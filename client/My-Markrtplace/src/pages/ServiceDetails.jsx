import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

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

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/services`);
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

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const deliveryDaysInt = parseInt(customDays) || 7;
    const deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() + deliveryDaysInt);

    const providerId = service.createdBy?._id || service.createdBy;

    if (!providerId) {
      alert("Error: Could not locate the Service Provider ID (createdBy) for this listing.");
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        provider: providerId,
        service: service._id,
        requirements: notes,
        budget: Number(customBudget),
        deadline: deadlineDate.toISOString()
      };

      await axios.post('http://localhost:5000/api/requests', payload);

      alert('🎉 Order request submitted successfully!');
      navigate('/customer-dashboard');
    } catch (error) {
      console.log("Full Backend Error Data:", error.response?.data);
      alert(error.response?.data?.error || error.response?.data?.message || 'Failed to submit order request.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-all duration-300 ease-in-out">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300">Service not found.</h2>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-7xl mx-auto px-4 py-12 font-sans"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Service Baseline Details - lg:col-span-7 */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-gray-100 dark:border-slate-800 overflow-hidden transition-all duration-300 ease-in-out"
        >
          <div className="p-8 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full uppercase tracking-wider transition-colors duration-300">
                {service.category}
              </span>

              {/* 🌟 New Dynamic Rating Badge for Detailed Listing Panel */}
              <div className="flex items-center text-xs font-medium">
                {service.averageRating && service.averageRating > 0 ? (
                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-md transition-colors duration-300">
                    ⭐ {Number(service.averageRating).toFixed(1)} Provider Score
                  </span>
                ) : (
                  <span className="text-slate-400 dark:text-slate-500 italic bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1 rounded-md transition-colors duration-300">
                    No evaluations yet
                  </span>
                )}
              </div>
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight transition-colors duration-300">
              {service.title}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-line transition-colors duration-300">
              {service.description}
            </p>
            
            <div className="pt-4 border-t border-gray-100 dark:border-slate-800 grid grid-cols-2 gap-4 transition-colors duration-300">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl transition-colors duration-300">
                <span className="block text-xs text-slate-400 dark:text-slate-500 font-medium transition-colors duration-300">Standard Rate</span>
                <span className="text-xl font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300">${service.price}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl transition-colors duration-300">
                <span className="block text-xs text-slate-400 dark:text-slate-500 font-medium transition-colors duration-300">Standard Delivery</span>
                <span className="text-xl font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300">{service.deliveryTime}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Negotiable Order Checkout Form - lg:col-span-5 */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="lg:col-span-5 bg-slate-50 dark:bg-slate-900 rounded-2xl shadow-md border border-gray-100 dark:border-slate-800 overflow-hidden transition-all duration-300 ease-in-out"
        >
          <div className="p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight transition-colors duration-300">Customize Your Order Offer</h2>
              
              {user?.role === 'customer' ? (
                <form onSubmit={handlePlaceOrder} className="space-y-4">
                  
                  {/* Custom Budget & Timeline Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 transition-colors duration-300">
                        Your Offer Budget ($)
                      </label>
                      <input
                        type="number"
                        required
                        min="5"
                        value={customBudget}
                        onChange={(e) => setCustomBudget(e.target.value)}
                        className="block w-full p-3.5 border border-gray-300 dark:border-slate-600 rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 transition-colors duration-300">
                        Delivery Days
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={customDays}
                        onChange={(e) => setCustomDays(e.target.value)}
                        className="block w-full p-3.5 border border-gray-300 dark:border-slate-600 rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Requirements Instructions */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 transition-colors duration-300">
                      Project Instructions
                    </label>
                    <textarea
                      rows="4"
                      required
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="block w-full p-3.5 border border-gray-300 dark:border-slate-600 rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 transition-all duration-300"
                      placeholder="Describe your design guidelines, tech specifications, or unique instructions..."
                    ></textarea>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-4 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500 text-white font-bold rounded-xl shadow-md transition-all duration-300 disabled:opacity-50 text-sm tracking-wide mt-2"
                  >
                    {submitting ? 'Submitting Order Proposal...' : 'Send Custom Project Order'}
                  </motion.button>
                </form>
              ) : (
                <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-xs text-amber-800 dark:text-amber-400 leading-relaxed transition-all duration-300">
                  🔒 Only logged-in **Customers** can configure and transmit order proposals to providers.
                </div>
              )}
            </div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default ServiceDetails;