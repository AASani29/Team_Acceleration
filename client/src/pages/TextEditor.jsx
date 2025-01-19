import React, { useState, useRef, useEffect } from "react";
import { Groq } from "groq-sdk";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";


const TextEditor = () => {
  const [banglishText, setBanglishText] = useState('');
  const [banglaText, setBanglaText] = useState('');
  const [fontSize, setFontSize] = useState('16px');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [loading, setLoading] = useState(false);
  const [pdfTitle, setPdfTitle] = useState('');
  const [pdfCaption, setPdfCaption] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postCaption, setPostCaption] = useState('');
  const [content, setContent] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef(null);

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
        temperature: 0.9,
        max_tokens: 150,
        messages: [
          {
            role: "system",
            content: `You are a content assistant. Your task is to generate a short title and caption for a PDF document. The title should be engaging, and the caption should summarize the content succinctly. Respond only with the title and caption.`,
          },
          {
            role: "user",
            content: `Please generate a title and caption for the following content: ${text}`,
          },
        ],
      });

      const aiResponse = chatCompletion.choices[0]?.message?.content || "No response from AI.";
      const [title, caption] = aiResponse.split("\n");

      setPdfTitle(title);
      setPdfCaption(caption);
    } catch (error) {
      console.error("Error generating caption:", error);
    }
  };

  const handleDownloadPDF = () => {
    const pdf = new jsPDF();
    pdf.text(banglaText, 10, 10);

    if (pdfTitle) {
      pdf.setFontSize(20);
      pdf.text(pdfTitle, 10, 30);
    }

    if (pdfCaption) {
      pdf.setFontSize(12);
      pdf.text(pdfCaption, 10, 40);
    }

    pdf.save('translated_text.pdf');
  };

  const handleVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-UK'; // Set to Bangla
    recognition.start();

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setBanglishText(speechToText);
    };

    recognition.onerror = (event) => {
      alert('Error with speech recognition!');
    };
  };

  const handleHearText = () => {
    if (!banglaText) {
      alert('No text to read out!');
      return;
    }

    if ('speechSynthesis' in window) {
      console.log('Speech synthesis supported');
    } else {
      alert('Your browser does not support speech synthesis.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(banglaText);

    const voices = window.speechSynthesis.getVoices();
    console.log('Available voices:', voices);

    const banglaVoice = voices.find(voice => voice.lang === 'bn-BD');

    if (banglaVoice) {
      utterance.voice = banglaVoice;
      console.log('Using Bangla voice:', banglaVoice.name);
    } else {
      const englishVoice = voices.find(voice => voice.lang === 'en-US');
      if (englishVoice) {
        utterance.voice = englishVoice;
        console.log('Using English voice:', englishVoice.name);
      } else {
        utterance.voice = voices[0];
        console.log('Using system default voice:', utterance.voice.name);
      }
    }

    utterance.onstart = () => {
      console.log('Speech synthesis started');
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      alert('Error with speech synthesis!');
    };

    window.speechSynthesis.speak(utterance);
  };

  


const handlePost = async () => {
  setLoading(true);
  try {
    const aiResponse = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 200,
      messages: [
        {
          role: "system",
          content: `You are a content assistant. Your task is to generate a short title and caption for a post. The title should be engaging and summarize the content succinctly. Respond only with the title and caption.`,
        },
        {
          role: "user",
          content: `Generate a title and caption for this content: ${banglishText}`,
        },
      ],
    });

    const aiResponseContent = aiResponse.choices[0]?.message?.content || "No response from AI.";
    const [title, caption] = aiResponseContent.split("\n");

    setPostTitle(title);
    setPostCaption(caption);

    // Generate the translated Bangla content
    const banglaTranslation = banglaText;

    // Append new data to the CSV on the server
    const appendToCSV = async (banglaText, banglishText) => {
      try {
        const response = await fetch("/api/update-csv", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ banglaText, banglishText }),
        });

        if (!response.ok) {
          throw new Error("Failed to update CSV");
        }

        console.log("CSV updated successfully");
      } catch (error) {
        console.error("Error updating CSV:", error);
      }
    };

    // Call appendToCSV after generating Bangla and Banglish text
    await appendToCSV(banglaTranslation, banglishText);

    // PDF creation/upload logic...
    const pdf = new jsPDF();
    pdf.text(title, 10, 30);
    pdf.text(caption, 10, 50);
    pdf.text(banglaTranslation, 10, 70);
    const pdfBlob = pdf.output("blob");

    const formData = new FormData();
    formData.append("pdf", pdfBlob);
    formData.append("title", title);
    formData.append("caption", caption);
    formData.append("banglishText", banglishText);
    formData.append("banglaText", banglaTranslation);

    const response = await fetch("/api/pdf/upload", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (response.ok) {
      alert("PDF uploaded successfully!");
    } else {
      alert("Failed to upload PDF");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    setLoading(false);
  }
};


 
 
