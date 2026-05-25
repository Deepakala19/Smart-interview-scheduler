import React from 'react';
import { 
  Search, 
  Bell, 
  Moon, 
  ChevronDown,
  Command
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 w-full px-6 py-4">
      <div className="glass rounded-3xl px-6 py-3 flex items-center justify-between border-white/[0.05]">
        <div className="flex items-center gap-8 flex-1">
          <div className="relative max-w-md w-full hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl py-2.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 bg-white/[0.05] border border-white/10 rounded-lg">
              <Command className="w-3 h-3 text-slate-500" />
              <span className="text-[10px] font-bold text-slate-500">K</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 mr-4">
            <button className="p-2.5 glass glass-hover rounded-2xl text-slate-400 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#050505]"></span>
            </button>
            <button className="p-2.5 glass glass-hover rounded-2xl text-slate-400">
              <Moon className="w-5 h-5" />
            </button>
          </div>

          <div className="h-8 w-px bg-white/[0.05] mx-2"></div>

          <button className="flex items-center gap-3 pl-2 pr-1 py-1 glass glass-hover rounded-2xl border-white/[0.05]">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-indigo-500/10">
              {user?.name?.charAt(0)}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-white leading-none">{user?.name}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mt-1">{user?.role}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-500 ml-1 mr-2" />
          </button>
        </div>
      </div>
    </header>
  );
}
