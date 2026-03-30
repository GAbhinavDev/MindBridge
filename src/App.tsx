import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import MoodCheckIn from "./pages/MoodCheckIn";
import StoryCircles from "./pages/StoryCircles";
import Dashboard from "./pages/Dashboard";
import CrisisSupport from "./pages/CrisisSupport";
import ResilienceStreaks from "./pages/ResilienceStreaks";
import Resources from "./pages/Resources";
import Auth from "./pages/Auth";
import NGOLogin from "./pages/NGOLogin";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import AICompanion from "./components/AICompanion";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/ngo-login" element={<NGOLogin />} />
            <Route path="/mood" element={<MoodCheckIn />} />
            <Route path="/stories" element={<StoryCircles />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/crisis" element={<CrisisSupport />} />
            <Route path="/streaks" element={<ResilienceStreaks />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AICompanion />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
