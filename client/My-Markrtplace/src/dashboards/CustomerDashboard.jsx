import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const CustomerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [reviewForm, setReviewForm] = useState({ visible: false, requestId: null, serviceId: null, providerId: null, rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchCustomerRequests = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/requests/my-requests');
        setRequests(data);
      } catch (error) {
        console.error("Error fetching order requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerRequests();
  }, []);

  const handleLeaveReview = (request) => {
    setReviewForm({
      visible: true,
      requestId: request._id,
      serviceId: request.service?._id,
      providerId: request.service?.createdBy,
      rating: 5,
      comment: ''
    });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await axios.post('http://localhost:5000/api/reviews', {
        serviceId: reviewForm.serviceId,
        providerId: reviewForm.providerId,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        requestId: reviewForm.requestId
      });
      alert('Review submitted successfully!');
      setReviewForm({ visible: false, requestId: null, serviceId: null, providerId: null, rating: 5, comment: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans"
    >
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800 rounded-2xl p-8 text-white shadow-md mb-10 transition-all duration-300 ease-in-out">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}!</h1>
        <p className="text-blue-100 dark:text-blue-200 mt-1 text-sm transition-colors duration-300">
          Track your active project orders, manage hires, and collaborate with service providers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column: Order History list - lg:col-span-3 */}
        <div className="lg:col-span-3 space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight transition-colors duration-300">Your Sent Order Requests</h2>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : requests.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-gray-100 dark:border-slate-800 shadow-sm text-center transition-all duration-300 ease-in-out">
              <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors duration-300">You haven't placed any service orders yet.</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 transition-colors duration-300">Head over to the home page to explore professional services!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <motion.div
                  key={req._id}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-100 dark:border-slate-800 shadow-md hover:shadow-xl dark:shadow-none flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 transition-all duration-300 ease-in-out"
                >
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight transition-colors duration-300">
                      {req.service?.title || 'Custom Freelance Project'}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md transition-colors duration-300">
                      <strong className="text-slate-700 dark:text-slate-300">Project Requirements:</strong> {req.requirements || 'No specific notes added.'}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-mono transition-colors duration-300">Order ID: {req._id}</p>
                  </div>
                  
                  <div className="text-right space-y-3">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full tracking-wider transition-colors duration-300 ${
                      req.status === 'Completed' || req.status === 'Delivered' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                      req.status === 'Accepted' || req.status === 'In Progress' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400' :
                      req.status === 'Rejected' || req.status === 'Cancelled' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' :
                      'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400'
                    }`}>
                      {req.status || 'Pending'}
                    </span>
                    <div className="text-lg font-black text-slate-900 dark:text-slate-100 transition-colors duration-300">${req.budget || req.service?.price || '0'}</div>
                    
                    {(req.status === 'Completed' || req.status === 'Delivered') && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleLeaveReview(req)}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-500 text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 shadow-sm flex items-center justify-center gap-2"
                      >
                        <Star size={16} fill="currentColor" />
                        Leave a Review
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Marketplace Guidelines Widget - lg:col-span-1 */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-100 dark:border-slate-800 shadow-md transition-all duration-300 ease-in-out">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 tracking-tight transition-colors duration-300">Marketplace Tools</h3>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-gray-100 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 leading-relaxed transition-all duration-300">
                 Need a custom integration? Tap into your **AI Assistant** in the bottom right corner to generate technical project guidelines instantly!
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-gray-100 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 leading-relaxed transition-all duration-300">
                 All payments are safely processed and protected through secure tokens until milestone delivery confirmations.
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Review Form Modal */}
      {reviewForm.visible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full shadow-xl border border-gray-100 dark:border-slate-800 transition-all duration-300 ease-in-out"
          >
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 tracking-tight transition-colors duration-300">Leave a Review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors duration-300">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="p-2 rounded-lg transition-all duration-300"
                    >
                      <Star 
                        size={24} 
                        className={star <= reviewForm.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 dark:text-slate-600'}
                        fill={star <= reviewForm.rating ? 'currentColor' : 'none'}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors duration-300">Comment</label>
                <textarea
                  required
                  rows="4"
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 transition-all duration-300"
                  placeholder="Share your experience with this service..."
                ></textarea>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  type="submit"
                  disabled={submittingReview}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-500 text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 shadow-sm disabled:opacity-50"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={() => setReviewForm({ visible: false, requestId: null, serviceId: null, providerId: null, rating: 5, comment: '' })}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium px-4 py-2 rounded-lg transition-all duration-300"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default CustomerDashboard;