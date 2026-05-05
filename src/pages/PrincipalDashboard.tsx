import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  Users, 
  Sparkles, 
  Activity, 
  TrendingUp, 
  ShieldCheck, 
  Monitor, 
  BookOpen, 
  Calendar, 
  FileText,
  Settings,
  ArrowUpRight,
  GraduationCap,
  Briefcase,
  Layers,
  ChevronRight,
  Cpu,
  Target,
  BrainCircuit
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../services/firebase';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, CartesianGrid } from 'recharts';
import { cn } from '../lib/utils';

// Mock data reflecting institutional metrics
const attendanceTrends = [
  { week: 'W1', studentAtt: 82, facultyAtt: 95 },
  { week: 'W2', studentAtt: 85, facultyAtt: 94 },
  { week: 'W3', studentAtt: 88, facultyAtt: 96 },
  { week: 'W4', studentAtt: 76, facultyAtt: 92 },
  { week: 'W5', studentAtt: 90, facultyAtt: 98 },
];

const facultyProductivity = [
  { dept: 'CS', materials: 45, score: 92 },
  { dept: 'Electronics', materials: 32, score: 85 },
  { dept: 'Mech', materials: 28, score: 78 },
  { dept: 'Civil', materials: 22, score: 80 },
  { dept: 'Maths', materials: 18, score: 95 },
];

const aiEngagementIndex = [
  { day: 'Mon', engagement: 65, efficiency: 72 },
  { day: 'Tue', engagement: 72, efficiency: 78 },
  { day: 'Wed', engagement: 88, efficiency: 85 },
  { day: 'Thu', engagement: 94, efficiency: 92 },
  { day: 'Fri', engagement: 82, efficiency: 88 },
];

