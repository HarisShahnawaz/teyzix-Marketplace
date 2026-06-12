import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProviderDashboard from './dashboards/ProviderDashboard';
import CustomerDashboard from './dashboards/CustomerDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AIAssistant from './components/AIAssistant'; 
import ServiceDetails from './pages/ServiceDetails';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col relative">
          <Navbar />
          <main className="grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services/:id" element={<ServiceDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route 
                path="/provider-dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['provider']}>
                    <ProviderDashboard />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/customer-dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <CustomerDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          
          {/* Render the AI Assistant widget floating over all views */}
          <AIAssistant />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;