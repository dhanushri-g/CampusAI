import React from 'react';
import { LayoutDashboard, Calendar, BookOpen, Clock, FileText, Bell, Users, MessageSquare, Settings, LogOut, GraduationCap, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../services/firebase';
import { cn } from '../../lib/utils';

const getNavItems = (role: string) => {
  const base = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Calendar, label: 'Attendance', path: '/attendance' },
    { icon: Clock, label: 'Timetable', path: '/timetable' },
    { icon: MessageSquare, label: 'AI Assistant', path: '/ai' },
    { icon: FileText, label: 'Assignments', path: '/assignments' },
    { icon: FileText, label: 'Leave Request', path: '/leave' },
  ];

  if (role === 'faculty') {
    return [
      ...base,
      { icon: Users, label: 'Mark Attendance', path: '/faculty/attendance' },
      { icon: BookOpen, label: 'Course Materials', path: '/materials' },
    ];
  }

  if (role === 'admin') {
    return [
      ...base,
      { icon: TrendingUp, label: 'Campus Analytics', path: '/admin/analytics' },
      { icon: Settings, label: 'System Settings', path: '/settings' },
    ];
  }

  return base;
};

export function Shell({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = getNavItems(profile?.role || 'student');

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 flex flex-col bg-[#050505] z-30">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-600/20 group cursor-pointer hover:rotate-12 transition-transform">
            <GraduationCap className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">CampusAI</span>
        </div>

        <nav className="flex-1 px-4 py-4 flex flex-col gap-1 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative",
                location.pathname === item.path 
                  ? "bg-violet-600/10 text-violet-400 border border-violet-500/20" 
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-5 h-5", location.pathname === item.path ? "text-violet-400 font-bold" : "group-hover:text-white")} />
              <span className="font-semibold text-sm">{item.label}</span>
              {location.pathname === item.path && (
                <motion.div layoutId="nav-active" className="absolute right-2 w-1.5 h-1.5 bg-violet-500 rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center font-bold">
              {profile?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{profile?.name}</p>
              <p className="text-xs text-zinc-500 truncate capitalize">{profile?.role}</p>
            </div>
          </div>
          <button 
            onClick={() => auth.signOut()}
            className="w-full mt-4 flex items-center gap-3 px-4 py-2 text-zinc-500 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative flex flex-col overflow-hidden bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.05)_0%,rgba(5,5,5,1)_100%)]">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-xl z-20">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">
              {navItems.find(i => i.path === location.pathname)?.label || 'Overview'}
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Search anything... (⌘K)" 
                className="bg-white/5 border border-white/10 rounded-full px-5 py-2 text-sm w-64 focus:outline-none focus:border-violet-500/50 transition-all font-sans"
              />
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-zinc-400 hover:text-white transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#050505]" />
              </button>
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 cursor-pointer">
                <img src={profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.name}`} alt="avatar" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
