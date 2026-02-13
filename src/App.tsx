import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RequireAuth from "@/components/RequireAuth";
import FirstLoginModal from "@/components/FirstLoginModal";
import Index from "./pages/Index";
import Astrologers from "./pages/Astrologers";
import BookConsultation from "./pages/BookConsultation";
import PoojaServices from "./pages/PoojaServices";
import TrainingWorkshops from "./pages/TrainingWorkshops";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthCallback from "./pages/AuthCallback";
import UserDashboard from "./pages/UserDashboard";
import AstrologerDashboard from "./pages/AstrologerDashboard";
import PriestDashboard from "./pages/PriestDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <FirstLoginModal />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/astrologers" element={<Astrologers />} />
                <Route path="/book" element={<RequireAuth><BookConsultation /></RequireAuth>} />
                <Route path="/pooja" element={<RequireAuth><PoojaServices /></RequireAuth>} />
                <Route path="/training" element={<TrainingWorkshops />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/dashboard" element={<RequireAuth><UserDashboard /></RequireAuth>} />
                <Route path="/astrologer-dashboard" element={<RequireAuth requireRole={["astrologer", "admin"]}><AstrologerDashboard /></RequireAuth>} />
                <Route path="/priest-dashboard" element={<RequireAuth requireRole={["priest", "admin"]}><PriestDashboard /></RequireAuth>} />
                <Route path="/admin" element={<RequireAuth requireRole="admin"><AdminDashboard /></RequireAuth>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
