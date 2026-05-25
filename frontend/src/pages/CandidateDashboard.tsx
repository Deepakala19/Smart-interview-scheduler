import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  FileUp, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Video,
  MapPin,
  ExternalLink,
  Sparkles,
  Trophy,
  Ban
} from 'lucide-react';
import DashboardLayout from '../components/Layout';
import ApplicationForm from '../components/ApplicationForm';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';

export default function CandidateDashboard() {
  const { user, token, completeProfile, refreshUser } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  React.useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/interviews', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const result = await response.json();
          setInterviews(Array.isArray(result) ? result : result.data || []);
        }
      } catch (error) {
        console.error('Error fetching interviews:', error);
      }
    };
    if (token) {
        fetchInterviews();
        refreshUser();
    }
  }, [token, user?.status, user?.applicationRound, user?.hrRound, user?.technicalRound]);

  const handleFormSubmit = async (data: any) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${user?._id}/round`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          roundType: 'application', 
          roundStatus: 'completed',
          profileData: data 
        })
      });
      
      if (res.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          refreshUser();
          setShowSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to submit application:', error);
    }
  };

  if (!user?.hasCompletedProfile) {
    return (
        <div className="py-10">
          <AnimatePresence mode="wait">
            {showSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="flex flex-col items-center justify-center min-h-[60vh] text-center"
              >
                <div className="w-24 h-24 bg-emerald-500/20 rounded-[2rem] flex items-center justify-center mb-8 border border-emerald-500/20 shadow-xl shadow-emerald-500/10">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                </div>
                <h2 className="text-4xl font-black text-white tracking-tight mb-4 uppercase italic">Application Submitted!</h2>
                <p className="text-slate-400 text-lg max-w-md mx-auto">
                  Your profile has been synchronized with our AI matching system. Redirecting you to your live dashboard...
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="mb-12 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 rounded-full border border-indigo-500/20 mb-6 backdrop-blur-md">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">Candidate Engine v2.0</span>
                  </div>
                  <h1 className="text-5xl font-black text-white tracking-tight mb-4 italic">JOIN THE FUTURE</h1>
                  <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    Welcome, <span className="text-white font-bold">{user?.name}</span>. Complete your profile to get matched with enterprise opportunities.
                  </p>
                </div>
                <ApplicationForm onSubmit={handleFormSubmit} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
    );
  }

  const currentStatus = user?.status || 'Applied';

  return (
    <div className="space-y-10 pb-16">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="relative group">
            <h1 className="text-5xl font-black text-white tracking-tight italic">
              WELCOME BACK, <span className="text-indigo-400">{user?.name.split(' ')[0].toUpperCase()}</span>
            </h1>
            <p className="text-slate-500 mt-2 text-lg font-medium group-hover:text-slate-400 transition-colors">
              Tracking your progress for <span className="text-white/80 font-bold border-b border-indigo-500/30">Senior Frontend Engineer</span> position.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white/[0.03] p-2 rounded-2xl border border-white/[0.05] backdrop-blur-xl">
            <div className="px-4 py-2 bg-indigo-600 rounded-xl text-xs font-black text-white italic tracking-wider shadow-lg shadow-indigo-600/30">ACTIVE SESSION</div>
            <div className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-white transition-colors cursor-help">LIVE UPDATES ENABLED</div>
          </div>
        </header>

        {/* Global Alert for Accepted/Rejected */}
        <AnimatePresence>
          {currentStatus === 'Accepted' && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden">
               <div className="bg-emerald-500/10 border-2 border-emerald-500/20 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-3xl flex items-center justify-center border border-emerald-500/20 rotate-3 group-hover:rotate-12 transition-transform shadow-2xl shadow-emerald-500/10">
                    <Trophy className="w-10 h-10 text-emerald-400" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl font-black text-white tracking-tight mb-2 italic">OFFER EXTENDED!</h2>
                    <p className="text-emerald-400/70 font-bold">Congratulations! The team at SparkAI has officially accepted your application. Check your inbox for the onboarding package.</p>
                  </div>
                  <button className="px-10 py-5 bg-white text-emerald-700 rounded-3xl font-black text-sm hover:bg-emerald-50 transition-all uppercase tracking-widest shadow-xl">Get Started</button>
               </div>
            </motion.div>
          )}
          {currentStatus === 'Rejected' && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden">
               <div className="bg-rose-500/10 border-2 border-rose-500/20 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-8 border-dashed">
                  <div className="w-20 h-20 bg-rose-500/20 rounded-3xl flex items-center justify-center border border-rose-500/20">
                    <Ban className="w-10 h-10 text-rose-400" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-black text-white tracking-tight mb-1 uppercase">APPLICATION STATUS: CLOSED</h2>
                    <p className="text-rose-400/60 font-medium">Thank you for your interest. While we aren't moving forward at this time, we've kept your profile in our talent pool for future openings.</p>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Application Progress */}
        <div className="glass rounded-[3rem] p-12 border-white/[0.05] relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="flex justify-between items-center mb-12 relative z-10">
            <h2 className="text-2xl font-black text-white italic tracking-tight">TRANSMISSION PIPELINE</h2>
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Live Tracking</span>
               <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
            </div>
          </div>
          <div className="relative pt-4 pb-8">
            <div className="absolute top-[34px] left-0 w-full h-[6px] bg-white/[0.04] rounded-full overflow-hidden">
                <div className={cn(
                  "h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-1000 ease-out",
                  user?.applicationRound === 'completed' ? (
                    user?.hrRound === 'completed' ? (
                      user?.technicalRound === 'completed' ? 'w-[100%]' : 'w-[66%]'
                    ) : 'w-[33%]'
                  ) : 'w-[0%]'
                )}></div>
             </div>
             <div className="relative flex justify-between items-center px-4">
               <ProgressStep label="Application" date="Verified" completed={user?.applicationRound === 'completed'} active={user?.applicationRound === 'pending'} />
               <ProgressStep label="HR Round" date="Screening" completed={user?.hrRound === 'completed'} active={user?.applicationRound === 'completed' && user?.hrRound === 'pending'} />
               <ProgressStep label="Technical" date="Assessment" completed={user?.technicalRound === 'completed'} active={user?.hrRound === 'completed' && user?.technicalRound === 'pending'} />
               <ProgressStep label="Selection" date="Final" completed={currentStatus === 'Accepted'} active={user?.technicalRound === 'completed' && currentStatus === 'Applied'} />
             </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upcoming Interviews */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-2xl font-black text-white italic flex items-center gap-4">
                <Calendar className="w-7 h-7 text-indigo-400" />
                UPCOMING OPS
              </h2>
            </div>
            <div className="space-y-4">
              {interviews.length > 0 ? interviews.map((int, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={int._id} 
                  className="glass rounded-[2.5rem] p-10 hover:bg-white/[0.04] transition-all group border-white/[0.05] relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 rounded-[2.5rem] transition-all duration-700"></div>
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 relative z-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
                      <div className="w-20 h-20 rounded-[2rem] bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform duration-500 shadow-2xl shadow-indigo-500/10">
                        <Video className="w-10 h-10 text-indigo-400" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h3 className="font-black text-white text-2xl tracking-tight uppercase">{int.title}</h3>
                          <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black text-indigo-400 uppercase tracking-widest">{int.status}</span>
                        </div>
                        <p className="text-slate-400 text-sm font-bold flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          SECURE CHANNEL WITH <span className="text-white">ENGR LEAD</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-row xl:flex-col items-center xl:items-end justify-between xl:justify-center border-t xl:border-t-0 border-white/5 pt-6 xl:pt-0">
                      <p className="text-3xl font-black text-white tracking-tighter tabular-nums px-4 py-2 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">10:00 AM</p>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-3 mr-2">
                        {new Date(int.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mt-10 pt-10 border-t border-white/[0.05] relative z-10">
                    <div className="flex items-center gap-8">
                      <div className="flex items-center gap-3 text-slate-400 text-[11px] font-black uppercase tracking-widest">
                        <MapPin className="w-4 h-4 text-indigo-400" /> VIRTUAL LOBBY
                      </div>
                      <div className="flex items-center gap-3 text-slate-400 text-[11px] font-black uppercase tracking-widest">
                        <Clock className="w-4 h-4 text-indigo-400" /> 60 MIN BURST
                      </div>
                    </div>
                    <a 
                      href={int.meetingLink || "https://meet.google.com"} 
                      target="_blank" rel="noopener noreferrer"
                      className="px-10 py-4 bg-white text-black rounded-2xl font-black text-sm hover:translate-y-[-4px] active:translate-y-0 transition-all flex items-center justify-center gap-3 group/btn shadow-xl shadow-white/5"
                    >
                      JOIN SESSION <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </a>
                  </div>
                </motion.div>
              )) : (
                <div className="glass rounded-[3rem] p-20 text-center border-white/[0.05] border-dashed">
                  <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-white/10 opacity-50">
                     <Calendar className="w-10 h-10 text-slate-500" />
                  </div>
                  <h3 className="text-white font-black text-xl mb-2 italic">NO ACTIVE SESSIONS</h3>
                  <p className="text-slate-500 font-bold max-w-sm mx-auto">Standby for scheduling confirmation from the talent acquisition desk.</p>
                </div>
              )}
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-8">
            <div className="bg-white text-black rounded-[3rem] p-10 relative overflow-hidden group border border-white/10 shadow-2xl transition-all hover:scale-[1.02]">
              <div className="absolute -right-6 -bottom-6 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
              <Sparkles className="w-10 h-10 mb-8" />
              <h3 className="text-3xl font-black tracking-tighter mb-4 leading-[0.9] uppercase italic">Optimize Your Node</h3>
              <p className="text-black/50 text-sm font-bold mb-10 leading-relaxed uppercase tracking-tighter">AI Analysis indicates adding specialized certifications increases match rate by <span className="text-indigo-600">42%</span>.</p>
              <button className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
                BOOST MATCHING
              </button>
            </div>

            {/* Notifications */}
            <div className="glass rounded-[3.5rem] p-10 border-white/[0.05]">
              <div className="flex items-center justify-between mb-10">
                <h3 className="font-black text-white text-xl italic tracking-tight">LOGS</h3>
                <span className="text-[9px] font-black text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">3 ALERTS</span>
              </div>
              <div className="space-y-8">
                <NotificationItem 
                  icon={<Trophy className="w-5 h-5 text-emerald-400" />}
                  title="Stage Advanced"
                  desc="HR upgraded your status to Shortlisted."
                  time="2h ago"
                />
                <NotificationItem 
                  icon={<Sparkles className="w-5 h-5 text-amber-400" />}
                  title="Profile Sync"
                  desc="AI Matching engine updated your score."
                  time="5h ago"
                />
                <NotificationItem 
                  icon={<Calendar className="w-5 h-5 text-indigo-400" />}
                  title="Slot Drafted"
                  desc="A potential slot was drafted for tomorrow."
                  time="1d ago"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

function ProgressStep({ label, date, active = false, completed = false }: { label: string, date: string, active?: boolean, completed?: boolean }) {
  return (
    <div className="flex flex-col items-center relative z-10 w-24">
      <div className={cn(
        "w-12 h-12 rounded-[1.25rem] flex items-center justify-center border-4 transition-all duration-700 shadow-lg",
        completed ? "bg-indigo-600 border-indigo-600 text-white shadow-indigo-500/30" : 
        active ? "bg-white border-white text-black scale-110 shadow-white/20" :
        "bg-[#0a0a0a] border-white/5 text-white/5"
      )}>
        {completed ? <CheckCircle2 className="w-6 h-6" /> : <div className="w-2 h-2 rounded-full bg-current" />}
      </div>
      <div className="mt-5 text-center">
        <p className={cn("text-[11px] font-black uppercase tracking-widest leading-none", active ? "text-indigo-400 italic" : completed ? "text-white" : "text-white/5")}>{label}</p>
        <p className={cn("text-[9px] font-bold uppercase tracking-tighter mt-1.5 opacity-40", active ? "text-white" : "text-slate-600")}>{date}</p>
      </div>
    </div>
  );
}

function NotificationItem({ icon, title, desc, time }: { icon: React.ReactNode, title: string, desc: string, time: string }) {
  return (
    <div className="flex items-start gap-5 group cursor-pointer">
      <div className="mt-1 p-3 bg-white/[0.03] rounded-2xl group-hover:bg-indigo-500/10 transition-all border border-transparent group-hover:border-indigo-500/20">{icon}</div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <p className="text-sm font-black text-white group-hover:text-indigo-400 transition-colors uppercase italic tracking-tighter">{title}</p>
          <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter group-hover:text-slate-400">{time}</span>
        </div>
        <p className="text-[11px] text-slate-500 font-bold mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
