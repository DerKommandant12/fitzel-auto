/*
 * TestimonialsSection — Refined European Elegance
 * White background, editorial quote cards, gold star ratings
 */
import { useEffect, useRef, useState } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Alexandru M.",
    location: "Piatra Neamț",
    rating: 5,
    text: "Am cumpărat un Volkswagen Golf de la Fitzel Pot și sunt extrem de mulțumit. Mașina era exact cum a fost descrisă, fără surprize neplăcute. Recomand cu toată încrederea!",
  },
  {
    name: "Maria D.",
    location: "Roman",
    rating: 5,
    text: "Personal amabil și profesionist. M-au ajutat să găsesc mașina potrivită bugetului meu și au explicat tot procesul pas cu pas. O experiență plăcută de la început până la final.",
  },
  {
    name: "Gheorghe T.",
    location: "Bacău",
    rating: 5,
    text: "Al doilea automobil cumpărat de la Fitzel Pot. Prețuri corecte, documentație completă și mașini bine întreținute. Nu merg în altă parte.",
  },
];

const REVIEW_COUNT = 47;

function CountUp({ target, active }: { target: number; active: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const duration = 1800;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [active, target]);

  return <>{count}</>;
}

export default function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 lg:py-28 bg-white" ref={ref}>
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-[#C9A84C]" />
            <span className="section-label">Recenzii Clienți</span>
            <div className="h-px w-10 bg-[#C9A84C]" />
          </div>
          <h2
            className="text-4xl lg:text-5xl font-bold text-[#1A2B4A] leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Ce spun
            <br />
            <span className="italic text-[#C9A84C]">clienții noștri</span>
          </h2>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`reveal ${visible ? "visible" : ""} relative bg-[#F8F6F2] rounded-xl p-7 border border-[#e8e4dc]`}
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              {/* Quote icon */}
              <Quote
                className="w-8 h-8 text-[#C9A84C]/30 mb-4"
                strokeWidth={1.5}
              />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, si) => (
                  <Star
                    key={si}
                    className="w-4 h-4 text-[#C9A84C] fill-[#C9A84C]"
                  />
                ))}
              </div>

              {/* Text */}
              <p
                className="text-[#1A2B4A]/70 text-sm leading-relaxed mb-6 italic"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#e8e4dc]">
                <div className="w-9 h-9 rounded-full bg-[#1A2B4A] flex items-center justify-center flex-shrink-0">
                  <span
                    className="text-white text-sm font-bold"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {t.name[0]}
                  </span>
                </div>
                <div>
                  <div
                    className="text-[#1A2B4A] font-semibold text-sm"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {t.name}
                  </div>
                  <div
                    className="text-[#1A2B4A]/40 text-xs"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {t.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p
          className={`reveal ${visible ? "visible" : ""} mt-10 text-center text-sm text-[#1A2B4A]/50`}
          style={{ fontFamily: "'DM Sans', sans-serif", transitionDelay: "0.36s" }}
        >
          <span className="text-[#C9A84C] font-normal">
            +<CountUp target={REVIEW_COUNT} active={visible} />
          </span>{" "}
          recenzii verificate de clienți mulțumiți
        </p>
      </div>
    </section>
  );
}
