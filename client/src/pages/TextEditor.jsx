"use client"
import { useState, useRef, useEffect } from "react"
import {
  Share2,
  Users,
  Download,
  Mic,
  Volume2,
  Settings,
  Copy,
  Save,
  Bot,
  Sparkles,
  X,
  MessageCircle,
} from "lucide-react"
import { Groq } from "groq-sdk"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

const CollaborativeStoryEditor = () => {
  const [banglishText, setBanglishText] = useState("")
  const [banglaText, setBanglaText] = useState("")
  const [englishText, setEnglishText] = useState("")
  const [activeLanguage, setActiveLanguage] = useState("banglish")
  const [fontSize, setFontSize] = useState(16)
  const [fontFamily, setFontFamily] = useState("Arial")
  const [loading, setLoading] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [shareableLink, setShareableLink] = useState("")
  const [connectedUsers, setConnectedUsers] = useState(1)
  const [showSettings, setShowSettings] = useState(false)
  const [showChatbot, setShowChatbot] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState("")
  const [storyTitle, setStoryTitle] = useState("Untitled Story")
  const [isListening, setIsListening] = useState(false)
  const [pdfTitle, setPdfTitle] = useState("")
  const [pdfCaption, setPdfCaption] = useState("")
  const [postTitle, setPostTitle] = useState("")
  const [postCaption, setPostCaption] = useState("")
  const ws = useRef(null)
  const recognition = useRef(null)

  const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
  })

  // Initialize WebSocket connection
  useEffect(() => {
    // LocalStorage-based collaboration (works across tabs)
    const handleStorageChange = (e) => {
      if (e.key === "collab-story-data") {
        try {
          const data = JSON.parse(e.newValue)
          if (data.language === "banglish") {
            setBanglishText(data.text)
          } else if (data.language === "english") {
            setEnglishText(data.text)
          }
        } catch (error) {
          console.error("Error parsing collaboration data:", error)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Simulate connected users
    const interval = setInterval(() => {
      setConnectedUsers((prev) => {
        const change = Math.random() > 0.5 ? 1 : -1
        return Math.max(1, prev + change)
      })
    }, 5000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    // Check URL for story parameter
    const params = new URLSearchParams(window.location.search)
    const storyId = params.get("story")

    if (storyId) {
      // Try to load the story
      const storyData = localStorage.getItem(`story-${storyId}`)
      if (storyData) {
        try {
          const parsed = JSON.parse(storyData)
          setStoryTitle(parsed.title || "Untitled Story")
          setBanglishText(parsed.banglishText || "")
          setEnglishText(parsed.englishText || "")
          setBanglaText(parsed.banglaText || "")
          setIsSharing(true)
          setShareableLink(window.location.href)
        } catch (error) {
          console.error("Error loading shared story:", error)
        }
      }
    }
  }, [])

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if ((activeLanguage === "banglish" && banglishText) || (activeLanguage === "english" && englishText)) {
        const textToTranslate = activeLanguage === "banglish" ? banglishText : englishText
        if (textToTranslate.trim().length > 0) {
          setLoading(true)
          const translatedText = await translateText(textToTranslate, activeLanguage)
          setBanglaText(translatedText)
          generateCaption(translatedText)
          setLoading(false)
        }
      }
    }, 1500) // 1.5 second delay after typing stops

    return () => clearTimeout(delayDebounceFn)
  }, [banglishText, englishText, activeLanguage])

  const translateText = async (text, language) => {
    try {
      const systemPrompt =
        language === "banglish"
          ? "You are a language model that translates Banglish (Romanized Bangla) into proper Bangla."
          : "You are a language model that translates English into proper Bangla."

      const chatCompletion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 200,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Translate this text into Bangla: ${text}` },
        ],
      })

      return chatCompletion.choices[0]?.message?.content || "No response from AI."
    } catch (error) {
      console.error("Translation error:", error)
      return "Translation failed"
    }
  }

  const generateCaption = async (text) => {
    try {
      const chatCompletion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 100,
        messages: [
          {
            role: "system",
            content: `You are a Bengali content assistant. Generate ONLY a Bengali title and caption for the given Bengali text. Respond with ONLY the Bengali title on the first line and Bengali caption on the second line. Keep it simple and relevant to the content. Do not add any English text or explanations.`,
          },
          {
            role: "user",
            content: `এই বাংলা লেখার জন্য একটি বাংলা শিরোনাম এবং ক্যাপশন তৈরি করুন: ${text}`,
          },
        ],
      })

      const aiResponse = chatCompletion.choices[0]?.message?.content || "বাংলা লেখা\nএকটি সুন্দর বাংলা রচনা।"
      const lines = aiResponse.split("\n").filter((line) => line.trim())
      const title = lines[0] || "বাংলা লেখা"
      const caption = lines[1] || "একটি সুন্দর বাংলা রচনা।"

      setPdfTitle(title)
      setPdfCaption(caption)
      setPostTitle(title)
      setPostCaption(caption)
    } catch (error) {
      console.error("Error generating caption:", error)
      // Fallback to default Bengali title and caption
      setPdfTitle("বাংলা লেখা")
      setPdfCaption("একটি সুন্দর বাংলা রচনা।")
      setPostTitle("বাংলা লেখা")
      setPostCaption("একটি সুন্দর বাংলা রচনা।")
    }
  }

  const handleDownloadPDF = async () => {
    try {
      // Generate Bengali title and caption if not already set
      if (!pdfTitle || !pdfCaption) {
        await generateCaption(banglaText)
      }

      // Create a temporary div element with proper styling for Bangla text
      const tempDiv = document.createElement("div")
      tempDiv.style.cssText = `
        position: fixed;
        top: -9999px;
        left: -9999px;
        width: 210mm;
        min-height: 297mm;
        padding: 20mm;
        background: white;
        font-family: 'Arial Unicode MS', 'Tahoma', 'SolaimanLipi', sans-serif;
        font-size: 16px;
        line-height: 1.6;
        color: black;
        box-sizing: border-box;
      `

      // Create content with proper Bangla text rendering
      const content = `
        <div style="margin-bottom: 30px;">
          <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 10px; text-align: center; font-family: 'Arial Unicode MS', 'Tahoma', 'SolaimanLipi', sans-serif;">
            ${pdfTitle || storyTitle || "বাংলা লেখা"}
          </h1>
          ${pdfCaption ? `<p style="font-style: italic; text-align: center; margin-bottom: 20px; color: #666; font-family: 'Arial Unicode MS', 'Tahoma', 'SolaimanLipi', sans-serif;">${pdfCaption}</p>` : ""}
        </div>
        <div style="white-space: pre-wrap; word-wrap: break-word; font-family: 'Arial Unicode MS', 'Tahoma', 'SolaimanLipi', sans-serif;">
          ${banglaText}
        </div>
      `

      tempDiv.innerHTML = content
      document.body.appendChild(tempDiv)

      // Generate canvas from the div
      const canvas = await html2canvas(tempDiv, {
        scale: 1.5, // Reduced for better performance and smaller file size
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        quality: 0.8, // Add quality setting
        logging: false, // Disable logging
        width: tempDiv.offsetWidth,
        height: tempDiv.offsetHeight,
      })

      // Remove the temporary div
      document.body.removeChild(tempDiv)

      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true, // Enable compression
      })

      const imgData = canvas.toDataURL("image/jpeg", 0.7) // Use JPEG with 70% quality
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      // Add first page
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, "MEDIUM")
      heightLeft -= pageHeight

      // Add additional pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, "MEDIUM")
        heightLeft -= pageHeight
      }

      pdf.save(`${storyTitle || "bangla_story"}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF. Please try again.")
    }
  }

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition not supported in your browser")
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognition.current = new SpeechRecognition()
    recognition.current.continuous = false
    recognition.current.interimResults = false
    recognition.current.lang = activeLanguage === "english" ? "en-US" : "en-UK"

    setIsListening(true)
    recognition.current.start()

    recognition.current.onresult = (event) => {
      const speechToText = event.results[0][0].transcript
      if (activeLanguage === "banglish") {
        setBanglishText((prev) => prev + " " + speechToText)
      } else if (activeLanguage === "english") {
        setEnglishText((prev) => prev + " " + speechToText)
      }
      setIsListening(false)
    }

    recognition.current.onerror = () => {
      setIsListening(false)
      alert("Error with speech recognition!")
    }

    recognition.current.onend = () => {
      setIsListening(false)
    }
  }

  const handleHearText = () => {
    if (!banglaText) {
      alert("No Bangla text to read!")
      return
    }

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(banglaText)
      const voices = window.speechSynthesis.getVoices()
      const banglaVoice = voices.find((voice) => voice.lang === "bn-BD")

      if (banglaVoice) {
        utterance.voice = banglaVoice
      } else {
        const englishVoice = voices.find((voice) => voice.lang === "en-US")
        if (englishVoice) {
          utterance.voice = englishVoice
        } else {
          utterance.voice = voices[0]
        }
      }

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event.error)
        alert("Error with speech synthesis!")
      }

      window.speechSynthesis.speak(utterance)
    } else {
      alert("Text-to-speech not supported in your browser")
    }
  }

  const toggleSharing = () => {
    setIsSharing(!isSharing)
    if (!isSharing) {
      // Generate a unique ID for this story session
      const storyId = Math.random().toString(36).substr(2, 9)

      // Save the current story state to localStorage
      const storyData = {
        id: storyId,
        title: storyTitle,
        banglishText,
        englishText,
        banglaText,
        createdAt: new Date().toISOString(),
      }

      localStorage.setItem(`story-${storyId}`, JSON.stringify(storyData))

      // Generate the shareable link
      const link = `${window.location.origin}${window.location.pathname}?story=${storyId}`
      setShareableLink(link)

      // Also save the ID so we can load it when the page refreshes
      localStorage.setItem("current-story-id", storyId)
    } else {
      setShareableLink("")
    }
  }

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareableLink)
    alert("Link copied to clipboard!")
  }

  const handleSaveStory = async () => {
    setLoading(true)
    try {
      // Generate title and caption if not already set
      if (!postTitle || !postCaption) {
        await generateCaption(banglaText)
      }

      // Append to CSV on the server
      const appendToCSV = async (banglaText, sourceText) => {
        try {
          const response = await fetch("/api/update-csv", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              banglaText,
              banglishText: activeLanguage === "banglish" ? sourceText : "",
              englishText: activeLanguage === "english" ? sourceText : "",
            }),
          })

          if (!response.ok) {
            throw new Error("Failed to update CSV")
          }
          console.log("CSV updated successfully")
        } catch (error) {
          console.error("Error updating CSV:", error)
        }
      }

      const sourceText = activeLanguage === "banglish" ? banglishText : englishText
      await appendToCSV(banglaText, sourceText)

      // PDF creation/upload logic with proper Bangla text support
      const createPDFBlob = async () => {
        try {
          console.log("Creating PDF with title:", postTitle)
          console.log("Creating PDF with caption:", postCaption)
          console.log("Creating PDF with bangla text length:", banglaText.length)

          const tempDiv = document.createElement("div")
          tempDiv.style.cssText = `
            position: fixed;
            top: -9999px;
            left: -9999px;
            width: 210mm;
            min-height: 297mm;
            padding: 20mm;
            background: white;
            font-family: 'Arial Unicode MS', 'Tahoma', 'SolaimanLipi', sans-serif;
            font-size: 16px;
            line-height: 1.6;
            color: black;
            box-sizing: border-box;
          `

          const content = `
            <div style="margin-bottom: 30px;">
              <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 10px; text-align: center; font-family: 'Arial Unicode MS', 'Tahoma', 'SolaimanLipi', sans-serif;">
                ${postTitle || "বাংলা লেখা"}
              </h1>
              ${postCaption ? `<p style="font-style: italic; text-align: center; margin-bottom: 20px; color: #666; font-family: 'Arial Unicode MS', 'Tahoma', 'SolaimanLipi', sans-serif;">${postCaption}</p>` : ""}
            </div>
            <div style="white-space: pre-wrap; word-wrap: break-word; font-family: 'Arial Unicode MS', 'Tahoma', 'SolaimanLipi', sans-serif;">
              ${banglaText}
            </div>
          `

          tempDiv.innerHTML = content
          document.body.appendChild(tempDiv)

          console.log("Generating canvas...")
          const canvas = await html2canvas(tempDiv, {
            scale: 1.5, // Reduced from 2 to 1.5 for smaller file size
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#ffffff",
            quality: 0.8, // Add quality setting to reduce file size
            logging: false, // Disable logging for performance
          })

          document.body.removeChild(tempDiv)
          console.log("Canvas generated successfully")

          const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
            compress: true, // Enable PDF compression
          })

          const imgData = canvas.toDataURL("image/jpeg", 0.7) // Use JPEG with 70% quality instead of PNG
          const imgWidth = 210
          const pageHeight = 297
          const imgHeight = (canvas.height * imgWidth) / canvas.width
          let heightLeft = imgHeight
          let position = 0

          pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, "MEDIUM") // Use MEDIUM compression
          heightLeft -= pageHeight

          while (heightLeft >= 0) {
            position = heightLeft - imgHeight
            pdf.addPage()
            pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, "MEDIUM")
            heightLeft -= pageHeight
          }

          const blob = pdf.output("blob")
          console.log("PDF blob created successfully, size:", blob.size)
          return blob
        } catch (error) {
          console.error("Error creating PDF blob:", error)
          throw error
        }
      }

      const pdfBlob = await createPDFBlob()

      console.log("Preparing form data...")
      const formData = new FormData()
      formData.append("pdf", pdfBlob, "translated_text.pdf")
      formData.append("title", postTitle)
      formData.append("caption", postCaption)
      formData.append("banglishText", activeLanguage === "banglish" ? banglishText : "")
      formData.append("englishText", activeLanguage === "english" ? englishText : "")
      formData.append("banglaText", banglaText)

      console.log("Form data prepared, making request to /api/pdf/upload")
      console.log("Title:", postTitle)
      console.log("Caption:", postCaption)
      console.log("PDF blob size:", pdfBlob.size)

      const response = await fetch("/api/pdf/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      })

      if (response.ok) {
        const result = await response.json()
        alert("Story saved and PDF uploaded successfully!")
        console.log("Upload successful:", result)
      } else {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }))
        console.error("Upload failed:", {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        })
        alert(`Failed to upload PDF: ${errorData.message || response.statusText}`)
      }
    } catch (error) {
      console.error("Error in handleSaveStory:", error)
      alert(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleChatSubmit = async (e) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const userMessage = { role: "user", content: chatInput }
    setChatMessages((prev) => [...prev, userMessage])
    setChatInput("")

    try {
      const chatCompletion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 200,
        messages: [
          {
            role: "system",
            content:
              "You are a helpful Bangla story writing assistant. Provide creative suggestions and feedback about the user's story in Bangla.",
          },
          {
            role: "user",
            content: chatInput,
          },
        ],
      })

      const aiResponse = {
        role: "assistant",
        content: chatCompletion.choices[0]?.message?.content || "I couldn't generate a response.",
      }
      setChatMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error("Error with chatbot:", error)
      const errorMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      }
      setChatMessages((prev) => [...prev, errorMessage])
    }
  }

  const handleTextChange = (language, value) => {
    if (language === "banglish") {
      setBanglishText(value)
    } else if (language === "english") {
      setEnglishText(value)
    }

    // Broadcast the change via localStorage
    localStorage.setItem(
      "collab-story-data",
      JSON.stringify({
        language,
        text: value,
      }),
    )

    // Trigger the storage event manually for same-tab updates
    window.dispatchEvent(new Event("storage"))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Background Decorations */}
      {/* <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div> */}

      <div className="relative z-10">
        {/* Header */}
        <div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Story Editor
                  </h1>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{connectedUsers} online</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowChatbot(!showChatbot)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <Bot className="w-4 h-4" />
                  <span className="hidden sm:block">AI Assistant</span>
                </button>

                <button
                  onClick={toggleSharing}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 ${
                    isSharing
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
                  }`}
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:block">{isSharing ? "Sharing On" : "Share"}</span>
                </button>

                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 bg-white hover:bg-gray-50 text-gray-700 rounded-xl shadow-lg border border-gray-200 transition-all duration-200 transform hover:scale-105"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sharing section */}
            {isSharing && (
              <div className="pb-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-800 font-medium">Story sharing is enabled</p>
                      <p className="text-green-600 text-sm">Anyone with the link can collaborate</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={shareableLink}
                        readOnly
                        className="px-3 py-2 bg-white border border-green-300 rounded-lg text-sm w-64"
                      />
                      <button
                        onClick={copyShareLink}
                        className="flex items-center space-x-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Story Title */}
          <div className="mb-8">
            <input
              type="text"
              value={storyTitle}
              onChange={(e) => setStoryTitle(e.target.value)}
              className="text-2xl sm:text-3xl font-bold text-gray-900 bg-white border border-purple-100 rounded-xl px-6 py-4 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-lg transition-all duration-200"
              placeholder="Enter your story title..."
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Main Editor - Side by Side Layout */}
            <div className="xl:col-span-3 space-y-8">
              {/* Language Tabs */}
              <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-lg border border-purple-100">
                {["banglish", "english"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveLanguage(lang)}
                    className={`flex-1 py-3 px-6 rounded-lg transition-all duration-200 font-medium ${
                      activeLanguage === lang
                        ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {lang === "banglish" ? "Banglish" : "English"}
                  </button>
                ))}
              </div>

              {/* Side by Side Text Areas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Editor */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-purple-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Write in {activeLanguage === "banglish" ? "Banglish" : "English"}
                    </h3>
                    <button
                      onClick={handleVoiceInput}
                      disabled={isListening}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        isListening
                          ? "bg-red-100 text-red-600 animate-pulse"
                          : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                      }`}
                      title="Voice Input"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>

                  <textarea
                    value={activeLanguage === "banglish" ? banglishText : englishText}
                    onChange={(e) => handleTextChange(activeLanguage, e.target.value)}
                    placeholder={`Start writing your story in ${activeLanguage}...`}
                    className="w-full h-80 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all duration-200"
                    style={{ fontFamily, fontSize: `${fontSize}px` }}
                  />
                </div>

                {/* Bangla Output */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-purple-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Bangla Translation</h3>
                    <div className="flex items-center space-x-2">
                      {loading && (
                        <div className="flex items-center space-x-2 text-purple-600">
                          <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm">Translating...</span>
                        </div>
                      )}
                      <button
                        onClick={handleHearText}
                        disabled={!banglaText}
                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Listen to Bangla text"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <textarea
                    value={banglaText}
                    readOnly
                    placeholder="Translated Bangla text will appear here..."
                    className="w-full h-80 p-4 border border-gray-200 rounded-xl bg-gray-50 resize-none"
                    style={{ fontFamily, fontSize: `${fontSize}px` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleSaveStory}
                  disabled={loading || !banglaText}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? "Saving..." : "Save Story"}</span>
                </button>

                <button
                  onClick={handleDownloadPDF}
                  disabled={!banglaText}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Settings Panel */}
              {showSettings && (
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-purple-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Font Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                      <input
                        type="range"
                        min="12"
                        max="24"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full accent-purple-500"
                      />
                      <span className="text-sm text-gray-500">{fontSize}px</span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                      <select
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="Arial">Arial</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Verdana">Verdana</option>
                        <option value="Courier New">Courier New</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Assistant Card */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-purple-800">AI Assistant</h3>
                </div>
                <p className="text-purple-700 text-sm mb-4">
                  Get creative suggestions, plot development ideas, and writing feedback for your stories.
                </p>
                <button
                  onClick={() => setShowChatbot(true)}
                  className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  Start Conversation
                </button>
              </div>

              {/* Collaboration Status */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-purple-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Collaboration</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Active Users</span>
                    <span className="text-sm font-medium text-green-600">{connectedUsers}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Sharing Status</span>
                    <span className={`text-sm font-medium ${isSharing ? "text-green-600" : "text-gray-400"}`}>
                      {isSharing ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot Modal */}
      {showChatbot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-96 flex flex-col border border-purple-100">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">AI Story Assistant</h3>
              </div>
              <button
                onClick={() => setShowChatbot(false)}
                className="text-white hover:text-red-300 transition-colors duration-200 p-1 hover:bg-white hover:bg-opacity-20 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {chatMessages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <p className="text-gray-500 text-sm">Ask me anything about your story!</p>
                </div>
              )}
              {chatMessages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs p-3 rounded-2xl shadow-sm ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                        : "bg-white text-gray-800 border border-gray-200"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-white border-t border-gray-100 rounded-b-2xl">
              <form onSubmit={handleChatSubmit} className="flex space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about your story..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-lg transition-all duration-200"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

export default CollaborativeStoryEditor
