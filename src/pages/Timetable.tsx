import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, Download, ChevronLeft, ChevronRight, Settings, Plus, Users, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';

import { useAuth } from '../context/AuthContext';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM'];

const schedule = [
  { day: 'Monday', time: '10:00 AM', subject: 'Data Structures', prof: 'Prof. Smith', room: 'R203', color: 'border-violet-500 bg-violet-500/10' },
  { day: 'Monday', time: '02:00 PM', subject: 'Algorithms', prof: 'Prof. Williams', room: 'R401', color: 'border-cyan-500 bg-cyan-500/10' },
  { day: 'Tuesday', time: '11:00 AM', subject: 'Database Systems', prof: 'Prof. Brown', room: 'Lab 2', color: 'border-emerald-500 bg-emerald-500/10' },
  { day: 'Wednesday', time: '09:00 AM', subject: 'Operating Systems', prof: 'Prof. Taylor', room: 'R105', color: 'border-orange-500 bg-orange-500/10' },
  { day: 'Thursday', time: '10:00 AM', subject: 'Data Structures', prof: 'Prof. Smith', room: 'R203', color: 'border-violet-500 bg-violet-500/10' },
  { day: 'Friday', time: '01:00 PM', subject: 'Soft Skills', prof: 'Prof. Miller', room: 'Auditorium', color: 'border-pink-500 bg-pink-500/10' },
];

export function Timetable() {
  const { profile } = useAuth();
  const [view, setView] = useState<'Grid' | 'List'>('Grid');
  const isFaculty = profile?.role !== 'student';

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold">Academic Schedule</h2>
           <p className="text-zinc-500 text-sm">{isFaculty ? "Manage classes and academic sessions." : "Organized view of your weekly classes and labs."}</p>
        </div>
        <div className="flex items-center gap-3">
          {isFaculty && (
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 rounded-xl text-sm font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20">
              <Plus className="w-4 h-4" />
              Add Entry
            </button>
          )}
          <div className="bg-white/5 border border-white/10 rounded-xl p-1 flex gap-1">
             {['Grid', 'List'].map((v) => (
               <button 
                  key={v}
                  onClick={() => setView(v as any)}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                    view === v ? "bg-violet-600 text-white" : "text-zinc-500 hover:text-white"
                  )}
                >
                  {v}
               </button>
             ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/10 transition-all">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 overflow-hidden">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-4">
              <button className="p-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-bold">20 May - 26 May, 2025</h3>
              <button className="p-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
           </div>
           <div className="flex items-center gap-6 text-sm text-zinc-500 font-medium">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-violet-500" />
                <span>Lecture</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Lab</span>
             </div>
             <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span>Preferences</span>
             </div>
           </div>
        </div>

        {view === 'Grid' ? (
          <div className="overflow-x-auto overflow-y-hidden">
            <div className="min-w-[800px] grid grid-cols-[100px_repeat(5,1fr)] gap-4">
              <div />
              {days.map(day => (
                <div key={day} className="text-center pb-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">{day.slice(0, 3)}</p>
                  <p className="text-sm font-bold">{19 + days.indexOf(day)} May</p>
                </div>
              ))}

              {timeSlots.map(time => (
                <React.Fragment key={time}>
                  <div className="py-8 text-xs font-bold text-zinc-600 border-t border-white/5">{time}</div>
                  {days.map(day => {
                    const item = schedule.find(s => s.day === day && s.time === time);
                    return (
                      <div key={day + time} className="border-t border-white/5 py-4">
                        {item && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={cn("p-4 rounded-2xl border-l-4 shadow-xl transition-all hover:scale-[1.02] cursor-pointer group", item.color)}
                          >
                            <p className="text-[10px] font-bold uppercase tracking-tight opacity-60 mb-1">{item.time}</p>
                            <p className="text-sm font-bold mb-3">{item.subject}</p>
                            <div className="space-y-1.5 opacity-80">
                               <div className="flex items-center gap-2 text-[10px] font-medium">
                                  <Users className="w-3 h-3" />
                                  {item.prof}
                               </div>
                               <div className="flex items-center gap-2 text-[10px] font-medium">
                                  <MapPin className="w-3 h-3" />
                                  {item.room}
                               </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {schedule.map((item, i) => (
               <div key={i} className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl">
                  <div className="flex items-center gap-6">
                    <div className="text-center min-w-[80px]">
                       <p className="text-xs uppercase text-zinc-500 font-bold">{item.day.slice(0, 3)}</p>
                       <p className="text-lg font-bold">{item.time.split(' ')[0]}</p>
                       <p className="text-[10px] text-zinc-500">{item.time.split(' ')[1]}</p>
                    </div>
                    <div>
                      <p className="font-bold">{item.subject}</p>
                      <p className="text-sm text-zinc-500">{item.prof} • {item.room}</p>
                    </div>
                  </div>
                  <button className="text-violet-400 font-bold text-sm px-4 py-2 bg-violet-600/10 rounded-xl hover:bg-violet-600/20 transition-all">
                    View Materials
                  </button>
               </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
         <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-[2.5rem] p-8 text-white flex flex-col justify-between overflow-hidden relative">
            <Settings className="absolute top-[-10%] right-[-10%] w-60 h-60 opacity-10 rotate-12" />
            <div>
               <h3 className="text-2xl font-bold mb-2">Smart Generator</h3>
               <p className="text-white/70 text-sm max-w-sm">Use AI to generate a conflict-free timetable across all departments and semesters instantly.</p>
            </div>
            <button className="mt-8 bg-white text-violet-600 px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-100 transition-all w-fit">
              <Settings className="w-5 h-5" />
              Configure & Generate
            </button>
         </div>
         <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex flex-col justify-between">
            <div>
               <h3 className="text-2xl font-bold text-white mb-2">Conflicts Found</h3>
               <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full w-fit text-xs font-bold mb-6">
                 No Conflicts Detected
               </div>
               <p className="text-zinc-500 text-sm">Your schedule is optimized for the upcoming week based on professor availability and room capacity.</p>
            </div>
            <button className="mt-8 text-zinc-400 font-bold text-sm hover:text-white transition-colors">
              View Audit Logs
            </button>
         </div>
      </div>
    </div>
  );
}
