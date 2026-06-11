import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role });
      login(data);
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleSubmit} className="max-w-md w-full bg-white p-8 rounded-xl shadow-md space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-900">Create Account [cite: 20]</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Join As A</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm">
            <option value="customer">Customer (Buy Services) [cite: 22]</option>
            <option value="provider">Service Provider (Sell Work) [cite: 23]</option>
          </select>
        </div>
        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
          Register [cite: 20]
        </button>
      </form>
    </div>
  );
};

export default Register;