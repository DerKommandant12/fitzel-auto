/*
 * HeroSection — Refined European Elegance
 * Full-bleed background with grain overlay, left-anchored editorial text
 * Dark overlay for text contrast, gold accent elements
 */
import { Car, MapPin, ChevronDown, MessageCircle, Phone } from "lucide-react";

const HERO_IMAGE =
  "https://res.cloudinary.com/djgk2muyc/image/upload/ar_16:9,c_auto,w_1536/regenereaza_aceasta_poza_cu_masini_202605160024_a9czd3.jpg";
const HERO_WHATSAPP = "https://wa.me/40743691717";

export default function HeroSection() {
  const scrollToInventory = () => {
    document.querySelector("#inventory")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative h-screen flex items-center overflow-hidden"
    >
      {/* Background Image */}
      <img
        src={HERO_IMAGE}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Dark gradient overlay — image is dark/night, white text is safe */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d1a2e]/90 via-[#0d1a2e]/70 to-[#0d1a2e]/30" />

      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 max-w-7xl pt-20">
        <div className="max-w-2xl">
          {/* Section label */}
          <div className="flex items-center gap-3 mb-6 animate-fade-in">
            <div className="h-px w-10 bg-[#C9A84C]" />
            <span className="section-label text-[#C9A84C]">Dealer Auto · Spătărești</span>
          </div>

          {/* Headline */}
          <h1
            className="text-5xl lg:text-7xl font-bold text-white leading-[1.05] mb-6 animate-fade-in-up"
            style={{ fontFamily: "'Playfair Display', serif", animationDelay: "0.1s" }}
          >
            Mașina ta
            <br />
            <span className="italic text-[#C9A84C]">perfectă</span>
            <br />
            te așteaptă
          </h1>

          {/* Subtitle */}
          <p
            className="text-white/75 text-lg lg:text-xl leading-relaxed mb-8 max-w-lg animate-fade-in-up"
            style={{ fontFamily: "'DM Sans', sans-serif", animationDelay: "0.2s" }}
          >
            Automobile verificate, prețuri corecte și servicii de calitate. 
            Vă ajutăm să găsiți vehiculul ideal pentru nevoile dumneavoastră.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-wrap items-center gap-3 mb-10 animate-fade-in-up"
            style={{ animationDelay: "0.3s", fontFamily: "'DM Sans', sans-serif" }}
          >
            <button
              type="button"
              onClick={scrollToInventory}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C9A84C] hover:bg-[#b8943d] text-[#1A2B4A] px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:shadow-md hover:shadow-[#C9A84C]/25"
            >
              <Car className="w-4 h-4" strokeWidth={2} />
              Vezi Catalog
            </button>
            <a
              href="tel:0743691717"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/60 hover:border-white text-white px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:bg-white/10"
            >
              <Phone className="w-4 h-4" strokeWidth={2} />
              Sună Acum
            </a>
            <a
              href={HERO_WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contactează pe WhatsApp"
              className="inline-flex items-center justify-center rounded-full border border-white/60 hover:border-white text-white p-2.5 transition-all duration-200 hover:bg-white/10"
            >
              <MessageCircle className="w-4 h-4" strokeWidth={2} />
            </a>
          </div>

          {/* Info pills */}
          <div
            className="flex flex-wrap gap-4 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <MapPin className="w-4 h-4 text-[#C9A84C]" />
              <span style={{ fontFamily: "'DM Sans', sans-serif" }}>727573 Spătărești</span>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
              <span style={{ fontFamily: "'DM Sans', sans-serif" }}>Lun–Sâm: 08:00–18:00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToInventory}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/50 hover:text-white transition-colors duration-200 animate-bounce"
        aria-label="Scroll down"
      >
        <ChevronDown className="w-7 h-7" />
      </button>
    </section>
  );
}
