import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Clock, RefreshCw, Star, ShieldAlert, ChevronRight, MessageSquare, Tag } from 'lucide-react';
import { API_URL } from '../config/api';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [service, setService] = useState(null);
  const [notes, setNotes] = useState('');
  const [customBudget, setCustomBudget] = useState('');
  const [customDays, setCustomDays] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('standard'); 

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/services`);
        const foundService = data.find(s => s._id === id);
        setService(foundService);

        if (foundService) {
          setCustomBudget(foundService.price || '');
          const baselineDays = parseInt(foundService.deliveryTime) || 7;
          setCustomDays(baselineDays);
        }
      } catch (error) {
        console.error("Error fetching service details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServiceDetails();
  }, [id]);

  const getCategoryFallback = (category) => {
    const cat = category?.toLowerCase() || '';
    if (cat.includes('design') || cat.includes('graphic')) {
      return "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1200&auto=format&fit=crop";
    }
    if (cat.includes('marketing') || cat.includes('digital')) {
      return "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop";
    }
    return "https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=1200&auto=format&fit=crop";
  };

  // 🟩 Helper function to pull the nested token out of 'teyzix_user' safely
  const getAuthHeader = () => {
    const storedUser = localStorage.getItem('teyzix_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      return parsed.token ? { Authorization: `Bearer ${parsed.token}` } : {};
    }
    return {};
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const finalBudget = activeTab === 'standard' ? service.price : Number(customBudget);
    const finalDays = activeTab === 'standard' ? (parseInt(service.deliveryTime) || 7) : (parseInt(customDays) || 7);

    const deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() + finalDays);

    const providerId = service.createdBy?._id || service.createdBy;

    if (!providerId) {
      alert("Error: Could not locate the Service Provider ID.");
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        provider: providerId,
        service: service._id,
        requirements: notes || `Standard checkout delivery request for: ${service.title}`,
        budget: finalBudget,
        deadline: deadlineDate.toISOString()
      };

      // 🟩 Fixed: Added authorization header configuration object to checkouts
      await axios.post(`${API_URL}/api/requests`, payload, {
        headers: getAuthHeader()
      });
      
      alert('🎉 Order request submitted successfully!');
      navigate('/customer-dashboard');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to submit order request.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleContactMe = async () => {
    if (!user) {
      alert('Please sign in to contact the provider.');
      navigate('/login');
      return;
    }

    const providerId = service.createdBy?._id || service.createdBy;
    if (!providerId) {
      alert('Error: Could not locate the Service Provider ID.');
      return;
    }

    if (user._id === providerId) {
      alert('You cannot contact yourself.');
      return;
    }

    try {
      const greetingMessage = `Hi! I'm interested in your service: ${service.title}. Could you tell me more about it?`;

      // 🟩 Fixed: Now successfully passing the verified parsed authorization header string
      await axios.post(`${API_URL}/api/messages/send`, {
        receiverId: providerId,
        text: greetingMessage
      }, {
        headers: getAuthHeader()
      });

      // ... after your successful API creation logic you do this
      navigate('/inbox', { 
        state: { fallbackProvider: service.createdBy } 
      });
    } catch (error) {
      console.error('Error sending message:', error);
      alert(error.response?.data?.message || error.response?.data?.error || 'Failed to send message. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1dbf73]"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center py-16 min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold text-[#222325] dark:text-zinc-200">Service not found.</h2>
      </div>
    );
  }

  const cardBanner = (service.image && service.image.startsWith('http') ? service.image : (service.image ? `${API_URL}${service.image}` : null)) || service.coverImage || service.banner || (service.images && service.images.length > 0 ? service.images[0] : null) || getCategoryFallback(service.category);
  const sellerName = service.createdBy?.name || "Haris";
  const initials = sellerName.substring(0, 2).toUpperCase();

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans text-[#404145] dark:text-zinc-300"
      >
        {/* 🧭 Aligned Breadcrumb Header */}
        <div className="text-xs font-medium text-[#74767e] mb-6 flex items-center gap-1.5">
          <Link to="/" className="hover:text-[#1dbf73] transition-colors">Marketplace</Link> 
          <ChevronRight size={12} className="text-slate-400" />
          <span className="font-semibold text-[#222325] dark:text-zinc-300 capitalize">
            {service.category || "Web Development"}
          </span>
        </div>

        {/* 📦 Master Grid System */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* ================= LEFT MAIN CONTENT PANEL ================= */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#222325] dark:text-zinc-100 leading-tight tracking-tight capitalize">
              {service.title}
            </h1> 

            {/* Seller Quick Info Meta Bar */}
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-zinc-800/80 pb-5 text-sm">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#1dbf73] to-emerald-600 text-white font-bold flex items-center justify-center text-sm uppercase shadow-sm">
                {initials}
              </div>
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <span className="font-bold text-[#222325] dark:text-zinc-100">
                  {sellerName}
                </span>
                <span className="text-xs bg-emerald-50 dark:bg-emerald-950/40 text-[#1dbf73] px-2 py-0.5 rounded font-bold">
                  Top Rated Seller
                </span>
                <span className="text-slate-300 dark:text-zinc-700 hidden sm:inline">|</span>
                <div className="flex items-center gap-1 text-xs font-bold text-[#222325] dark:text-zinc-200">
                  <Star size={14} className="fill-[#ffb33e] text-[#ffb33e]" /> 
                  <span>{service.averageRating ? Number(service.averageRating).toFixed(1) : "5.0"}</span>
                  <span className="text-[#74767e] font-normal">({service.reviewCount || 1} reviews)</span>
                </div>
              </div>
            </div>

            {/* 📸 Clean Display Showcase Banner Area */}
            <div className="w-full h-[240px] sm:h-[360px] md:h-[420px] rounded-lg overflow-hidden bg-slate-50 dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 shadow-sm relative">
              <img 
                src={cardBanner} 
                alt={service.title} 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = getCategoryFallback(service.category); }}
              />
            </div>

            {/* About This Gig Content Area */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#222325] dark:text-zinc-100">
                  About This Gig
                </h2>
                {service.category && (
                  <span className="flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md capitalize">
                    <Tag size={10} className="text-slate-400 dark:text-zinc-500" />
                    {service.category}
                  </span>
                )}
              </div>
              <p className="text-[15px] text-[#404145] dark:text-zinc-300 leading-relaxed whitespace-pre-line font-normal tracking-wide">
                {service.description || "No description provided for this marketplace listing."}
              </p>
            </div>

            {/* Premium Modular Identity Component */}
            <div className="border border-slate-200 dark:border-zinc-800 rounded-xl p-6 bg-white dark:bg-zinc-900/50 shadow-xs">
              <h3 className="text-base font-bold text-[#222325] dark:text-zinc-100 mb-4">About The Seller</h3>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#1dbf73] to-emerald-600 text-white font-black flex items-center justify-center text-lg uppercase shadow-sm">
                    {initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#222325] dark:text-zinc-200 text-base">
                      {sellerName}
                    </h4>
                    <p className="text-xs text-[#74767e] dark:text-zinc-400 mt-0.5">
                      Full Stack MERN Developer & Systems Engineer
                    </p>
                    <div className="flex items-center gap-1 text-xs text-[#ffb33e] font-bold mt-1">
                      <Star size={12} className="fill-[#ffb33e] text-[#ffb33e]" />
                      <span>5.0 Exceptional Performance Profile</span>
                    </div>
                  </div>
                </div>
                <button onClick={handleContactMe} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-zinc-50 text-gray-700 font-semibold text-sm border border-gray-300 rounded-lg shadow-sm hover:shadow transition-all duration-200">
                  <MessageSquare size={13} /> Contact Me
                </button>
              </div>
            </div>

          </div>

          {/* ================= RIGHT SIDEBAR PRICE CHECKOUT BOX ================= */}
          <div className="lg:col-span-1 lg:sticky lg:top-24">
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-md overflow-hidden">
              
              {/* Tab Selector Headers */}
              <div className="grid grid-cols-2 text-center border-b border-slate-200 dark:border-zinc-800 font-bold text-xs uppercase tracking-wider bg-slate-50 dark:bg-zinc-900/50">
                <button 
                  onClick={() => setActiveTab('standard')}
                  className={`py-4 px-2 transition-all font-bold ${activeTab === 'standard' ? 'border-b-2 border-[#1dbf73] text-[#1dbf73] bg-white dark:bg-zinc-900' : 'text-[#74767e] hover:text-[#222325] dark:hover:text-zinc-200'}`}
                >
                  Standard Price
                </button>
                <button 
                  onClick={() => setActiveTab('custom')}
                  className={`py-4 px-2 transition-all font-bold ${activeTab === 'custom' ? 'border-b-2 border-[#1dbf73] text-[#1dbf73] bg-white dark:bg-zinc-900' : 'text-[#74767e] hover:text-[#222325] dark:hover:text-zinc-200'}`}
                >
                  Custom Offer
                </button>
              </div>

              {/* Package Interior Wrapper */}
              <div className="p-6 space-y-5">
                
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#222325] dark:text-zinc-400 uppercase tracking-wide">
                    {activeTab === 'standard' ? 'BASELINE FIXED TIER' : 'Negotiated Rate Proposal'}
                  </span>
                  <span className="text-xl font-extrabold text-[#222325] dark:text-zinc-100">
                    {activeTab === 'standard' ? `$${Number(service.price).toLocaleString()}` : 'Customized'}
                  </span>
                </div>

                <p className="text-xs text-[#62646a] dark:text-zinc-400 leading-relaxed font-normal">
                  {activeTab === 'standard' 
                    ? "Receive professional grade build deployments matching standard core architecture structures outlined in description scopes."
                    : "Propose personalized architectural project deliverables, specific technical scope items, or custom budgets directly to this seller."
                  }
                </p>

                {/* Delivery Metrics Context Line */}
                <div className="flex items-center gap-4 text-xs font-bold text-[#62646a] dark:text-zinc-400 border-b border-slate-100 dark:border-zinc-800/60 pb-4">
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} className="text-slate-400 dark:text-zinc-500" /> 
                    {activeTab === 'standard' ? `${service.deliveryTime || 10} Days` : `${customDays || '—'} Days`} Delivery
                  </span>
                  <span className="flex items-center gap-1.5">
                    <RefreshCw size={13} className="text-slate-400 dark:text-zinc-500" /> 
                    Unlimited Revisions
                  </span>
                </div>

                {/* Secure Verification Gateways */}
                {user?.role === 'customer' ? (
                  <form onSubmit={handlePlaceOrder} className="space-y-4 pt-1">
                    {activeTab === 'custom' && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-2 gap-3"
                      >
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Offer Budget ($)</label>
                          <input
                            type="number"
                            required
                            min="5"
                            value={customBudget}
                            onChange={(e) => setCustomBudget(e.target.value)}
                            className="w-full p-2 border border-slate-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-sm font-bold focus:outline-none focus:border-[#1dbf73] text-[#222325] dark:text-zinc-100"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Days Duration</label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={customDays}
                            onChange={(e) => setCustomDays(e.target.value)}
                            className="w-full p-2 border border-slate-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-sm font-bold focus:outline-none focus:border-[#1dbf73] text-[#222325] dark:text-zinc-100"
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Requirements Area */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Project Requirements</label>
                      <textarea
                        rows={activeTab === 'standard' ? 3 : 4}
                        required={activeTab === 'custom'}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder={activeTab === 'standard' ? "Add optional baseline delivery specifications or technical requirements..." : "Provide clear design criteria, specialized integration endpoints, or target deployment instructions..."}
                        className="w-full p-3 border border-slate-300 dark:border-zinc-700 rounded text-xs bg-white dark:bg-zinc-800 text-[#404145] dark:text-zinc-200 focus:outline-none focus:border-[#1dbf73] focus:ring-1 focus:ring-[#1dbf73] leading-relaxed transition-all"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 bg-[#1dbf73] hover:bg-[#19a463] text-white font-bold rounded text-sm tracking-wide transition-all duration-150 transform active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {submitting ? 'Processing Order...' : activeTab === 'standard' ? 'Continue Standard Checkout' : 'Submit Custom Offer'}
                    </button>
                  </form>
                ) : (
                  <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-md p-3.5 text-xs text-amber-800 dark:text-amber-400 leading-relaxed font-medium flex gap-2.5 items-start">
                    <ShieldAlert size={16} className="flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-500" />
                    <span>
                      Please sign in with a standard <strong>Customer Account</strong> to process order checkouts or request custom project details with this provider.
                    </span>
                  </div>
                )}

              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default ServiceDetails;