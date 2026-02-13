import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

/**
 * AuthCallback Page
 * 
 * Handles OAuth/email callback by:
 * 1. Waiting for session to be established
 * 2. Loading user role from database
 * 3. Redirecting to appropriate dashboard based on role
 */
const AuthCallback = () => {
  const navigate = useNavigate();
  const { user, role, loading, error } = useAuth();

  // Map roles to their dashboard routes (memoized to avoid dependency issues)
  const roleToRoute = useMemo(() => ({
    admin: "/admin" as const,
    astrologer: "/astrologer-dashboard" as const,
    priest: "/priest-dashboard" as const,
    user: "/dashboard" as const,
  }), []);

  useEffect(() => {
    // Still loading auth and role information
    if (loading) return;

    // Error occurred during auth initialization
    if (error) {
      console.error("Auth callback error:", error);
      navigate("/login", { replace: true });
      return;
    }

    // User has complete session and role information
    if (user && role) {
      const path = roleToRoute[role];
      navigate(path, { replace: true });
      return;
    }

    // User authenticated but role not loaded, fallback to user dashboard
    if (user && !role) {
      navigate("/dashboard", { replace: true });
      return;
    }

    // No user session, redirect to login
    navigate("/login", { replace: true });
  }, [user, role, loading, error, navigate, roleToRoute]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-2">Completing sign-in...</h1>
          <p className="text-muted-foreground text-sm">Please wait while we set up your account.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
