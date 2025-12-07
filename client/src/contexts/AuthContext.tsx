// Authentication context to manage user session state across the app
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { TutorProfile } from '@shared/schema';

// User roles
export type UserRole = 'student' | 'tutor' | 'admin' | null;

interface AuthContextType {
  user: User | null;
  tutorProfile: TutorProfile | null;
  userRole: UserRole;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  tutorSignUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  tutorSignIn: (email: string, password: string) => Promise<{ error?: string }>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  adminSignIn: (username: string, password: string) => Promise<{ error?: string }>;
  adminSignOut: () => void;
  isAdmin: boolean;
  refreshTutorProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin credentials (hashed comparison happens server-side for security)
const ADMIN_USERNAME = 'Lisa98';
const ADMIN_PASSWORD = 'Lisa98*#2025';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tutorProfile, setTutorProfile] = useState<TutorProfile | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch tutor profile if user is a tutor
  const fetchTutorProfile = async (userId: string) => {
    try {
      const response = await fetch(`/api/tutor-profiles/user/${userId}`);
      if (response.ok) {
        const profile = await response.json();
        setTutorProfile(profile);
        setUserRole('tutor');
        return profile;
      }
    } catch (error) {
      console.error('Error fetching tutor profile:', error);
    }
    return null;
  };

  const refreshTutorProfile = async () => {
    if (user) {
      await fetchTutorProfile(user.id);
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Check if user is a tutor
        const profile = await fetchTutorProfile(session.user.id);
        if (!profile) {
          // User is a student (Google OAuth user without tutor profile)
          setUserRole('student');
        }
      }
      
      // Check for admin session
      const adminSession = sessionStorage.getItem('adminSession');
      if (adminSession === 'true') {
        setIsAdmin(true);
        setUserRole('admin');
      }
      
      setLoading(false);
    });

    // Listen for authentication state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const profile = await fetchTutorProfile(session.user.id);
        if (!profile) {
          setUserRole('student');
        }
      } else {
        setTutorProfile(null);
        if (!isAdmin) {
          setUserRole(null);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign in with Google OAuth (for students)
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      console.error('Error signing in with Google:', error.message);
    }
  };

  // Sign out the current user
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    }
    setTutorProfile(null);
    setUserRole(null);
    setIsAdmin(false);
    sessionStorage.removeItem('adminSession');
  };

  // Tutor sign up with email and password
  const tutorSignUp = async (email: string, password: string, fullName: string): Promise<{ error?: string }> => {
    try {
      // Create auth user in Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'tutor',
            full_name: fullName,
          },
        },
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        // Create tutor profile in our database
        const response = await fetch('/api/tutor-profiles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            supabaseUserId: data.user.id,
            email,
            fullName,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          return { error: errorData.message || 'Failed to create tutor profile' };
        }

        const profile = await response.json();
        setTutorProfile(profile);
        setUserRole('tutor');
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  // Tutor sign in with email and password
  const tutorSignIn = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        const profile = await fetchTutorProfile(data.user.id);
        if (!profile) {
          // Sign out if no tutor profile exists
          await supabase.auth.signOut();
          return { error: 'No tutor account found. Please sign up first.' };
        }
        
        if (profile.isBlocked) {
          await supabase.auth.signOut();
          return { error: 'Your account has been blocked. Please contact support.' };
        }
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  // Reset password
  const resetPassword = async (email: string): Promise<{ error?: string }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  // Admin sign in with fixed credentials
  const adminSignIn = async (username: string, password: string): Promise<{ error?: string }> => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setUserRole('admin');
      sessionStorage.setItem('adminSession', 'true');
      return {};
    }
    return { error: 'Invalid admin credentials' };
  };

  // Admin sign out
  const adminSignOut = () => {
    setIsAdmin(false);
    setUserRole(null);
    sessionStorage.removeItem('adminSession');
  };

  const value = {
    user,
    tutorProfile,
    userRole,
    loading,
    signInWithGoogle,
    signOut,
    tutorSignUp,
    tutorSignIn,
    resetPassword,
    adminSignIn,
    adminSignOut,
    isAdmin,
    refreshTutorProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
