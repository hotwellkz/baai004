import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  tokens: number;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState(0);

  useEffect(() => {
    // Check active sessions and subscribe to auth changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchTokens(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchTokens(session.user.id);
      } else {
        setTokens(0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchTokens = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('tokens')
      .eq('id', userId)
      .single();

    if (!error && data) {
      setTokens(data.tokens);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setTokens(0);
    // Clear all lesson states from localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('lesson_')) {
        localStorage.removeItem(key);
      }
    });
  };

  return (
    <AuthContext.Provider value={{ user, tokens, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};