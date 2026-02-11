import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import Astrologers from "./pages/Astrologers";
import BookConsultation from "./pages/BookConsultation";
import PoojaServices from "./pages/PoojaServices";
import NotFound from "./pages/NotFound";
import TrainingWorkshops from "./pages/TrainingWorkshops";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/astrologers" element={<Astrologers />} />
              <Route path="/book" element={<BookConsultation />} />
              <Route path="/pooja" element={<PoojaServices />} />
              <Route path="/training" element={<TrainingWorkshops />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
