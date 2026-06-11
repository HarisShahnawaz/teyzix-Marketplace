import { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerDashboard = () => {
  const [requests, setRequests] = useState([]);

  const fetchMyRequests = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/requests');
      setRequests(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/requests/${id}/status`, { status: newStatus });
      fetchMyRequests();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Buyer Order Tracking</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
          <thead className="bg-gray-50 text-gray-700 uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Service</th>
              <th className="px-6 py-4">Provider</th>
              <th className="px-6 py-4">Budget</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-gray-600">
            {requests.map((req) => (
              <tr key={req._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-900">{req.service?.title}</td>
                <td className="px-6 py-4">{req.provider?.name}</td>
                <td className="px-6 py-4 text-green-600 font-bold">${req.budget}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    req.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {req.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {req.status === 'Pending' && (
                    <button onClick={() => handleStatusUpdate(req._id, 'In Progress')} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded transition">
                      Accept & Start
                    </button>
                  )}
                  {req.status === 'In Progress' && (
                    <button onClick={() => handleStatusUpdate(req._id, 'Delivered')} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded transition">
                      Mark as Delivered
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-gray-400">
                  No active service requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerDashboard;