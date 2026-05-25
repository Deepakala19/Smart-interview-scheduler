import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  Video,
  ChevronRight,
  MoreVertical,
  Star
} from 'lucide-react';
import { mockInterviews } from '../utils/mockData';
import Calendar from '../components/Calendar';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';

export default function AdminDashboard() {
  const { token, user } = useAuth();
  const [interviews, setInterviews] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/interviews', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const result = await response.json();
          // Filter to only show interviews where this admin is assigned or involved
          setInterviews(result.data.filter((i: any) => i.adminId?._id === user?._id || !i.adminId));
        }
      } catch (error) {
        console.error('Error fetching admin interviews:', error);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchInterviews();
  }, [token, user]);

  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Admin Portal</h1>
            <p className="text-slate-400 mt-1">Review your schedule and provide candidate feedback.</p>
          </div>
          <div className="flex items-center gap-4 bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.05]">
            <div className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/20">Today</div>
            <div className="px-5 py-2 text-slate-400 text-xs font-bold hover:text-white transition-colors cursor-pointer">Week</div>
            <div className="px-5 py-2 text-slate-400 text-xs font-bold hover:text-white transition-colors cursor-pointer">Month</div>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Timeline */}
            <div className="glass rounded-[2.5rem] p-8 border-white/[0.05]">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <Clock className="w-6 h-6 text-indigo-400" />
                  Today's Timeline
                </h2>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{today}</span>
              </div>
              
              <div className="space-y-0 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-0.5 before:bg-white/[0.05]">
                {loading ? (
                  <p className="text-slate-500 text-sm font-bold pl-12 py-4">Loading schedule...</p>
                ) : interviews.length > 0 ? (
                  interviews.map((int, i) => (
                    <TimelineItem 
                      key={int._id}
                      time={int.startTime} 
                      title={int.candidateId?.name || "Candidate Session"} 
                      type={int.title}
                      status={int.status === 'completed' ? 'completed' : i === 0 ? 'active' : 'pending'}
                      candidateRole="External Applicant"
                    />
                  ))
                ) : (
                  <div className="pl-12 py-6">
                    <p className="text-white font-bold text-lg mb-1">Clear Slate!</p>
                    <p className="text-slate-500 text-sm">You have no interviews scheduled for today.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Calendar View */}
            <div className="glass rounded-[2.5rem] p-8 border-white/[0.05]">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <CalendarIcon className="w-6 h-6 text-purple-400" />
                  Availability Calendar
                </h2>
                <div className="flex gap-2">
                  <button className="p-2 glass glass-hover rounded-xl text-slate-400"><ChevronRight className="w-5 h-5 rotate-180" /></button>
                  <button className="p-2 glass glass-hover rounded-xl text-slate-400"><ChevronRight className="w-5 h-5" /></button>
                </div>
              </div>
              <Calendar interviews={mockInterviews} />
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-8">
            {/* Quick Feedback Card */}
            <div className="glass rounded-[2.5rem] p-8 border-white/[0.05] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                <Star className="w-12 h-12 text-indigo-500/10 -rotate-12 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Pending Feedback</h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">You have <span className="text-white font-bold">2 candidates</span> waiting for your technical assessment scores.</p>
              
              <div className="space-y-4">
                <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/[0.05] hover:bg-white/[0.06] transition-all cursor-pointer group/item">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-indigo-400">David Miller</span>
                    <span className="text-[10px] text-slate-500">2h ago</span>
                  </div>
                  <p className="text-xs text-slate-300 mb-4">Backend Systems Round</p>
                  <button className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all">Submit Feedback</button>
                </div>
              </div>
            </div>

            {/* Interview Requests */}
            <div className="glass rounded-[2.5rem] p-8 border-white/[0.05]">
              <h3 className="text-xl font-bold text-white mb-8">New Requests</h3>
              <div className="space-y-6">
                {mockInterviews.slice(2, 4).map((int, i) => (
                  <div key={int.id} className="group">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center text-white font-bold border border-white/10">
                        {int.candidate.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white">{int.candidate}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{int.type} • {int.time}</p>
                      </div>
                      <button className="p-1.5 text-slate-500 hover:text-white transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 bg-white/5 hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 border border-white/10 hover:border-emerald-500/20 rounded-xl text-[10px] font-bold transition-all">Accept</button>
                      <button className="flex-1 py-2 bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-white/10 hover:border-rose-500/20 rounded-xl text-[10px] font-bold transition-all">Decline</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

function TimelineItem({ time, title, type, status, candidateRole, key }: { time: string, title: string, type: string, status: 'completed' | 'active' | 'pending', candidateRole?: string, key?: React.Key }) {
  return (
    <div className="flex gap-6 pb-10 last:pb-0 relative">
      <div className="relative z-10">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500",
          status === 'completed' ? "bg-emerald-500 border-emerald-500 text-white" :
          status === 'active' ? "bg-[#050505] border-indigo-500 text-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" :
          "bg-[#050505] border-white/10 text-white/20"
        )}>
          {status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : status === 'active' ? <Video className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
        </div>
      </div>
      <div className="flex-1 pt-1">
        <div className="flex justify-between items-start mb-1">
          <p className={cn("text-lg font-bold", status === 'active' ? "text-white" : "text-slate-400")}>{title}</p>
          <span className="text-xs font-bold text-slate-500">{time}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-indigo-400/80 uppercase tracking-widest">{type}</span>
          {candidateRole && (
            <>
              <div className="w-1 h-1 rounded-full bg-slate-700"></div>
              <span className="text-xs text-slate-500 font-medium">{candidateRole}</span>
            </>
          )}
        </div>
        {status === 'active' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
              <span className="text-xs font-bold text-white">Session is live</span>
            </div>
            <button className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-bold hover:bg-indigo-700 transition-all">Join Now</button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
