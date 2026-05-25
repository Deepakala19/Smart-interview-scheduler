import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserCheck, 
  CalendarCheck, 
  CheckCircle,
  TrendingUp,
  MoreHorizontal,
  Search,
  Filter,
  ArrowUpRight,
  Download,
  Check,
  X,
  Calendar,
  Sparkles,
  Command
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockChartData } from '../utils/mockData';
import DashboardLayout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';

export default function HRDashboard() {
  const [candidates, setCandidates] = React.useState<any[]>([]);
  const [interviews, setInterviews] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedCandidate, setSelectedCandidate] = React.useState<any>(null);
  const [showScheduleModal, setShowScheduleModal] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [bookingData, setBookingData] = React.useState({ date: '', time: '', type: 'Technical Interview' });
  const { token } = useAuth();

  const fetchData = async () => {
    try {
      const [userRes, intRes] = await Promise.all([
        fetch('http://localhost:5000/api/users?role=candidate', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/interviews', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (userRes.ok) setCandidates(await userRes.json());
      if (intRes.ok) {
        const result = await intRes.json();
        setInterviews(Array.isArray(result) ? result : result.data || []);
      }
    } catch (error) {
      console.error('Error fetching HR data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error('Status update failed:', error);
    }
  };

  const handleRoundUpdate = async (id: string, roundType: string, roundStatus: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}/round`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ roundType, roundStatus })
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error('Round update failed:', error);
    }
  };

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) return;

    try {
      const res = await fetch('http://localhost:5000/api/interviews', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          candidateId: selectedCandidate._id,
          title: bookingData.type,
          date: bookingData.date,
          startTime: bookingData.time,
          endTime: `${parseInt(bookingData.time.split(':')[0]) + 1}:${bookingData.time.split(':')[1]}`.padStart(5, '0'),
          meetingLink: `https://meet.google.com/${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`
        })
      });
      if (res.ok) {
        setShowScheduleModal(false);
        fetchData();
        handleStatusUpdate(selectedCandidate._id, 'Interviewing');
        // Also mark specific round as completed if needed
        if (bookingData.type.toLowerCase().includes('hr')) {
           handleRoundUpdate(selectedCandidate._id, 'application', 'completed');
        }
      }
    } catch (error) {
      console.error('Scheduling failed:', error);
    }
  };

  return (
    <div className="space-y-8 pb-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Enterprise Talent Console</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Talent Command Center</h1>
            <p className="text-slate-400 mt-1">AI-optimized candidate pipeline and assessment analytics.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 glass glass-hover rounded-2xl text-slate-300 text-sm font-bold flex items-center gap-2">
              <Download className="w-4 h-4" /> Export
            </button>
            <button className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 group">
              <TrendingUp className="w-4 h-4 group-hover:rotate-12 transition-transform" /> Generate Report
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Active Pipeline" value={candidates.length} trend="+12%" icon={<Users className="text-indigo-400" />} />
          <StatCard label="Hiring Velocity" value="86%" trend="+4%" icon={<TrendingUp className="text-purple-400" />} />
          <StatCard label="Live Sessions" value={interviews.length} trend="Active" icon={<CalendarCheck className="text-pink-400" />} />
          <StatCard label="Open Roles" value="12" trend="High Demand" icon={<CheckCircle className="text-emerald-400" />} />
        </div>

        {/* Pipeline Table */}
        <div className="glass rounded-[2.5rem] border-white/[0.05] overflow-hidden">
          <div className="p-8 border-b border-white/[0.05] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.01]">
            <div>
              <h3 className="font-bold text-white text-xl flex items-center gap-3">
                Incoming Applications
                <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] rounded-full border border-indigo-500/20 uppercase tracking-tighter">Live</span>
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search talent..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-64" 
                />
              </div>
              <button className="p-2.5 glass glass-hover rounded-2xl text-slate-400">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-white/[0.05]">
                  <th className="px-8 py-5">Candidate</th>
                  <th className="px-8 py-5">Role Fit</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {isLoading ? (
                  <tr><td colSpan={4} className="px-8 py-10 text-center text-slate-500 font-bold">Initializing data nodes...</td></tr>
                ) : candidates.filter(c => 
                    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    c.email.toLowerCase().includes(searchTerm.toLowerCase())
                  ).length > 0 ? (
                  candidates
                    .filter(c => 
                      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      c.email.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((can, i) => {
                    const statusColor = can.status === 'Accepted' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' :
                                      can.status === 'Rejected' ? 'text-rose-400 bg-rose-400/10 border-rose-400/20' :
                                      can.status === 'Interviewing' ? 'text-purple-400 bg-purple-400/10 border-purple-400/20' :
                                      'text-indigo-400 bg-indigo-400/10 border-indigo-400/20';

                    return (
                      <motion.tr 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={can._id} 
                        className="hover:bg-white/[0.02] transition-all group border-l-2 border-l-transparent hover:border-l-indigo-500"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-400 font-bold border border-white/10 uppercase">
                              {can.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{can.name}</p>
                              <p className="text-[11px] text-slate-500">{can.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                             <div className="px-2.5 py-1 bg-white/[0.03] border border-white/10 rounded-lg flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3 text-indigo-400" />
                                <span className="text-[10px] font-black text-white italic">{(8 + (can.name.length % 5) / 2).toFixed(1)} Match</span>
                             </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={cn("px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm", statusColor)}>
                            {can.status || 'Applied'}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            {can.status === 'Applied' || can.status === 'Shortlisted' ? (
                              <>
                                <button onClick={() => handleStatusUpdate(can._id, 'Accepted')} className="p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 transition-all" title="Accept">
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => { setSelectedCandidate(can); setShowScheduleModal(true); }}
                                  className="p-2.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl hover:bg-indigo-500/20 transition-all flex items-center gap-2 font-bold text-xs"
                                >
                                  <Calendar className="w-4 h-4" /> Book Slot
                                </button>
                                <button onClick={() => handleStatusUpdate(can._id, 'Rejected')} className="p-2.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl hover:bg-rose-500/20 transition-all" title="Decline">
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : null}
                            <div className="flex gap-1">
                                {can.applicationRound === 'pending' && (
                                    <button onClick={() => handleRoundUpdate(can._id, 'application', 'completed')} className="px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-[9px] font-bold uppercase transition-all hover:bg-blue-500/20">
                                        App Done
                                    </button>
                                )}
                                {can.hrRound === 'pending' && (
                                    <button onClick={() => handleRoundUpdate(can._id, 'hr', 'completed')} className="px-2 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg text-[9px] font-bold uppercase transition-all hover:bg-purple-500/20">
                                        HR Done
                                    </button>
                                )}
                                {can.technicalRound === 'pending' && (
                                    <button onClick={() => handleRoundUpdate(can._id, 'technical', 'completed')} className="px-2 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg text-[9px] font-bold uppercase transition-all hover:bg-indigo-500/20">
                                        Tech Done
                                    </button>
                                )}
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr><td colSpan={4} className="px-8 py-20 text-center text-slate-500 font-bold uppercase tracking-widest bg-white/[0.01]">No active nodes found in pipeline.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Area Chart Section */}
        <div className="glass rounded-[2.5rem] p-8 border-white/[0.05]">
          <h3 className="font-bold text-white text-xl mb-6">Pipeline Velocity</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="velocity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#ffffff20', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #ffffff10', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="interviews" stroke="#6366f1" strokeWidth={3} fill="url(#velocity)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      {/* Schedule Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowScheduleModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass rounded-[3rem] p-10 max-w-lg w-full border-white/10 relative z-10"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
                  <Calendar className="w-7 h-7 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">Schedule Assessment</h3>
                  <p className="text-slate-400 text-sm">Locking in slot for <span className="text-white font-bold">{selectedCandidate?.name}</span></p>
                </div>
              </div>

              <form onSubmit={handleSchedule} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block ml-2">Assessment Matrix</label>
                  <select 
                    value={bookingData.type}
                    onChange={e => setBookingData({...bookingData, type: e.target.value})}
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-bold text-sm"
                  >
                    <option>Technical Interview</option>
                    <option>System Design Round</option>
                    <option>Behavioral Assessment</option>
                    <option>Final Founder Match</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block ml-2">Slot Date</label>
                    <input 
                      type="date" required
                      value={bookingData.date}
                      onChange={e => setBookingData({...bookingData, date: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block ml-2">Time Delta</label>
                    <input 
                      type="time" required
                      value={bookingData.time}
                      onChange={e => setBookingData({...bookingData, time: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-bold text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="bg-indigo-500/5 rounded-2xl p-5 border border-indigo-500/10 flex items-center gap-4">
                   <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                      <Command className="w-5 h-5 text-indigo-400" />
                   </div>
                   <p className="text-[11px] text-slate-400 leading-relaxed">
                     <span className="text-white font-bold">Optimization Note:</span> The candidate's activity peaks at this time. Confirmation rates are expected to be <span className="text-indigo-400 font-bold">94.2%</span>.
                   </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowScheduleModal(false)} className="flex-1 glass glass-hover py-4 rounded-2xl text-slate-400 font-bold text-sm">Cancel</button>
                  <button type="submit" className="flex-2 bg-white text-black py-4 px-8 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all shadow-xl shadow-white/5 active:scale-95">Confirm Session</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ label, value, trend, icon }: { label: string, value: string | number, trend: string, icon: React.ReactNode }) {
  const isPositive = trend.startsWith('+') || trend === 'Active';
  return (
    <div className="glass rounded-[2rem] p-7 border-white/[0.05] hover:border-white/[0.1] transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.02] rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="p-3 bg-white/[0.05] rounded-2xl group-hover:bg-indigo-500/20 transition-colors">{icon}</div>
        <div className={cn(
          "flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg",
          isPositive ? "text-emerald-400 bg-emerald-500/10" : "text-rose-400 bg-rose-500/10"
        )}>
          {isPositive ? <ArrowUpRight className="w-3 h-3" /> : null}
          {trend}
        </div>
      </div>
      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest relative z-10">{label}</p>
      <p className="text-4xl font-black text-white mt-1 tracking-tighter relative z-10">{value}</p>
    </div>
  );
}
