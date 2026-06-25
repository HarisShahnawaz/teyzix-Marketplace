import { useEffect } from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-sans"
    >
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 p-8 md:p-12 transition-all duration-300">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-zinc-100 mb-8 tracking-tight">Privacy Policy</h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-zinc-400 leading-relaxed">
          <p className="mb-6">Last Updated: June 2026</p>

          <h2 className="text-xl font-bold text-[#1dbf73] dark:text-emerald-400 mt-8 mb-4">1. Information Collection</h2>
          <p className="mb-4">
            We collect information you provide directly to us when you create an account, update your profile, use our marketplace features, or communicate with other users. This includes your name, email address, payment details, and professional portfolio. We also automatically collect certain device and usage data when you navigate our platform.
          </p>

          <h2 className="text-xl font-bold text-[#1dbf73] dark:text-emerald-400 mt-8 mb-4">2. How We Use Data</h2>
          <p className="mb-4">
            The data we collect is essential to operate, maintain, and securely provide our marketplace services. We use your information to facilitate seamless transactions, verify user identities, personalize your browsing experience, and ensure compliance with our platform policies. 
          </p>

          <h2 className="text-xl font-bold text-[#1dbf73] dark:text-emerald-400 mt-8 mb-4">3. Multi-Vendor Data Sharing Protection</h2>
          <p className="mb-4">
            TeyzixMarket employs strict data segregation protocols. Your sensitive personal and financial data is heavily encrypted and NEVER shared directly with third-party vendors or clients. Service providers only receive the necessary operational details required to fulfill your specific gig or project request.
          </p>

          <h2 className="text-xl font-bold text-[#1dbf73] dark:text-emerald-400 mt-8 mb-4">4. User Data Rights</h2>
          <p className="mb-4">
            You retain full control over your personal data. You have the right to access, correct, export, or permanently delete your account information at any time from your dashboard settings. If you require further assistance regarding your data rights or GDPR compliance, please contact our support team.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default PrivacyPolicy;
