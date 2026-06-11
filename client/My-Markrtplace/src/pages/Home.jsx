import { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/services');
        setServices(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Explore Professional Services [cite: 10]</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{service.title} [cite: 43]</h2>
            <p className="text-gray-600 mb-4 line-clamp-2">{service.description} [cite: 44]</p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded">
                {service.category} [cite: 45]
              </span>
              <span className="text-lg font-bold text-green-600">${service.price} [cite: 46]</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;