import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, X, Users, Search, Filter, Save, Calendar as CalendarIcon, Loader2, ChevronLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { useSearchParams, useNavigate } from 'react-router-dom';

export function FacultyAttendance() {
  const { profile } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const classId = searchParams.get('class');

  const [studentList, setStudentList] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchClasses() {
      if (!profile || profile.role !== 'faculty') return;
      try {
        const res = await fetch('/api/faculty/classes', {
          headers: {
            'x-user-role': profile.role,
            'x-user-id': profile.uid
          }
        });
        const data = await res.json();
        setClasses(data);
      } catch (err) {
        console.error("Error fetching classes:", err);
      }
    }
    fetchClasses();
  }, [profile]);

  useEffect(() => {
    async function fetchStudents() {
      if (!profile || !classId) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/faculty/class/${classId}/students`, {
          headers: {
            'x-user-role': profile.role,
            'x-user-id': profile.uid
          }
        });
        const data = await res.json();
        // Ensure all students have a default status if missing
        setStudentList(data.map((s: any) => ({ ...s, status: s.status || 'present' })));
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, [profile, classId]);

  const toggleStatus = (id: string) => {
    setStudentList(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'present' ? 'absent' : 'present' } : s));
  };

  const markAllPresent = () => {
    setStudentList(prev => prev.map(s => ({ ...s, status: 'present' })));
  };

  const handleSave = async () => {
    if (!profile || !classId) return;
    setSaving(true);
    try {
      const res = await fetch('/api/faculty/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': profile.role,
          'x-user-id': profile.uid
        },
        body: JSON.stringify({
          classId,
          date: new Date().toISOString(),
          attendanceData: studentList.map(s => ({ studentId: s.id, status: s.status }))
        })
      });
      
      if (res.ok) {
        alert('Attendance recorded successfully in CampusAI!');
        navigate('/attendance');
      }
    } catch (err) {
      console.error("Error saving attendance:", err);
      alert('Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = studentList.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.rollNo?.toLowerCase().includes(search.toLowerCase())
  );

  if (!classId) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold">Select Class</h2>
          <p className="text-zinc-500">Choose a class to mark attendance for today.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <div 
              key={cls.id}
              onClick={() => navigate(`/faculty/attendance?class=${cls.id}`)}
              className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:border-violet-500/50 cursor-pointer transition-all flex flex-col gap-4 group"
            >
              <div className="w-12 h-12 bg-violet-600/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                 <Users className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <h4 className="text-xl font-bold">{cls.name}</h4>
                <p className="text-zinc-500">{cls.section} • {cls.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
      </div>
    );
  }

  const selectedClass = classes.find(c => c.id === classId);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/faculty/attendance')}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-2xl font-bold">{selectedClass?.name || 'Class Attendance'}</h2>
            <p className="text-zinc-500 text-sm">
              {selectedClass?.section} • {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <button 
            onClick={markAllPresent}
            className="text-xs font-bold text-violet-400 hover:text-violet-300 px-3 py-2 bg-violet-600/10 rounded-xl transition-all"
           >
             Mark All Present
           </button>
           <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-violet-400" />
              <span>{studentList.filter(s => s.status === 'present').length}/{studentList.length} Present</span>
           </div>
           <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-violet-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-violet-500 transition-all disabled:opacity-50"
           >
             <Save className="w-4 h-4" />
             {saving ? 'Syncing...' : 'Save Attendance'}
           </button>
        </div>
      </header>

      <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student by name or roll..." 
              className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-violet-500/50"
            />
          </div>
          <button className="p-2 text-zinc-500 hover:text-white transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-zinc-500 text-xs uppercase tracking-wider">
                <th className="px-8 py-5 font-semibold">Student Name</th>
                <th className="px-8 py-5 font-semibold">Roll Number</th>
                <th className="px-8 py-5 font-semibold">Status</th>
                <th className="px-8 py-5 font-semibold text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold ring-1 ring-white/5">
                        {student.name.charAt(0)}
                      </div>
                      <span className="font-semibold">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-zinc-400 text-sm">{student.rollNo}</td>
                  <td className="px-8 py-5">
                    <button 
                      onClick={() => toggleStatus(student.id)}
                      className={cn(
                        "px-4 py-1 rounded-full text-[10px] font-bold uppercase transition-all flex items-center gap-2",
                        student.status === 'present' 
                          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                          : "bg-red-500/10 text-red-500 border border-red-500/20 shadow-lg shadow-red-500/5"
                      )}
                    >
                      {student.status === 'present' ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      {student.status}
                    </button>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => toggleStatus(student.id)}
                      className="text-xs text-zinc-600 hover:text-violet-400 font-bold transition-colors"
                    >
                      Change
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
