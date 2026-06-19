import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  Users, ShoppingBag, ClipboardList, TrendingUp,
  UserCheck, UserCog, CheckCircle2, Clock, PackageCheck,
  Truck, LayoutDashboard, Shield, Activity, BarChart3
} from 'lucide-react';
import { API_URL } from '../config/api';

// ─── Animation Variants ─────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
};

// ─── Animated Counter ───────────────────────────────────────────────────────
const AnimatedNumber = ({ value }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(value) || 0;
    if (end === 0) return;
    const step = Math.ceil(end / 25);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setDisplay(end); clearInterval(timer); }
      else setDisplay(start);
    }, 30);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{display}</span>;
};

// ─── KPI Card ───────────────────────────────────────────────────────────────
const KpiCard = ({ icon: Icon, label, value, color, bgColor, delay = 0 }) => (
  <motion.div
    variants={cardVariants}
    whileHover={{ y: -4, scale: 1.01 }}
    transition={{ duration: 0.2 }}
    className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm p-6 flex items-center gap-5"
  >
    <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${bgColor}`}>
      <Icon size={24} className={color} />
    </div>
    <div>
      <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-3xl font-extrabold ${color}`}>
        <AnimatedNumber value={value} />
      </p>
    </div>
  </motion.div>
);

// ─── Stat Row ───────────────────────────────────────────────────────────────
const StatRow = ({ label, value, total, color, icon: Icon }) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-slate-600 dark:text-zinc-400 font-medium">
          <Icon size={14} className={color} />
          {label}
        </span>
        <span className={`font-bold text-base ${color}`}>{value}</span>
      </div>
      <div className="h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          className={`h-full rounded-full ${color.replace('text-', 'bg-')}`}
        />
      </div>
    </div>
  );
};

