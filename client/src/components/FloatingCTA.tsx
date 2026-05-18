/*
 * FloatingCTA — Refined European Elegance
 * Fixed floating phone button for quick contact
 */
import { Phone } from "lucide-react";
import { useState, useEffect } from "react";

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkLightbox = () => {
      setLightboxOpen(document.body.style.overflow === 'hidden');
    };
    const observer = new MutationObserver(checkLightbox);
    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });
    return () => observer.disconnect();
  }, []);

  return (
    <a
      href="tel:0743691717"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#C9A84C] hover:bg-[#b8943d] text-[#1A2B4A] font-semibold px-5 py-3.5 rounded-full shadow-xl shadow-[#C9A84C]/30 transition-all duration-300 ${
        visible && !lightboxOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <Phone className="w-4 h-4" strokeWidth={2.5} />
      <span className="text-sm">Sunați Acum</span>
    </a>
  );
}
