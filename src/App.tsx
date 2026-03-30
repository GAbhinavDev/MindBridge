import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import MoodCheckIn from "./pages/MoodCheckIn";
import StoryCircles from "./pages/StoryCircles";
import Dashboard from "./pages/Dashboard";
import CrisisSupport from "./pages/CrisisSupport";
import ResilienceStreaks from "./pages/ResilienceStreaks";
import Resources from "./pages/Resources";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/mood" element={<MoodCheckIn />} />
          <Route path="/stories" element={<StoryCircles />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/crisis" element={<CrisisSupport />} />
          <Route path="/streaks" element={<ResilienceStreaks />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