// ─── Section Card ───────────────────────────────────────────────────────────
const SectionCard = ({ title, icon: Icon, iconClass, children }) => (
  <motion.div
    variants={cardVariants}
    className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden"
  >
    <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconClass}`}>
        <Icon size={16} className="text-white" />
      </div>
      <h3 className="font-bold text-slate-800 dark:text-zinc-100 text-sm uppercase tracking-wide">{title}</h3>
    </div>
    <div className="p-6 space-y-4">{children}</div>
  </motion.div>
);

// ─── Main Component ─────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/admin/stats`);
        setStats(data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
          <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const totalRequests = stats?.requests?.total || 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 pb-16">

      {/* ── Hero Header ──────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-20 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 blur-2xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                <LayoutDashboard size={26} className="text-white" />
              </div>
              <div>
                <p className="text-violet-200 text-xs font-semibold uppercase tracking-widest mb-0.5">TeyzixMarket</p>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Admin Dashboard</h1>
                <p className="text-violet-200 text-sm mt-0.5">Real-time platform analytics & oversight</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3">
              <Shield size={16} className="text-violet-200" />
              <div>
                <p className="text-xs text-violet-200">Signed in as</p>
                <p className="text-sm font-bold text-white">{user?.name || 'Admin'}</p>
              </div>
              <span className="ml-2 px-2 py-0.5 bg-emerald-400/20 border border-emerald-400/40 rounded-full text-emerald-300 text-[10px] font-bold uppercase">Admin</span>
            </div>
          </motion.div>

          {/* Quick summary bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {[
              { label: 'Total Users', val: stats?.users?.total || 0, icon: Users },
              { label: 'Total Services', val: stats?.services?.total || 0, icon: ShoppingBag },
              { label: 'Total Orders', val: totalRequests, icon: ClipboardList },
              { label: 'Completed', val: (stats?.requests?.completed || 0) + (stats?.requests?.delivered || 0), icon: CheckCircle2 },
            ].map(({ label, val, icon: Icon }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 flex items-center gap-3">
                <Icon size={18} className="text-violet-200 flex-shrink-0" />
                <div>
                  <p className="text-[11px] text-violet-200 font-medium">{label}</p>
                  <p className="text-xl font-extrabold text-white"><AnimatedNumber value={val} /></p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Content Area ────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >

          {/* ── KPI Metric Cards Row ─────────────────────────────────── */}
          <div>
            <motion.p variants={cardVariants} className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity size={13} /> Key Metrics
            </motion.p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <KpiCard icon={Users}       label="Total Users"     value={stats?.users?.total || 0}     color="text-violet-600 dark:text-violet-400" bgColor="bg-violet-50 dark:bg-violet-950/40" />
              <KpiCard icon={UserCheck}   label="Customers"       value={stats?.users?.customers || 0} color="text-blue-600 dark:text-blue-400"     bgColor="bg-blue-50 dark:bg-blue-950/40" />
              <KpiCard icon={UserCog}     label="Providers"       value={stats?.users?.providers || 0} color="text-emerald-600 dark:text-emerald-400" bgColor="bg-emerald-50 dark:bg-emerald-950/40" />
              <KpiCard icon={ShoppingBag} label="Live Services"   value={stats?.services?.total || 0}  color="text-amber-600 dark:text-amber-400"   bgColor="bg-amber-50 dark:bg-amber-950/40" />
            </div>
          </div>

          {/* ── Detailed Stat Cards ──────────────────────────────────── */}
          <div>
            <motion.p variants={cardVariants} className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <BarChart3 size={13} /> Detailed Breakdown
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* User Breakdown */}
              <SectionCard title="User Breakdown" icon={Users} iconClass="bg-violet-600">
                <StatRow label="Total Users"  value={stats?.users?.total || 0}     total={stats?.users?.total || 1} color="text-slate-700 dark:text-zinc-200"       icon={Users} />
                <StatRow label="Customers"    value={stats?.users?.customers || 0} total={stats?.users?.total || 1} color="text-blue-600 dark:text-blue-400"        icon={UserCheck} />
                <StatRow label="Providers"    value={stats?.users?.providers || 0} total={stats?.users?.total || 1} color="text-emerald-600 dark:text-emerald-400"  icon={UserCog} />
              </SectionCard>

              {/* Service Breakdown */}
              <SectionCard title="Service Listings" icon={ShoppingBag} iconClass="bg-amber-500">
                <div className="flex flex-col items-center justify-center py-4 gap-3">
                  <div className="w-24 h-24 rounded-full border-8 border-amber-100 dark:border-amber-950 flex items-center justify-center">
                    <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                      <AnimatedNumber value={stats?.services?.total || 0} />
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-zinc-400">Active Marketplace Listings</p>
                  <span className="px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-full border border-amber-200 dark:border-amber-800">
                    All Services Live
                  </span>
                </div>
              </SectionCard>

              {/* Orders Breakdown */}
              <SectionCard title="Order Pipeline" icon={ClipboardList} iconClass="bg-indigo-600">
                <StatRow label="Total Orders" value={totalRequests}                          total={totalRequests || 1} color="text-slate-700 dark:text-zinc-200"       icon={TrendingUp} />
                <StatRow label="Pending"      value={stats?.requests?.pending || 0}         total={totalRequests || 1} color="text-amber-600 dark:text-amber-400"      icon={Clock} />
                <StatRow label="Accepted"     value={stats?.requests?.accepted || 0}        total={totalRequests || 1} color="text-blue-600 dark:text-blue-400"        icon={CheckCircle2} />
                <StatRow label="Completed"    value={stats?.requests?.completed || 0}       total={totalRequests || 1} color="text-emerald-600 dark:text-emerald-400"  icon={PackageCheck} />
                <StatRow label="Delivered"    value={stats?.requests?.delivered || 0}       total={totalRequests || 1} color="text-violet-600 dark:text-violet-400"    icon={Truck} />
              </SectionCard>

            </div>
          </div>

          {/* ── Platform Health Summary ──────────────────────────────── */}
          <motion.div variants={cardVariants} className="bg-gradient-to-r from-slate-900 to-zinc-900 dark:from-zinc-900 dark:to-zinc-800 rounded-2xl p-6 border border-zinc-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                  <Activity size={12} className="text-emerald-400" /> Platform Health
                </p>
                <h3 className="text-xl font-bold text-white">All Systems Operational</h3>
                <p className="text-zinc-400 text-sm mt-1">
                  {totalRequests} total orders processed &bull; {stats?.users?.total || 0} registered users
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: 'Completion Rate', value: totalRequests > 0 ? `${Math.round(((stats?.requests?.completed || 0) + (stats?.requests?.delivered || 0)) / totalRequests * 100)}%` : '—', color: 'text-emerald-400' },
                  { label: 'Provider Ratio', value: stats?.users?.total > 0 ? `${Math.round((stats?.users?.providers || 0) / stats?.users?.total * 100)}%` : '—', color: 'text-violet-400' },
                  { label: 'Pending Rate', value: totalRequests > 0 ? `${Math.round((stats?.requests?.pending || 0) / totalRequests * 100)}%` : '—', color: 'text-amber-400' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-3 text-center min-w-[100px]">
                    <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
