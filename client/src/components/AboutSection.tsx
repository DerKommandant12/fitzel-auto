/*
 * AboutSection — Refined European Elegance
 * Warm cream background, editorial layout with dealership image
 * Gold rule dividers, serif headings, trust-building content
 */
import { useEffect, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";

const ABOUT_IMAGE =
  "https://res.cloudinary.com/djgk2muyc/image/upload/ar_3:4,c_auto,w_1536/genereaza_o_poza_la_un_202605160012_xtsfez.jpg";

const promises = [
  "Transparență totală în prețuri și documentație",
  "Vehicule verificate tehnic înainte de vânzare",
  "Consultanță onestă adaptată bugetului dvs.",
  "Suport post-vânzare și service de calitate",
  "Documentație completă și legală garantată",
];

export default function AboutSection() {
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
    <section id="about" className="py-20 lg:py-28 bg-[#F8F6F2]" ref={ref}>
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Images collage */}
          <div className={`reveal-left ${visible ? "visible" : ""} relative`}>
            <div className="relative">
              {/* Main image - Mercedes with FITZEL POT plate */}
              <div className="rounded-xl overflow-hidden shadow-xl shadow-[#1A2B4A]/12">
                <img
                  src={ABOUT_IMAGE}
                  alt="Mercedes Fitzel Pot"
                  className="w-full object-cover aspect-[4/3]"
                />
              </div>


            </div>
          </div>

          {/* Text content */}
          <div className={`reveal-right ${visible ? "visible" : ""} pt-10 lg:pt-0`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-[#C9A84C]" />
              <span className="section-label">Povestea Noastră</span>
            </div>

            <h2
              className="text-4xl lg:text-5xl font-bold text-[#1A2B4A] leading-tight mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Dealer auto de
              <br />
              <span className="italic text-[#C9A84C]">încredere</span> în Spătărești
            </h2>

            <div className="gold-rule mb-6 w-16" />

            <p
              className="text-[#1A2B4A]/70 text-base leading-relaxed mb-5"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Automobile Fitzel Pot este un dealer auto cu experiență, dedicat comunității din 
              Spătărești și împrejurimi. Misiunea noastră este simplă: să vă ajutăm să găsiți 
              vehiculul potrivit la un preț corect, cu toată documentația în regulă.
            </p>

            <p
              className="text-[#1A2B4A]/70 text-base leading-relaxed mb-8"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Fiecare mașină din stocul nostru este selectată cu grijă, verificată tehnic și 
              pregătită pentru un nou proprietar. Credem că achiziționarea unui automobil 
              trebuie să fie o experiență plăcută, nu stresantă.
            </p>

            {/* Promises list */}
            <ul className="space-y-3 mb-8">
              {promises.map((promise) => (
                <li key={promise} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#C9A84C] flex-shrink-0 mt-0.5" strokeWidth={2} />
                  <span
                    className="text-[#1A2B4A]/75 text-sm leading-relaxed"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {promise}
                  </span>
                </li>
              ))}
            </ul>

            {/* Business hours */}
            <div className="bg-white rounded-lg p-5 border border-[#e8e4dc]">
              <h4
                className="text-[#1A2B4A] font-bold text-sm mb-3 uppercase tracking-wider"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Program de Lucru
              </h4>
              <div className="space-y-2">
                {[
                  { days: "Luni – Vineri", hours: "08:00 – 18:00" },
                  { days: "Sâmbătă", hours: "09:00 – 15:00" },
                  { days: "Duminică", hours: "Închis" },
                ].map((row) => (
                  <div key={row.days} className="flex justify-between items-center">
                    <span
                      className="text-[#1A2B4A]/60 text-sm"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {row.days}
                    </span>
                    <span
                      className={`text-sm font-medium ${row.hours === "Închis" ? "text-red-500" : "text-[#1A2B4A]"}`}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {row.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
