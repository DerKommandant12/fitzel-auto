/*
 * Home — Automobile Fitzel Pot
 * Design: Refined European Elegance
 * Sections: Hero → Stats → Inventory → Services → About → Testimonials → Contact
 */
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import InventorySection from "@/components/InventorySection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import AdminPanel from "@/components/AdminPanel";
import AdminLoginModal from "@/components/AdminLoginModal";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function Home() {
  const { hash } = useLocation();

  const { isAuthenticated: adminAuth, login } = useAdminAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);

  useEffect(() => {
    if (!hash) return;
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, [hash]);

  // Keyboard shortcut: Ctrl+Shift+A to open login modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        e.preventDefault();
        setLoginModalOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    const success = await login(email, password);
    if (success) {
      setLoginModalOpen(false);
      setAdminPanelOpen(true);
    }
    return success;
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <InventorySection />
      <ServicesSection />
      <AboutSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
      <FloatingCTA />
      <AdminLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLogin={handleLogin}
      />
      <AdminPanel
        isOpen={adminPanelOpen}
        onClose={() => setAdminPanelOpen(false)}
      />
    </div>
  );
}
