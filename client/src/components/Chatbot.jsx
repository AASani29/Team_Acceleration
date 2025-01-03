import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Groq } from "groq-sdk";

const FloatingChatbot = () => {
  const [inputText, setInputText] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatEndRef = useRef(null);

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
  You are a chatbot named SoulMate. Your purpose is to assist users in Bangla. 
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
      {/* Floating Chatbot Button */}
      {!isChatOpen && (
        <button
          className="fixed bottom-4 right-4  transition-all z-50"
          onClick={() => setIsChatOpen(true)}
        >
          <img src="/chatbot.png" alt="Chatbot Icon" className="w-30 h-20" />
        </button>
      )}

      {/* Chatbot Popup */}
      {isChatOpen && (
  <div
    className="fixed bottom-12 right-12 w-96 h-[32rem] bg-white rounded-lg shadow-lg flex flex-col z-50"
  >
    {/* Chat Header */}
    <div className="flex items-center justify-between bg-teal-600 text-white p-3 rounded-t-lg">
      <div className="flex items-center">
        <img
          src="/chatbot.png"
          alt="Chatbot Header Icon"
          className="w-28 h-16 -mr-2 -ml-4" // Slight left shift for the image
        />
        <div>
          <h1 className="text-lg font-bold">BanglishBaba</h1>
          <p className="text-sm text-teal-200">
          Your AI Companion, Transforming Banglish into Fluent Bangla Instantly!
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

    {/* Chat History */}
    <div className="flex-1 overflow-y-auto p-3">
      {conversation.map((message, index) => (
        <div
          key={index}
          className={`mb-4 ${
            message.role === "user" ? "text-right" : "text-left"
          }`}
        >
          <div
            className={`inline-block p-3 rounded-lg shadow-sm ${
              message.role === "user"
                ? "bg-teal-600 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>
      ))}
      <div ref={chatEndRef}></div>
    </div>

    {/* Chat Input */}
    <form onSubmit={handleSubmit} className="p-3 border-t">
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Type your message here..."
        rows="2"
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-teal-300"
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50"
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
