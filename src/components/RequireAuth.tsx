import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface RequireAuthProps {
  children: React.ReactNode;
  requireRole?: AppRole | AppRole[];
}

/**
 * RequireAuth Component
 * 
 * Protects routes and enforces role-based access control.
 * 
 * Usage:
 * - Basic protection (any authenticated user):
 *   <RequireAuth>
 *     <Dashboard />
 *   </RequireAuth>
 * 
 * - Require specific role:
 *   <RequireAuth requireRole="admin">
 *     <AdminPanel />
 *   </RequireAuth>
 * 
 * - Require one of multiple roles:
 *   <RequireAuth requireRole={["admin", "astrologer"]}>
 *     <ProfessionalDashboard />
 *   </RequireAuth>
 */
const RequireAuth = ({ children, requireRole }: RequireAuthProps) => {
  const { user, role, loading, error } = useAuth();
  const location = useLocation();

  // Still loading auth state
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // No user session - redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role requirement specified, check if user has the required role
  if (requireRole) {
    const requiredRoles = Array.isArray(requireRole) ? requireRole : [requireRole];

    // Still waiting for role to load
    if (!role) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
            <p className="text-sm text-muted-foreground">Loading permissions...</p>
          </div>
        </div>
      );
    }

    // User doesn't have required role
    if (!requiredRoles.includes(role)) {
      console.warn(`User ${user.id} with role "${role}" attempted to access route requiring ${requiredRoles.join(" or ")}`);
      
      // Redirect to appropriate dashboard based on user's actual role
      const roleBasedRedirect: Record<AppRole, string> = {
        admin: "/admin",
        astrologer: "/astrologer-dashboard",
        priest: "/priest-dashboard",
        user: "/dashboard",
      };

      return <Navigate to={roleBasedRedirect[role]} replace />;
    }
  }

  // Auth error occurred
  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-sm font-medium text-destructive mb-4">Authentication Error</p>
          <p className="text-xs text-muted-foreground mb-4">{error}</p>
          <Navigate to="/login" replace />
        </div>
      </div>
    );
  }

  // All checks passed, render children
  return <>{children}</>;
};

export default RequireAuth;
