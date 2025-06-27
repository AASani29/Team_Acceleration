import { useState, useRef, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import { Groq } from "groq-sdk"
import { MessageCircle, Send, Bot, User, Loader2, X, Mic } from "lucide-react"

const FloatingChatbot = ({ userId }) => {
  const [inputText, setInputText] = useState("")
  const [conversation, setConversation] = useState([])
  const [loading, setLoading] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isRAGEnabled, setIsRAGEnabled] = useState(true) // Toggle for RAG
  const chatEndRef = useRef(null)

  const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
  })

  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [conversation])

  const handleVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
    recognition.lang = "en-UK"
    recognition.start()

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript
      setInputText(speechToText)
    }

    recognition.onerror = (event) => {
      alert("Error with speech recognition!")
    }
  }

  const searchUserStories = async (query) => {
    try {
      const response = await fetch(`/api/rag/search-stories?query=${encodeURIComponent(query)}&userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (!response.ok) throw new Error('Failed to fetch stories')
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching stories:", error)
      return []
    }
  }

  const classifyQuery = async (query) => {
    try {
      const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0.2,
        max_tokens: 50,
        messages: [
          {
            role: "system",
            content: `Classify if this query is about the user's personal stories or experiences. 
            Respond ONLY with "yes" or "no".`
          },
          { role: "user", content: query }
        ],
      })

      return response.choices[0]?.message?.content?.toLowerCase().trim() === "yes"
    } catch (error) {
      console.error("Error classifying query:", error)
      return false
    }
  }

  const generateResponseWithRAG = async (query, conversationHistory, storyChunks) => {
    const context = storyChunks.map(chunk => 
      `Story from "${chunk.metadata.title}" (${new Date(chunk.metadata.createdAt).toLocaleDateString()}):\n${chunk.textChunk}`
    ).join('\n\n---\n\n')

    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
      messages: [
        {
          role: "system",
          content: `You are ChatBlingo, a helpful assistant that can answer questions about the user's personal stories.
          Use the following context from the user's stories to answer questions. If the question isn't about these stories,
          respond normally. Always respond in Bangla unless asked otherwise.

          User's Stories Context:
          ${context}`
        },
        ...conversationHistory
      ],
    })

    return chatCompletion.choices[0]?.message?.content || "I couldn't generate a response."
  }

  const generateRegularResponse = async (conversationHistory) => {
    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.9,
      max_tokens: 1024,
      messages: [
        {
          role: "system",
          content: `You are ChatBlingo, a helpful assistant that responds in Bangla.
          You can understand both Bangla and Banglish but always respond in proper Bangla.`
        },
        ...conversationHistory
      ],
    })

    return chatCompletion.choices[0]?.message?.content || "No response from AI."
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!inputText.trim()) return

    setLoading(true)
    const userMessage = { role: "user", content: inputText }
    const updatedConversation = [...conversation, userMessage]
    setConversation(updatedConversation)

    try {
      let aiResponse
      
      if (isRAGEnabled) {
        // First check if this is a story-related query
        const isStoryQuery = await classifyQuery(inputText)
        
        if (isStoryQuery && userId) {
          // Search for relevant story chunks
          const storyChunks = await searchUserStories(inputText)
          
          if (storyChunks.length > 0) {
            // Generate response with RAG
            aiResponse = await generateResponseWithRAG(inputText, updatedConversation, storyChunks)
          } else {
            // No relevant stories found
            aiResponse = "I couldn't find any relevant stories to answer your question."
          }
        } else {
          // Regular response for non-story queries
          aiResponse = await generateRegularResponse(updatedConversation)
        }
      } else {
        // RAG disabled - always use regular response
        aiResponse = await generateRegularResponse(updatedConversation)
      }

      setConversation([...updatedConversation, { role: "assistant", content: aiResponse }])
    } catch (error) {
      console.error("Error:", error)
      setConversation([...updatedConversation, { 
        role: "assistant", 
        content: "Sorry, I encountered an error processing your request." 
      }])
    } finally {
      setLoading(false)
      setInputText("")
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }
  return (
    <>
      {/* Floating Chat Button */}
      {!isChatOpen && (
        <button
          className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-full w-16 h-16 shadow-xl flex items-center justify-center hover:scale-110 transition-all duration-300 z-50 group"
          onClick={() => setIsChatOpen(true)}
        >
          <MessageCircle className="h-8 w-8 group-hover:scale-110 transition-transform duration-200" />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">!</span>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isChatOpen && (
        <div className="fixed inset-4 sm:bottom-6 sm:right-6 sm:inset-auto w-auto sm:w-96 h-auto sm:h-[32rem] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-purple-100 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-base sm:text-lg">ChatBlingo</h1>
                <p className="text-purple-100 text-xs sm:text-sm">Online • Ready to help</p>
              </div>
            </div>
            <button
              className="text-white hover:text-red-300 transition-colors duration-200 p-1 hover:bg-white hover:bg-opacity-20 rounded-full"
              onClick={() => setIsChatOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gray-50 min-h-0">
            {conversation.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Welcome to ChatBlingo!</h3>
                <p className="text-gray-500 text-sm">Start chatting in Banglish or Bangla</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {conversation.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`flex items-start space-x-2 max-w-[85%] sm:max-w-xs`}>
                      {message.role === "assistant" && (
                        <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                          <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                        </div>
                      )}
                      <div
                        className={`px-3 py-2 rounded-2xl shadow-sm text-sm ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-br-sm"
                            : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"
                        }`}
                      >
                        <ReactMarkdown className="leading-relaxed">{message.content}</ReactMarkdown>
                      </div>
                      {message.role === "user" && (
                        <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                      <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                        <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                      </div>
                      <div className="bg-white text-gray-800 border border-gray-200 px-3 py-2 rounded-2xl rounded-bl-sm shadow-sm">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                          <span className="text-sm text-gray-600">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef}></div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <div className="p-3 sm:p-4 bg-white border-t border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  rows="2"
                  className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none text-sm"
                />
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  className="absolute right-2 top-2 p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-200"
                  title="Voice Input"
                >
                  <Mic className="h-4 w-4" />
                </button>
              </div>
              <button
                type="submit"
                disabled={loading || !inputText.trim()}
                className="w-full group bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-2 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm">Send</span>
                    <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default FloatingChatbot
