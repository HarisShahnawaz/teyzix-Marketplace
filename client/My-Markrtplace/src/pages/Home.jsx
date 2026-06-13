import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-slate-50 dark:bg-slate-950 min-h-screen font-sans transition-all duration-300 ease-in-out"
    >
      
      {/* Dynamic Hero Section */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 transition-all duration-300 ease-in-out">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight transition-colors duration-300">
              Find the Perfect <span className="text-green-600 dark:text-green-400">Freelance</span> Services For Your Project
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-md transition-colors duration-300">
              Connect with top-tier service providers, manage milestones, and secure payments flawlessly on TeyzixMarket.
            </p>
            {!user && (
              <div className="flex items-center space-x-4 pt-2">
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all duration-300"
                  >
                    Get Started
                  </motion.button>
                </Link>
                <Link to="/login" className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 font-semibold px-4 py-2 transition-all duration-300">
                  Sign In
                </Link>
              </div>
            )}
          </div>
          <div className="flex justify-center">
            <img 
              src={heroImg} 
              alt="Marketplace Hero Illustration" 
              className="max-h-87.5 object-contain drop-shadow-md rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Services Grid Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-8 transition-colors duration-300">
          Explore Professional Services
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm transition-all duration-300 ease-in-out">
            <p className="text-slate-500 dark:text-slate-400 transition-colors duration-300">No professional services have been listed yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <motion.div
                key={service._id}
                whileHover={{ y: -6, scale: 1.015 }}
                className="bg-white dark:bg-slate-900 rounded-xl shadow-md hover:shadow-xl dark:shadow-none border border-gray-100 dark:border-slate-800 flex flex-col justify-between overflow-hidden transition-all duration-300 ease-in-out"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-0 transition-colors duration-300">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3 leading-relaxed transition-colors duration-300">
                    {service.description}
                  </p>
                </div>

                <div className="px-6 pb-6 pt-2 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 flex flex-col space-y-4 transition-all duration-300 ease-in-out">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full capitalize transition-colors duration-300">
                      {service.category}
                    </span>
                    
                    {/* 🌟 New Dynamic Average Rating Display */}
                    <div className="flex items-center text-xs font-medium text-slate-500 dark:text-slate-400">
                      {service.averageRating && service.averageRating > 0 ? (
                        <span className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
                          ⭐ {Number(service.averageRating).toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 italic text-xs">No reviews</span>
                      )}
                    </div>

                    <span className="text-xl font-bold text-green-600 dark:text-green-400 transition-colors duration-300">
                      ${service.price}
                    </span>
                  </div>
                  
                  {/* Action Link Button */}
                  <Link to={user ? `/services/${service._id}` : '/login'}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      className="w-full text-center py-2 px-4 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-300 shadow-sm"
                    >
                      {user ? 'View Details & Order' : 'Sign in to Hire'}
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </motion.div>
  );
};

export default Home;