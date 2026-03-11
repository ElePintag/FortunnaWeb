'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isOperador: boolean;
  userRole: 'admin' | 'operador' | 'user' | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'admin' | 'operador' | 'user' | null>(null);

  const isAdmin = userRole === 'admin';
  const isOperador = userRole === 'operador';

  const fetchUserRole = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('rol')
        .eq('email', email)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user role:', error);
        setUserRole(null);
        return;
      }

      if (data) {
        setUserRole(data.rol as 'admin' | 'operador' | 'user');
      } else {
        setUserRole(null);
      }
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
      setUserRole(null);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user?.email) {
        await fetchUserRole(session.user.email);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setUser(session?.user ?? null);
        if (session?.user?.email) {
          await fetchUserRole(session.user.email);
        } else {
          setUserRole(null);
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, isOperador, userRole, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
