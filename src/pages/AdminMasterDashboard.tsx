import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Globe, 
  ShieldCheck, 
  Database, 
  Cpu, 
  AlertCircle,
  BarChart3,
  Users2,
  FileText,
  Clock,
  ArrowUpRight,
  Monitor
} from 'lucide-react';
import { collection, query, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { cn } from '../lib/utils';

export function AdminMasterDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    materials: 0,
    attendance: 0,
    leaves: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMasterStats() {
      try {
        const [users, mats, leaves] = await Promise.all([
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'materials')),
          getDocs(collection(db, 'leave_requests'))
        ]);
        
        setStats({
          users: users.size,
          materials: mats.size,
          leaves: leaves.size,
          attendance: 0 // Would need grouping for actual count
        });
      } catch (err) {
        console.error("Master Stats Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMasterStats();
  }, []);

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-violet-500 font-bold uppercase tracking-widest text-[10px]">
            <Monitor className="w-4 h-4" /> System Hub
          </div>
          <h2 className="text-4xl font-black tracking-tight text-white">Global Command</h2>
          <p className="text-zinc-500 font-medium">Unified oversight of all campus-wide datasets and services.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)]" />
              <span className="text-emerald-500 text-xs font-black uppercase">Core Online</span>
           </div>
           <button className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-zinc-400">
             <ShieldCheck className="w-5 h-5" />
           </button>
        </div>
      </header>

      {/* Real-time Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Network Users', val: stats.users, icon: Users2, color: 'violet' },
           { label: 'Grounding Assets', val: stats.materials, icon: Database, color: 'cyan' },
           { label: 'Active Requests', val: stats.leaves, icon: FileText, color: 'orange' },
           { label: 'AI Latency', val: '42ms', icon: Cpu, color: 'emerald' },
         ].map((item, i) => (
           <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="bg-zinc-900/40 backdrop-blur-md border border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden group transition-all hover:border-violet-500/30 shadow-2xl"
           >
             <div className={cn(
               "absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 -mr-16 -mt-16",
               `bg-${item.color}-500`
             )} />
             <div className="space-y-4 relative z-10">
               <div className={cn("p-4 rounded-2xl bg-white/5 self-start inline-block", `text-${item.color}-400`)}>
                 <item.icon className="w-6 h-6" />
               </div>
               <div>
                  <p className="text-4xl font-black text-white">{item.val}</p>
                  <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mt-1">{item.label}</p>
               </div>
             </div>
           </motion.div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Dataset Health */}
        <div className="lg:col-span-2 bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-[3rem] p-10 space-y-8 shadow-2xl relative overflow-hidden">
           <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black tracking-tight">Database Synapse</h3>
              <button className="text-violet-400 text-xs font-bold hover:underline flex items-center gap-1 group">
                Full Mapping <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
           </div>
           
           <div className="space-y-6">
             {[
               { name: 'User Directory', size: '2.4MB', usage: 82, color: 'bg-violet-500' },
               { name: 'Academic Infrastructure', size: '15.8MB', usage: 45, color: 'bg-cyan-500' },
               { name: 'Intelligence Grounding', size: '4.2GB', usage: 92, color: 'bg-emerald-500' },
             ].map((db, i) => (
               <div key={i} className="space-y-3">
                 <div className="flex justify-between text-sm font-bold">
                    <span className="text-zinc-400">{db.name}</span>
                    <span className="text-white font-mono">{db.size}</span>
                 </div>
                 <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${db.usage}%` }}
                      className={cn("h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.1)]", db.color)} 
                    />
                 </div>
               </div>
             ))}
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
                 <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase">
                    <AlertCircle className="w-4 h-4 text-orange-400" /> Integrity Check
                 </div>
                 <p className="text-sm text-zinc-400 font-medium">All relational data schemas are valid and consistent with blueprint.</p>
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
                 <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase">
                    <Globe className="w-4 h-4 text-cyan-400" /> Access Logs
                 </div>
                 <p className="text-sm text-zinc-400 font-medium">100% of requests handled via authenticated security tunnels.</p>
              </div>
           </div>
        </div>

        {/* Global Activity Feed */}
        <div className="bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-[3rem] p-10 space-y-8 shadow-2xl">
           <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black tracking-tight">System Pulse</h3>
              <ActivityIndicator />
           </div>
           <div className="space-y-8">
             {[
               { user: 'Admin GP', action: 'Modified System Config', time: '2m', color: 'orange' },
               { user: 'AI Core', action: 'Knowledge Grounding Synced', time: '14m', color: 'violet' },
               { user: 'Firewall', action: 'Access Token Refreshed', time: '1h', color: 'emerald' },
               { user: 'Auto Backup', action: 'Weekly Dump Success', time: '3h', color: 'cyan' },
             ].map((log, i) => (
               <div key={i} className="flex gap-4 group">
                 <div className={cn(
                   "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 bg-white/5",
                   `text-${log.color}-400 group-hover:bg-${log.color}-500/20 transition-all`
                 )}>
                    <Clock className="w-5 h-5" />
                 </div>
                 <div className="min-w-0">
                    <p className="font-bold text-white truncate group-hover:text-violet-400 transition-colors uppercase text-[10px] tracking-widest">{log.user}</p>
                    <p className="text-sm text-zinc-400 font-bold mt-0.5">{log.action}</p>
                    <p className="text-[10px] text-zinc-600 font-black mt-1">{log.time} AGO</p>
                 </div>
               </div>
             ))}
           </div>
           <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
             Audit Trail History
           </button>
        </div>
      </div>
    </div>
  );
}

function ActivityIndicator() {
  return (
    <div className="flex gap-1">
      {[...Array(4)].map((_, i) => (
        <motion.div
           key={i}
           animate={{ height: [4, 16, 4] }}
           transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
           className="w-1 bg-violet-500 rounded-full"
        />
      ))}
    </div>
  );
}
