import { useState, useRef, useEffect } from "react";
import { Share2, Users, Download, Mic, Volume2, Settings, Copy, Save, Bot, Sparkles } from "lucide-react";
import { Groq } from "groq-sdk";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const CollaborativeStoryEditor = () => {
  const [banglishText, setBanglishText] = useState('');
  const [banglaText, setBanglaText] = useState('');
  const [englishText, setEnglishText] = useState('');
  const [activeLanguage, setActiveLanguage] = useState('banglish');
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [loading, setLoading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  const [connectedUsers, setConnectedUsers] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [storyTitle, setStoryTitle] = useState('Untitled Story');
  const [isListening, setIsListening] = useState(false);
  const [pdfTitle, setPdfTitle] = useState('');
  const [pdfCaption, setPdfCaption] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postCaption, setPostCaption] = useState('');
  const ws = useRef(null);
  const recognition = useRef(null);

  const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  // Initialize WebSocket connection
  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:3000");

    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "update") {
          if (message.language === 'banglish') {
            setBanglishText(message.data);
          } else if (message.language === 'english') {
            setEnglishText(message.data);
          }
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.current.onopen = () => {
      console.log("WebSocket connected");
      setConnectedUsers(Math.floor(Math.random() * 5) + 1);
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const handleTranslate = async () => {
    setLoading(true);
    try {
      const textToTranslate = activeLanguage === 'banglish' ? banglishText : englishText;
      const systemPrompt = activeLanguage === 'banglish' 
        ? "You are a language model that translates Banglish (Romanized Bangla) into proper Bangla."
        : "You are a language model that translates English into proper Bangla.";

      const chatCompletion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 200,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: `Translate this text into Bangla: ${textToTranslate}`,
          },
        ],
      });

      const aiResponse = chatCompletion.choices[0]?.message?.content || "No response from AI.";
      setBanglaText(aiResponse);
      generateCaption(aiResponse);
    } catch (error) {
      console.error("Error fetching translation:", error);
      alert("Translation failed!");
    } finally {
      setLoading(false);
    }
  };

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
      });

      const aiResponse = chatCompletion.choices[0]?.message?.content || "বাংলা লেখা\nএকটি সুন্দর বাংলা রচনা।";
      const lines = aiResponse.split("\n").filter(line => line.trim());
      const title = lines[0] || "বাংলা লেখা";
      const caption = lines[1] || "একটি সুন্দর বাংলা রচনা।";

      setPdfTitle(title);
      setPdfCaption(caption);
      setPostTitle(title);
      setPostCaption(caption);
    } catch (error) {
      console.error("Error generating caption:", error);
      // Fallback to default Bengali title and caption
      setPdfTitle("বাংলা লেখা");
      setPdfCaption("একটি সুন্দর বাংলা রচনা।");
      setPostTitle("বাংলা লেখা");
      setPostCaption("একটি সুন্দর বাংলা রচনা।");
    }
  };

  const handleDownloadPDF = async () => {
    try {
      // Create a temporary div element with proper styling for Bangla text
      const tempDiv = document.createElement('div');
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
      `;

      // Create content with proper Bangla text rendering
      const content = `
        <div style="margin-bottom: 30px;">
          <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 10px; text-align: center; font-family: 'Arial Unicode MS', 'Tahoma', 'SolaimanLipi', sans-serif;">
            ${pdfTitle || storyTitle || 'বাংলা লেখা'}
          </h1>
          ${pdfCaption ? `<p style="font-style: italic; text-align: center; margin-bottom: 20px; color: #666; font-family: 'Arial Unicode MS', 'Tahoma', 'SolaimanLipi', sans-serif;">${pdfCaption}</p>` : ''}
        </div>
        <div style="white-space: pre-wrap; word-wrap: break-word; font-family: 'Arial Unicode MS', 'Tahoma', 'SolaimanLipi', sans-serif;">
          ${banglaText}
        </div>
      `;

      tempDiv.innerHTML = content;
      document.body.appendChild(tempDiv);

      // Generate canvas from the div
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: tempDiv.offsetWidth,
        height: tempDiv.offsetHeight
      });

      // Remove the temporary div
      document.body.removeChild(tempDiv);

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${storyTitle || 'bangla_story'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in your browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition.current = new SpeechRecognition();
    recognition.current.continuous = false;
    recognition.current.interimResults = false;
    recognition.current.lang = activeLanguage === 'english' ? 'en-US' : 'en-UK';

    setIsListening(true);
    recognition.current.start();

    recognition.current.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      if (activeLanguage === 'banglish') {
        setBanglishText(prev => prev + ' ' + speechToText);
      } else if (activeLanguage === 'english') {
        setEnglishText(prev => prev + ' ' + speechToText);
      }
      setIsListening(false);
    };

    recognition.current.onerror = () => {
      setIsListening(false);
      alert('Error with speech recognition!');
    };

    recognition.current.onend = () => {
      setIsListening(false);
    };
  };

  const handleHearText = () => {
    if (!banglaText) {
      alert('No Bangla text to read!');
      return;
    }

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(banglaText);
      const voices = window.speechSynthesis.getVoices();
      const banglaVoice = voices.find(voice => voice.lang === 'bn-BD');
      
      if (banglaVoice) {
        utterance.voice = banglaVoice;
      } else {
        const englishVoice = voices.find(voice => voice.lang === 'en-US');
        if (englishVoice) {
          utterance.voice = englishVoice;
        } else {
          utterance.voice = voices[0];
        }
      }
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        alert('Error with speech synthesis!');
      };

      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech not supported in your browser');
    }
  };

  const toggleSharing = () => {
    setIsSharing(!isSharing);
    if (!isSharing) {
      const link = `${window.location.origin}/story/${Math.random().toString(36).substr(2, 9)}`;
      setShareableLink(link);
    } else {
      setShareableLink('');
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareableLink);
    alert('Link copied to clipboard!');
  };

  const handleSaveStory = async () => {
    setLoading(true);
    try {
      // Generate title and caption if not already set
      if (!postTitle || !postCaption) {
        await generateCaption(banglaText);
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
              banglishText: activeLanguage === 'banglish' ? sourceText : '',
              englishText: activeLanguage === 'english' ? sourceText : '' 
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to update CSV");
          }
          console.log("CSV updated successfully");
        } catch (error) {
          console.error("Error updating CSV:", error);
        }
      };

      const sourceText = activeLanguage === 'banglish' ? banglishText : englishText;
      await appendToCSV(banglaText, sourceText);

      // PDF creation/upload logic with proper Bangla text support
      const createPDFBlob = async () => {
        const tempDiv = document.createElement('div');
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
        `;

        const content = `
          <div style="margin-bottom: 30px;">
            <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 10px; text-align: center; font-family: 'Arial Unicode MS', 'Tahoma', 'SolaimanLipi', sans-serif;">
              ${postTitle || 'বাংলা লেখা'}
            </h1>
            ${postCaption ? `<p style="font-style: italic; text-align: center; margin-bottom: 20px; color: #666; font-family: 'Arial Unicode MS', 'Tahoma', 'SolaimanLipi', sans-serif;">${postCaption}</p>` : ''}
          </div>
          <div style="white-space: pre-wrap; word-wrap: break-word; font-family: 'Arial Unicode MS', 'Tahoma', 'SolaimanLipi', sans-serif;">
            ${banglaText}
          </div>
        `;

        tempDiv.innerHTML = content;
        document.body.appendChild(tempDiv);

        const canvas = await html2canvas(tempDiv, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        });

        document.body.removeChild(tempDiv);

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        return pdf.output("blob");
      };

      const pdfBlob = await createPDFBlob();

      const formData = new FormData();
      formData.append("pdf", pdfBlob);
      formData.append("title", postTitle);
      formData.append("caption", postCaption);
      formData.append("banglishText", activeLanguage === 'banglish' ? banglishText : '');
      formData.append("englishText", activeLanguage === 'english' ? englishText : '');
      formData.append("banglaText", banglaText);

      const response = await fetch("/api/pdf/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        alert("Story saved and PDF uploaded successfully!");
      } else {
        alert("Failed to upload PDF");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMessage = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    
    try {
      const chatCompletion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 200,
        messages: [
          {
            role: "system",
            content: "You are a helpful Bangla story writing assistant. Provide creative suggestions and feedback about the user's story in Bangla.",
          },
          {
            role: "user",
            content: chatInput,
          },
        ],
      });

      const aiResponse = { 
        role: 'assistant', 
        content: chatCompletion.choices[0]?.message?.content || "I couldn't generate a response."
      };
      setChatMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error with chatbot:", error);
      const errorMessage = { 
        role: 'assistant', 
        content: "Sorry, I encountered an error. Please try again." 
      };
      setChatMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleTextChange = (language, value) => {
    if (language === 'banglish') {
      setBanglishText(value);
    } else if (language === 'english') {
      setEnglishText(value);
    }
    
    // Broadcast the change to all connected clients
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'update',
        language,
        data: value
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Collaborative Story Editor
              </h1>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{connectedUsers} online</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowChatbot(!showChatbot)}
                className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                <Bot className="w-4 h-4" />
                <span className="hidden sm:block">AI Assistant</span>
              </button>
              
              <button
                onClick={toggleSharing}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                  isSharing 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:block">{isSharing ? 'Sharing On' : 'Share'}</span>
              </button>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Sharing section */}
          {isSharing && (
            <div className="pb-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
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
                      className="px-3 py-1 bg-white border border-green-300 rounded text-sm"
                    />
                    <button
                      onClick={copyShareLink}
                      className="flex items-center space-x-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-all"
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Story Title */}
        <div className="mb-6">
          <input
            type="text"
            value={storyTitle}
            onChange={(e) => setStoryTitle(e.target.value)}
            className="text-xl sm:text-2xl font-bold text-gray-900 bg-transparent border-none outline-none w-full focus:bg-white focus:border focus:border-gray-300 rounded px-3 py-2 transition-all"
            placeholder="Enter your story title..."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Language Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              {['banglish', 'english'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLanguage(lang)}
                  className={`flex-1 py-2 px-4 rounded-md transition-all ${
                    activeLanguage === lang
                      ? 'bg-white text-blue-600 shadow-sm font-medium'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {lang === 'banglish' ? 'Banglish' : 'English'}
                </button>
              ))}
            </div>

            {/* Text Editor */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Write your story in {activeLanguage === 'banglish' ? 'Banglish' : 'English'}
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleVoiceInput}
                    disabled={isListening}
                    className={`p-2 rounded-lg transition-all ${
                      isListening
                        ? 'bg-red-100 text-red-600 animate-pulse'
                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <textarea
                value={activeLanguage === 'banglish' ? banglishText : englishText}
                onChange={(e) => handleTextChange(activeLanguage, e.target.value)}
                placeholder={`Start writing your story in ${activeLanguage}...`}
                className="w-full h-64 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                style={{ fontFamily, fontSize: `${fontSize}px` }}
              />
            </div>

            {/* Bangla Output */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Bangla Translation</h3>
                <button
                  onClick={handleHearText}
                  disabled={!banglaText}
                  className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              
              <textarea
                value={banglaText}
                readOnly
                placeholder="Translated Bangla text will appear here..."
                className="w-full h-64 p-4 border border-gray-200 rounded-lg bg-gray-50 resize-none"
                style={{ fontFamily, fontSize: `${fontSize}px` }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleTranslate}
                disabled={loading || (!banglishText && !englishText)}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loading ? 'Translating...' : 'Translate'}</span>
              </button>
              
              <button
                onClick={handleSaveStory}
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Story'}</span>
              </button>
              
              <button
                onClick={handleDownloadPDF}
                disabled={!banglaText}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
              <div className="bg-white rounded-xl shadow-lg p-6">
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
                      className="w-full"
                    />
                    <span className="text-sm text-gray-500">{fontSize}px</span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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

            {/* AI Assistant Suggestion */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-3">
                <Bot className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-purple-800">AI Assistant</h3>
              </div>
              <p className="text-purple-700 text-sm mb-3">
                Ask me anything about your stories! I can help with plot development, character analysis, or creative suggestions.
              </p>
              <button
                onClick={() => setShowChatbot(true)}
                className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Start Conversation
              </button>
            </div>

            {/* Collaboration Status */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Collaboration</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Users</span>
                  <span className="text-sm font-medium text-green-600">{connectedUsers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Sharing Status</span>
                  <span className={`text-sm font-medium ${isSharing ? 'text-green-600' : 'text-gray-400'}`}>
                    {isSharing ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot Modal */}
      {showChatbot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md h-96 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold">AI Story Assistant</h3>
              </div>
              <button
                onClick={() => setShowChatbot(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.length === 0 && (
                <div className="text-center text-gray-500 text-sm">
                  Ask me anything about your story!
                </div>
              )}
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t">
              <form onSubmit={handleChatSubmit} className="flex space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about your story..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaborativeStoryEditor;