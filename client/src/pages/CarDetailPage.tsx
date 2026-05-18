/*
 * CarDetailPage — Vehicle detail with gallery, specs grid, and price card
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Car as CarIcon,
  ChevronLeft,
  ChevronRight,
  Fuel,
  Gauge,
  Heart,
  MapPin,
  MessageCircle,
  Navigation,
  Package,
  Settings2,
  Share2,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminPanel from "@/components/AdminPanel";
import AdminLoginModal from "@/components/AdminLoginModal";
import { useCarInventory, Car } from "@/hooks/useCarInventory";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const EUR_TO_RON = 5100;
const TBI_BANK_LOGO =
  "https://res.cloudinary.com/djgk2muyc/image/upload/v1779138739/Tbi_Bank_id28uhzJQh_0_jj8xzm.png";

function parseEuroPrice(priceStr: string): number {
  const cleaned = priceStr.replace(/[^\d,.-]/g, "").replace(",", ".");
  return parseFloat(cleaned) || 0;
}

function displayImages(car: Car): string[] {
  const imgs = (car.images || []).filter((img) => img && img !== "icon-car");
  return imgs.length > 0 ? imgs : [];
}

function specValue(value?: string): string {
  return value?.trim() ? value.trim() : "—";
}

export default function CarDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { loaded, getCar } = useCarInventory();
  const car = id ? getCar(id) : undefined;

  const { login } = useAdminAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);

  const images = useMemo(() => (car ? displayImages(car) : []), [car]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageVisible, setImageVisible] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [favorite, setFavorite] = useState(false);

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

  useEffect(() => {
    if (!lightboxOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxOpen]);

  useEffect(() => {
    setActiveIndex(0);
    setImageVisible(true);
    setLightboxOpen(false);
  }, [car?.id]);

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    const success = await login(email, password);
    if (success) {
      setLoginModalOpen(false);
      setAdminPanelOpen(true);
    }
    return success;
  };

  const adminModals = (
    <>
      <AdminLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLogin={handleLogin}
      />
      <AdminPanel isOpen={adminPanelOpen} onClose={() => setAdminPanelOpen(false)} />
    </>
  );

  const goToImage = useCallback(
    (index: number) => {
      if (images.length === 0) return;
      const next = ((index % images.length) + images.length) % images.length;
      if (next === activeIndex) return;
      setImageVisible(false);
      window.setTimeout(() => {
        setActiveIndex(next);
        setImageVisible(true);
      }, 150);
    },
    [activeIndex, images.length]
  );

  const euroAmount = car ? parseEuroPrice(car.price) : 0;
  const ronAmount = Math.round(euroAmount * EUR_TO_RON);
  const ronFormatted = ronAmount.toLocaleString("ro-RO");

  const engineSummary =
    car?.engine?.trim() || car?.power?.trim()
      ? [car.engine, car.power].filter(Boolean).join(" · ")
      : car?.fuel || "—";

  const handleShare = async () => {
    const url = window.location.href;
    const title = car ? `${car.make} ${car.model}` : "Automobile Fitzel Pot";
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* fall through */
      }
    }
    await navigator.clipboard.writeText(url);
    alert("Link copiat în clipboard.");
  };

  if (loaded && !car) {
    return (
      <div className="min-h-screen bg-[#1A2B4A] flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-24 text-center">
          <p className="text-white/70 mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Mașina nu a fost găsită.
          </p>
          <Link
            to="/#inventory"
            className="inline-flex items-center gap-2 text-[#C9A84C] hover:text-[#b8943d] font-medium"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Înapoi la inventar
          </Link>
        </main>
        <Footer />
        {adminModals}
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-[#1A2B4A] flex items-center justify-center">
        <p className="text-white/60" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Se încarcă...
        </p>
        {adminModals}
      </div>
    );
  }

  const whatsappText = encodeURIComponent(
    `Bună ziua! Sunt interesat de ${car.make} ${car.model} (${car.year}) — ${car.price}.`
  );

  const specItems = [
    { label: "AN", value: String(car.year), icon: Calendar },
    { label: "KM", value: specValue(car.km), icon: Gauge },
    { label: "COMBUSTIBIL", value: specValue(car.fuel), icon: Fuel },
    { label: "CUTIE DE VITEZE", value: specValue(car.transmission), icon: Settings2 },
    { label: "TIP CAROSERIE", value: specValue(car.bodyType), icon: CarIcon },
    { label: "CAPACITATE CILINDRICĂ", value: specValue(car.engine), icon: Wrench },
    { label: "PUTERE", value: specValue(car.power), icon: Zap },
    { label: "TRACȚIUNE", value: specValue(car.drivetrain), icon: Navigation },
    { label: "TIP STOC", value: specValue(car.stockType), icon: Package },
    { label: "LOCAȚIE", value: specValue(car.location), icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-[#1A2B4A] flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 lg:px-8 max-w-7xl pt-24 pb-16">
        <Link
          to="/#inventory"
          className="inline-flex items-center gap-2 text-white/70 hover:text-[#C9A84C] transition-colors mb-8"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Înapoi la inventar
        </Link>

        <div className="mb-8">
          <h1
            className="text-3xl lg:text-4xl font-bold text-white mb-1"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {car.make} {car.model}
          </h1>
          <p className="text-[#C9A84C] font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {car.year}
            {car.bodyType ? ` · ${car.bodyType}` : ""}
          </p>
        </div>

        {/* Gallery */}
        <div className="mb-10">
          <div className="relative rounded-xl overflow-hidden bg-[#0d1a2e] w-full max-h-[480px] flex items-center justify-center min-h-[200px]">
            {images.length > 0 ? (
              <>
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="w-full max-h-[480px] flex items-center justify-center focus:outline-none"
                  aria-label="Deschide imaginea la dimensiune completă"
                >
                  <img
                    src={images[activeIndex]}
                    alt={`${car.make} ${car.model} — imagine ${activeIndex + 1}`}
                    className={`w-full max-h-[480px] object-contain transition-opacity duration-300 ease-in-out ${
                      imageVisible ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </button>

                <div
                  className="absolute top-3 right-3 bg-black/60 text-white text-sm px-3 py-1 rounded-full font-semibold z-10 pointer-events-none"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {activeIndex + 1}/{images.length}
                </div>

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        goToImage(activeIndex - 1);
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors z-10"
                      aria-label="Imaginea anterioară"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        goToImage(activeIndex + 1);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors z-10"
                      aria-label="Imaginea următoare"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-white/30 py-16">
                <CarIcon className="w-16 h-16 mb-2" />
                <span className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Fără imagini
                </span>
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToImage(idx)}
                  className={`flex-shrink-0 w-[72px] h-[54px] rounded overflow-hidden transition-opacity ${
                    idx === activeIndex
                      ? "border-2 border-[#C9A84C] opacity-100"
                      : "border-2 border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {lightboxOpen && images.length > 0 && (
          <div
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-label="Galerie foto"
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-20 text-white/80 hover:text-white transition-colors p-2"
              aria-label="Închide"
            >
              <X className="w-8 h-8" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => goToImage(activeIndex - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 hover:bg-white/35 text-white flex items-center justify-center transition-colors"
                  aria-label="Imaginea anterioară"
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>
                <button
                  type="button"
                  onClick={() => goToImage(activeIndex + 1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 hover:bg-white/35 text-white flex items-center justify-center transition-colors"
                  aria-label="Imaginea următoare"
                >
                  <ChevronRight className="w-7 h-7" />
                </button>
              </>
            )}

            <div
              className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-black/60 text-white text-sm px-3 py-1 rounded-full font-semibold pointer-events-none"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {activeIndex + 1}/{images.length}
            </div>

            <img
              src={images[activeIndex]}
              alt={`${car.make} ${car.model} — imagine ${activeIndex + 1}`}
              className={`max-w-[95vw] max-h-[90vh] object-contain transition-opacity duration-300 ease-in-out ${
                imageVisible ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* Specs — 65% on desktop, below price on mobile */}
          <div className="lg:w-[65%] order-2 lg:order-1">
            <h2
              className="text-lg font-bold text-white mb-4 uppercase tracking-wider"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Specificații tehnice
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {specItems.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="bg-[#0d1a2e]/80 border border-white/10 rounded-lg p-3 flex gap-2"
                >
                  <Icon className="w-4 h-4 text-[#C9A84C] flex-shrink-0 mt-0.5" strokeWidth={1.8} />
                  <div className="min-w-0">
                    <div
                      className="text-[#C9A84C] text-[9px] uppercase tracking-wider font-semibold mb-0.5 leading-tight"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {label}
                    </div>
                    <div
                      className="text-white text-xs font-medium break-words leading-snug"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-lg border border-white/10 bg-[#0d1a2e]/80 px-4 py-3">
              <img
                src={TBI_BANK_LOGO}
                alt="TBI Bank"
                className="h-10 w-auto object-contain flex-shrink-0"
              />
              <p
                className="text-white/55 text-sm leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Finanțare disponibilă prin{" "}
                <span className="text-white/75 font-medium">TBI Bank</span>
                <span className="text-white/35"> · </span>
                Contactați-ne:{" "}
                <a
                  href="tel:0743691717"
                  className="text-[#C9A84C] hover:text-[#b8943d] transition-colors font-medium"
                >
                  0743 691 717
                </a>
              </p>
            </div>

            {car.description && (
              <div className="mt-8">
                <h2
                  className="text-lg font-bold text-white mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Descriere
                </h2>
                <p
                  className="text-white/70 leading-relaxed"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {car.description}
                </p>
              </div>
            )}
          </div>

          {/* Price card — 35%, first on mobile */}
          <div className="lg:w-[35%] order-1 lg:order-2">
            <div className="bg-[#0d1a2e] border border-white/10 rounded-xl p-6 lg:sticky lg:top-24">
              <div
                className="text-3xl lg:text-4xl font-bold text-white mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {car.price}
              </div>
              {euroAmount > 0 && (
                <p
                  className="text-white/50 text-sm mb-6"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  ≈ {ronFormatted} RON
                </p>
              )}

              <div className="space-y-3 mb-6 pb-6 border-b border-white/10">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    An
                  </span>
                  <span className="text-white font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {car.year}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Km
                  </span>
                  <span className="text-white font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {specValue(car.km)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Motor
                  </span>
                  <span className="text-white font-medium text-right max-w-[60%]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {engineSummary}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <a
                  href={`https://wa.me/40743691717?text=${whatsappText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 font-semibold transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => navigate({ pathname: "/", hash: "#contact" })}
                  className="w-full py-3 rounded bg-[#C9A84C] hover:bg-[#b8943d] text-[#1A2B4A] font-semibold transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Test Drive
                </button>
                <button
                  type="button"
                  onClick={() => setFavorite((f) => !f)}
                  className={`flex items-center justify-center gap-2 w-full py-3 rounded border transition-colors ${
                    favorite
                      ? "border-[#C9A84C] text-[#C9A84C] bg-[#C9A84C]/10"
                      : "border-white/20 text-white hover:border-[#C9A84C]/50"
                  }`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <Heart className={`w-4 h-4 ${favorite ? "fill-[#C9A84C]" : ""}`} />
                  Favorite
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded border border-white/20 text-white hover:border-[#C9A84C]/50 transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      {adminModals}
    </div>
  );
}
