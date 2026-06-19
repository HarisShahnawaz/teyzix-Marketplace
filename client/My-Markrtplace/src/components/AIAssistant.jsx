import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config/api';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I am your AI Guide. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Safe internal regex parser to convert markdown text markers into clean layout strings
  const formatAiMessage = (rawText) => {
    if (!rawText) return '';

    return rawText.split('\n').map((line, lineIndex) => {
      let cleanLine = line.trim();
      if (!cleanLine) return <div key={lineIndex} className="h-2" />;

      // 1. Process Bullet Points (lines starting with * or -)
      const isBullet = cleanLine.startsWith('* ') || cleanLine.startsWith('- ');
      if (isBullet) {
        cleanLine = cleanLine.substring(2);
      }

      // 2. Process Bold text markers (**text** or ^^text^^)
      const boldRegex = /(\*\*|\^)(.*?)\1/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(cleanLine)) !== null) {
        if (match.index > lastIndex) {
          parts.push(cleanLine.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} className="font-bold text-zinc-950 dark:text-white">{match[2]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }

      if (lastIndex < cleanLine.length) {
        parts.push(cleanLine.substring(lastIndex));
      }

      // Return formatted row structures
      if (isBullet) {
        return (
          <li key={lineIndex} className="list-disc ml-4 my-0.5 text-gray-700 dark:text-zinc-200">
            {parts}
          </li>
        );
      }

      return (
        <p key={lineIndex} className="mb-1 text-gray-700 dark:text-zinc-200 last:mb-0">
          {parts}
        </p>
      );
    });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/api/ai`, { message: userMessage.text });
      setMessages((prev) => [...prev, { role: 'assistant', text: data.reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', text: "Can't connect to server right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[999] font-sans">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-green-600 hover:bg-green-700 text-white p-3.5 rounded-full shadow-lg transition-all transform hover:scale-105 flex items-center justify-center focus:outline-none"
      >
        {isOpen ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-14 w-[calc(100vw-32px)] sm:w-80 h-[400px] right-0 sm:right-0 bg-white rounded-xl shadow-xl border border-gray-100 flex flex-col overflow-hidden transition-all">
          <div className="bg-green-600 p-3 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-300 rounded-full animate-ping"></span>
              <h3 className="font-semibold text-xs tracking-wide uppercase">AI Assistant</h3>
            </div>
          </div>

          <div className="grow p-3 overflow-y-auto space-y-2 bg-gray-50 text-xs">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-lg px-3 py-2 leading-relaxed shadow-sm ${msg.role === 'user'
                  ? 'bg-green-600 text-white'
                  : 'bg-white border border-gray-100'
                  }`}>

                  {msg.role === 'user' ? (
                    msg.text
                  ) : (
                    <div className="space-y-1 break-words font-medium">
                      {formatAiMessage(msg.text)}
                    </div>
                  )}

                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 text-gray-400 rounded-lg px-3 py-1.5 shadow-sm animate-pulse">
                  Typing...
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="p-2 bg-white border-t border-gray-100 flex items-center space-x-1.5">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="grow p-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-green-500 bg-gray-50"
            />
            <button
              type="submit"
              className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition"
            >
              <svg className="w-3.5 h-3.5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;