export function PrincipalDashboard() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({
    students: 0,
    faculty: 0,
    materials: 0,
    activeAttendance: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrincipalStats() {
      try {
        const [usersSnap, materialsSnap] = await Promise.all([
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'materials'))
        ]);
        
        const allUsers = usersSnap.docs.map(d => d.data());
        setCounts({
          students: allUsers.filter(u => u.role === 'student').length,
          faculty: allUsers.filter(u => u.role === 'faculty').length,
          materials: materialsSnap.size,
          activeAttendance: 88
        });
      } catch (err) {
        console.error("Principal Stats Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPrincipalStats();
  }, []);

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-violet-500 text-[10px] font-black uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" /> Principal's Intelligence Hub
          </div>
          <h2 className="text-4xl font-black tracking-tight text-white">Institutional Command</h2>
          <p className="text-zinc-500 font-medium max-w-md">Executive oversight across all academic departments, faculty productivity, and AI-driven quality metrics.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-2 shrink-0">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-500 text-xs font-black uppercase">Live Quality Sync</span>
           </div>
           <button className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-zinc-400 group">
             <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform" />
           </button>
        </div>
      </header>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Campus Presence', val: `${counts.activeAttendance}%`, icon: Activity, color: 'emerald', trend: '+2.4%' },
           { label: 'Academic Assets', val: counts.materials, icon: BookOpen, color: 'cyan', trend: '+12' },
           { label: 'Faculty Pulse', val: counts.faculty, icon: Briefcase, color: 'violet', trend: 'Optimal' },
           { label: 'AI Engagement', val: '92%', icon: Sparkles, color: 'orange', trend: '+18%' },
         ].map((stat, i) => (
           <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="bg-zinc-900/40 backdrop-blur-md border border-white/10 p-8 rounded-[2.5rem] group hover:border-violet-500/30 transition-all shadow-2xl relative overflow-hidden"
           >
             <div className={cn("absolute -right-8 -top-8 w-32 h-32 blur-3xl opacity-5 transition-opacity group-hover:opacity-10", `bg-${stat.color}-500`)} />
             <div className="flex items-start justify-between relative z-10">
                <div className={cn("p-4 rounded-2xl bg-white/5", `text-${stat.color}-400`)}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className={cn("text-[10px] font-black px-2 py-1 rounded-full bg-white/5 border border-white/5", stat.trend.includes('+') ? 'text-emerald-500' : 'text-zinc-500')}>
                  {stat.trend}
                </span>
             </div>
             <div className="mt-6 relative z-10">
                <p className="text-4xl font-black text-white">{stat.val}</p>
                <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mt-1">{stat.label}</p>
             </div>
           </motion.div>
         ))}
      </div>

      {/* Institutional Oversight Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Attendance Trends */}
        <div className="bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-[3rem] p-10 space-y-8 shadow-2xl relative overflow-hidden">
           <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-2xl font-black tracking-tight">Institutional Quality Trends</h3>
                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Global Attendance Monitoring</p>
              </div>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2 text-[10px] font-black text-cyan-400">
                    <div className="w-2 h-2 rounded-full bg-cyan-500" /> STUDENTS
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-black text-violet-400">
                    <div className="w-2 h-2 rounded-full bg-violet-500" /> FACULTY
                 </div>
              </div>
           </div>
           
           <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={attendanceTrends}>
                 <defs>
                   <linearGradient id="pStudGrad" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                     <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                   </linearGradient>
                   <linearGradient id="pFacGrad" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                     <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <XAxis dataKey="week" hide />
                 <YAxis hide />
                 <Tooltip 
                   contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '10px' }}
                   itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                 />
                 <Area type="monotone" dataKey="studentAtt" stroke="#06b6d4" strokeWidth={4} fillOpacity={1} fill="url(#pStudGrad)" />
                 <Area type="monotone" dataKey="facultyAtt" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#pFacGrad)" />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* AI Engagement levels */}
        <div className="bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-[3rem] p-10 space-y-8 shadow-2xl relative overflow-hidden">
           <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
                   AI Engagement Index <Target className="w-4 h-4 text-emerald-400" />
                </h3>
                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Grounding utilization levels</p>
              </div>
           </div>
           
           <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={aiEngagementIndex}>
                 <XAxis dataKey="day" hide />
                 <Tooltip 
                   contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '10px' }}
                   cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                 />
                 <Bar dataKey="engagement" radius={[8, 8, 0, 0]} fill="#10b981" />
                 <Bar dataKey="efficiency" radius={[8, 8, 0, 0]} fill="#8b5cf6" />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Faculty Productivity */}
        <div className="lg:col-span-2 bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-[3rem] p-10 space-y-8 shadow-2xl">
           <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-2xl font-black tracking-tight">Faculty Productivity Landscape</h3>
                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Departmental Content Contribution</p>
              </div>
              <div className="p-3 bg-violet-600/20 text-violet-400 rounded-2xl font-black text-[10px]">
                GLOBAL QUALITY SCORE: 88.4
              </div>
           </div>

           <div className="space-y-6">
             {facultyProductivity.map((dept, i) => (
               <div key={i} className="group">
                 <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                       <span className="w-8 h-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center font-bold text-xs text-zinc-500">{dept.dept}</span>
                       <span className="font-bold text-zinc-300">Grounding Assets: {dept.materials}</span>
                    </div>
                    <span className="text-sm font-black text-violet-400">{dept.score}% Proficiency</span>
                 </div>
                 <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${dept.score}%` }}
                      className="h-full bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full"
                    />
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* AI Intelligence & Strategic Overview Section (from before) */}
      <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between group overflow-hidden relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 blur-3xl -mr-32 -mt-32" />
         <div className="flex flex-col md:flex-row items-center gap-8 relative z-10 w-full">
            <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
               <GraduationCap className="w-10 h-10 text-violet-400" />
            </div>
            <div className="flex-1 space-y-2 text-center md:text-left">
               <h4 className="text-2xl font-black">Strategic Enrollment Index</h4>
               <p className="text-zinc-500 text-sm font-medium">Monitoring scholars across 12 distinct academic departments. Quality engagement is trending up by 15.4% this semester.</p>
            </div>
            <div className="flex items-center gap-6 pr-6">
               <div className="text-center">
                  <p className="text-2xl font-black text-white">{counts.students}</p>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Scholars</p>
               </div>
               <div className="text-center">
                  <p className="text-2xl font-black text-violet-400">98%</p>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Satisfaction</p>
               </div>
            </div>
         </div>
      </div>

      {/* NEW: Principal Master Control Hub */}
      <div className="space-y-6">
         <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-bold flex items-center gap-2">
               <Monitor className="w-5 h-5 text-violet-400" /> Operational Control Hub
            </h3>
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Global Administrative Access</span>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
               onClick={() => navigate('/attendance')}
               className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-violet-600 group transition-all flex flex-col gap-4 text-left"
            >
               <div className="p-3 bg-violet-600/10 rounded-xl w-fit group-hover:bg-white/20">
                  <Activity className="w-5 h-5 text-violet-400 group-hover:text-white" />
               </div>
               <div>
                  <p className="font-bold text-white">Campus Presence</p>
                  <p className="text-xs text-zinc-500 group-hover:text-violet-100 transition-colors mt-1 font-medium">Verify departmental attendance logs</p>
               </div>
            </button>

            <button 
               onClick={() => navigate('/materials')}
               className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-cyan-600 group transition-all flex flex-col gap-4 text-left"
            >
               <div className="p-3 bg-cyan-600/10 rounded-xl w-fit group-hover:bg-white/20">
                  <FileText className="w-5 h-5 text-cyan-400 group-hover:text-white" />
               </div>
               <div>
                  <p className="font-bold text-white">Course Materials</p>
                  <p className="text-xs text-zinc-500 group-hover:text-cyan-100 transition-colors mt-1 font-medium">Manage Al-grounding academic assets</p>
               </div>
            </button>

            <button 
               onClick={() => navigate('/admin/users')}
               className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-emerald-600 group transition-all flex flex-col gap-4 text-left"
            >
               <div className="p-3 bg-emerald-600/10 rounded-xl w-fit group-hover:bg-white/20">
                  <Users className="w-5 h-5 text-emerald-400 group-hover:text-white" />
               </div>
               <div>
                  <p className="font-bold text-white">Identity Access</p>
                  <p className="text-xs text-zinc-500 group-hover:text-emerald-100 transition-colors mt-1 font-medium">Manage faculty & student profiles</p>
               </div>
            </button>

            <button 
               onClick={() => navigate('/admin/master')}
               className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-orange-600 group transition-all flex flex-col gap-4 text-left"
            >
               <div className="p-3 bg-orange-600/10 rounded-xl w-fit group-hover:bg-white/20">
                  <Settings className="w-5 h-5 text-orange-400 group-hover:text-white" />
               </div>
               <div>
                  <p className="font-bold text-white">System Synapse</p>
                  <p className="text-xs text-zinc-500 group-hover:text-orange-100 transition-colors mt-1 font-medium">Master server configurations</p>
               </div>
            </button>
         </div>
      </div>
    </div>
  );
}
