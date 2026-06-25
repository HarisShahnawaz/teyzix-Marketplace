import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = await login(email, password);

      if (userData.role === 'provider') {
        navigate('/provider-dashboard');
      } else if (userData.role === 'customer') {
        navigate('/customer-dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      if (errorMsg === 'Email not registered') {
        setAuthError({ type: 'not_registered', message: 'This email is not registered yet. Please create an account first!' });
      } else {
        setAuthError({ type: 'general', message: errorMsg });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-all duration-300 ease-in-out"
    >
      <motion.form
        whileHover={{ y: -4 }}
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-md border border-gray-100 dark:border-slate-800 space-y-6 transition-all duration-300 ease-in-out"
      >
        <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-slate-100 tracking-tight transition-colors duration-300">Sign In</h2>

        {authError && (
          <div className={`p-4 rounded-lg text-sm flex items-center justify-between shadow-sm ${authError.type === 'not_registered' ? 'bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 border border-amber-200 dark:border-amber-800' : 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-200 border border-red-200 dark:border-red-800'}`}>
            <span>{authError.message}</span>
            {authError.type === 'not_registered' && (
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="ml-4 whitespace-nowrap font-bold text-amber-900 dark:text-amber-100 underline decoration-amber-400 hover:text-amber-700 dark:hover:text-white transition-colors"
              >
                Join Now
              </button>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors duration-300">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm transition-all duration-300"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors duration-300">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm transition-all duration-300"
            placeholder="••••••••"
            required
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50"
        >
          {loading ? 'Signing In...' : 'Login'}
        </motion.button>
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-6 border-t border-gray-100 dark:border-slate-800">
          <span className="text-sm text-slate-600 dark:text-slate-400 mb-4 sm:mb-0">
            Don't have an account?
          </span>
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="w-full sm:w-auto flex justify-center py-2.5 px-6 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
          >
            Create account
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default Login;