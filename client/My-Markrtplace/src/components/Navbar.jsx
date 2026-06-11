import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-green-600 tracking-wide">
              TeyzixMarket
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-green-600 font-medium px-3 py-2 rounded-md transition">
              Browse
            </Link>

            {user ? (
              <>
                {user.role === 'customer' && (
                  <Link to="/customer-dashboard" className="text-gray-600 hover:text-green-600 font-medium px-3 py-2 rounded-md transition">
                    Buyer Dashboard
                  </Link>
                )}
                {user.role === 'provider' && (
                  <Link to="/provider-dashboard" className="text-gray-600 hover:text-green-600 font-medium px-3 py-2 rounded-md transition">
                    Seller Dashboard
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin-dashboard" className="text-gray-600 hover:text-green-600 font-medium px-3 py-2 rounded-md transition">
                    Admin Panel
                  </Link>
                )}

                <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full font-semibold">
                  {user.name} ({user.role})
                </span>

                <button onClick={handleLogout} className="bg-red-50 hover:bg-red-100 text-red-600 font-medium px-4 py-2 rounded-md transition">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-green-600 font-medium px-3 py-2 rounded-md transition">
                  Sign In
                </Link>
                <Link to="/register" className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md transition shadow-sm">
                  Join
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;