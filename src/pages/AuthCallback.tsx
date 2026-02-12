import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // The session is automatically set by Supabase when the callback URL is accessed
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          // User is logged in
          if (role) {
            // Redirect based on role
            switch (role) {
              case "admin":
                navigate("/admin", { replace: true });
                break;
              case "astrologer":
                navigate("/astrologer-dashboard", { replace: true });
                break;
              case "priest":
                navigate("/priest-dashboard", { replace: true });
                break;
              default:
                navigate("/dashboard", { replace: true });
            }
          } else {
            // Default redirect if role is not yet available
            navigate("/dashboard", { replace: true });
          }
        } else {
          // No session, redirect to login
          navigate("/login", { replace: true });
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        navigate("/login", { replace: true });
      }
    };

    handleCallback();
  }, [role, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Completing sign-in...</h1>
        <p className="text-muted-foreground">Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
