import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Send, Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

export function LeaveRequest() {
  const { profile } = useAuth();
  const [form, setForm] = useState({ reason: '', type: 'Personal', startDate: '', endDate: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold">Leave Application</h2>
        <p className="text-zinc-500 mt-1">Submit your request for review by the academic {profile?.role === 'student' ? 'office' : 'administration'}.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-6">
             <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Reason for Leave</label>
                <textarea 
                  required
                  value={form.reason}
                  onChange={e => setForm({...form, reason: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-violet-500/50 min-h-[120px]"
                  placeholder="Describe your reason briefly..."
                />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Start Date</label>
                   <input 
                      type="date" 
                      required
                      value={form.startDate}
                      onChange={e => setForm({...form, startDate: e.target.value})}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">End Date</label>
                   <input 
                      type="date" 
                      required
                      value={form.endDate}
                      onChange={e => setForm({...form, endDate: e.target.value})}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50"
                   />
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Leave Type</label>
                <div className="flex flex-wrap gap-4">
                  {(profile?.role === 'student' ? ['Personal', 'Medical', 'Academic'] : ['Casual', 'Sick', 'Duty', 'Sabbatical']).map(t => (
                    <button 
                      key={t}
                      type="button"
                      onClick={() => setForm({...form, type: t})}
                      className={cn(
                        "flex-1 min-w-[100px] py-3 rounded-xl border text-sm font-bold transition-all",
                        form.type === t ? "bg-violet-600 border-violet-400 text-white" : "bg-white/5 border-white/10 text-zinc-500 hover:text-white"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
             </div>

             <button 
               type="submit"
               className="w-full py-4 bg-violet-600 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-violet-500 transition-all shadow-lg shadow-violet-600/20 group"
             >
               <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
               Submit Application
             </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 text-violet-400" />
              Recent Applications
            </h3>
            <div className="space-y-4">
              {[
                { date: '12 May', status: 'Approved', type: 'Medical' },
                { date: '05 May', status: 'Rejected', type: 'Personal' },
              ].map((h, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <div>
                    <p className="text-sm font-bold">{h.type} Leave</p>
                    <p className="text-[10px] text-zinc-500 uppercase">{h.date}</p>
                  </div>
                  <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", h.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500')}>
                    {h.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/20 p-6 rounded-[2rem] flex gap-4">
             <AlertCircle className="w-6 h-6 text-orange-500 mt-1 shrink-0" />
             <p className="text-xs text-orange-400 leading-relaxed font-bold uppercase tracking-wide">
                Ensure you attach official documentation for medical leaves to expedite processing.
             </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {submitted && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 right-10 bg-emerald-600 px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 text-white font-bold"
          >
            <CheckCircle className="w-6 h-6" />
            Application Submitted Successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
