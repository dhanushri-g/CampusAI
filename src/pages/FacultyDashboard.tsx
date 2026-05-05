import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Clock, 
  Sparkles, 
  Book, 
  Flame, 
  FileText, 
  Loader2, 
  ChevronRight, 
  Calendar, 
  BrainCircuit, 
  Activity, 
  ShieldCheck, 
  AlertTriangle,
  Monitor,
  Filter,
  CheckCircle2,
  XCircle,
  MoreVertical,
  BarChart3,
  TrendingUp,
  LayoutGrid
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as ReTooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  CartesianGrid, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { cn } from '../lib/utils';

// Mock live feed data
const liveFeed = [
  { id: '1', name: 'Alex Johnson', time: '10:02 AM', status: 'verified', avatar: 'AJ' },
  { id: '2', name: 'Sarah Miller', time: '10:04 AM', status: 'verified', avatar: 'SM' },
  { id: '3', name: 'David Chen', time: '10:05 AM', status: 'failed', avatar: 'DC' },
  { id: '4', name: 'Emily Watts', time: '10:07 AM', status: 'verified', avatar: 'EW' },
];

const trendData = [
  { name: 'Mon', attendance: 92 },
  { name: 'Tue', attendance: 88 },
  { name: 'Wed', attendance: 94 },
  { name: 'Thu', attendance: 90 },
  { name: 'Fri', attendance: 96 },
];

