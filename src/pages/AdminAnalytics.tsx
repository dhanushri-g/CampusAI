import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Users, Activity, Target, Shield, Sparkles } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { cn } from '../lib/utils';

const attendanceTrend = [
  { month: 'Jan', attendance: 88, aiUsage: 45 },
  { month: 'Feb', attendance: 85, aiUsage: 52 },
  { month: 'Mar', attendance: 82, aiUsage: 68 },
  { month: 'Apr', attendance: 90, aiUsage: 75 },
  { month: 'May', attendance: 92, aiUsage: 89 },
];

const facultyPerf = [
  { name: 'Dr. Smith', score: 94, color: '#7c3aed' },
  { name: 'Prof. Miller', score: 88, color: '#06b6d4' },
  { name: 'Dr. Brown', score: 91, color: '#10b981' },
  { name: 'Prof. Taylor', score: 82, color: '#f59e0b' },
];

export function AdminAnalytics() {
  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">Institutional Intelligence</h2>
          <p className="text-zinc-500 text-sm">Real-time performance monitoring and quality control.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
              <Shield className="w-3.5 h-3.5" />
              SYSTEM SECURE
           </div>
           <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 transition-all">
              Download Audit
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Enrollment', value: '1,240', change: '+12%', icon: Users, color: 'text-violet-400' },
          { label: 'Campus Attendance', value: '88.4%', change: '+3.4%', icon: Activity, color: 'text-emerald-400' },
          { label: 'AI Engagement', value: '92%', change: '+18%', icon: Sparkles, color: 'text-cyan-400' },
          { label: 'Resource Utilization', value: '76%', change: '-2%', icon: Target, color: 'text-orange-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-[2rem] p-6 space-y-4 hover:border-white/20 transition-all group">
            <div className="flex items-center justify-between">
              <div className={cn("p-3 rounded-2xl bg-white/5 group-hover:bg-opacity-10 transition-colors", stat.color)}>
                 <stat.icon className="w-5 h-5" />
              </div>
              <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", stat.change.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500')}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Attendance & AI Trend */}
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Campus Engagement Trends</h3>
            <div className="flex items-center gap-4 text-xs font-bold text-zinc-500">
               <div className="flex items-center gap-2"><div className="w-3 h-3 bg-violet-600 rounded-full" /> AI Chat Usage</div>
               <div className="flex items-center gap-2"><div className="w-3 h-3 bg-cyan-600 rounded-full" /> Attendance Rate</div>
            </div>
          </div>
          <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceTrend}>
                   <defs>
                      <linearGradient id="colorAI" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                         <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                         <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                   </defs>
                   <XAxis dataKey="month" stroke="#374151" fontSize={12} tickLine={false} axisLine={false} />
                   <YAxis hide />
                   <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px' }}
                      itemStyle={{ fontSize: '12px' }}
                   />
                   <Area type="monotone" dataKey="aiUsage" stroke="#7c3aed" strokeWidth={3} fillOpacity={1} fill="url(#colorAI)" />
                   <Area type="monotone" dataKey="attendance" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorAtt)" />
                </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Faculty Productivity */}
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-8">
          <h3 className="text-xl font-bold">Faculty Productivity Index</h3>
          <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={facultyPerf} layout="vertical">
                   <XAxis type="number" hide />
                   <YAxis dataKey="name" type="category" stroke="#fff" fontSize={12} width={100} tickLine={false} axisLine={false} />
                   <Tooltip 
                     cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                     contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px' }}
                   />
                   <Bar dataKey="score" radius={[0, 8, 8, 0]} barSize={32}>
                      {facultyPerf.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                   </Bar>
                </BarChart>
             </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center font-bold text-violet-400">QS</div>
                <div>
                   <p className="text-sm font-bold">Quality Score Target</p>
                   <p className="text-xs text-zinc-500">Based on institutional benchmarks</p>
                </div>
             </div>
             <span className="text-lg font-bold text-emerald-500">EXCEEDED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
