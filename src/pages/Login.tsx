import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, GraduationCap, Github, Users, ShieldCheck } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../services/firebase';

export function Login() {
  const [error, setError] = useState('');

  const handleLogin = async (selectedRole: 'student' | 'faculty' | 'admin') => {
    try {
      sessionStorage.setItem('preferred_role', selectedRole);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/20 blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full bg-white/5 border border-white/10 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-violet-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-violet-600/40 mb-6">
            <GraduationCap className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome to CampusAI</h1>
          <p className="text-zinc-400 mt-2 text-center">The intelligent ecosystem for the modern campus.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <p className="text-center text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4">Select Domain Identity</p>
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleLogin('student')}
              className="flex flex-col items-center gap-3 p-6 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-violet-600/10 hover:border-violet-500/30 transition-all group"
            >
              <div className="w-14 h-14 bg-violet-600/10 rounded-2xl flex items-center justify-center group-hover:bg-violet-600 group-hover:scale-110 transition-all">
                <Users className="text-violet-400 group-hover:text-white w-7 h-7" />
              </div>
              <span className="text-sm font-black uppercase tracking-wider">Student</span>
            </button>
            <button 
              onClick={() => handleLogin('faculty')}
              className="flex flex-col items-center gap-3 p-6 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-cyan-600/10 hover:border-cyan-500/30 transition-all group"
            >
              <div className="w-14 h-14 bg-cyan-600/10 rounded-2xl flex items-center justify-center group-hover:bg-cyan-600 group-hover:scale-110 transition-all">
                <GraduationCap className="text-cyan-400 group-hover:text-white w-7 h-7" />
              </div>
              <span className="text-sm font-black uppercase tracking-wider">Faculty</span>
            </button>
          </div>

          <button 
            onClick={() => handleLogin('admin')}
            className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-orange-600/10 to-orange-500/5 border border-orange-500/20 rounded-[2rem] hover:from-orange-600/20 hover:border-orange-500/40 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-600/10 rounded-xl flex items-center justify-center group-hover:bg-orange-600 group-hover:scale-110 transition-all">
                <ShieldCheck className="text-orange-400 group-hover:text-white w-6 h-6" />
              </div>
              <div className="text-left">
                <span className="text-sm font-black uppercase tracking-wider block text-white">Principal / Chairperson</span>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Executive Institutional Control</span>
              </div>
            </div>
            <LogIn className="w-5 h-5 text-zinc-600 group-hover:text-orange-400 transition-colors" />
          </button>

          <p className="text-center text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em] pt-4">Choose role to continue with Google</p>
        </div>

        <p className="text-center text-zinc-500 text-[10px] font-medium mt-10">
          By signing in, you agree to our <span className="text-zinc-300 underline underline-offset-4 pointer">Terms</span> and <span className="text-zinc-300 underline underline-offset-4 pointer">Privacy Policy</span>.
        </p>
      </motion.div>
    </div>
  );
}
