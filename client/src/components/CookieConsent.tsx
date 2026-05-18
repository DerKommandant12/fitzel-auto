/*
 * CookieConsent — GDPR-compliant cookie banner
 * Simple, clean design using site colors (blue, gold, white)
 * No glassmorphism, animations, or heavy scripts
 */
import { useState, useEffect } from "react";
import { X } from "lucide-react";

type ConsentChoice = "accept" | "reject" | "customize" | null;

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);

  useEffect(() => {
    // Check if user has already made a choice
    try {
      const savedConsent = localStorage.getItem("cookieConsent");
      if (!savedConsent) {
        // Force show banner on first visit
        setIsVisible(true);
      }
    } catch (e) {
      // localStorage might be blocked, show banner anyway
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    const consentData = JSON.stringify({
      choice: "accept",
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    });
    try {
      localStorage.setItem("cookieConsent", consentData);
    } catch (e) {
      // Fallback if localStorage is blocked
      sessionStorage.setItem("cookieConsent", consentData);
    }
    setIsVisible(false);
  };

  const handleReject = () => {
    const consentData = JSON.stringify({
      choice: "reject",
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    });
    try {
      localStorage.setItem("cookieConsent", consentData);
    } catch (e) {
      // Fallback if localStorage is blocked
      sessionStorage.setItem("cookieConsent", consentData);
    }
    setIsVisible(false);
  };

  const handleCustomize = () => {
    const consentData = JSON.stringify({
      choice: "customize",
      analytics,
      marketing,
      timestamp: new Date().toISOString(),
    });
    try {
      localStorage.setItem("cookieConsent", consentData);
    } catch (e) {
      // Fallback if localStorage is blocked
      sessionStorage.setItem("cookieConsent", consentData);
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#1A2B4A] border-t border-[#C9A84C]/30 shadow-2xl">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl py-6">
        {!showCustomize ? (
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Message */}
            <div className="flex-1">
              <p
                className="text-white text-sm leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Utilizăm cookies pentru a îmbunătăți experiența dvs. pe site. Unele sunt esențiale pentru funcționare, 
                iar altele ne ajută să înțelegem cum folosiți site-ul.{" "}
                <a
                  href="#"
                  className="text-[#C9A84C] hover:text-[#d4b456] underline transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    // Link to privacy policy
                  }}
                >
                  Politica de confidențialitate
                </a>
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <button
                onClick={handleReject}
                className="px-6 py-2.5 rounded border border-white/20 text-white hover:border-white/40 hover:bg-white/5 font-medium text-sm transition-all duration-200"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Respinge
              </button>
              <button
                onClick={() => setShowCustomize(true)}
                className="px-6 py-2.5 rounded border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C]/10 font-medium text-sm transition-all duration-200"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Personalizează
              </button>
              <button
                onClick={handleAccept}
                className="px-6 py-2.5 rounded bg-[#C9A84C] hover:bg-[#b8943d] text-[#1A2B4A] font-semibold text-sm transition-all duration-200"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Accept
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Customize Header */}
            <div className="flex items-center justify-between">
              <h3
                className="text-white font-semibold text-base"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Preferințe Cookie
              </h3>
              <button
                onClick={() => setShowCustomize(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cookie Options */}
            <div className="space-y-3 bg-white/5 rounded p-4">
              {/* Essential */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Cookies Esențiale
                  </p>
                  <p className="text-white/60 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Necesare pentru funcționarea site-ului
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="w-4 h-4 rounded accent-[#C9A84C] cursor-not-allowed"
                />
              </div>

              {/* Analytics */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Cookies de Analiză
                  </p>
                  <p className="text-white/60 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Ne ajută să înțelegem cum folosiți site-ul
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#C9A84C] cursor-pointer"
                />
              </div>

              {/* Marketing */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Cookies de Marketing
                  </p>
                  <p className="text-white/60 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Pentru publicitate personalizată
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#C9A84C] cursor-pointer"
                />
              </div>
            </div>

            {/* Customize Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowCustomize(false)}
                className="flex-1 px-4 py-2.5 rounded border border-white/20 text-white hover:border-white/40 hover:bg-white/5 font-medium text-sm transition-all duration-200"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Înapoi
              </button>
              <button
                onClick={handleCustomize}
                className="flex-1 px-4 py-2.5 rounded bg-[#C9A84C] hover:bg-[#b8943d] text-[#1A2B4A] font-semibold text-sm transition-all duration-200"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Salvează Preferințe
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
