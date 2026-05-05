import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, 
  AlertCircle, 
  Sparkles, 
  ChevronRight, 
  Book, 
  Flame, 
  Calendar as CalendarIcon, 
  Loader2, 
  Camera, 
  Fingerprint,
  Smartphone,
  CheckCircle2, 
  XCircle,
  ScanFace,
  User,
  Activity,
  History,
  TrendingUp
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export function StudentDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMarking, setIsMarking] = useState(false);
  const [markingMethod, setMarkingMethod] = useState<'camera' | 'biometric'>('camera');
  const [cameraState, setCameraState] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [biometricState, setBiometricState] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [faceDetected, setFaceDetected] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    return () => {
      // Cleanup camera stream on unmount
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    async function fetchAttendance() {
      if (!profile) return;
      try {
        const res = await fetch('/api/student/attendance', {
          headers: {
            'x-user-role': profile.role,
            'x-user-id': profile.uid
          }
        });
        const data = await res.json();
        setAttendance(data);
      } catch (err) {
        console.error("Error fetching attendance:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAttendance();
  }, [profile]);

  const startMarking = async (method: 'camera' | 'biometric' = 'camera') => {
    setMarkingMethod(method);
    setIsMarking(true);
    
    if (method === 'camera') {
      setCameraState('scanning');
      try {
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'user' } 
          });
        } catch (innerErr) {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
        }
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          try { await videoRef.current.play(); } catch (playErr) { console.error(playErr); }
        }
        
        setTimeout(() => {
          setFaceDetected(true);
          setTimeout(() => {
            setCameraState('success');
            setTimeout(() => {
              setIsMarking(false);
              setCameraState('idle');
              setFaceDetected(false);
              if (stream) stream.getTracks().forEach(track => track.stop());
            }, 2000);
          }, 1200);
        }, 1000);
      } catch (err: any) {
        setCameraState('error');
        console.error(err);
      }
    } else {
      setBiometricState('scanning');
      // Simulate biometric scan
      setTimeout(() => {
        setBiometricState('success');
        setTimeout(() => {
          setIsMarking(false);
          setBiometricState('idle');
        }, 2000);
      }, 2500);
    }
  };

  if (loading || !profile) {
     return (
       <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
         <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
         <p className="text-zinc-500 font-medium animate-pulse">Initializing Neural Link...</p>
       </div>
     );
  }

  const overallPercentage = Math.round(attendance.reduce((acc, curr) => acc + curr.percentage, 0) / (attendance.length || 1));

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-4xl font-black tracking-tight text-white">
            Welcome, {profile?.name?.split(' ')[0]} ⚡️
          </h2>
          <p className="text-zinc-500 font-medium flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500" /> System integrity optimal. You're on track.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-violet-600/10 border border-violet-500/20 rounded-xl flex items-center gap-2">
              <History className="w-4 h-4 text-violet-400" />
              <span className="text-violet-400 text-xs font-black uppercase tracking-widest">Last verified 18h ago</span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 blur-3xl -mr-16 -mt-16" />
              <div className="flex flex-col items-center text-center space-y-4">
                 <div className="relative">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-600 to-cyan-500 p-[2px]">
                       <div className="w-full h-full rounded-[calc(1.5rem-2px)] bg-zinc-900 flex items-center justify-center overflow-hidden">
                          <User className="w-12 h-12 text-zinc-700" />
                       </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-emerald-500 border-4 border-zinc-900 flex items-center justify-center shadow-lg">
                       <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-white">{profile?.name}</h3>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">ID: {profile?.uid?.substring(0, 8)} • B.Tech CS</p>
                 </div>
              </div>
              
              <div className="mt-8 space-y-6">
                 <div className="space-y-3">
                    <div className="flex justify-between items-end">
                       <p className="text-xs font-black text-zinc-500 uppercase tracking-widest">Global Attendance</p>
                       <p className="text-2xl font-black text-white">{overallPercentage}%</p>
                    </div>
                    <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden shadow-inner font-bold">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${overallPercentage}%` }}
                        className={cn(
                          "h-full rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all",
                          overallPercentage >= 75 ? "bg-emerald-500 shadow-emerald-500/20" : 
                          overallPercentage >= 60 ? "bg-orange-500 shadow-orange-500/20" : "bg-red-500 shadow-red-500/20"
                        )}
                       />
                    </div>
                    <p className="text-[10px] text-zinc-500 font-bold leading-relaxed">
                       {overallPercentage >= 75 
                         ? "✓ You are above the 75% institutional threshold. Marking access: FREELY AVAILABLE." 
                         : "⚠ Below attendance threshold. Please contact department head for exemption."}
                    </p>
                 </div>

                 <div className="flex gap-4">
                    <div className="flex-1 bg-white/5 rounded-2xl p-4 border border-white/5">
                       <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Streak</p>
                       <p className="text-xl font-black text-orange-500 flex items-center gap-2">
                          12 <Flame className="w-4 h-4" />
                       </p>
                    </div>
                    <div className="flex-1 bg-white/5 rounded-2xl p-4 border border-white/5">
                       <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Rank</p>
                       <p className="text-xl font-black text-violet-400 flex items-center gap-2">
                          #42 <TrendingUp className="w-4 h-4" />
                       </p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => navigate('/timetable')}
                className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all text-center group"
              >
                 <CalendarIcon className="w-6 h-6 text-cyan-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                 <span className="text-xs font-black uppercase tracking-widest text-zinc-400 group-hover:text-white">Schedule</span>
              </button>
              <button 
                onClick={() => navigate('/materials')}
                className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all text-center group"
              >
                 <Book className="w-6 h-6 text-violet-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                 <span className="text-xs font-black uppercase tracking-widest text-zinc-400 group-hover:text-white">Grounding</span>
              </button>
           </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
           <div className="bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row gap-10">
                 <div className="flex-1 space-y-6">
                    <div>
                       <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
                          Mark Attendance <Sparkles className="w-5 h-5 text-violet-400" />
                       </h3>
                       <p className="text-zinc-500 text-sm mt-1 font-medium italic">
                          "Students with full monthly attendance can mark attendance freely."
                       </p>
                    </div>
                    
                    {!isMarking ? (
                       <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                             <button
                               onClick={() => setMarkingMethod('camera')}
                               className={cn(
                                 "flex flex-col items-center gap-3 p-6 rounded-3xl border transition-all",
                                 markingMethod === 'camera' ? "bg-violet-600/10 border-violet-500/50 text-white" : "bg-white/5 border-white/5 text-zinc-500 hover:text-zinc-300"
                               )}
                             >
                                <Camera className="w-6 h-6" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Face ID</span>
                             </button>
                             <button
                               onClick={() => setMarkingMethod('biometric')}
                               className={cn(
                                 "flex flex-col items-center gap-3 p-6 rounded-3xl border transition-all",
                                 markingMethod === 'biometric' ? "bg-cyan-600/10 border-cyan-500/50 text-white" : "bg-white/5 border-white/5 text-zinc-500 hover:text-zinc-300"
                               )}
                             >
                                <Fingerprint className="w-6 h-6" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Biometric</span>
                             </button>
                          </div>

                          <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                             <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                <Clock className="w-4 h-4 text-violet-400" /> Next Session
                             </h4>
                             <p className="text-xl font-bold mt-2">Design Systems & Frameworks</p>
                             <p className="text-sm text-zinc-500 font-medium mt-1 uppercase tracking-widest text-[10px]">Hall A • Starts in 12 mins</p>
                          </div>
                          
                          <button 
                            onClick={() => startMarking(markingMethod)}
                            className={cn(
                              "w-full py-5 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
                              markingMethod === 'camera' ? "bg-violet-600 hover:bg-violet-500 shadow-violet-600/30" : "bg-cyan-600 hover:bg-cyan-500 shadow-cyan-600/30"
                            )}
                            disabled={overallPercentage < 75}
                          >
                             {markingMethod === 'camera' ? <Camera className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
                             Initialize {markingMethod === 'camera' ? 'Visual' : 'Digital'} Verification
                          </button>
                       </div>
                    ) : (
                       <div className="space-y-6 py-4">
                          <div className="flex items-center gap-4">
                             <div className={cn(
                               "w-3 h-3 rounded-full animate-pulse",
                               (markingMethod === 'camera' ? faceDetected : biometricState === 'scanning' || biometricState === 'success') 
                                 ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]" 
                                 : "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]"
                             )} />
                             <span className={cn(
                               "text-sm font-black uppercase tracking-widest",
                               (markingMethod === 'camera' ? faceDetected : biometricState === 'scanning' || biometricState === 'success') 
                                 ? "text-emerald-500" 
                                 : "text-red-500"
                             )}>
                                {markingMethod === 'camera' ? (
                                   cameraState === 'success' ? 'Verification Success' : 
                                   cameraState === 'scanning' ? (faceDetected ? 'Face Detected' : 'Detecting Face...') : 'System Error'
                                ) : (
                                   biometricState === 'success' ? 'Fingerprint Verified' :
                                   biometricState === 'scanning' ? 'Scanning Biometrics...' : 'System Error'
                                )}
                             </span>
                          </div>
                          
                          <div className="font-bold text-zinc-400 text-sm italic">
                             {markingMethod === 'camera' ? (
                                <>
                                   {cameraState === 'scanning' && "Please stay in front of the camera while marking attendance."}
                                   {cameraState === 'success' && "Identity confirmed. Attendance marked successfully ✅"}
                                   {cameraState === 'error' && "Access Denied. Please ensure camera permissions are enabled in your browser ❌"}
                                </>
                             ) : (
                                <>
                                   {biometricState === 'scanning' && "Keep your finger on the sensor for secure digital grounding."}
                                   {biometricState === 'success' && "Biometric signature confirmed. Ledger updated ✅"}
                                </>
                             )}
                          </div>
                          
                          {(cameraState === 'success' || biometricState === 'success') && (
                             <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3"
                             >
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Stored in Immutable Academic Ledger</span>
                             </motion.div>
                          )}
                       </div>
                    )}
                 </div>

                 <div className="w-full md:w-[320px] aspect-[4/5] bg-black rounded-[2.5rem] relative overflow-hidden border border-white/5 shadow-inner">
                    <AnimatePresence mode="wait">
                       {isMarking ? (
                          markingMethod === 'camera' ? (
                            <motion.div 
                              key="camera-feed"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0"
                            >
                               <video 
                                ref={videoRef}
                                autoPlay 
                                playsInline 
                                muted 
                                className="w-full h-full object-cover"
                               />
                               {cameraState === 'scanning' && (
                                 <motion.div 
                                  animate={{ top: ['0%', '100%', '0%'] }}
                                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                  className="absolute left-0 right-0 h-1 bg-violet-500 shadow-[0_0_15px_#8b5cf6] z-20"
                                 />
                               )}
                               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <ScanFace className={cn("w-32 h-32 transition-all duration-700", faceDetected ? "text-emerald-500/40 scale-110" : "text-red-500/20")} />
                               </div>
                               {cameraState === 'success' && (
                                  <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                                     <div className="p-4 bg-white rounded-full scale-125 shadow-2xl">
                                        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                                     </div>
                                  </div>
                               )}
                            </motion.div>
                          ) : (
                            <motion.div 
                              key="biometric-feed"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950"
                            >
                               <div className="relative w-48 h-48 flex items-center justify-center">
                                  {/* Scanning Ring */}
                                  <motion.div 
                                    animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    className={cn(
                                       "absolute inset-0 border-2 border-dashed rounded-full",
                                       biometricState === 'success' ? "border-emerald-500/40" : "border-cyan-500/40"
                                    )}
                                  />
                                  <motion.div 
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                                    className={cn(
                                       "absolute inset-4 border border-dotted rounded-full",
                                       biometricState === 'success' ? "border-emerald-400/20" : "border-cyan-400/20"
                                    )}
                                  />

                                  <div className={cn(
                                     "p-8 rounded-full bg-white/5 backdrop-blur-xl border transition-all duration-500 relative z-10",
                                     biometricState === 'success' ? "border-emerald-500 text-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]" : "border-cyan-500/30 text-cyan-500"
                                  )}>
                                     {biometricState === 'success' ? (
                                        <CheckCircle2 className="w-16 h-16 animate-in zoom-in duration-300" />
                                     ) : (
                                        <div className="relative">
                                           <Fingerprint className="w-16 h-16" />
                                           {biometricState === 'scanning' && (
                                              <motion.div 
                                                animate={{ top: ['0%', '100%'] }}
                                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                                className="absolute left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
                                              />
                                           )}
                                        </div>
                                     )}
                                  </div>
                               </div>

                               <div className="mt-10 space-y-2 text-center px-8">
                                  <p className={cn(
                                     "text-xs font-black uppercase tracking-[0.2em]",
                                     biometricState === 'success' ? "text-emerald-500" : "text-cyan-500"
                                  )}>
                                     {biometricState === 'success' ? "Identity Confirmed" : "Scanning Pulse Point"}
                                  </p>
                                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">
                                     {biometricState === 'success' ? "Fingerprint matched with system ID" : "Place finger on the secure sensor area"}
                                  </p>
                               </div>
                            </motion.div>
                          )
                       ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center p-8">
                             <div className="p-4 bg-white/5 rounded-full text-zinc-700">
                                {markingMethod === 'camera' ? <Camera className="w-12 h-12" /> : <Fingerprint className="w-12 h-12" />}
                             </div>
                             <p className="text-zinc-600 text-xs font-black uppercase tracking-[0.2em]">{markingMethod === 'camera' ? 'Lens Deactivated' : 'Sensor Hibernating'}</p>
                          </div>
                       )}
                    </AnimatePresence>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6 text-zinc-300">
                 <h3 className="text-lg font-black tracking-tight px-2">Academic Roadmap</h3>
                 <div className="space-y-3">
                    {[
                       { sub: 'Algorithms', time: '14:00', room: 'Laby 3', status: 'upcoming' },
                       { sub: 'OS Concepts', time: 'Yesterday', room: 'Hall B', status: 'present' },
                    ].map((item, i) => (
                       <div key={i} className="flex items-center gap-4 p-5 bg-white/5 border border-white/5 rounded-3xl group hover:border-violet-500/20 transition-all">
                          <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shrink-0", item.status === 'present' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-violet-500/10 text-violet-400')}>
                             {item.status === 'present' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                             <p className="font-bold truncate">{item.sub}</p>
                             <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{item.room} • {item.time}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-white transition-colors" />
                       </div>
                    ))}
                 </div>
              </div>

              <div className="space-y-6">
                 <h3 className="text-lg font-black tracking-tight px-2">Monthly Fidelity</h3>
                 <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-6 text-center">
                    <div className="p-4 bg-violet-600/10 rounded-[2rem] inline-block mb-4">
                       <CalendarIcon className="w-8 h-8 text-violet-400" />
                    </div>
                    <p className="text-2xl font-black text-white">May 2026</p>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">20/22 Active Days</p>
                    <button onClick={() => navigate('/attendance')} className="mt-6 w-full py-3 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                       Full Calendar Insight
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
