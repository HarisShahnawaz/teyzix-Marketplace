import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-all duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Branding Section */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight transition-colors duration-300">
              TeyzixMarket
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed transition-colors duration-300">
              Secure Freelance Service Hub
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider transition-colors duration-300">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-600 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 text-sm transition-colors duration-300">
                  Browse Services
                </Link>
              </li>
              <li>
                <Link to="/customer-dashboard" className="text-slate-600 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 text-sm transition-colors duration-300">
                  Customer Dashboard
                </Link>
              </li>
              <li>
                <Link to="/provider-dashboard" className="text-slate-600 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 text-sm transition-colors duration-300">
                  Provider Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider transition-colors duration-300">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-slate-600 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 text-sm transition-colors duration-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-slate-600 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 text-sm transition-colors duration-300">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Attribution */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
          <p className="text-center text-slate-500 dark:text-slate-500 text-sm transition-colors duration-300">
            © 2026 Teyzix Marketplace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
//test