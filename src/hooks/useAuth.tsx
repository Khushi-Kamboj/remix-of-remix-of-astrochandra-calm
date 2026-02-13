import { createContext, useContext, useEffect, useRef, useState, ReactNode, useCallback } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface AuthContextType {
  session: Session | null;
  user: User | null;
  role: AppRole | null;
  profile: Database["public"]["Tables"]["profiles"]["Row"] | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  role: null,
  profile: null,
  loading: true,
  error: null,
  signOut: async () => {},
  refreshProfile: async () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [profile, setProfile] = useState<Database["public"]["Tables"]["profiles"]["Row"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Ref to remember which userId we've already processed to avoid duplicate fetches
  const processedUserIdRef = useRef<string | null>(null);

  // Helper function to fetch user's role from user_roles table
  const fetchUserRole = async (userId: string): Promise<AppRole | null> => {
    try {
      const { data, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .single();

      if (roleError) {
        if (roleError.code === "PGRST116") {
          // No row found - user_roles record doesn't exist yet
          console.warn(`No role found for user ${userId}, using default 'user' role`);
          return "user";
        }
        console.error("Error fetching role:", roleError);
        return null;
      }

      return data?.role || null;
    } catch (err) {
      console.error("Exception fetching user role:", err);
      return null;
    }
  };

  // Helper function to fetch user profile
  const fetchUserProfile = async (userId: string): Promise<Database["public"]["Tables"]["profiles"]["Row"] | null> => {
    try {
      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) {
        if (profileError.code !== "PGRST116") {
          console.error("Error fetching profile:", profileError);
        }
        return null;
      }

      return data || null;
    } catch (err) {
      console.error("Exception fetching profile:", err);
      return null;
    }
  };

  // Fetch both profile and role in parallel
  const fetchUserData = useCallback(async (userId: string) => {
    try {
      setError(null);
      console.info(`[useAuth] fetchUserData start for ${userId}`);
      const [fetchedProfile, fetchedRole] = await Promise.all([
        fetchUserProfile(userId),
        fetchUserRole(userId),
      ]);

      // Always set profile (may be null) to avoid stale state
      setProfile(fetchedProfile ?? null);

      // Set role, default to 'user' when no role row exists
      setRole(fetchedRole ?? "user");
      console.info(`[useAuth] fetchUserData complete for ${userId}`, { fetchedProfile, fetchedRole });
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Failed to load user data";
      setError(errMsg);
      console.error("Error loading user data:", err);
    }
  }, []);

  const refreshProfile = async () => {
    if (user) {
      await fetchUserData(user.id);
    }
  };

  useEffect(() => {
    // Persist a processed-user id across renders to avoid duplicate fetches
    const processedUserRef = processedUserIdRef;
    let isMounted = true;

    // Helper to process session once per user id
    const processSession = async (session: Session | null) => {
      if (!isMounted) return;

      setSession(session);
      setUser(session?.user ?? null);

      const userId = session?.user?.id ?? null;

      if (userId) {
        // Avoid refetching if we've already processed this user id
        if (processedUserRef.current === userId) {
          console.info(`[useAuth] already processed user ${userId}, skipping fetch`);
          setLoading(false);
          return;
        }

        try {
          await fetchUserData(userId);
          processedUserRef.current = userId;
          console.info(`[useAuth] processedUserRef set to ${userId}`);
        } catch (err) {
          console.error("Error processing session:", err);
        }
      } else {
        // No session: clear data
        setProfile(null);
        setRole(null);
        setError(null);
        processedUserRef.current = null;
        console.info("[useAuth] no session, cleared processedUserRef");
      }

      setLoading(false);
    };

    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.info(`[useAuth] onAuthStateChange event=${event} user=${session?.user?.id ?? null}`);
        setLoading(true);
        try {
          await processSession(session);
        } catch (err) {
          console.error("onAuthStateChange processing error:", err);
          setLoading(false);
        }
      }
    );

    // Restore session from storage on mount
    (async () => {
      try {
        setLoading(true);
        console.info("[useAuth] restoring session via getSession()");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (sessionError) {
          setError(sessionError.message);
          setLoading(false);
          return;
        }

        console.info("[useAuth] getSession returned", { hasSession: !!session?.user?.id });
        await processSession(session ?? null);
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : "Failed to restore session";
        setError(errMsg);
        setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [fetchUserData]);

  const signOut = async () => {
    try {
      setError(null);
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setProfile(null);
      setRole(null);
      // clear processed user guard so future sessions will refetch
      processedUserIdRef.current = null;
      setLoading(false);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Failed to sign out";
      setError(errMsg);
      console.error("Sign out error:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, role, profile, loading, error, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
