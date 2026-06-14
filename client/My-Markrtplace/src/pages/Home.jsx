import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Star, ArrowRight, Tag } from 'lucide-react';
import heroImg from '../assets/hero.png';

const Home = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/services');
        setServices(data);
      } catch (error) {
        console.error("Error fetching marketplace services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // 🎨 Smart category fallback images to avoid showing the same laptop for everything
  const getCategoryFallback = (category) => {
    const cat = category?.toLowerCase() || '';
    if (cat.includes('design') || cat.includes('graphic')) {
      return "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=600&auto=format&fit=crop"; // Creative Abstract
    }
    if (cat.includes('marketing') || cat.includes('digital')) {
      return "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop"; // Analytics / Growth
    }
    // Default Web Dev fallback
    return "https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=600&auto=format&fit=crop";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-slate-50/50 dark:bg-zinc-950 min-h-screen font-sans transition-all duration-300"
    >
      
      {/* 🚀 Dynamic Hero Section */}
      <div className="bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight leading-tight">
              Find the Perfect <span className="text-[#1dbf73] dark:text-emerald-400">Freelance</span> Services For Your Project
            </h1>
            <p className="text-slate-600 dark:text-zinc-400 text-base max-w-md leading-relaxed font-normal">
              Connect with top-tier service providers, manage milestones, and secure payments flawlessly on TeyzixMarket.
            </p>
            {!user && (
              <div className="flex items-center space-x-4 pt-2">
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-[#1dbf73] hover:bg-[#19a463] text-white font-bold px-6 py-3 rounded-lg shadow-sm transition-all"
                  >
                    Get Started
                  </motion.button>
                </Link>
                <Link to="/login" className="text-slate-700 dark:text-zinc-300 hover:text-[#1dbf73] font-bold px-4 py-2 transition-all">
                  Sign In
                </Link>
              </div>
            )}
          </div>
          <div className="flex justify-center">
            <img 
              src={heroImg} 
              alt="Marketplace Hero Illustration" 
              className="max-h-80 object-contain drop-shadow-md rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* 🟩 Marketplace Services Grid Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-zinc-100 tracking-tight">
            Explore Professional Services
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Handpicked full-stack development setups and creative solutions engineered for your projects.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1dbf73]"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 shadow-xs">
            <p className="text-sm text-slate-500 dark:text-zinc-400">No professional services have been listed yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {services.map((service) => {
              
              // Dynamic banner with distinct smart fallbacks
              const cardBanner = 
                (service.image && service.image.startsWith('http') ? service.image : (service.image ? `http://localhost:5000${service.image}` : null)) || 
                service.coverImage ||
                service.banner || 
                (service.images && service.images.length > 0 ? service.images[0] : null) || 
                getCategoryFallback(service.category);

              const sellerName = service.createdBy?.name || "Seller";
              const initials = sellerName.substring(0, 2).toUpperCase();

              return (
                <motion.div
                  key={service._id}
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-zinc-900 rounded-xl shadow-xs hover:shadow-md border border-slate-200/60 dark:border-zinc-800 flex flex-col justify-between overflow-hidden transition-all duration-200 group h-full"
                >
                  <div>
                    {/* 📸 Clean Thumbnail Image Box (No tags on top!) */}
                    <Link to={user ? `/services/${service._id}` : '/login'} className="block relative aspect-video w-full overflow-hidden bg-slate-50 dark:bg-zinc-800">
                      <img 
                        src={cardBanner} 
                        alt={service.title} 
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        onError={(e) => { e.target.src = getCategoryFallback(service.category); }}
                      />
                    </Link>

                    {/* Card Internal Details Body */}
                    <div className="p-4 space-y-2.5">
                      
                      {/* 👤 Seller Row */}
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#1dbf73] to-emerald-600 text-white flex-shrink-0 flex items-center justify-center text-[10px] font-bold uppercase tracking-tight">
                          {initials}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200 truncate max-w-[140px]">
                            {sellerName}
                          </span>
                          <span className="text-[9px] text-[#1dbf73] font-medium -mt-0.5">Verified Provider</span>
                        </div>
                      </div>

                      {/* 📝 Title & Description */}
                      <div className="space-y-1">
                        <Link to={user ? `/services/${service._id}` : '/login'} className="block">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 hover:text-[#1dbf73] transition-colors line-clamp-1 capitalize tracking-tight">
                            {service.title}
                          </h3>
                        </Link>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2 min-h-[32px] leading-relaxed">
                          {service.description || "No specific details provided for this listing."}
                        </p>
                      </div>

                      {/* 🏷️ Smart Bottom Metadata (Cleanly structured underneath descriptions) */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-50 dark:border-zinc-800/50">
                        {/* Organic Reviews */}
                        <div className="flex items-center gap-1 text-xs font-bold min-h-[16px]">
                          {service.averageRating && service.averageRating > 0 ? (
                            <>
                              <Star size={12} className="fill-[#ffb33e] text-[#ffb33e]" />
                              <span className="text-slate-700 dark:text-zinc-300 text-xs">{Number(service.averageRating).toFixed(1)}</span>
                              <span className="text-slate-400 dark:text-zinc-500 font-normal text-[10px]">({service.reviewCount || 0})</span>
                            </>
                          ) : (
                            <span className="text-slate-400 dark:text-zinc-500 font-normal text-[11px] italic">No reviews</span>
                          )}
                        </div>

                        {/* Beautiful inline category badge instead of a giant tag on picture */}
                        {service.category && (
                          <span className="flex items-center gap-1 text-[10px] font-medium text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md capitalize max-w-[120px] truncate">
                            <Tag size={10} className="text-slate-400 dark:text-zinc-500" />
                            {service.category}
                          </span>
                        )}
                      </div>

                    </div>
                  </div>

                  {/* 💳 Price Footer Row */}
                  <div className="px-4 py-2.5 bg-slate-50/50 dark:bg-zinc-900/50 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                    <Link 
                      to={user ? `/services/${service._id}` : '/login'}
                      className="text-[10px] font-bold text-slate-400 hover:text-[#1dbf73] dark:hover:text-[#1dbf73] uppercase tracking-wider transition-colors flex items-center gap-1"
                    >
                      Details <ArrowRight size={10} />
                    </Link>
                    <div className="text-right">
                      <span className="block text-[9px] text-slate-400 dark:text-zinc-500 font-medium uppercase tracking-wider -mb-0.5">Starting At</span>
                      <span className="text-sm font-extrabold text-slate-900 dark:text-zinc-100">
                        ${Number(service.price || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        )}
      </div>

    </motion.div>
  );
};

export default Home;