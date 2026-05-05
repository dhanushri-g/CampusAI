import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Shell } from './components/layout/Shell';
import { VoiceButton } from './components/VoiceAssistant';
import { StudentDashboard } from './pages/StudentDashboard';
import { FacultyDashboard } from './pages/FacultyDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Attendance } from './pages/Attendance';
import { Login } from './pages/Login';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { Timetable } from './pages/Timetable';
import { FacultyAttendance } from './pages/FacultyAttendance';
import { AdminAnalytics } from './pages/AdminAnalytics';
import { AdminUserManagement } from './pages/AdminUserManagement';
import { AdminMasterDashboard } from './pages/AdminMasterDashboard';
import { PrincipalDashboard } from './pages/PrincipalDashboard';
import { LeaveRequest } from './pages/LeaveRequest';
import { MaterialsPage } from './pages/MaterialsPage';
import { chatWithAI } from './services/ai';
import { useNavigate } from 'react-router-dom';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  const handleAICommand = async (text: string) => {
    try {
      const history = []; // Could fetch actual history here
      const response = await chatWithAI(text, history);
      const parts = response.split('|');
      const message = parts[0]?.trim();
      const commandStr = parts[1]?.trim();

      if (commandStr) {
        const command = JSON.parse(commandStr);
        if (command.action === 'NAVIGATE') {
          navigate(command.path);
        }
      }
      
      console.log('AI Response:', message);
    } catch (err) {
      console.error('AI Command Error:', err);
    }
  };

  if (loading) return <div className="h-screen bg-[#050505] flex flex-col items-center justify-center gap-4 text-violet-500 font-bold">
    <div className="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
    <p className="animate-pulse tracking-widest uppercase text-xs">Loading CampusAI</p>
  </div>;

  // Handle case where user is logged in but profile failed to fetch
  if (user && !profile) {
    return (
      <div className="h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-500/10 p-6 rounded-[2rem] border border-red-500/20 max-w-sm">
          <h2 className="text-xl font-bold text-white mb-2">Profile Sync Error</h2>
          <p className="text-zinc-500 text-sm mb-6">We couldn't retrieve your CampusAI identity. This might be a temporary connection issue.</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all border border-white/10"
           skill="frontend-design"
          >
            Retry Sync
          </button>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route
        path="/*"
        element={
          user ? (
            <Shell>
              <Routes>
                {/* Unified Access Route */}
                <Route path="/" element={
                  profile?.role === 'student' ? <StudentDashboard /> :
                  profile?.role === 'faculty' ? <FacultyDashboard /> :
                  profile?.role === 'admin' ? <PrincipalDashboard /> :
                  <Navigate to="/login" />
                } />
                
                {/* Specific Role Dashboards (Explicit routes) */}
                <Route path="/student-dashboard" element={profile?.role === 'student' ? <StudentDashboard /> : <Navigate to="/" />} />
                <Route path="/faculty-dashboard" element={profile?.role === 'faculty' ? <FacultyDashboard /> : <Navigate to="/" />} />
                <Route path="/admin-dashboard" element={profile?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />

                <Route path="/attendance" element={<Attendance />} />
                <Route path="/timetable" element={<Timetable />} />
                <Route path="/ai" element={<AIAssistantPage />} />
                <Route path="/leave" element={<LeaveRequest />} />
                <Route path="/materials" element={<MaterialsPage />} />
                
                {/* Faculty Specific */}
                {profile?.role !== 'student' && (
                  <Route path="/faculty/attendance" element={<FacultyAttendance />} />
                )}

                {/* Admin Specific */}
                {profile?.role === 'admin' && (
                  <>
                    <Route path="/admin" element={<PrincipalDashboard />} />
                    <Route path="/admin/analytics" element={<AdminAnalytics />} />
                    <Route path="/admin/users" element={<AdminUserManagement />} />
                    <Route path="/admin/master" element={<AdminMasterDashboard />} />
                  </>
                )}

                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
              <VoiceButton onResult={handleAICommand} />
            </Shell>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
