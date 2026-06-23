import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ fullName: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="bg-slate-50 dark:bg-zinc-950 py-16 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-zinc-100 tracking-tight mb-2">
            Get In Touch
          </h2>
          <p className="text-slate-500 dark:text-zinc-400 text-sm">
            Have questions? We'd love to hear from you.
          </p>
        </motion.div>

        {/* Split Layout - Contact Info & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Side - Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-zinc-800">
              <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100 mb-6">
                Contact Information
              </h3>
              
              <div className="space-y-5">
                {/* Email Badge */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="text-[#1dbf73] dark:text-emerald-400" size={22} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-zinc-100 text-sm mb-1">
                      Email Us
                    </h4>
                    <p className="text-slate-600 dark:text-zinc-400 text-sm">
                      contact@teyzixmarket.com
                    </p>
                  </div>
                </div>

                {/* Phone Badge */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="text-[#1dbf73] dark:text-emerald-400" size={22} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-zinc-100 text-sm mb-1">
                      Call Us
                    </h4>
                    <p className="text-slate-600 dark:text-zinc-400 text-sm">
                     +92 324 8113280
                    </p>
                  </div>
                </div>

                {/* Location Badge */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-[#1dbf73] dark:text-emerald-400" size={22} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-zinc-100 text-sm mb-1">
                      Location
                    </h4>
                    <p className="text-slate-600 dark:text-zinc-400 text-sm">
                    Lahore, Pakistan
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info Card */}
            <div className="bg-gradient-to-br from-[#1dbf73] to-emerald-600 rounded-2xl p-8 text-white shadow-sm">
              <h4 className="font-bold text-lg mb-2">
                Need Immediate Help?
              </h4>
              <p className="text-emerald-50 text-sm leading-relaxed mb-4">
                Our support team is available 24/7 to assist you with any questions or concerns.
              </p>
              <button className="bg-white text-[#1dbf73] font-semibold px-6 py-2.5 rounded-xl hover:bg-emerald-50 transition duration-200 text-sm">
                Start Live Chat
              </button>
            </div>
          </motion.div>

          {/* Right Side - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-zinc-800">
              <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100 mb-6">
                Send Us a Message
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:border-teal-500 dark:focus:border-emerald-500 transition duration-200 text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500"
                  />
                </div>

                {/* Business Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-2">
                    Business Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@company.com"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:border-teal-500 dark:focus:border-emerald-500 transition duration-200 text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="How can we help?"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:border-teal-500 dark:focus:border-emerald-500 transition duration-200 text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Tell us more about your inquiry..."
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:border-teal-500 dark:focus:border-emerald-500 transition duration-200 text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 resize-none"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-teal-600 hover:bg-teal-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold rounded-xl transition duration-200 shadow-sm flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  Send Message
                </motion.button>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ContactUs;
