import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProviderDashboard from './dashboards/ProviderDashboard';
import CustomerDashboard from './dashboards/CustomerDashboard';
import AdminDashboard from './dashboards/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AIAssistant from './components/AIAssistant'; 
import ServiceDetails from './pages/ServiceDetails';
import Inbox from './pages/Inbox';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col relative transition-all duration-300 ease-in-out">
            <Navbar />
            <main className="grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services/:id" element={<ServiceDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route 
                  path="/inbox" 
                  element={
                    <ProtectedRoute allowedRoles={['customer', 'provider']}>
                      <Inbox />
                    </ProtectedRoute>
                  } 
                />
                
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

                <Route 
                  path="/admin-dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            
            {/* Render the AI Assistant widget floating over all views */}
            <AIAssistant />
            
            {/* Global Footer */}
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;