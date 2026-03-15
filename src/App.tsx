import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import UseCasePage from "./pages/UseCasePage";
import LibraryPage from "./pages/LibraryPage";
import AuthPage from "./pages/AuthPage";
import CaseStudiesPage from "./pages/CaseStudiesPage";
import CaseStudyProductionPage from "./pages/CaseStudyProductionPage";
import CaseStudyComingSoonPage from "./pages/CaseStudyComingSoonPage";
import CaseStudySteamDelaysPage from "./pages/CaseStudySteamDelaysPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/use-cases/:slug" element={<UseCasePage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/case-studies" element={<CaseStudiesPage />} />
          <Route path="/case-studies/production" element={<CaseStudyProductionPage />} />
          <Route path="/case-studies/steam-delays" element={<CaseStudySteamDelaysPage />} />
          <Route path="/case-studies/:stage" element={<CaseStudyComingSoonPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
