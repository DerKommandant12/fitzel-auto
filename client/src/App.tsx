import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Routes } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import CookieConsent from "./components/CookieConsent";
import { initGDPRCompliance, ensureGDPRCompliance } from "./components/GDPRCompliance";
import Home from "./pages/Home";
import CarDetailPage from "./pages/CarDetailPage";
import { useEffect } from "react";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/masini/:id" element={<CarDetailPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  useEffect(() => {
    // Initialize GDPR compliance on app load
    initGDPRCompliance();
    ensureGDPRCompliance();
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
          <CookieConsent />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
