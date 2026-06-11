import { useState, useEffect } from 'react';
import axios from 'axios';

const ProviderDashboard = () => {
  const [services, setServices] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [price, setPrice] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');

  const fetchMyServices = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/services');
      setServices(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMyServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/services', {
        title,
        description,
        category,
        price: Number(price),
        deliveryTime: Number(deliveryTime)
      });
      setTitle('');
      setDescription('');
      setPrice('');
      setDeliveryTime('');
      fetchMyServices();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create service');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md border border-gray-100 h-fit">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Service</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Service Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-md" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-md h-24" required></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-md">
              <option value="Web Development">Web Development</option>
              <option value="Graphic Design">Graphic Design</option>
              <option value="Digital Marketing">Digital Marketing</option>
              <option value="Content Writing">Content Writing</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price ($)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-md" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Delivery (Days)</label>
              <input type="number" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-md" required />
            </div>
          </div>
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-md transition shadow-sm">
            Publish Service
          </button>
        </form>
      </div>

      <div className="lg:col-span-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Active Service Listings</h2>
        <div className="space-y-4">
          {services.map((service) => (
            <div key={service._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                <p className="text-gray-600 mt-1">{service.description}</p>
                <div className="flex space-x-4 mt-3 text-sm text-gray-500">
                  <span>Category: <strong>{service.category}</strong></span>
                  <span>Delivery: <strong>{service.deliveryTime} Days</strong></span>
                </div>
              </div>
              <span className="text-xl font-extrabold text-green-600">${service.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;