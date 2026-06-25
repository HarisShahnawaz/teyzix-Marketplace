import { useEffect } from 'react';
import { motion } from 'framer-motion';

const TermsOfService = () => {
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
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-zinc-100 mb-8 tracking-tight">Terms of Service</h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-zinc-400 leading-relaxed">
          <p className="mb-6">Last Updated: June 2026</p>

          <h2 className="text-xl font-bold text-[#1dbf73] dark:text-emerald-400 mt-8 mb-4">1. Account Registration Eligibility</h2>
          <p className="mb-4">
            To utilize TeyzixMarket, you must be at least 18 years old and capable of forming legally binding contracts. By registering, you agree to provide accurate, complete, and verifiable information. Fraudulent accounts or the use of automated bots to manipulate marketplace listings are strictly prohibited and will result in permanent suspension.
          </p>

          <h2 className="text-xl font-bold text-[#1dbf73] dark:text-emerald-400 mt-8 mb-4">2. Vendor Workspace Code of Conduct</h2>
          <p className="mb-4">
            Service providers must deliver exactly what is outlined in their gig descriptions. Plagiarism, missed deadlines without prior communication, or delivering malicious software violates our Code of Conduct. Providers must maintain a professional demeanor and resolve minor disputes amicably before escalating to marketplace arbitration.
          </p>

          <h2 className="text-xl font-bold text-[#1dbf73] dark:text-emerald-400 mt-8 mb-4">3. Client-Provider Messaging Pipelines</h2>
          <p className="mb-4">
            All project communications must remain within the TeyzixMarket messaging system to guarantee our dispute resolution protections. Sharing external contact information (e.g., WhatsApp, personal emails, or social media) prior to project completion bypasses our secure payment escrow and is heavily restricted.
          </p>

          <h2 className="text-xl font-bold text-[#1dbf73] dark:text-emerald-400 mt-8 mb-4">4. Payment and Service Delivery Disclaimers</h2>
          <p className="mb-4">
            Payments are held securely in escrow and are only released to the provider once the client approves the delivered milestone. However, TeyzixMarket acts strictly as a facilitating platform. We disclaim liability for the quality, legality, or actual performance of the services rendered. Both parties must perform due diligence before entering into a gig agreement.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default TermsOfService;
