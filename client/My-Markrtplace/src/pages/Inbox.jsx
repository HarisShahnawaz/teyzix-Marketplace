import { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Send, User, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom'; // 🟩 Added useLocation
import io from 'socket.io-client';

const Inbox = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation(); // 🟩 Read fallback data from ServiceDetails routing state

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  // 🟩 Safe localized utility handler to pluck the real nested token from 'teyzix_user'
  const getAuthToken = () => {
    const storedUser = localStorage.getItem('teyzix_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      return parsed.token || null;
    }
    return null;
  };

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Setup Socket.io connection
  useEffect(() => {
    if (user) {
      const newSocket = io('http://localhost:5000');
      setSocket(newSocket);

      // Emit user online event
      newSocket.emit('userOnline', user._id);

      // Listen for incoming messages
      newSocket.on('getMessage', (message) => {
        if (selectedConversation && message.conversationId?._id === selectedConversation._id) {
          setMessages((prev) => [...prev, message]);
        }
        // Refresh conversations to update last message
        fetchConversations();
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user, selectedConversation]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const token = getAuthToken(); // 🟩 Fixed Token Pointer
      const { data } = await axios.get('http://localhost:5000/api/messages/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(data);

      // 🟩 SMART RECOVERY: If redirected with a fallback provider, focus on them immediately
      if (location.state?.fallbackProvider) {
        const targetProvider = location.state.fallbackProvider;
        
        // Check if a real conversation object thread already exists in database results
        const matchingChat = data.find(chat => 
          chat.participants.some(p => p._id === targetProvider._id || p === targetProvider._id)
        );

        if (matchingChat) {
          setSelectedConversation(matchingChat);
          fetchMessages(matchingChat._id);
        } else {
          // Instantly open a local mock UI session structure so the user can type straight away
          setSelectedConversation({
            _id: 'temp_placeholder_thread',
            participants: [targetProvider],
            isTempPlaceholder: true
          });
          setMessages([]);
        }
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const token = getAuthToken(); // 🟩 Fixed Token Pointer
      const { data } = await axios.get(`http://localhost:5000/api/messages/history/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleConversationClick = async (conversation) => {
    setSelectedConversation(conversation);
    if (conversation.isTempPlaceholder) {
      setMessages([]);
    } else {
      fetchMessages(conversation._id);
      // Mark messages as read when conversation is opened
      try {
        const token = getAuthToken();
        await axios.put(`http://localhost:5000/api/messages/mark-read/${conversation._id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);
    try {
      const token = getAuthToken(); // 🟩 Fixed Token Pointer
      
      // Determine recipient dynamically whether it's an array or a flat single fallback object profile
      const recipientId = selectedConversation.isTempPlaceholder 
        ? selectedConversation.participants[0]._id 
        : selectedConversation.participants.find(p => p._id !== user._id)?._id || selectedConversation.participants[0]._id;
      
      const { data } = await axios.post('http://localhost:5000/api/messages/send', {
        receiverId: recipientId,
        text: newMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessages((prev) => [...prev, data]);
      setNewMessage('');
      
      // If it was a temporary placeholder interface session, re-sync completely into standard data flow
      if (selectedConversation.isTempPlaceholder) {
        // Clear history router state parameter flags so loop resets cleanly
        window.history.replaceState({}, document.title);
        await fetchConversations();
      } else {
        fetchConversations();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <p className="text-slate-600 dark:text-zinc-400">Please sign in to access your inbox.</p>
      </div>
    );
  }

  // Helper calculation to safely get the recipient's display label data context
  const getRecipientInfo = (chat) => {
    if (!chat) return { name: 'Unknown User', role: 'User' };
    if (chat.isTempPlaceholder) return { name: chat.participants[0]?.name || 'Provider', role: chat.participants[0]?.role || 'Provider' };
    const counterpart = chat.participants.find(p => p._id !== user._id);
    return {
      name: counterpart?.name || 'Unknown User',
      role: counterpart?.role || 'User'
    };
  };

  const currentRecipient = getRecipientInfo(selectedConversation);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600 dark:text-zinc-400" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">Messages</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          
          {/* Left Navigation Column - Conversations List */}
          <div className="lg:col-span-1 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-zinc-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100">Conversations</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#1dbf73]"></div>
                </div>
              ) : conversations.length === 0 && !selectedConversation?.isTempPlaceholder ? (
                <div className="p-8 text-center">
                  <p className="text-slate-500 dark:text-zinc-400 text-sm">No conversations yet.</p>
                  <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">Contact a service provider to start chatting!</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {/* Render Mock Placeholder Sidebar Tab if active conversation is newly initialized */}
                  {selectedConversation?.isTempPlaceholder && (
                    <div className="p-4 bg-slate-50 dark:bg-zinc-800 border-l-4 border-[#1dbf73]">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold rounded-full flex items-center justify-center flex-shrink-0">
                          {currentRecipient.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 dark:text-zinc-100 text-sm truncate">{currentRecipient.name}</h3>
                          <p className="text-xs text-[#1dbf73] font-medium mt-1 animate-pulse">New conversation context...</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {conversations.map((conv) => {
                    const activeMeta = getRecipientInfo(conv);
                    return (
                      <div
                        key={conv._id}
                        onClick={() => handleConversationClick(conv)}
                        className={`p-4 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-zinc-800 ${
                          selectedConversation?._id === conv._id ? 'bg-slate-50 dark:bg-zinc-800' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold rounded-full flex items-center justify-center flex-shrink-0">
                            {activeMeta.name.charAt(0).toUpperCase() || <User size={18} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-slate-900 dark:text-zinc-100 text-sm truncate">
                                {activeMeta.name}
                              </h3>
                              <span className="text-xs text-slate-400 dark:text-zinc-500">
                                {new Date(conv.updatedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-zinc-400 truncate mt-1">
                              {conv.lastMessage || 'No messages yet'}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Messaging Window */}
          <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 overflow-hidden flex flex-col">
            {!selectedConversation ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <User size={48} className="text-slate-300 dark:text-zinc-700 mx-auto mb-4" />
                  <p className="text-slate-500 dark:text-zinc-400">Select a conversation to start messaging</p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold rounded-full flex items-center justify-center">
                    {currentRecipient.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-zinc-100">
                      {currentRecipient.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 capitalize">
                      {currentRecipient.role}
                    </p>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-slate-400 dark:text-zinc-500 text-sm">No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isOwn = msg.sender?._id === user._id || msg.sender === user._id;
                      return (
                        <motion.div
                          key={msg._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                              isOwn
                                ? 'bg-emerald-500 text-white rounded-br-sm'
                                : 'bg-slate-200 dark:bg-zinc-700 text-slate-900 dark:text-zinc-100 rounded-bl-sm'
                            }`}
                          >
                            <p className="text-sm">{msg.text}</p>
                            <p className={`text-[10px] mt-1 text-right ${isOwn ? 'text-emerald-100' : 'text-slate-400'}`}>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 dark:border-zinc-800">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-[#1dbf73] transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={sending || !newMessage.trim()}
                      className="px-4 py-2 bg-[#1dbf73] hover:bg-[#19a463] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Send size={18} />
                      {sending ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inbox;