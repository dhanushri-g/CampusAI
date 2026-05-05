import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  UserPlus, 
  Shield, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  XCircle,
  Mail,
  Smartphone,
  Calendar,
  Lock,
  ChevronDown
} from 'lucide-react';
import { collection, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { cn } from '../lib/utils';

interface SystemUser {
  uid: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'admin';
  department?: string;
  semester?: string;
  avatar?: string;
  createdAt?: any;
  status?: 'active' | 'suspended' | 'pending';
}

export function AdminUserManagement() {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'student' | 'faculty' | 'admin'>('all');
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const q = query(collection(db, 'users'));
        const snap = await getDocs(q);
        const userData = snap.docs.map(d => ({ ...d.data(), uid: d.id })) as SystemUser[];
        setUsers(userData);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => {
    const matchesSearch = (u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = filter === 'all' || u.role === filter;
    return matchesSearch && matchesFilter;
  });

  const toggleStatus = async (uid: string, currentStatus?: string) => {
    const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    try {
      await updateDoc(doc(db, 'users', uid), { status: newStatus });
      setUsers(prev => prev.map(u => u.uid === uid ? { ...u, status: newStatus as any } : u));
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
            User Ecosystem
          </h2>
          <p className="text-zinc-500 mt-2">Manage profiles, permissions, and roles across the entire CampusAI network.</p>
        </div>
        <button className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-2xl transition-all flex items-center gap-2 group">
          <UserPlus className="w-5 h-5 text-violet-400 group-hover:scale-110 transition-transform" />
          Provision User
        </button>
      </header>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Accounts', value: users.length, color: 'text-violet-400' },
          { label: 'Faculty Members', value: users.filter(u => u.role === 'faculty').length, color: 'text-cyan-400' },
          { label: 'Students', value: users.filter(u => u.role === 'student').length, color: 'text-emerald-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-3xl">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
            <p className={cn("text-3xl font-black mt-2", stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-violet-500 transition-colors" />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or ID..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-violet-500/50 transition-all font-medium"
          />
        </div>
        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10">
          {(['all', 'student', 'faculty', 'admin'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all",
                filter === t ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20" : "text-zinc-500 hover:text-white"
              )}
            >
              {t}s
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-zinc-900/40 backdrop-blur-sm border border-white/10 rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-8 py-6 text-left text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <Users className="w-4 h-4" /> User Profile
                </th>
                <th className="px-8 py-6 text-left text-xs font-black text-zinc-500 uppercase tracking-widest">Role</th>
                <th className="px-8 py-6 text-left text-xs font-black text-zinc-500 uppercase tracking-widest">Department</th>
                <th className="px-8 py-6 text-left text-xs font-black text-zinc-500 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-right text-xs font-black text-zinc-500 uppercase tracking-widest">Controls</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <motion.tr 
                  layout
                  key={user.uid}
                  className="group hover:bg-white/[0.02] transition-colors border-b border-white/5 last:border-none"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600/20 to-cyan-600/20 flex items-center justify-center font-black text-violet-400 shrink-0 border border-white/5">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-white truncate">{user.name}</p>
                        <p className="text-sm text-zinc-500 truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border",
                      user.role === 'admin' ? "bg-orange-500/10 text-orange-400 border-orange-500/20" :
                      user.role === 'faculty' ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" :
                      "bg-violet-500/10 text-violet-400 border-violet-500/20"
                    )}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm text-zinc-400 font-medium font-mono">
                    {user.department || '--'}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <div className={cn(
                         "w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]",
                         user.status === 'suspended' ? "text-red-500 bg-red-500" : "text-emerald-500 bg-emerald-500"
                       )} />
                       <span className={cn(
                         "text-xs font-bold",
                         user.status === 'suspended' ? "text-red-400" : "text-emerald-400"
                       )}>
                         {user.status === 'suspended' ? 'Suspended' : 'Active'}
                       </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button 
                        onClick={() => toggleStatus(user.uid, user.status)}
                        className="p-2.5 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-zinc-400 hover:text-white"
                        title={user.status === 'suspended' ? 'Activate' : 'Suspend'}
                       >
                         {user.status === 'suspended' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                       </button>
                       <button className="p-2.5 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-zinc-400 hover:text-white">
                         <MoreVertical className="w-5 h-5" />
                       </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && !loading && (
             <div className="py-20 text-center">
                <Search className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500 font-medium">No users found matching your search criteria.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
