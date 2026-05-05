import React from 'react';
import { motion } from 'motion/react';
import { Users, GraduationCap, TrendingUp, Shield, Settings, Activity, Monitor } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Control Center</h2>
          <p className="text-zinc-400 mt-1">Manage global campus operations and system analytics.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/master')}
          className="px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-[1.5rem] shadow-xl shadow-violet-600/30 transition-all flex items-center gap-3 active:scale-95"
        >
          <Monitor className="w-5 h-5" />
          System Hub (Access All)
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Students', value: '1,280', icon: Users, color: 'text-violet-400', bg: 'bg-violet-500/10' },
          { label: 'Active Faculty', value: '84', icon: GraduationCap, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
          { label: 'System Health', value: '99.9%', icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'AI Interactions', value: '4.2k', icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-500/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4">
            <div className={stat.bg + " w-12 h-12 rounded-2xl flex items-center justify-center"}>
              <stat.icon className={stat.color + " w-6 h-6"} />
            </div>
            <div>
              <p className="text-zinc-500 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-6">
          <h3 className="text-xl font-bold">Quick Management</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/admin/analytics')}
              className="p-6 bg-white/5 border border-white/5 rounded-3xl hover:bg-white/10 transition-all flex items-center gap-4 group"
            >
              <div className="p-3 bg-violet-600/10 rounded-xl group-hover:bg-violet-600 transition-colors">
                <TrendingUp className="w-5 h-5 text-violet-400 group-hover:text-white" />
              </div>
              <span className="font-bold">System Analytics</span>
            </button>
            <button 
              onClick={() => navigate('/admin/users')}
              className="p-6 bg-white/5 border border-white/5 rounded-3xl hover:bg-white/10 transition-all flex items-center gap-4 group"
            >
              <div className="p-3 bg-cyan-600/10 rounded-xl group-hover:bg-cyan-600 transition-colors">
                <Users className="w-5 h-5 text-cyan-400 group-hover:text-white" />
              </div>
              <span className="font-bold">User Ecosystem</span>
            </button>
            <button 
              onClick={() => navigate('/materials')}
              className="p-6 bg-white/5 border border-white/5 rounded-3xl hover:bg-white/10 transition-all flex items-center gap-4 group"
            >
              <div className="p-3 bg-orange-600/10 rounded-xl group-hover:bg-orange-600 transition-colors">
                <Shield className="w-5 h-5 text-orange-400 group-hover:text-white" />
              </div>
              <span className="font-bold">Content Control</span>
            </button>
            <button 
              onClick={() => navigate('/leave')}
              className="p-6 bg-white/5 border border-white/5 rounded-3xl hover:bg-white/10 transition-all flex items-center gap-4 group"
            >
              <div className="p-3 bg-emerald-600/10 rounded-xl group-hover:bg-emerald-600 transition-colors">
                <Settings className="w-5 h-5 text-emerald-400 group-hover:text-white" />
              </div>
              <span className="font-bold">Leave Approvals</span>
            </button>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-6">
          <h3 className="text-xl font-bold">Recent Activities</h3>
          <div className="space-y-4">
            {[
              { text: 'Server successfully backed up', time: '10 min ago', status: 'success' },
              { text: 'New faculty registration request', time: '1 hour ago', status: 'alert' },
              { text: 'High AI usage detected (Algorithms)', time: '2 hours ago', status: 'info' },
              { text: 'Leave policy updated by HR', time: 'Yesterday', status: 'success' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  activity.status === 'success' ? "bg-emerald-500" : activity.status === 'alert' ? "bg-orange-500" : "bg-cyan-500"
                )} />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{activity.text}</p>
                  <p className="text-xs text-zinc-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
