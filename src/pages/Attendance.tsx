import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, XCircle, Clock, Filter, Download, Plus, Search, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

import { useNavigate } from 'react-router-dom';

export function Attendance() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [studentAttendance, setStudentAttendance] = useState<any[]>([]);
  const [facultyClasses, setFacultyClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const isFaculty = profile?.role === 'faculty';

  useEffect(() => {
    async function fetchData() {
      if (!profile) return;
      setLoading(true);
      try {
        const headers = {
          'x-user-role': profile.role,
          'x-user-id': profile.uid
        };

        if (profile.role === 'student') {
          const res = await fetch('/api/student/attendance', { headers });
          const data = await res.json();
          setStudentAttendance(data);
        } else if (profile.role === 'faculty') {
          const res = await fetch('/api/faculty/classes', { headers });
          const data = await res.json();
          setFacultyClasses(data);
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [profile]);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold">
            {isFaculty ? "Class Attendance Insights" : "My Attendance Breakdown"}
           </h2>
           <p className="text-zinc-500 text-sm">
            {isFaculty ? "Overview of classes you teach and their overall attendance metrics." : "Detailed record of your subject-wise presence."}
           </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/10 transition-all">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          {isFaculty && (
            <button 
              onClick={() => window.location.href = '/faculty/attendance'}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 rounded-xl text-sm font-bold hover:bg-violet-500 transition-all shadow-lg shadow-violet-600/20"
            >
              <Plus className="w-4 h-4" />
              Mark Attendance
            </button>
          )}
        </div>
      </div>

      {!isFaculty ? (
        // STUDENT VIEW
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Present', value: studentAttendance.reduce((acc, curr) => acc + curr.attended, 0), color: 'text-emerald-500' },
              { label: 'Total Classes', value: studentAttendance.reduce((acc, curr) => acc + curr.total, 0), color: 'text-zinc-400' },
              { label: 'Avg. Attendance', value: `${Math.round(studentAttendance.reduce((acc, curr) => acc + curr.percentage, 0) / (studentAttendance.length || 1))}%`, color: 'text-violet-500' },
              { label: 'Shortage', value: studentAttendance.filter(s => s.percentage < 75).length, color: 'text-red-500' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-2">
                <p className="text-sm font-medium text-zinc-500">{stat.label}</p>
                <p className={cn("text-3xl font-bold", stat.color)}>{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
            <div className="p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.02]">
               <h3 className="font-bold">Subject-wise Records</h3>
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input placeholder="Filter subject..." className="bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-violet-500/50" />
               </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-zinc-500 text-xs uppercase tracking-wider">
                    <th className="px-8 py-5 font-semibold">Subject</th>
                    <th className="px-8 py-5 font-semibold">Attended</th>
                    <th className="px-8 py-5 font-semibold">Total</th>
                    <th className="px-8 py-5 font-semibold">Percentage</th>
                    <th className="px-8 py-5 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {studentAttendance.map((row, i) => (
                    <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-5 font-semibold text-sm">{row.subject}</td>
                      <td className="px-8 py-5 text-sm">{row.attended}</td>
                      <td className="px-8 py-5 text-sm">{row.total}</td>
                      <td className="px-8 py-5">
                         <div className="flex items-center gap-3">
                            <span className="text-sm font-bold">{row.percentage}%</span>
                            <div className="flex-1 w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                               <div 
                                className={cn("h-full", row.percentage >= 75 ? "bg-emerald-500" : "bg-red-500")} 
                                style={{ width: `${row.percentage}%` }} 
                               />
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                         <span className={cn(
                           "text-[10px] font-bold uppercase px-2 py-1 rounded-md",
                           row.percentage >= 75 ? "text-emerald-500 bg-emerald-500/10" : "text-red-500 bg-red-500/10"
                         )}>
                           {row.percentage >= 75 ? "Safe" : "Shortage"}
                         </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        // FACULTY VIEW
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Assigned Classes', value: facultyClasses.length, color: 'text-zinc-400' },
              { label: 'Avg. Attendance', value: '91%', color: 'text-emerald-500' },
              { label: 'Pending Reviews', value: '2', color: 'text-orange-500' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-2">
                <p className="text-sm font-medium text-zinc-500">{stat.label}</p>
                <p className={cn("text-3xl font-bold", stat.color)}>{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
             <div className="p-6 border-b border-white/10 bg-white/[0.02]">
                <h3 className="font-bold">Managed Classes</h3>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                    <tr className="text-zinc-500 text-xs uppercase tracking-wider">
                      <th className="px-8 py-5 font-semibold">Course Name</th>
                      <th className="px-8 py-5 font-semibold">Section</th>
                      <th className="px-8 py-5 font-semibold">Schedule</th>
                      <th className="px-8 py-5 font-semibold">Students</th>
                      <th className="px-8 py-5 font-semibold text-right">Quick Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {facultyClasses.map((cls, i) => (
                      <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="px-8 py-5 font-semibold text-sm">{cls.name}</td>
                        <td className="px-8 py-5 text-sm text-zinc-400">{cls.section}</td>
                        <td className="px-8 py-5 text-sm text-zinc-400">{cls.time} • {cls.room}</td>
                        <td className="px-8 py-5 text-sm">{cls.studentCount}</td>
                        <td className="px-8 py-5 text-right">
                           <button 
                            onClick={() => navigate(`/faculty/attendance?class=${cls.id}`)}
                            className="text-xs font-bold text-violet-400 hover:underline"
                           >
                              Mark Attendance
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
             </div>
          </div>
        </>
      )}
    </div>
  );
}
