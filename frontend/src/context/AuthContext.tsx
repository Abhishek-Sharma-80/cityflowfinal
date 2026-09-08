import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface AuthUserProfile {
  id: string;
  email: string;
  fullName: string;
  role: string;
  department: string;
  initials: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: AuthUserProfile | null;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | Error | null; message?: string }>;
  signOut: () => Promise<void>;
  signInWithDemo: (role?: 'officer' | 'operator' | 'analyst') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_DEMO_KEY = 'cityflow_demo_auth_profile';

const DEMO_PROFILES: Record<string, AuthUserProfile> = {
  officer: {
    id: 'demo-user-blr-01',
    email: 'abhishek@bbmp.gov.in',
    fullName: 'Abhishek Sharma',
    role: 'Municipal Officer',
    department: 'BBMP Urban Transport',
    initials: 'AS',
  },
  operator: {
    id: 'demo-user-blr-02',
    email: 'priya.nair@bmtc.karnataka.gov.in',
    fullName: 'Priya Nair',
    role: 'Corridor Controller',
    department: 'BMTC & Transit Command',
    initials: 'PN',
  },
  analyst: {
    id: 'demo-user-blr-03',
    email: 'karthik.r@iisc.ac.in',
    fullName: 'Karthik Raman',
    role: 'AI Mobility Researcher',
    department: 'Smart Mobility Lab',
    initials: 'KR',
  },
};

const getInitials = (name: string): string => {
  if (!name) return 'BL';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AuthUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSupabaseConfigured) {
      // 1. Check existing Supabase session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          const metaName = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User';
          setProfile({
            id: session.user.id,
            email: session.user.email || '',
            fullName: metaName,
            role: session.user.user_metadata?.role || 'Municipal Officer',
            department: session.user.user_metadata?.department || 'Bengaluru Smart City',
            initials: getInitials(metaName),
          });
        }
        setLoading(false);
      });

      // 2. Listen for auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          const metaName = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User';
          setProfile({
            id: session.user.id,
            email: session.user.email || '',
            fullName: metaName,
            role: session.user.user_metadata?.role || 'Municipal Officer',
            department: session.user.user_metadata?.department || 'Bengaluru Smart City',
            initials: getInitials(metaName),
          });
        } else {
          setProfile(null);
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // Local fallback mode when Supabase credentials are pending
      try {
        const saved = localStorage.getItem(LOCAL_DEMO_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setProfile(parsed);
          setUser({ id: parsed.id, email: parsed.email } as User);
        }
      } catch {
        // ignore storage errors
      }
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      // Simulated sign in for fallback
      const found = Object.values(DEMO_PROFILES).find((p) => p.email.toLowerCase() === email.toLowerCase());
      const chosenProfile: AuthUserProfile = found || {
        id: `local-user-${Date.now()}`,
        email,
        fullName: email.split('@')[0],
        role: 'Municipal Officer',
        department: 'Bengaluru Smart City',
        initials: getInitials(email.split('@')[0]),
      };
      setProfile(chosenProfile);
      setUser({ id: chosenProfile.id, email: chosenProfile.email } as User);
      localStorage.setItem(LOCAL_DEMO_KEY, JSON.stringify(chosenProfile));
      return { error: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { error };

    if (data.user) {
      const metaName = data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User';
      setProfile({
        id: data.user.id,
        email: data.user.email || '',
        fullName: metaName,
        role: data.user.user_metadata?.role || 'Municipal Officer',
        department: data.user.user_metadata?.department || 'Bengaluru Smart City',
        initials: getInitials(metaName),
      });
    }

    return { error: null };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!isSupabaseConfigured) {
      const newProfile: AuthUserProfile = {
        id: `local-user-${Date.now()}`,
        email,
        fullName: fullName || email.split('@')[0],
        role: 'Municipal Officer',
        department: 'Bengaluru Smart City',
        initials: getInitials(fullName || email.split('@')[0]),
      };
      setProfile(newProfile);
      setUser({ id: newProfile.id, email: newProfile.email } as User);
      localStorage.setItem(LOCAL_DEMO_KEY, JSON.stringify(newProfile));
      return { error: null, message: 'Account created successfully (local fallback).' };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'Municipal Officer',
          department: 'Bengaluru Smart City',
        },
      },
    });

    if (error) return { error };

    // Check if email confirmation is required by Supabase
    if (data.session) {
      const metaName = data.user?.user_metadata?.full_name || fullName || 'User';
      setProfile({
        id: data.user!.id,
        email: data.user!.email || '',
        fullName: metaName,
        role: 'Municipal Officer',
        department: 'Bengaluru Smart City',
        initials: getInitials(metaName),
      });
      return { error: null, message: 'Account created and signed in successfully!' };
    }

    return {
      error: null,
      message: 'Registration successful! Please check your email to confirm your account.',
    };
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(LOCAL_DEMO_KEY);
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const signInWithDemo = (role: 'officer' | 'operator' | 'analyst' = 'officer') => {
    const demoProfile = DEMO_PROFILES[role] || DEMO_PROFILES.officer;
    setProfile(demoProfile);
    setUser({ id: demoProfile.id, email: demoProfile.email } as User);
    localStorage.setItem(LOCAL_DEMO_KEY, JSON.stringify(demoProfile));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isConfigured: isSupabaseConfigured,
        signIn,
        signUp,
        signOut,
        signInWithDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