useEffect(() => {
    ws.current = new WebSocket("ws://localhost:3000"); // Replace with your WebSocket server URL

    // Handle incoming messages
    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "update") {
          setBanglishText(message.data); // Update the local state with the collaborative data
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.current.onopen = () => {
      console.log("WebSocket connected");
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

  const handleContentChange = (event) => {
    const updatedContent = event.target.value;
    setContent(updatedContent);

    // Broadcast updates to the server
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          type: 'update',
          data: updatedContent,
        })
      );
    }
  };


const handleChange = (e) => {
    const newText = e.target.value;
    setBanglishText(newText);

    // Broadcast the change to all connected clients
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({ type: "update", data: newText }) // Send the updated text
      );
    }
  };



  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-gray-100 min-h-screen">
  <h2 className="text-4xl font-bold text-center text-blue-800 mb-6">
    Banglish to Bangla Editor
  </h2>
  <p className="text-center text-gray-600 text-lg mb-10">
    Easily translate Banglish to Bangla, save PDFs, and manage your content.
  </p>

  <div className="flex justify-center gap-6 mb-8">
    {/* Input Section */}
    <div className="flex-1 bg-white shadow-lg rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Banglish Input</h3>
      <textarea
        placeholder="Type Banglish text here..."
        value={banglishText}
        onChange={handleChange}
        className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 text-gray-700"
        style={{ fontFamily: fontFamily, fontSize: fontSize }}
      />
    </div>

    {/* Output Section */}
    <div className="flex-1 bg-white shadow-lg rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Bangla Output</h3>
      <textarea
        placeholder="Translated Bangla text will appear here..."
        value={banglaText}
        readOnly
        className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:outline-none text-gray-700"
        style={{ fontFamily: fontFamily, fontSize: fontSize }}
      />
    </div>
  </div>

  <div className="flex justify-center gap-4 mb-10">
    <button
      onClick={handleTranslate}
      className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 transition focus:outline-none focus:ring-4 focus:ring-blue-300"
    >
      Translate
    </button>
    <button
      onClick={handleVoiceInput}
      className="px-6 py-3 bg-green-500 text-white font-medium rounded-lg shadow-md hover:bg-green-600 transition focus:outline-none focus:ring-4 focus:ring-green-300"
    >
      🎤 Voice Input
    </button>
    <button
      onClick={handlePost}
      className="px-6 py-3 bg-purple-500 text-white font-medium rounded-lg shadow-md hover:bg-purple-600 transition focus:outline-none focus:ring-4 focus:ring-purple-300"
    >
      📥 Save & Download PDF
    </button>
    <button
      onClick={handleHearText}
      className="px-6 py-3 bg-teal-500 text-white font-medium rounded-lg shadow-md hover:bg-teal-600 transition focus:outline-none focus:ring-4 focus:ring-teal-300"
    >
      🔊 Hear
    </button>
  </div>

  <div className="bg-white shadow-lg rounded-lg p-6 space-y-6">
    <h3 className="text-xl font-semibold text-gray-800">Font Settings</h3>
    <div className="flex items-center justify-between">
      <label className="text-lg font-medium text-gray-700">Font Size:</label>
      <input
        type="number"
        value={parseInt(fontSize)}
        onChange={(e) => setFontSize(e.target.value + "px")}
        min="10"
        max="30"
        className="w-20 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 text-gray-700"
      />
    </div>
    <div className="flex items-center justify-between">
      <label className="text-lg font-medium text-gray-700">Font Family:</label>
      <select
        onChange={(e) => setFontFamily(e.target.value)}
        value={fontFamily}
        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 text-gray-700"
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

export default TextEditor;