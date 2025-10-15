import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithPhone: (phone: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Create profile if user signs up
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(() => {
            createProfile(session.user);
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const createProfile = async (user: User) => {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        phone: user.phone,
        full_name: user.user_metadata?.full_name,
      }, { onConflict: 'id' });

    if (error && error.code !== '23505') { // Ignore duplicate key errors
      console.error('Error creating profile:', error);
    }

    // Create default user role
    await supabase
      .from('user_roles')
      .upsert({
        user_id: user.id,
        role: 'user',
      }, { onConflict: 'user_id,role' });
  };

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Check your email to confirm your account!');
    }
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Welcome back!');
    }
    
    return { error };
  };

  const signInWithPhone = async (phone: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      phone,
    });
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Check your phone for the OTP!');
    }
    
    return { error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/categories`,
      },
    });
    
    if (error) {
      toast.error(error.message);
    }
    
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Signed out successfully');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        signUp,
        signIn,
        signInWithPhone,
        signInWithGoogle,
        signOut,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
