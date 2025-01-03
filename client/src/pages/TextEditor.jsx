import React, { useState, useRef, useEffect } from "react";
import { Groq } from "groq-sdk";
import jsPDF from "jspdf";

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

  //  const handlePost = async () => {
  //   setLoading(true);
  //   try {
  //     const aiResponse = await groq.chat.completions.create({
  //       model: "llama-3.3-70b-versatile",
  //       temperature: 0.7,
  //       max_tokens: 200,
  //       messages: [
  //         {
  //           role: "system",
  //           content: `You are a content assistant. Your task is to generate a short title and caption for a post. The title should be engaging and summarize the content succinctly. Respond only with the title and caption.`,
  //         },
  //         {
  //           role: "user",
  //           content: `Generate a title and caption for this content: ${banglishText}`,
  //         },
  //       ],
  //     });

  //     const aiResponseContent = aiResponse.choices[0]?.message?.content || "No response from AI.";
  //     const [title, caption] = aiResponseContent.split("\n");

  //     setPostTitle(title);
  //     setPostCaption(caption);

  //     // Generate the translated Bangla content (this must be handled separately)
  //     const banglaTranslation = banglaText; // Replace this with your Bangla text

  //     // Create the PDF and format text properly
  //     const pdf = new jsPDF();
  //     const pageWidth = pdf.internal.pageSize.getWidth();
  //     const margin = 10;
  //     const maxWidth = pageWidth - margin * 2;

  //     pdf.setFontSize(20);
  //     pdf.text(title, margin, 30, { maxWidth });
  //     pdf.setFontSize(12);
  //     pdf.text(caption, margin, 50, { maxWidth });

  //     // Add the Bangla content
  //     pdf.setFont("Helvetica"); // Adjust font if necessary for Bangla text rendering
  //     pdf.setFontSize(14);
  //     pdf.text(banglaTranslation, margin, 70, { maxWidth });

  //     const fileName = `${title.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_")}.pdf`;
  //     pdf.save(fileName);

  //     alert(`Post generated! Title: ${title}, Caption: ${caption}`);
  //   } catch (error) {
  //     console.error("Error generating post:", error);
  //     alert("Failed to generate post!");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

      // Generate the translated Bangla content (this must be handled separately)
      const banglaTranslation = banglaText;

      // Create the PDF and format text properly
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 10;
      const maxWidth = pageWidth - margin * 2;

      pdf.setFontSize(20);
      pdf.text(title, margin, 30, { maxWidth });
      pdf.setFontSize(12);
      pdf.text(caption, margin, 50, { maxWidth });

      // Add the Bangla content
      pdf.setFont("Helvetica"); // Adjust font if necessary for Bangla text rendering
      pdf.setFontSize(14);
      pdf.text(banglaTranslation, margin, 70, { maxWidth });

      // Generate the PDF as a Blob
      const pdfBlob = pdf.output('blob');
      const formData = new FormData();
      formData.append('pdf', pdfBlob, `${title.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_")}.pdf`);
      formData.append('title', title);
      formData.append('caption', caption);

      // Send the form data to the backend
      const response = await fetch('/api/pdf/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('PDF uploaded successfully!');
      } else {
        alert('Failed to upload PDF');
      }

      alert(`Post generated! Title: ${title}, Caption: ${caption}`);
    } catch (error) {
      console.error("Error generating post:", error);
      alert("Failed to generate post!");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-semibold text-center mb-6">Banglish to Bangla Text Editor</h2>

      <div className="mb-4">
        <textarea
          placeholder="Type Banglish text here..."
          value={banglishText}
          onChange={(e) => setBanglishText(e.target.value)}
          className="w-full h-28 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ fontFamily: fontFamily, fontSize: fontSize }}
        />
      </div>

      <div className="flex justify-between mb-4">
        <button
          onClick={handleTranslate}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Translate
        </button>
        <button
          onClick={handleVoiceInput}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Voice Input
        </button>

      </div>

      <div className="mb-4">
        <textarea
          placeholder="Translated Bangla text will appear here..."
          value={banglaText}
          readOnly
          className="w-full h-28 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none"
          style={{ fontFamily: fontFamily, fontSize: fontSize }}
        />
      </div>

      <div className="flex justify-between mb-6">
        <button
          onClick={handlePost}
          className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          Download PDF
        </button>
        <button
          onClick={handleHearText}
          className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          Hear
        </button>
      </div>

      <div className="flex flex-col space-y-3 mb-4">
        <div className="flex items-center space-x-3">
          <label className="text-lg">Change Font Size: </label>
          <input
            type="number"
            value={parseInt(fontSize)}
            onChange={(e) => setFontSize(`${e.target.value}px`)}
            min="10"
            max="30"
            className="w-24 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center space-x-3">
          <label className="text-lg">Font Family: </label>
          <select
            onChange={(e) => setFontFamily(e.target.value)}
            value={fontFamily}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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



