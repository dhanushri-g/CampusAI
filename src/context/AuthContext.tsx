import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'admin';
  department?: string;
  semester?: string;
  avatar?: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      try {
        console.log("[AUTH] State changed. User:", user?.email);
        setUser(user);
        
        if (user) {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          const preferredRole = sessionStorage.getItem('preferred_role') as 'student' | 'faculty' | 'admin';
          
          if (docSnap.exists()) {
            const currentProfile = docSnap.data() as UserProfile;
            setProfile(currentProfile); // Set immediately so UI doesn't hang

            if (preferredRole && preferredRole !== currentProfile.role) {
              try {
                console.log(`[AUTH] Switching role to: ${preferredRole}`);
                const updatedProfile = { ...currentProfile, role: preferredRole };
                await setDoc(docRef, updatedProfile, { merge: true });
                setProfile(updatedProfile);
              } catch (updateErr) {
                console.error("[AUTH] Failed to update role in DB:", updateErr);
              }
            }
          } else {
            const roleToSet = preferredRole || 'student';
            console.log(`[AUTH] Creating new profile with role: ${roleToSet}`);
            
            const newProfile: UserProfile = {
              uid: user.uid,
              name: user.displayName || 'User',
              email: user.email || '',
              role: roleToSet,
            };
            
            try {
              await setDoc(docRef, newProfile);
              setProfile(newProfile);
            } catch (createErr) {
              console.error("[AUTH] Failed to create profile in DB:", createErr);
              // Fallback: set profile locally even if write fails initially
              setProfile(newProfile);
            }
          }
          // Always clear after processing
          sessionStorage.removeItem('preferred_role');
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error("[AUTH] Error in auth observer:", err);
      } finally {
        setLoading(false);
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
