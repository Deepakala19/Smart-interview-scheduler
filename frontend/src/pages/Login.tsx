import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Globe,
  ArrowRight,
  Briefcase,
  GraduationCap,
  UserCircle
} from 'lucide-react';
import { useAuth, UserRole } from '../hooks/useAuth';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('candidate');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (isSignUp) {
        await register(name || email.split('@')[0], email, password, role);
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (user) {
      navigate(`/${user.role}/dashboard`);
    }
  }, [user, navigate]);

  const roles = [
    { id: 'candidate', label: 'Candidate', icon: GraduationCap, color: 'from-blue-500 to-indigo-600', desc: 'Find your dream role' },
    { id: 'admin', label: 'Admin', icon: Briefcase, color: 'from-purple-500 to-pink-600', desc: 'Assess top talent' },
    { id: 'hr', label: 'HR Admin', icon: ShieldCheck, color: 'from-emerald-500 to-teal-600', desc: 'Manage pipeline' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 overflow-hidden relative font-sans">
      {/* Animated Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Side: Branding & Features */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:block space-y-12"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-indigo-500/40">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter">Schedulr<span className="text-indigo-500">.</span></h1>
          </div>

          <div className="space-y-8">
            <h2 className="text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
              The Future of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Smart Hiring.</span>
            </h2>
            <p className="text-slate-400 text-xl max-w-md leading-relaxed">
              Experience a seamless, AI-driven interview ecosystem designed for modern teams.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <FeatureCard icon={<Zap className="text-amber-400" />} title="Instant Booking" desc="Zero friction scheduling." />
            <FeatureCard icon={<Globe className="text-indigo-400" />} title="Global Sync" desc="Timezone aware sessions." />
          </div>

          <div className="flex items-center gap-6 pt-8">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-[#050505] bg-slate-800 overflow-hidden">
                  <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
            <p className="text-slate-500 font-bold text-sm">Joined by <span className="text-white">2,000+</span> top companies</p>
          </div>
        </motion.div>

        {/* Right Side: Login Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass rounded-[3rem] p-10 md:p-14 border-white/[0.05] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[60px] rounded-full"></div>
          
          <div className="relative z-10">
            <div className="mb-12">
              <h3 className="text-3xl font-black text-white tracking-tight mb-2">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h3>
              <p className="text-slate-400 font-medium">
                {isSignUp ? 'Join the future of smart hiring.' : 'Select your role to continue to the portal.'}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={cn(
                    "mb-6 p-4 rounded-2xl text-sm font-bold border",
                    error.includes('successfully') 
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                      : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                  )}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Role Selector */}
              <div className="grid grid-cols-3 gap-4">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id as any)}
                    className={cn(
                      "flex flex-col items-center gap-3 p-4 rounded-3xl border transition-all duration-500 group relative overflow-hidden",
                      role === r.id 
                        ? "bg-white/[0.08] border-white/20 shadow-xl" 
                        : "bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04] grayscale opacity-60 hover:grayscale-0 hover:opacity-100"
                    )}
                  >
                    {role === r.id && (
                      <motion.div 
                        layoutId="role-bg"
                        className={cn("absolute inset-0 opacity-10 bg-gradient-to-br", r.color)}
                      />
                    )}
                    <r.icon className={cn(
                      "w-6 h-6 transition-transform group-hover:scale-110",
                      role === r.id ? "text-indigo-400" : "text-slate-500"
                    )} />
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      role === r.id ? "text-white" : "text-slate-500"
                    )}>{r.label}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {isSignUp && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="relative group"
                  >
                    <UserCircle className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-[1.5rem] py-4 pl-14 pr-6 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all font-medium"
                    />
                  </motion.div>
                )}

                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-[1.5rem] py-4 pl-14 pr-6 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all font-medium"
                  />
                </div>

                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-[1.5rem] py-4 pl-14 pr-6 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between px-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-5 h-5 rounded-lg border-2 border-white/10 flex items-center justify-center group-hover:border-indigo-500/40 transition-colors">
                    <div className="w-2 h-2 rounded-sm bg-indigo-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  </div>
                  <span className="text-sm font-bold text-slate-500 group-hover:text-slate-300 transition-colors">Remember me</span>
                </label>
                <button type="button" className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors">Forgot Password?</button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-black py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-slate-200 transition-all shadow-2xl shadow-white/10 relative overflow-hidden group"
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-6 h-6 border-4 border-black/20 border-t-black rounded-full animate-spin"
                    />
                  ) : (
                      <motion.div
                        key="text"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-3"
                      >
                        {isSignUp ? 'Create Account' : 'Sign In to Portal'} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </form>

            <div className="mt-12 text-center">
              <p className="text-slate-500 font-bold text-sm">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button 
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError(null);
                  }}
                  className="text-white hover:text-indigo-400 transition-colors"
                >
                  {isSignUp ? 'Sign In' : 'Create Account'}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="glass rounded-3xl p-6 border-white/[0.05] hover:border-white/[0.1] transition-all group">
      <div className="mb-4 p-3 bg-white/[0.03] rounded-2xl w-fit group-hover:scale-110 transition-transform">{icon}</div>
      <h4 className="text-white font-bold mb-1">{title}</h4>
      <p className="text-slate-500 text-sm font-medium">{desc}</p>
    </div>
  );
}
