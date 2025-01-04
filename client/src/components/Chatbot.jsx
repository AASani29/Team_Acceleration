import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Groq } from "groq-sdk";

const FloatingChatbot = () => {
  const [inputText, setInputText] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatEndRef = useRef(null);

  const handleVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-UK"; // Adjust for language as needed
    recognition.start();

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setInputText(speechToText); // Set the recognized text into the input box
    };

    recognition.onerror = (event) => {
      alert("Error with speech recognition!");
    };
  };

  const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!inputText.trim()) return;

    setLoading(true);

    const updatedConversation = [
      ...conversation,
      { role: "user", content: inputText },
    ];

    try {
      const chatCompletion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0.9,
        max_tokens: 1024,
        messages: [
          {
            role: "system",
            content: `
  You are a chatbot named Blingo. Your purpose is to assist users in Bangla. 
  You can understand both Bangla and Banglish (Romanized Bangla), but all your responses must be in proper Bangla. 
  If the user's input is unclear, ask for clarification politely in Bangla.
`,
          },
          ...updatedConversation,
        ],
      });

      const aiResponse =
        chatCompletion.choices[0]?.message?.content || "No response from AI.";

      setConversation([
        ...updatedConversation,
        { role: "assistant", content: aiResponse },
      ]);

      setInputText("");
    } catch (error) {
      console.error("Error fetching from Groq:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!isChatOpen && (
        <button
          className="fixed bottom-4 right-4 bg-gradient-to-r from-[#002a62] to-[#00509e] text-white rounded-full w-14 h-14 shadow-lg flex items-center justify-center hover:scale-105 transition-all duration-300 z-50 overflow-hidden"
          onClick={() => setIsChatOpen(true)}
        >
          <img
            src="/bot.png"
            alt="Chatbot Icon"
            className="w-full h-full object-cover"
          />
        </button>
      )}
      {isChatOpen && (
        <div className="fixed bottom-8 right-8 w-80 h-[28rem] bg-white rounded-lg shadow-xl flex flex-col z-50 border border-gray-200">
          <div className="flex items-center justify-between bg-gradient-to-r from-[#002a62] to-[#00509e] text-white p-3 rounded-t-lg">
            <div className="flex items-center">
              <div>
                <h1 className="text-lg font-bold">Blingo</h1>
                <p className="text-xs text-gray-200">
                  Your AI Companion for Bangla Assistance
                </p>
              </div>
            </div>
            <button
              className="text-white hover:text-red-500"
              onClick={() => setIsChatOpen(false)}
            >
              ✖
            </button>
          </div>
          <button
            onClick={handleVoiceInput}
            className="px-6 py-3 bg-transparent text-blue font-medium rounded-lg shadow-md  transition focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            🎤 Voice Input
          </button>

          <div className="flex-1 overflow-y-auto bg-gray-50 p-3">
            {conversation.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"
                  }`}
              >
                <div
                  className={`inline-block p-2 rounded-lg shadow-sm ${message.role === "user"
                    ? "bg-gradient-to-r from-[#00509e] to-[#002a62] text-white"
                    : "bg-gray-200 text-black"
                    }`}
                >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            ))}
            <div ref={chatEndRef}></div>
          </div>

          <form onSubmit={handleSubmit} className="p-3 bg-gray-100 border-t">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message here..."
              rows="2"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002a62] resize-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-[#002a62] to-[#00509e] hover:bg-[#001a4a] disabled:opacity-50 transition-all duration-300"
            >
              {loading ? "Thinking..." : "Send"}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;
