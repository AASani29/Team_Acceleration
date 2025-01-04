import React, { useState } from "react";
import { Groq } from "groq-sdk";
import jsPDF from "jspdf";

const TextEditor = () => {
  const [banglishText, setBanglishText] = useState("");
  const [banglaText, setBanglaText] = useState("");
  const [fontSize, setFontSize] = useState("16px");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [loading, setLoading] = useState(false);
  const [pdfTitle, setPdfTitle] = useState("");
  const [pdfCaption, setPdfCaption] = useState("");

  const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const handleTranslate = async () => {
    setLoading(true);
    try {
      const chatCompletion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 200,
        messages: [
          {
            role: "system",
            content: `You are a language model that translates Banglish (Romanized Bangla) into proper Bangla.`,
          },
          {
            role: "user",
            content: `Translate this Banglish text into Bangla: ${banglishText}`,
          },
        ],
      });

      const aiResponse =
        chatCompletion.choices[0]?.message?.content || "No response from AI.";
      setBanglaText(aiResponse);
      await generateCaption(aiResponse);
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
        temperature: 0.9,
        max_tokens: 150,
        messages: [
          {
            role: "system",
            content: `You are a content assistant. Your task is to generate a short title and caption for a PDF document. The title should be engaging, and the caption should summarize the content succinctly.`,
          },
          {
            role: "user",
            content: `Generate a title and caption for the following content: ${text}`,
          },
        ],
      });

      const aiResponse =
        chatCompletion.choices[0]?.message?.content || "No response from AI.";
      const [title, caption] = aiResponse.split("\n");

      setPdfTitle(title || "Untitled PDF");
      setPdfCaption(caption || "No caption provided.");
    } catch (error) {
      console.error("Error generating title and caption:", error);
      alert("Failed to generate title and caption.");
    }
  };

  const handlePost = async () => {
    setLoading(true);
    try {
      const pdf = new jsPDF();
      let currentY = 10;

      if (pdfTitle) {
        pdf.setFontSize(20);
        pdf.setFont("helvetica", "bold");
        pdf.text(pdfTitle, 10, currentY);
        currentY += 10;
      }

      if (pdfCaption) {
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "italic");
        pdf.text(pdfCaption, 10, currentY);
        currentY += 10;
      }

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "normal");
      pdf.text(banglaText, 10, currentY);

      const pdfBlob = pdf.output("blob");

      const formData = new FormData();
      formData.append("pdf", pdfBlob, "translated_text.pdf");
      formData.append("title", pdfTitle);
      formData.append("caption", pdfCaption);
      formData.append("banglishText", banglishText);
      formData.append("banglaText", banglaText);

      const response = await fetch("/api/pdf/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        alert("PDF successfully uploaded and saved to your profile!");
      } else {
        const errorData = await response.json();
        console.error("Upload failed:", errorData);
        alert(`Failed to upload PDF. Error: ${errorData.message || "Unknown error"}`);
      }

      pdf.save("translated_text.pdf");
    } catch (error) {
      console.error("Error during upload:", error);
      alert("An error occurred while uploading the PDF.");
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-UK";
    recognition.start();

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setBanglishText(speechToText);
    };

    recognition.onerror = (event) => {
      alert("Error with speech recognition!");
    };
  };

  const handleHearText = () => {
    if (!banglaText) {
      alert("No text to read out!");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(banglaText);
    const voices = window.speechSynthesis.getVoices();
    const banglaVoice = voices.find((voice) => voice.lang === "bn-BD");

    if (banglaVoice) {
      utterance.voice = banglaVoice;
    } else {
      utterance.voice = voices[0];
    }

    utterance.onstart = () => {
      console.log("Speech synthesis started");
    };

    utterance.onend = () => {
      console.log("Speech synthesis ended");
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event.error);
      alert("Error with speech synthesis!");
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="p-6 bg-gradient-to-b from-blue-50 to-gray-100 min-h-screen">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#002a62]">Banglish to Bangla Editor</h1>
        <p className="text-lg text-gray-600 mt-2">
          Easily translate Banglish to Bangla, save PDFs, and manage your content.
        </p>
      </header>

      {/* Input and Output Section Side-by-Side */}
      <div className="flex justify-center gap-6 mb-6">
        {/* Input Section */}
        <div className="flex-1 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-[#002a62]">Banglish Input</h2>
          <textarea
            placeholder="Type Banglish text here..."
            value={banglishText}
            onChange={(e) => setBanglishText(e.target.value)}
            className="w-full mt-4 h-60 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002a62]"
            style={{ fontFamily: fontFamily, fontSize: fontSize }}
          />
        </div>

        {/* Output Section */}
        <div className="flex-1 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-[#002a62]">Bangla Output</h2>
          <textarea
            placeholder="Translated Bangla text will appear here..."
            value={banglaText}
            readOnly
            className="w-full mt-4 h-60 p-3 border border-gray-300 rounded-lg focus:outline-none"
            style={{ fontFamily: fontFamily, fontSize: fontSize }}
          />
        </div>
      </div>

      {/* Buttons Section */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <button
          onClick={handleTranslate}
          className="px-5 py-2 bg-[#002a62] text-white text-sm font-medium rounded-md hover:bg-[#003b82] transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {loading ? "Translating..." : "Translate"}
        </button>
        <button
          onClick={handleVoiceInput}
          className="px-5 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 transition-all focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          🎤 Voice Input
        </button>
        <button
          onClick={handlePost}
          className="px-5 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-all focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          📥 Save & Download PDF
        </button>
        <button
          onClick={handleHearText}
          className="px-5 py-2 bg-teal-500 text-white text-sm font-medium rounded-md hover:bg-teal-600 transition-all focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          🔊 Hear
        </button>
      </div>

      {/* Font Settings Section */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-[#002a62] mb-4">Font Settings</h2>
        <div className="flex items-center justify-between mb-4">
          <label className="text-lg font-medium text-gray-600">Font Size:</label>
          <input
            type="number"
            value={parseInt(fontSize)}
            onChange={(e) => setFontSize(`${e.target.value}px`)}
            min="10"
            max="30"
            className="w-20 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002a62]"
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="text-lg font-medium text-gray-600">Font Family:</label>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002a62]"
          >
            <option value="Arial">Arial</option>
            <option value="Verdana">Verdana</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
