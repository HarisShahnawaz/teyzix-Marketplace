import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Moon, Sun, Menu, X, Search, LogOut, ShieldCheck, MessageSquare } from 'lucide-react';
import axios from 'axios';
import io from 'socket.io-client';
import { API_URL } from '../config/api';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);

  // Helper function to get auth token
  const getAuthToken = () => {
    const storedUser = localStorage.getItem('teyzix_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      return parsed.token || null;
    }
    return null;
  };

  // Fetch unread message count
  const fetchUnreadCount = async () => {
    if (!user) return;
    try {
      const token = getAuthToken();
      const { data } = await axios.get(`${API_URL}/api/messages/unread-count`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  // Setup Socket.io for real-time unread count updates
  useEffect(() => {
    if (user) {
      const newSocket = io(API_URL);
      setSocket(newSocket);

      newSocket.emit('userOnline', user._id);

      newSocket.on('getMessage', (message) => {
        // If message is not from current user, increment unread count
        if (message.sender._id !== user._id) {
          setUnreadCount(prev => prev + 1);
        }
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  // Fetch unread count on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchUnreadCount();
    }
  }, [user]);

  // Reset unread count when navigating to inbox
  useEffect(() => {
    if (location.pathname === '/inbox' && user) {
      setUnreadCount(0);
    }
  }, [location.pathname, user]);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getUserInitials = () => {
    if (!user || !user.name) return 'US';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 transition-all duration-300 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          
          {/* Left Block: Premium Geometric Brand Token */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="text-2xl font-black text-[#222325] dark:!text-white tracking-tighter select-none">
              Teyzix<span className="text-[#1dbf73] dark:!text-white">Market.</span>
            </Link>
          </div>

          {/* 🔍 Center Block: Embedded Rounded Omnibox Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-grow max-w-xl relative mx-2">
            <input
              type="text"
              placeholder="What service are you looking for today?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-4 pr-12 border border-slate-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-xs font-normal text-[#404145] dark:text-zinc-200 placeholder-slate-400 focus:outline-none focus:border-slate-400 dark:focus:border-zinc-500 transition-all"
            />
            <button 
              type="submit" 
              className="absolute right-0 top-0 h-10 w-11 bg-[#222325] hover:bg-black dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white rounded-r flex items-center justify-center transition-colors"
            >
              <Search size={16} strokeWidth={2.5} />
            </button>
          </form>

          {/* Right Block: Actions & Context Menus */}
          <div className="hidden md:flex items-center space-x-5 text-[14px] font-bold text-[#62646a] dark:text-zinc-300">
            <Link to="/" className="hover:text-[#1dbf73] transition-colors">
              Browse
            </Link>

            {user ? (
              <>
                {(user.role === 'customer' || user.role === 'provider') && (
                  <Link to="/inbox" className="hover:text-[#1dbf73] transition-colors flex items-center gap-1 relative">
                    <MessageSquare size={15} /> Messages
                    {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>
                )}
                {user.role === 'customer' && (
                  <Link to="/customer-dashboard" className="hover:text-[#1dbf73] transition-colors flex items-center gap-1">
                    Orders
                  </Link>
                )}
                {user.role === 'provider' && (
                  <Link to="/provider-dashboard" className="hover:text-[#1dbf73] transition-colors text-[#1dbf73]">
                    Switch to Selling
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin-dashboard" className="text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1">
                    <ShieldCheck size={15} /> Admin Panel
                  </Link>
                )}

                <button
                  onClick={toggleTheme}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition-colors"
                  aria-label="Toggle layout theme"
                >
                  {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </button>

                {/* 👤 User Context Avatar Bubble */}
                <div className="relative group flex items-center">
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold rounded-full flex items-center justify-center border border-emerald-200 dark:border-emerald-800 cursor-pointer text-xs select-none shadow-xs">
                    {getUserInitials()}
                  </div>
                  
                  <div className="absolute right-0 top-full pt-2 hidden group-hover:block w-48 transition-all">
                    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded shadow-xl py-2 flex flex-col font-medium text-slate-700 dark:text-zinc-300">
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-zinc-800 font-bold text-xs text-[#222325] dark:!text-white line-clamp-1">
                        {user.name}
                      </div>
                      <button 
                        onClick={handleLogout} 
                        className="px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-zinc-800 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 font-semibold"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={toggleTheme}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
                >
                  {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </button>
                <Link to="/login" className="hover:text-[#1dbf73] transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="border border-[#1dbf73] text-[#1dbf73] hover:bg-[#1dbf73] hover:text-white font-bold px-4 py-1.5 rounded transition-all duration-200">
                  Join
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Triggers */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-zinc-400"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#222325] dark:text-white"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu Overlays */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 px-4 py-4 space-y-3 font-semibold text-slate-700 dark:text-zinc-300 text-sm">
          <form onSubmit={handleSearchSubmit} className="flex relative w-full mb-2">
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-3 pr-10 border border-slate-300 dark:border-zinc-700 rounded text-xs bg-slate-50 dark:bg-zinc-800"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-slate-400">
              <Search size={16} />
            </button>
          </form>

          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#1dbf73]">
            Browse Marketplace
          </Link>

          {user ? (
            <>
              {(user.role === 'customer' || user.role === 'provider') && (
                <Link to="/inbox" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#1dbf73] relative">
                  Messages
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              )}
              {user.role === 'customer' && (
                <Link to="/customer-dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#1dbf73]">
                  Buyer Dashboard
                </Link>
              )}
              {user.role === 'provider' && (
                <Link to="/provider-dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-[#1dbf73]">
                  Seller Dashboard
                </Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin-dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-purple-500">
                  Admin Panel Dashboard
                </Link>
              )}
              <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex flex-col gap-3">
                <span className="text-xs text-slate-400 dark:!text-white font-bold block">Logged as: {user.name}</span>
                <button onClick={handleLogout} className="w-full text-left py-2 text-rose-500 text-xs font-bold">
                  Sign Out Account
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between gap-4">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#1dbf73]">
                Sign In
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="bg-[#1dbf73] text-white px-4 py-1.5 rounded font-bold text-center flex-grow">
                Join
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;