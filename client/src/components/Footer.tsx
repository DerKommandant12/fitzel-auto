/*
 * Footer — Refined European Elegance
 * Dark navy, gold accents, clean editorial layout
 */
import { Phone, Clock } from "lucide-react";
import { FITZEL_LOGO_URL } from "@/lib/brand";
import { companyLegalLines } from "@/lib/company";

const TBI_BANK_LOGO =
  "https://res.cloudinary.com/djgk2muyc/image/upload/v1779138739/Tbi_Bank_id28uhzJQh_0_jj8xzm.png";
const TBI_WHATSAPP = "https://wa.me/40743691717";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0d1a2e] border-t border-white/5">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <img
                src={FITZEL_LOGO_URL}
                alt="Automobile Fitzel Pot"
                className="h-10 w-auto flex-shrink-0"
              />
              <div>
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
                  Fitzel Pot
                </div>
              </div>
            </div>
            <p
              className="text-white/40 text-sm leading-relaxed mb-4"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Dealer auto de încredere în Spătărești. Vehicule verificate, prețuri corecte, 
              servicii de calitate.
            </p>
            <div className="space-y-2 text-xs text-white/30" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {companyLegalLines().map(({ label, value }) => (
                <div key={label}>
                  <strong className="text-white/50">{label}:</strong> {value}
                </div>
              ))}
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h4
              className="text-white/80 font-semibold text-xs uppercase tracking-widest mb-4"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Link-uri Utile
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Termeni și Condiții", href: "/legal.html#termeni", external: true },
                { label: "Politica de Confidențialitate", href: "/legal.html#confidentialitate", external: true },
                { label: "Politica de Cookies", href: "/legal.html#cookies", external: true },
                { label: "Contact", href: "#contact" },
                { label: "ANPC", href: "https://anpc.ro/", external: true },
              ].map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/40 hover:text-[#C9A84C] text-sm transition-colors duration-200"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <a
                      href={link.href}
                      className="text-white/40 hover:text-[#C9A84C] text-sm transition-colors duration-200"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
            {/* SAL & SOL Badges */}
            <div className="flex gap-4 mt-6">
              <a
                href="https://anpc.ro/ce-este-sal/"
                target="_blank"
                rel="noopener noreferrer"
                title="SAL - Soluționarea Alternativă a Litigiilor"
              >
                <img
                  src="https://res.cloudinary.com/djgk2muyc/image/upload/v1778881882/SAL_fsetku.png"
                  alt="SAL"
                  className="h-16 object-contain hover:opacity-80 transition-opacity"
                />
              </a>
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                title="SOL - Soluționarea Online a Litigiilor"
              >
                <img
                  src="https://res.cloudinary.com/djgk2muyc/image/upload/v1778881897/SOL_a4ufr4.png"
                  alt="SOL"
                  className="h-16 object-contain hover:opacity-80 transition-opacity"
                />
              </a>
            </div>
          </div>

          {/* Contact Rapid */}
          <div>
            <h4
              className="text-white/80 font-semibold text-xs uppercase tracking-widest mb-4"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Contact Rapid
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#C9A84C] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white/60 text-xs mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Telefon:</div>
                  <a
                    href="tel:0743691717"
                    className="text-white/40 hover:text-white text-sm transition-colors duration-200"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    0743 691 717
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#C9A84C] text-xs flex-shrink-0 mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>@</span>
                <div>
                  <div className="text-white/60 text-xs mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Email:</div>
                  <a
                    href="mailto:ovi_beredecasa@yahoo.com"
                    className="text-white/40 hover:text-white text-sm transition-colors duration-200 break-all"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    ovi_beredecasa@yahoo.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#C9A84C] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white/60 text-xs mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Program:</div>
                  <div className="text-white/40 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Luni - Vineri: 09:00 - 18:00
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h4
              className="text-white/80 font-semibold text-xs uppercase tracking-widest mb-4"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Navigare
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Acasă", href: "#hero" },
                { label: "Inventar Auto", href: "#inventory" },
                { label: "Servicii", href: "#services" },
                { label: "Despre Noi", href: "#about" },
                { label: "Contact", href: "#contact" },
              ].map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-white/40 hover:text-[#C9A84C] text-sm transition-colors duration-200"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* TBI Bank */}
        <div className="border-t border-white/10 pt-4 mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <img
            src={TBI_BANK_LOGO}
            alt="TBI Bank"
            className="h-8 w-auto object-contain flex-shrink-0"
          />
          <p
            className="text-white/45 text-xs sm:text-sm text-center flex-1"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Finanțare disponibilă prin TBI Bank
          </p>
          <a
            href={TBI_WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors flex-shrink-0"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <span className="w-2 h-2 rounded-full bg-[#25D366]" aria-hidden />
            WhatsApp
          </a>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <p
              className="text-white/25 text-xs"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              © {currentYear} Automobile Fitzel Pot. Toate drepturile rezervate.
            </p>

          </div>
          <div className="flex items-center gap-4">
            <p
              className="text-white/20 text-xs"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              727573 Spătărești · 0743 691 717
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
