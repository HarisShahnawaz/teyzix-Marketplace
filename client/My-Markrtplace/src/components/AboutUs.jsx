import { motion } from 'framer-motion';
import { Users, Target, Zap } from 'lucide-react';
import kashifImg from '../assets/kashif.jpeg';
import israrImg from '../assets/israr.jpeg';
import hamdanImg from '../assets/hamdan.jpeg';

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Kashif",
      role: "Founder & Lead Full-Stack Developer",
      image: kashifImg
    },
    {
      name: "Israr Irshad",
      role: "Co-Founder & UI/UX Engineer",
      image: israrImg
    },
    {
      name: "Hamdan Khalid",
      role: "Documentation Specialist",
      image: hamdanImg
    }
  ];

  return (
    <section className="bg-white dark:bg-zinc-900 py-16 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-zinc-100 tracking-tight">
            About Us
          </h2>
          <p className="text-slate-500 dark:text-zinc-400 text-sm mt-2">
            Learn more about our mission and the team behind TeyzixMarket
          </p>
        </motion.div>

        {/* Main About Section - Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Side - Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop"
              alt="Modern Tech Workspace"
              className="w-full h-80 object-cover rounded-2xl shadow-lg"
            />
          </motion.div>

          {/* Right Side - Mission Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-zinc-100 tracking-tight">
              Empowering Freelance Collaboration
            </h2>
            <p className="text-slate-600 dark:text-zinc-400 text-base leading-relaxed">
              TeyzixMarket is a cutting-edge freelance marketplace designed to bridge the gap between talented service providers and clients seeking exceptional work. Our platform provides a secure, transparent environment where projects come to life through seamless collaboration, milestone-based payments, and real-time communication.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-slate-700 dark:text-zinc-300">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                  <Target className="text-[#1dbf73] dark:text-emerald-400" size={20} />
                </div>
                <span className="font-semibold text-sm">Secure Payments</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-zinc-300">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                  <Zap className="text-[#1dbf73] dark:text-emerald-400" size={20} />
                </div>
                <span className="font-semibold text-sm">Fast Delivery</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Team Section - 3 Column Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-zinc-100 tracking-tight mb-2">
              Meet Our Team
            </h3>
            <p className="text-slate-500 dark:text-zinc-400 text-sm">
              The passionate minds behind TeyzixMarket
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-2xl p-6 shadow-sm text-center hover:shadow-md transition duration-300"
              >
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-emerald-100 dark:border-emerald-900/30">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-zinc-100 mb-1">
                  {member.name}
                </h4>
                <p className="text-sm text-[#1dbf73] dark:text-emerald-400 font-medium">
                  {member.role}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default AboutUs;
