/*
 * Navbar — Refined European Elegance
 * Sticky, transparent-to-solid on scroll, gold accent underlines on hover
 * Navy background when scrolled, transparent over hero
 */
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Phone, Menu, X } from "lucide-react";
import { FITZEL_LOGO_URL } from "@/lib/brand";

const navLinks = [
  { label: "Acasă", href: "#hero" },
  { label: "Inventar", href: "#inventory" },
  { label: "Servicii", href: "#services" },
  { label: "Despre Noi", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar({
  onAdminClick,
}: {
  onAdminClick?: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    if (isHome) {
      scrollToSection(href);
      return;
    }
    const hash = href.startsWith("#") ? href.slice(1) : href;
    navigate({ pathname: "/", hash });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#1A2B4A] shadow-lg shadow-[#1A2B4A]/20"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button
            onClick={() => handleNavClick("#hero")}
            className="flex items-center gap-2.5 group"
          >
            <img
              src={FITZEL_LOGO_URL}
              alt="Automobile Fitzel Pot"
              className="h-10 w-auto flex-shrink-0"
            />
            <div className="text-left">
              <div
                className="font-bold text-sm leading-tight text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Automobile
              </div>
              <div
                className="text-[#C9A84C] text-xs font-semibold tracking-widest uppercase leading-tight"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                FITZEL POT
              </div>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="relative text-white/80 hover:text-white text-sm font-medium tracking-wide transition-colors duration-200 group"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#C9A84C] transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </nav>

          {/* CTA Phone + Portal */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:0743691717"
              className="flex items-center gap-2 bg-[#C9A84C] hover:bg-[#b8943d] text-[#1A2B4A] font-semibold text-sm px-4 py-2.5 rounded transition-colors duration-200"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <Phone className="w-4 h-4" strokeWidth={2.5} />
              0743 691 717
            </a>

          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-white p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } bg-[#1A2B4A] border-t border-white/10`}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="text-left text-white/80 hover:text-[#C9A84C] text-base font-medium py-2.5 border-b border-white/5 transition-colors duration-200"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {link.label}
            </button>
          ))}
          <a
            href="tel:0743691717"
            className="flex items-center gap-2 mt-3 bg-[#C9A84C] text-[#1A2B4A] font-semibold text-sm px-4 py-3 rounded justify-center"
          >
            <Phone className="w-4 h-4" strokeWidth={2.5} />
            0743 691 717
          </a>
        </div>
      </div>
    </header>
  );
}
