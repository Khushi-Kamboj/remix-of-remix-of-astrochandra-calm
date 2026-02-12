import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Astrologers from "./pages/Astrologers";
import BookConsultation from "./pages/BookConsultation";
import PoojaServices from "./pages/PoojaServices";
import TrainingWorkshops from "./pages/TrainingWorkshops";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
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
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/astrologers" element={<Astrologers />} />
                <Route path="/book" element={<BookConsultation />} />
                <Route path="/pooja" element={<PoojaServices />} />
                <Route path="/training" element={<TrainingWorkshops />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
                <Route path="/astrologer-dashboard" element={<ProtectedRoute allowedRoles={["astrologer", "admin"]}><AstrologerDashboard /></ProtectedRoute>} />
                <Route path="/priest-dashboard" element={<ProtectedRoute allowedRoles={["priest", "admin"]}><PriestDashboard /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
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
