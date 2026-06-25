import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { API_URL } from '../config/api';

const ProviderDashboard = () => {
  const { user } = useContext(AuthContext);
  const [myServices, setMyServices] = useState([]);
  const [incomingOrders, setIncomingOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [price, setPrice] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const getCategoryFallback = (category) => {
    const cat = category?.toLowerCase() || '';
    if (cat.includes('design') || cat.includes('graphic')) {
      return "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=600&auto=format&fit=crop";
    }
    if (cat.includes('marketing') || cat.includes('digital')) {
      return "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop";
    }
    return "https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=600&auto=format&fit=crop";
  };

  const fetchData = async () => {
    try {
      const servicesRes = await axios.get(`${API_URL}/api/services`);
      const filteredServices = servicesRes.data.filter(
        (s) => (s.createdBy?._id || s.createdBy) === user?._id
      );
      setMyServices(filteredServices);

      const ordersRes = await axios.get(`${API_URL}/api/requests/my-requests`);
      setIncomingOrders(ordersRes.data);
    } catch (error) {
      console.error("Error fetching provider dashboard data:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('price', Number(price));
      formData.append('deliveryTime', `${deliveryTime} Days`);
      if (image) {
        formData.append('image', image);
      }

      await axios.post(`${API_URL}/api/services`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('🚀 Service published successfully!');
      setTitle('');
      setDescription('');
      setPrice('');
      setDeliveryTime('');
      setImage(null);
      setImagePreview('');
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create service');
    }
  };

 const handleUpdateStatus = async (orderId, newStatus) => {
    let formattedStatus = newStatus;
    if (newStatus === 'accepted') formattedStatus = 'Accepted';
    if (newStatus === 'rejected') formattedStatus = 'Rejected'; 
    if (newStatus === 'completed') formattedStatus = 'Completed';

    try {
      await axios.put(`${API_URL}/api/requests/${orderId}`, {
        status: formattedStatus
      });
      
      alert(`💼 Order status marked as ${formattedStatus}!`);
      fetchData();
    } catch (error) {
      console.log("=== BACKEND STATUS UPDATE ERROR ===");
      console.log(error.response?.data);
      console.log("===================================");
      alert(error.response?.data?.error || error.response?.data?.message || 'Failed to update order status.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans"
    >
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-green-600 to-teal-700 dark:from-green-700 dark:to-teal-800 rounded-2xl p-8 text-white shadow-md mb-10 transition-all duration-300 ease-in-out">
        <h1 className="text-3xl font-bold tracking-tight">Seller Workspace</h1>
        <p className="text-green-100 dark:text-green-200 mt-1 text-sm transition-colors duration-300">Welcome back, {user?.name}. Manage your listings and fulfill client requests.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column: Incoming Orders & Active Services - lg:col-span-3 */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Section: Incoming Client Orders */}
          <h2 className="text-2xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight transition-colors duration-300">Incoming Client Orders</h2>
          
          {loadingOrders ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
            </div>
          ) : incomingOrders.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-8 border border-gray-100 dark:border-zinc-800 shadow-sm text-center transition-all duration-300 ease-in-out">
              <p className="text-slate-500 dark:text-zinc-400 text-sm transition-colors duration-300">No clients have ordered your services yet.</p>
              <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1 transition-colors duration-300">Active listings will show orders here!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {incomingOrders.map((order) => (
                <motion.div
                  key={order._id}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-md hover:shadow-xl dark:shadow-none flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 transition-all duration-300 ease-in-out"
                >
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 tracking-tight transition-colors duration-300">
                      {order.service?.title || 'Freelance Gig'}
                    </h3>
                    <p className="text-slate-600 dark:text-zinc-400 text-sm max-w-md transition-colors duration-300">
                      <strong className="text-slate-700 dark:text-zinc-300">Client:</strong> {order.customer?.name} ({order.customer?.email})
                    </p>
                    <p className="text-slate-600 dark:text-zinc-400 text-sm max-w-md transition-colors duration-300">
                      <strong className="text-slate-700 dark:text-zinc-300">Requirements:</strong> {order.requirements || 'No specific notes added.'}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-zinc-500 font-mono transition-colors duration-300">Order ID: {order._id}</p>
                  </div>
                  
                  <div className="text-right space-y-3">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full tracking-wider transition-colors duration-300 ${
                      order.status === 'Completed' || order.status === 'Delivered' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                      order.status === 'Accepted' || order.status === 'In Progress' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400' :
                      order.status === 'Rejected' || order.status === 'Cancelled' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' :
                      'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400'
                    }`}>
                      {order.status || 'Pending'}
                    </span>
                    <div className="text-lg font-black text-slate-900 dark:text-zinc-100 transition-colors duration-300">${order.budget || order.service?.price || '0'}</div>
                    
                    <div className="flex gap-2 justify-end">
                      {(order.status === 'Pending' || !order.status) && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => handleUpdateStatus(order._id, 'accepted')} 
                            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 shadow-sm text-xs"
                          >
                            Accept
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => handleUpdateStatus(order._id, 'rejected')}
                            className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium px-4 py-2 rounded-lg transition-all duration-300 text-xs"
                          >
                            Reject
                          </motion.button>
                        </>
                      )}
                      {order.status === 'Accepted' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => handleUpdateStatus(order._id, 'completed')} 
                          className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500 text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 shadow-sm text-xs"
                        >
                          Mark Complete
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Section: Active Service Listings */}
          <h2 className="text-2xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight transition-colors duration-300 mt-10">Your Active Service Listings</h2>
          
          {myServices.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-8 border border-gray-100 dark:border-zinc-800 shadow-sm text-center transition-all duration-300 ease-in-out">
              <p className="text-slate-500 dark:text-zinc-400 text-sm transition-colors duration-300">You haven't listed any services yet.</p>
              <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1 transition-colors duration-300">Use the sidebar form to post your first gig!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myServices.map((service) => {
                const cardBanner = service.image 
                  ? (service.image.startsWith('http') ? service.image : `${API_URL}${service.image}`) 
                  : getCategoryFallback(service.category);
                  
                return (
                  <motion.div
                    key={service._id}
                    whileHover={{ y: -4 }}
                    className="bg-white dark:bg-zinc-900 rounded-xl shadow-xs hover:shadow-md border border-slate-200/60 dark:border-zinc-800 flex flex-col justify-between overflow-hidden transition-all duration-200 group h-full"
                  >
                    <div>
                      <div className="block relative aspect-video w-full overflow-hidden bg-slate-50 dark:bg-zinc-800">
                        <img 
                          src={cardBanner} 
                          alt={service.title} 
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                          onError={(e) => { e.target.src = getCategoryFallback(service.category); }}
                        />
                      </div>
                      
                      <div className="p-4 space-y-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#1dbf73] to-emerald-600 text-white flex-shrink-0 flex items-center justify-center text-[10px] font-bold uppercase tracking-tight">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200 truncate max-w-[140px]">
                              {user?.name || 'Provider'}
                            </span>
                            <span className="text-[9px] text-[#1dbf73] font-medium -mt-0.5">Verified Provider</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 hover:text-[#1dbf73] transition-colors line-clamp-1 capitalize tracking-tight">
                            {service.title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2 min-h-[32px] leading-relaxed">
                            {service.description || "No specific details provided for this listing."}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-50 dark:border-zinc-800/50">
                          <button className="text-xs font-semibold text-[#1dbf73] hover:text-emerald-600 transition-colors duration-300">
                            Edit Listing
                          </button>
                          <span className="text-[10px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                            STARTING AT <span className="text-base font-black text-slate-900 dark:text-zinc-100 ml-0.5">${service.price}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Create Service Form - lg:col-span-1 */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-md transition-all duration-300 ease-in-out"
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 mb-4 tracking-tight transition-colors duration-300">Create New Service</h3>
            <form onSubmit={handleCreateService} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase mb-2 transition-colors duration-300">Banner Image</label>
                <div className="space-y-2">
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full p-3 border border-gray-200 dark:border-zinc-600 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 transition-all duration-300 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                  </div>
                  {imagePreview && (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-600">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImage(null);
                          setImagePreview('');
                        }}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 text-xs transition-colors duration-300"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase mb-2 transition-colors duration-300">Service Title</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-zinc-600 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 transition-all duration-300" placeholder="e.g. Full Stack Web Application"/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase mb-2 transition-colors duration-300">Description</label>
                <textarea rows="3" required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-zinc-600 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 transition-all duration-300" placeholder="Describe your freelance service details..."></textarea>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase mb-2 transition-colors duration-300">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-zinc-600 rounded-xl text-sm bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-green-500 outline-none text-slate-900 dark:text-zinc-100 transition-all duration-300">
                  <option value="Web Development">Web Development</option>
                  <option value="Graphic Design">Graphic Design</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase mb-2 transition-colors duration-300">Price ($)</label>
                  <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-zinc-600 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 transition-all duration-300" placeholder="50"/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase mb-2 transition-colors duration-300">Delivery (Days)</label>
                  <input type="number" required value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-zinc-600 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 transition-all duration-300" placeholder="7"/>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                type="submit" 
                className="w-full py-3 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500 text-white font-semibold rounded-xl text-sm transition-all duration-300 shadow-md"
              >
                Publish Service
              </motion.button>
            </form>
          </motion.div>

          {/* Seller Tools Widget */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-100 dark:border-slate-800 shadow-md transition-all duration-300 ease-in-out">
            <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 mb-4 tracking-tight transition-colors duration-300">Seller Tools</h3>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 dark:bg-zinc-800/50 rounded-lg border border-gray-100 dark:border-zinc-700 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed transition-all duration-300">
                 Keep your response time under 24 hours to maintain a high seller rating and attract more clients.
              </div>
              <div className="p-3 bg-slate-50 dark:bg-zinc-800/50 rounded-lg border border-gray-100 dark:border-zinc-700 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed transition-all duration-300">
                 Complete orders on time to build trust and earn positive reviews from customers.
              </div>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default ProviderDashboard;