export function FacultyDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'monitoring' | 'analytics'>('overview');

  useEffect(() => {
    async function fetchClasses() {
      if (!profile) return;
      try {
        const res = await fetch('/api/faculty/classes', {
          headers: {
            'x-user-role': profile.role,
            'x-user-id': profile.uid
          }
        });
        const data = await res.json();
        setClasses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Faculty Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchClasses();
  }, [profile]);

  if (loading || !profile) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
        <p className="text-zinc-500 font-medium">Synchronizing Control Center...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-violet-500 text-[10px] font-black uppercase tracking-widest">
            <Monitor className="w-4 h-4" /> System Control Panel
          </div>
          <h2 className="text-4xl font-black tracking-tight text-white">
            Welcome, {profile?.name?.split(' ')[0] || 'Professor'}
          </h2>
          <p className="text-zinc-500 font-medium">Faculty oversight for {classes.length} academic courses.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-2 shrink-0">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)]" />
              <span className="text-emerald-500 text-xs font-black uppercase tracking-widest">Live Monitoring Active</span>
           </div>
           <button 
             onClick={() => navigate('/faculty/attendance')}
             className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-widest text-[10px] rounded-[1.2rem] shadow-xl shadow-violet-600/30 transition-all active:scale-95 flex items-center gap-2"
           >
             <Activity className="w-4 h-4" /> Launch Session
           </button>
        </div>
      </header>

      {/* Primary Navigation Tabs */}
      <div className="flex bg-white/5 p-1.5 rounded-[1.5rem] border border-white/10 w-fit">
         {[
           { id: 'overview', label: 'Overview', icon: LayoutGrid },
           { id: 'monitoring', label: 'Live Monitoring', icon: Activity },
           { id: 'analytics', label: 'Analytics', icon: BarChart3 },
         ].map((tab) => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id as any)}
             className={cn(
               "px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
               activeTab === tab.id ? "bg-violet-600 text-white shadow-lg" : "text-zinc-500 hover:text-white"
             )}
           >
             <tab.icon className="w-4 h-4" />
             {tab.label}
           </button>
         ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            key="overview"
            className="space-y-10"
          >
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Classes Conducted', val: '24', icon: Clock, color: 'violet', trend: '+12%' },
                { label: 'Avg. Attendance', val: '94.2%', icon: Users, color: 'emerald', trend: '+2.4%' },
                { label: 'Syllabus Coverage', val: '68%', icon: Book, color: 'cyan', trend: 'on track' },
                { label: 'AI Grounding', val: '12', icon: BrainCircuit, color: 'orange', trend: '+4' },
              ].map((stat, i) => (
                <div key={i} className="bg-zinc-900/40 backdrop-blur-md border border-white/10 p-8 rounded-[2.5rem] group hover:border-white/20 transition-all shadow-2xl relative overflow-hidden">
                   <div className={cn("absolute -top-8 -right-8 w-24 h-24 blur-3xl opacity-5", `bg-${stat.color}-500`)} />
                   <div className="flex items-start justify-between relative z-10">
                      <div className={cn("p-4 rounded-2xl bg-white/5", `text-${stat.color}-400`)}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2 py-1 bg-white/5 rounded-full border border-white/5">
                        {stat.trend}
                      </span>
                   </div>
                   <div className="mt-6 relative z-10">
                      <p className="text-3xl font-black text-white">{stat.val}</p>
                      <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1">{stat.label}</p>
                   </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* Daily Schedule */}
               <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between px-2">
                     <h3 className="text-2xl font-black tracking-tight">Today's Academic Pulse</h3>
                     <button onClick={() => navigate('/timetable')} className="text-violet-400 text-xs font-bold hover:underline flex items-center gap-1 group">
                        Full Schedule <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                     </button>
                  </div>
                  <div className="grid gap-4">
                     {classes.length > 0 ? classes.map((cls, i) => (
                        <motion.div 
                          key={cls.id || i}
                          whileHover={{ x: 10 }}
                          className="bg-zinc-900/40 backdrop-blur-md border border-white/5 p-6 rounded-[2rem] flex items-center gap-6 group hover:border-violet-500/20 transition-all shadow-xl"
                        >
                           <div className="w-16 h-16 rounded-2xl bg-violet-600/10 flex items-center justify-center shrink-0 border border-white/5 group-hover:bg-violet-600 group-hover:text-white transition-all">
                              <Calendar className="w-8 h-8 text-violet-400 group-hover:text-white" />
                           </div>
                           <div className="flex-1 min-w-0">
                              <p className="text-xl font-bold truncate text-white">{cls.name}</p>
                              <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">Section {cls.section} • Room {cls.room}</p>
                           </div>
                           <div className="text-right shrink-0">
                              <p className="text-xl font-black text-white">{cls.time}</p>
                              <div className="flex items-center justify-end gap-2 mt-2">
                                 <button 
                                   onClick={() => navigate(`/faculty/attendance?class=${cls.id}`)}
                                   className="px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5 transition-all"
                                 >
                                    Verify
                                 </button>
                                 <button className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-500 border border-white/5">
                                    <MoreVertical className="w-4 h-4" />
                                 </button>
                              </div>
                           </div>
                        </motion.div>
                     )) : (
                        <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] space-y-4">
                           <Clock className="w-12 h-12 text-zinc-800 mx-auto" />
                           <p className="text-zinc-500 font-medium italic">No scheduled academic conflicts detected.</p>
                        </div>
                     )}
                  </div>
               </div>

               {/* Notifications & System Alerts */}
               <div className="space-y-6">
                  <h3 className="text-2xl font-black tracking-tight px-2">System Pulse</h3>
                  <div className="bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-[3rem] p-10 space-y-8 shadow-2xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 blur-3xl -mr-16 -mt-16" />
                     <div className="space-y-6">
                        {[
                           { type: 'warning', text: 'Student Dave Chen: Face detection failed 3 times in CS-201', time: '4m ago' },
                           { type: 'info', text: 'Weekly syllabus report generated: 68% complete', time: '1h ago' },
                           { type: 'alert', text: 'Multiple login attempts detected from unrecognized IP', time: '3h ago' },
                        ].map((alert, i) => (
                           <div key={i} className="flex gap-4 group">
                              <div className={cn(
                                "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border transition-all group-hover:scale-110",
                                alert.type === 'warning' ? "bg-orange-500/10 border-orange-500/20 text-orange-400" :
                                alert.type === 'alert' ? "bg-red-500/10 border-red-500/20 text-red-500" :
                                "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                              )}>
                                 {alert.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> : 
                                  alert.type === 'alert' ? <ShieldCheck className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                              </div>
                              <div className="min-w-0">
                                 <p className="text-sm font-bold text-zinc-300 leading-relaxed group-hover:text-white transition-colors">
                                    {alert.text}
                                 </p>
                                 <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mt-1">{alert.time}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                     <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-all">
                        View All Incident Logs
                     </button>
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'monitoring' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            key="monitoring"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-[3rem] p-10 shadow-2xl space-y-8">
               <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-3xl font-black tracking-tight text-white">Live Session Pulse</h3>
                    <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mt-1">CS-201: Algorithms & Data Structures</p>
                  </div>
                  <div className="flex gap-2">
                     <div className="px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                        64 Verified
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {liveFeed.map((user) => (
                    <motion.div 
                      key={user.id}
                      layout
                      className="p-6 bg-white/5 border border-white/5 rounded-3xl flex items-center gap-4 group hover:border-white/20 transition-all"
                    >
                       <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600/20 to-cyan-500/20 flex items-center justify-center font-black text-violet-400 shrink-0 border border-white/5">
                          {user.avatar}
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="font-bold text-white truncate">{user.name}</p>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Timestamp: {user.time}</p>
                       </div>
                       <div className={cn(
                         "p-2 rounded-xl border transition-all",
                         user.status === 'verified' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-red-500/10 border-red-500/20 text-red-500"
                       )}>
                          {user.status === 'verified' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                       </div>
                    </motion.div>
                  ))}
               </div>

               <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                  <button className="py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                     View Session Heatmap
                  </button>
                  <button className="py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-violet-600/20">
                     Force Close Session
                  </button>
               </div>
            </div>

            <div className="bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-[3rem] p-10 shadow-2xl flex flex-col items-center justify-center text-center space-y-6">
               <div className="w-24 h-24 rounded-[2rem] bg-violet-600/10 flex items-center justify-center shadow-inner group">
                  <Sparkles className="w-10 h-10 text-violet-400 group-hover:scale-110 transition-transform" />
               </div>
               <div className="space-y-4">
                  <h3 className="text-2xl font-black tracking-tight text-white leading-none">Instant AI Audit</h3>
                  <p className="text-zinc-500 text-sm font-medium italic">"Current session engagement is 14% higher than departmental average. AI grounded materials are being utilized 3x more in Room 203."</p>
               </div>
               <button className="w-full py-5 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-violet-600/20 hover:scale-105 transition-all">
                  Generate Quality Report
               </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            key="analytics"
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-[3rem] p-10 shadow-2xl space-y-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 blur-3xl -mr-32 -mt-32" />
                  <div className="flex items-center justify-between">
                     <div>
                        <h3 className="text-3xl font-black tracking-tight text-white">Enrollment Fidelity</h3>
                        <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mt-1">Attendance Trend (Current Semester)</p>
                     </div>
                     <div className="p-3 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                        <span className="text-emerald-500 text-[10px] font-black uppercase">+2.4% Optimal</span>
                     </div>
                  </div>

                  <div className="h-[400px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                           <defs>
                              <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                                 <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                              </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                           <XAxis 
                              dataKey="name" 
                              stroke="#52525b" 
                              fontSize={10} 
                              fontWeight={900} 
                              axisLine={false} 
                              tickLine={false} 
                              dy={15}
                           />
                           <YAxis 
                              stroke="#52525b" 
                              fontSize={10} 
                              fontWeight={900} 
                              axisLine={false} 
                              tickLine={false} 
                              domain={[70, 100]}
                              dx={-10}
                           />
                           <ReTooltip 
                              contentStyle={{ 
                                 backgroundColor: '#18181b', 
                                 border: '1px solid rgba(255,255,255,0.1)', 
                                 borderRadius: '16px',
                                 boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                              }}
                              itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}
                           />
                           <Area 
                              type="monotone" 
                              dataKey="attendance" 
                              stroke="#8b5cf6" 
                              strokeWidth={4} 
                              fillOpacity={1} 
                              fill="url(#colorAtt)" 
                           />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
               </div>

               <div className="space-y-8">
                  <div className="bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-[3rem] p-10 shadow-2xl space-y-8">
                     <h3 className="text-xl font-black tracking-tight text-white">Grounding Efficiency</h3>
                     <div className="space-y-6">
                        {[
                           { name: 'Lecture Notes', val: 92, count: 124, color: 'bg-violet-500' },
                           { name: 'Lab Sheets', val: 78, count: 45, color: 'bg-cyan-500' },
                           { name: 'Research Ref', val: 45, count: 12, color: 'bg-emerald-500' },
                        ].map((item, i) => (
                           <div key={i} className="space-y-3">
                              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                 <span className="text-zinc-500">{item.name}</span>
                                 <span className="text-white">{item.count} Assets</span>
                              </div>
                              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                 <motion.div 
                                   initial={{ width: 0 }}
                                   animate={{ width: `${item.val}%` }}
                                   className={cn("h-full rounded-full transition-all duration-1000 shadow-lg", item.color)}
                                 />
                              </div>
                           </div>
                        ))}
                     </div>
                     <button className="w-full py-4 border border-violet-500/20 text-violet-400 bg-violet-600/5 hover:bg-violet-600 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                        Sync with AI Core
                     </button>
                  </div>

                  <div className="p-8 bg-gradient-to-br from-violet-600 to-cyan-600 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                     <Sparkles className="absolute -bottom-8 -right-8 w-24 h-24 text-white/10 group-hover:scale-125 transition-transform" />
                     <p className="text-xs font-black uppercase tracking-widest text-white/60 mb-2">Institutional Quality</p>
                     <h4 className="text-3xl font-black text-white">88.4</h4>
                     <p className="text-[10px] font-bold text-white/80 mt-2 italic leading-relaxed">
                        "Your faculty productivity index is in the top 5% of the university. Quality metrics indicate high student retention."
                     </p>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
