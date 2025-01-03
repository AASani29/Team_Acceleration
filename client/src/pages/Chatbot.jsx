import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Groq } from "groq-sdk";

const Chatbot = () => {
  const [inputText, setInputText] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
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
  You are a chatbot named BanglishBaba. Your purpose is to assist users in Bangla. 
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
    <div className="min-h-screen flex flex-col bg-gray-100">
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        {/* Title and Subtext Section */}
        <div className="text-center px-6 py-8">
          {/* Title with Padding */}
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Welcome to BanglishBaba!
          </h2>
          {/* Subtext in Italics */}
          <p className="text-gray-600 italic">
            Use our AI-powered chatbot to transform Banglish into fluent Bangla.
          </p>
        </div>

        {/* Chat Container */}
        <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6">
          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-3 h-64 bg-gray-100 rounded-lg mb-4">
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

          {/* Input and Submit Button */}
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
      </main>
    </div>
  );
};

export default Chatbot;
