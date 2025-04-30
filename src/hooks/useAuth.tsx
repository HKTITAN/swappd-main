
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<ProfileType>) => Promise<void>;
};

type ProfileType = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  swapcoins: number;
  bio?: string | null;
  preferences?: Record<string, any> | null;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  isAdmin: false,
  signOut: async () => {},
  updateProfile: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Fetch user profile data
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        // Added harsh.khemani@gmail.com as an admin
        const adminEmails = ['harsh.khemani@gmail.com'];
        setIsAdmin(
          !!currentUser?.user_metadata?.is_admin || 
          (currentUser?.email?.endsWith('@swappd.in') ?? false) ||
          (adminEmails.includes(currentUser?.email ?? '') ?? false)
        );
        
        if (currentUser) {
          fetchProfile(currentUser.id);
        } else {
          setProfile(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      // Added harsh.khemani@gmail.com as an admin
      const adminEmails = ['harsh.khemani@gmail.com'];
      setIsAdmin(
        !!currentUser?.user_metadata?.is_admin || 
        (currentUser?.email?.endsWith('@swappd.in') ?? false) ||
        (adminEmails.includes(currentUser?.email ?? '') ?? false)
      );
      
      if (currentUser) {
        fetchProfile(currentUser.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (updates: Partial<ProfileType>) => {
    if (!user) throw new Error("User must be logged in to update profile");
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Refetch the profile to update state
      fetchProfile(user.id);
      
      return;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, isAdmin, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
