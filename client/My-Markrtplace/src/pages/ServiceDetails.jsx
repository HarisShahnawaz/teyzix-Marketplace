import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [service, setService] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/services`);
        const foundService = data.find(s => s._id === id);
        setService(foundService);
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

    // Parse your delivery string (e.g., "7 Days" -> 7) safely to build a deadline date
    const deliveryDaysInt = parseInt(service.deliveryTime) || 7;
    const deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() + deliveryDaysInt);

    // ✅ Synced with your exact backend Schema key 'createdBy'
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
        budget: service.price,
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-800">Service not found.</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 font-sans">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden md:flex">
        
        {/* Left Side: Details */}
        <div className="p-8 md:w-3/5 border-b md:border-b-0 md:border-r border-gray-100 space-y-4">
          <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-full uppercase tracking-wider">
            {service.category}
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
            {service.title}
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
            {service.description}
          </p>
          <div className="text-xs text-gray-400 pt-2">
            ⏱️ Delivery Expected: {service.deliveryTime}
          </div>
        </div>

        {/* Right Side: Form Submission */}
        <div className="p-8 md:w-2/5 bg-gray-50 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-gray-500 font-medium">Gig Budget</span>
              <span className="text-3xl font-black text-green-600">${service.price}</span>
            </div>

            {user?.role === 'customer' ? (
              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Project Instructions
                  </label>
                  <textarea
                    rows="4"
                    required
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="block w-full p-3 border border-gray-300 rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    placeholder="Describe your design guidelines or requirements..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm transition disabled:opacity-50 text-sm"
                >
                  {submitting ? 'Submitting Order...' : 'Hire This Provider'}
                </button>
              </form>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
                🔒 Only logged-in **Customers** can place order requests.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ServiceDetails;