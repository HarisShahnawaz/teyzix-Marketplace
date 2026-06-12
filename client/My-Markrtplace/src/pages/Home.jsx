import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import heroImg from '../assets/hero.png'; // Import your hero graphic

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
    <div className="bg-gray-50 min-h-screen font-sans">
      
      {/* 🚀 Dynamic Hero Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Find the Perfect <span className="text-green-600">Freelance</span> Services For Your Project
            </h1>
            <p className="text-gray-600 text-lg max-w-md">
              Connect with top-tier service providers, manage milestones, and secure payments flawlessly on TeyzixMarket.
            </p>
            {!user && (
              <div className="flex items-center space-x-4 pt-2">
                <Link to="/register" className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow-sm transition">
                  Get Started
                </Link>
                <Link to="/login" className="text-gray-700 hover:text-gray-900 font-semibold px-4 py-2 transition">
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

      {/* 📋 Services Grid Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">
          Explore Professional Services
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
            <p className="text-gray-500">No professional services have been listed yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service._id} className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between overflow-hidden hover:shadow-md transition duration-200">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="px-6 pb-6 pt-2 bg-gray-50 border-t border-gray-50 flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-full capitalize">
                      {service.category}
                    </span>
                    <span className="text-xl font-bold text-green-600">
                      ${service.price}
                    </span>
                  </div>
                  
                  {/* Action Link Button */}
                  <Link 
                    to={user ? `/services/${service._id}` : '/login'}
                    className="w-full text-center py-2 px-4 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition shadow-sm"
                  >
                    {user ? 'View Details & Order' : 'Sign in to Hire'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Home;