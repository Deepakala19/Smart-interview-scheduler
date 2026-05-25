import React from 'react';
import { 
  LayoutDashboard, 
  LogOut,
  UserCircle,
  Sparkles
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useAuth } from '../hooks/useAuth';

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: `/${user?.role}/dashboard` },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 p-4 hidden lg:flex flex-col z-40">
      <div className="flex-1 glass rounded-[2rem] p-6 flex flex-col border-white/[0.05]">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="font-extrabold text-2xl tracking-tighter text-white">Schedulr</span>
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 group relative",
                  isActive 
                    ? "text-white bg-white/[0.08] shadow-sm" 
                    : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.8)]" />
                )}
                <item.icon className={cn(
                  "w-5 h-5 transition-transform group-hover:scale-110",
                  isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
                )} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/[0.05]">
          <div className="bg-white/[0.03] rounded-2xl p-4 mb-4 border border-white/[0.05]">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
                <UserCircle className="w-5 h-5 text-indigo-400" />
              </div>
              <p className="text-sm font-bold text-white truncate capitalize">{user?.name}</p>
            </div>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold ml-11">{user?.role}</p>
          </div>
          
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/10 transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
