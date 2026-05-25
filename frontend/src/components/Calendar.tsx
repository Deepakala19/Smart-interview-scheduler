import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Calendar({ interviews }: { interviews: any[] }) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-white">{format(currentMonth, 'MMMM yyyy')}</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs font-bold text-white/40 uppercase tracking-widest mb-4">
            {day}
          </div>
        ))}
        {days.map((day, i) => {
          const dayInterviews = interviews.filter(int => isSameDay(new Date(int.time), day));
          return (
            <div 
              key={i} 
              className={cn(
                "min-h-[100px] p-2 rounded-2xl border transition-all duration-300 group",
                !isSameMonth(day, currentMonth) ? "bg-transparent border-transparent opacity-20" : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
              )}
            >
              <span className="text-sm font-medium text-white/60 group-hover:text-white">{format(day, 'd')}</span>
              <div className="mt-2 space-y-1">
                {dayInterviews.map(int => (
                  <div 
                    key={int.id} 
                    className={cn(
                      "text-[10px] p-1.5 rounded-lg border truncate font-medium",
                      int.status === 'confirmed' ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" :
                      int.status === 'pending' ? "bg-amber-500/20 border-amber-500/40 text-amber-400" :
                      "bg-indigo-500/20 border-indigo-500/40 text-indigo-400"
                    )}
                  >
                    {int.candidate}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
