import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const ProviderDashboard = () => {
  const { user } = useContext(AuthContext);
  const [myServices, setMyServices] = useState([]);
  const [incomingOrders, setIncomingOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Form states for creating a service (Keep your existing state variables here)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [price, setPrice] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');

  // Fetch provider listings and incoming order requests
  const fetchData = async () => {
    try {
      // 1. Fetch this provider's active services
      const servicesRes = await axios.get('http://localhost:5000/api/services');
      // Filter services created by this provider (matching user._id)
      const filteredServices = servicesRes.data.filter(
        (s) => (s.createdBy?._id || s.createdBy) === user?._id
      );
      setMyServices(filteredServices);

      // 2. Fetch incoming client order requests from your backend controller
      const ordersRes = await axios.get('http://localhost:5000/api/requests/my-requests');
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

  // Handle Form Submission for a new service
  const handleCreateService = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/services', {
        title,
        description,
        category,
        price: Number(price),
        deliveryTime: `${deliveryTime} Days`
      });
      alert('🚀 Service published successfully!');
      // Reset form fields
      setTitle('');
      setDescription('');
      setPrice('');
      setDeliveryTime('');
      fetchData(); // Refresh list
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create service');
    }
  };

  // ✅ Handle Status Updates (Accept, Reject, Complete) using your backend controller
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/requests/${orderId}`, {
        status: newStatus
      });
      alert(`💼 Order status marked as ${newStatus}!`);
      fetchData(); // Refresh lists to show new status instantly
    } catch (error) {
      console.error("Error updating status:", error);
      alert(error.response?.data?.message || 'Failed to update order status.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-green-600 to-teal-700 rounded-2xl p-8 text-white shadow-sm mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Seller Workspace</h1>
        <p className="text-green-100 mt-1 text-sm">Welcome back, {user?.name}. Manage your listings and fulfill client requests.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Create Service Form */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Service</h2>
          <form onSubmit={handleCreateService} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">Service Title</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder="e.g. Full Stack Web Application"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">Description</label>
              <textarea rows="3" required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder="Describe your freelance service details..."></textarea>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none">
                <option value="Web Development">Web Development</option>
                <option value="Graphic Design">Graphic Design</option>
                <option value="Digital Marketing">Digital Marketing</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">Price ($)</label>
                <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder="50"/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">Delivery (Days)</label>
                <input type="number" required value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder="7"/>
              </div>
            </div>
            <button type="submit" className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl text-sm transition shadow-sm">
              Publish Service
            </button>
          </form>
        </div>

        {/* Right Columns: Active Services & Incoming Orders */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Section: Incoming Project Orders */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-4">Incoming Client Orders</h2>
            {loadingOrders ? (
              <div className="animate-pulse space-y-3">
                <div className="h-20 bg-gray-100 rounded-xl"></div>
              </div>
            ) : incomingOrders.length === 0 ? (
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center text-sm text-gray-400">
                No clients have ordered your services yet. Active listings will show orders here!
              </div>
            ) : (
              <div className="space-y-4">
                {incomingOrders.map((order) => (
                  <div key={order._id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-gray-900">{order.service?.title || 'Freelance Gig'}</span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {order.status || 'pending'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600"><strong className="text-gray-700">Client:</strong> {order.customer?.name} ({order.customer?.email})</p>
                      <p className="text-xs text-gray-600"><strong className="text-gray-700">Requirements:</strong> "{order.requirements}"</p>
                    </div>

                    <div className="flex items-center space-x-4 justify-between md:justify-end border-t md:border-0 pt-3 md:pt-0">
                      <span className="text-lg font-black text-green-600">${order.budget || order.service?.price}</span>
                      
                      {/* Action state management control buttons */}
                      <div className="flex space-x-2">
                        {order.status === 'pending' && (
                          <>
                            <button onClick={() => handleUpdateStatus(order._id, 'accepted')} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition">
                              Accept
                            </button>
                            <button onClick={() => handleUpdateStatus(order._id, 'rejected')} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-semibold transition">
                              Reject
                            </button>
                          </>
                        )}
                        {order.status === 'accepted' && (
                          <button onClick={() => handleUpdateStatus(order._id, 'completed')} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold transition">
                            Mark Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Active Service Listings */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-4">Your Active Service Listings</h2>
            {myServices.length === 0 ? (
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center text-sm text-gray-400">
                You haven't listed any services yet. Use the sidebar form to post your first gig!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myServices.map((service) => (
                  <div key={service._id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{service.title}</h3>
                      <p className="text-gray-500 text-xs mt-1 line-clamp-2">{service.description}</p>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-50">
                      <span className="text-[11px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {service.category}
                      </span>
                      <span className="font-bold text-green-600">${service.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;