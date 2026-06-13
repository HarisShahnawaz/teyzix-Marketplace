import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/admin/stats');
        setStats(data);
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-all duration-300 ease-in-out">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans"
    >
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 dark:from-purple-700 dark:to-indigo-800 rounded-2xl p-8 text-white shadow-md mb-10 transition-all duration-300 ease-in-out">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-purple-100 dark:text-purple-200 mt-1 text-sm transition-colors duration-300">
          Platform overview and analytics monitoring
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* User Statistics */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-md transition-all duration-300 ease-in-out"
        >
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 tracking-tight transition-colors duration-300">User Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400 text-sm transition-colors duration-300">Total Users</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 transition-colors duration-300">{stats?.users?.total || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400 text-sm transition-colors duration-300">Customers</span>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 transition-colors duration-300">{stats?.users?.customers || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400 text-sm transition-colors duration-300">Providers</span>
              <span className="text-2xl font-bold text-green-600 dark:text-green-400 transition-colors duration-300">{stats?.users?.providers || 0}</span>
            </div>
          </div>
        </motion.div>

        {/* Service Statistics */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-md transition-all duration-300 ease-in-out"
        >
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 tracking-tight transition-colors duration-300">Service Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400 text-sm transition-colors duration-300">Active Services</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 transition-colors duration-300">{stats?.services?.total || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400 text-sm transition-colors duration-300">Total Listings</span>
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400 transition-colors duration-300">{stats?.services?.total || 0}</span>
            </div>
          </div>
        </motion.div>

        {/* Project Statistics */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-md transition-all duration-300 ease-in-out"
        >
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 tracking-tight transition-colors duration-300">Project Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400 text-sm transition-colors duration-300">Total Requests</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 transition-colors duration-300">{stats?.requests?.total || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400 text-sm transition-colors duration-300">Pending</span>
              <span className="text-2xl font-bold text-amber-600 dark:text-amber-400 transition-colors duration-300">{stats?.requests?.pending || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400 text-sm transition-colors duration-300">Accepted</span>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 transition-colors duration-300">{stats?.requests?.accepted || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400 text-sm transition-colors duration-300">Completed</span>
              <span className="text-2xl font-bold text-green-600 dark:text-green-400 transition-colors duration-300">{stats?.requests?.completed || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400 text-sm transition-colors duration-300">Delivered</span>
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400 transition-colors duration-300">{stats?.requests?.delivered || 0}</span>
            </div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default AdminDashboard;
