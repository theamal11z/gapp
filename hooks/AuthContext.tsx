import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { AuthError, User } from '@supabase/supabase-js';
import { router } from 'expo-router';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, options?: { data?: { full_name?: string } }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session retrieval error:', error.message);
          // If there's a refresh token error, clear the session
          if (error.message?.includes('Refresh Token Not Found') || 
              error.message?.includes('Invalid Refresh Token')) {
            await supabase.auth.signOut();
          }
        }
        
        setUser(data?.session?.user ?? null);
      } catch (err) {
        console.error('Session init error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event);
      
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token was refreshed successfully');
      } else if (event === 'SIGNED_OUT') {
        // Clear any local auth state
        setUser(null);
      }
      
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      
      // First, ensure we're logged out to avoid conflicts
      await supabase.auth.signOut();
      
      // Now attempt sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data?.session) {
        // Successful login with session
        console.log('Login successful with session');
        router.replace('/(tabs)');
      } else {
        // This shouldn't happen with signInWithPassword, but just in case
        throw new Error('Login successful but no session created');
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err as AuthError);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    options?: { 
      data?: { 
        full_name?: string;
      } 
    }
  ) => {
    try {
      setError(null);
      
      // Basic signup with minimal required fields
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        console.error('Signup error:', signUpError);
        throw signUpError;
      }

      if (!signUpData.user) {
        throw new Error('No user data returned from signup');
      }

      // After successful signup, update the user metadata separately
      if (options?.data?.full_name) {
        const { error: updateError } = await supabase.auth.updateUser({
          data: { full_name: options.data.full_name }
        });
        
        if (updateError) {
          console.error('Error updating user profile:', updateError);
          // Non-blocking - we continue even if profile update fails
        }
      }
      
      // Check if email confirmation is required
      if (!signUpData.session) {
        // Redirect to email verification page
        router.push('/verify-email');
        return;
      }
      
      // If we have a session (email confirmation not required), proceed normally
      router.replace('/(tabs)');
    } catch (err) {
      console.error('Error during signup:', err);
      setError(err as AuthError);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      setLoading(true);
      
      // Sign out from supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error.message);
        throw error;
      }
      
      // Clear local state regardless of server response
      setUser(null);
      
      // Navigate to auth screen
      router.replace('/auth');
    } catch (err) {
      console.error('Sign out error:', err);
      setError(err as AuthError);
      
      // Even if sign out fails on backend, we still want to redirect user and clear local state
      router.replace('/auth');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 