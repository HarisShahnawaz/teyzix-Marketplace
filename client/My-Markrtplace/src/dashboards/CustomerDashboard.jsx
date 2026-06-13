import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const CustomerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchCustomerRequests = async () => {
      try {
        // Fetches only the orders belonging to this specific logged-in customer
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-sm mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}!</h1>
        <p className="text-blue-100 mt-1 text-sm">
          Track your active project orders, manage hires, and collaborate with service providers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Order History list */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Your Sent Order Requests</h2>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : requests.length === 0 ? (
            <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm text-center">
              <p className="text-gray-500 text-sm">You haven't placed any service orders yet.</p>
              <p className="text-xs text-gray-400 mt-1">Head over to the home page to explore professional services!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <div key={req._id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex justify-between items-start hover:shadow-md transition">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                      {req.service?.title || 'Custom Freelance Project'}
                    </h3>
                    <p className="text-gray-600 text-sm max-w-md">
                      <strong className="text-gray-700">Project Requirements:</strong> {req.requirements || 'No specific notes added.'}
                    </p>
                    <p className="text-xs text-gray-400 font-mono">Order ID: {req._id}</p>
                  </div>
                  
                  <div className="text-right space-y-3">
                    {/* 🚀 FIXED: Dynamic Status matching with exact Sentence Case enum entries */}
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full tracking-wider ${
                      req.status === 'Completed' || req.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      req.status === 'Accepted' || req.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      req.status === 'Rejected' || req.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800' // Matches 'Pending' perfectly
                    }`}>
                      {req.status || 'Pending'}
                    </span>
                    {/* 🚀 FIXED: Set to req.budget to align perfectly with your Mongoose schema */}
                    <div className="text-lg font-black text-gray-900">${req.budget || req.service?.price || '0'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Marketplace Guidelines Widget */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">Marketplace Tools</h3>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-xs text-gray-600 leading-relaxed">
                 Need a custom integration? Tap into your **AI Assistant** in the bottom right corner to generate technical project guidelines instantly!
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-xs text-gray-600 leading-relaxed">
                 All payments are safely processed and protected through secure tokens until milestone delivery confirmations.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CustomerDashboard;