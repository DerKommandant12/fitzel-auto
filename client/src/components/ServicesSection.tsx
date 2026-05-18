/*
 * ServicesSection — Refined European Elegance
 * White background, alternating layout with service garage image
 * Gold icon accents, editorial serif headings
 */
import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Wrench, ShieldCheck, FileSearch, CreditCard, Car, Star } from "lucide-react";

const TBI_BANK_LOGO =
  "https://res.cloudinary.com/djgk2muyc/image/upload/v1779138739/Tbi_Bank_id28uhzJQh_0_jj8xzm.png";
const TBI_FINANCING_WHATSAPP =
  "https://wa.me/40743691717?text=Buna%20ziua%2C%20sunt%20interesat%20de%20o%20finantare%20prin%20TBI%20Bank";

const services: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Car,
    title: "Vânzare Automobile",
    description: "Gamă largă de vehicule second-hand verificate, de la mărci europene și asiatice de top, la prețuri competitive.",
  },
  {
    icon: FileSearch,
    title: "Inspecție Tehnică",
    description: "Fiecare mașină din stocul nostru trece printr-o inspecție tehnică completă înainte de vânzare.",
  },
  {
    icon: ShieldCheck,
    title: "Garanție Post-Vânzare",
    description: "Oferim perioadă de garanție și suport tehnic după achiziție pentru liniștea dumneavoastră.",
  },
  {
    icon: Wrench,
    title: "Service Auto",
    description: "Servicii de întreținere și reparații auto realizate de mecanici cu experiență, cu piese originale.",
  },
  {
    icon: CreditCard,
    title: "Finanțare & Rate",
    description: "Vă ajutăm să găsiți cea mai bună soluție de finanțare sau leasing pentru vehiculul dorit.",
  },
  {
    icon: Star,
    title: "Consultanță Personalizată",
    description: "Echipa noastră vă ghidează în alegerea mașinii potrivite nevoilor și bugetului dumneavoastră.",
  },
];

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function TbiFinancingCard({ visible, delay }: { visible: boolean; delay: string }) {
  return (
    <div
      className={`reveal ${visible ? "visible" : ""} group p-5 rounded-lg border border-[#e8e4dc] bg-white hover:border-[#C9A84C]/40 hover:shadow-md transition-all duration-300 flex flex-col`}
      style={{ transitionDelay: delay }}
    >
      <img
        src={TBI_BANK_LOGO}
        alt="TBI Bank"
        style={{ height: "48px", objectFit: "contain" }}
        className="mb-4 w-auto max-w-full"
      />
      <h3
        className="text-[#1A2B4A] font-bold text-base mb-2"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Finanțare prin TBI Bank
      </h3>
      <p
        className="text-[#1A2B4A]/60 text-sm leading-relaxed flex-1 mb-4"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        Îți dorești mașina visurilor tale dar nu ai toți banii acum? Te ajutăm cu o finanțare
        rapidă prin TBI Bank — rate avantajoase, aprobare în aceeași zi.
      </p>
      <a
        href={TBI_FINANCING_WHATSAPP}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 w-full rounded-md px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#25D366", fontFamily: "'DM Sans', sans-serif" }}
      >
        <WhatsAppIcon className="w-5 h-5 flex-shrink-0" />
        Întreabă despre finanțare
      </a>
    </div>
  );
}

export default function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" className="py-20 lg:py-28 bg-[#F8F6F2]" ref={ref}>
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-10 bg-[#C9A84C]" />
          <span className="section-label">Ce Oferim</span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-14 gap-6">
          <h2
            className="text-4xl lg:text-5xl font-bold text-[#1A2B4A] leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Servicii complete
            <br />
            <span className="italic text-[#C9A84C]">sub același acoperiș</span>
          </h2>
          <p
            className="max-w-sm text-[#1A2B4A]/60 text-base leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            De la achiziție până la întreținere, suntem partenerul dumneavoastră 
            de încredere în toate aspectele legate de automobil.
          </p>
        </div>

        {/* Two-column layout: services grid + image */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Services grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {services.slice(0, 3).map((service, i) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className={`reveal ${visible ? "visible" : ""} group p-5 rounded-lg border border-[#e8e4dc] bg-white hover:border-[#C9A84C]/40 hover:shadow-md transition-all duration-300`}
                  style={{ transitionDelay: `${i * 0.08}s` }}
                >
                  <div className="w-10 h-10 rounded bg-[#F8F6F2] flex items-center justify-center mb-4 group-hover:bg-[#C9A84C]/10 transition-colors duration-300">
                    <Icon className="w-5 h-5 text-[#C9A84C]" strokeWidth={1.8} />
                  </div>
                  <h3
                    className="text-[#1A2B4A] font-bold text-base mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {service.title}
                  </h3>
                  <p
                    className="text-[#1A2B4A]/60 text-sm leading-relaxed"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {service.description}
                  </p>
                </div>
              );
            })}
            <TbiFinancingCard visible={visible} delay="0.24s" />
            {services.slice(3).map((service, i) => {
              const Icon = service.icon;
              const gridIndex = i + 4;
              return (
                <div
                  key={service.title}
                  className={`reveal ${visible ? "visible" : ""} group p-5 rounded-lg border border-[#e8e4dc] bg-white hover:border-[#C9A84C]/40 hover:shadow-md transition-all duration-300`}
                  style={{ transitionDelay: `${gridIndex * 0.08}s` }}
                >
                  <div className="w-10 h-10 rounded bg-[#F8F6F2] flex items-center justify-center mb-4 group-hover:bg-[#C9A84C]/10 transition-colors duration-300">
                    <Icon className="w-5 h-5 text-[#C9A84C]" strokeWidth={1.8} />
                  </div>
                  <h3
                    className="text-[#1A2B4A] font-bold text-base mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {service.title}
                  </h3>
                  <p
                    className="text-[#1A2B4A]/60 text-sm leading-relaxed"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>


        </div>
      </div>
    </section>
  );
}
