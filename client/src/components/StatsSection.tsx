/*
 * StatsSection — Refined European Elegance
 * Navy background, gold accent numbers, editorial serif typography
 * Scroll-triggered counter animations
 */
import { useEffect, useRef, useState } from "react";

interface Stat {
  value: number;
  suffix: string;
  label: string;
  description: string;
}

const stats: Stat[] = [
  { value: 4, suffix: "+", label: "Ani de Experiență", description: "Servim comunitatea din Spătărești" },
  { value: 89, suffix: "+", label: "Mașini Vândute", description: "Clienți mulțumiți în toată România" },
  { value: 100, suffix: "%", label: "Verificate Tehnic", description: "Fiecare mașină trece prin inspecție" },
  { value: 24, suffix: "h", label: "Suport Clienți", description: "Răspundem la orice întrebare" },
];

function CountUp({ target, suffix, active }: { target: number; suffix: string; active: boolean }) {
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

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-[#1A2B4A] py-20 lg:py-28" ref={ref}>
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-[#C9A84C]" />
            <span className="section-label text-[#C9A84C]">De ce să ne alegeți</span>
            <div className="h-px w-10 bg-[#C9A84C]" />
          </div>
          <h2
            className="text-3xl lg:text-4xl font-bold text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Cifre care vorbesc de la sine
          </h2>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center reveal ${visible ? "visible" : ""}`}
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              <div
                className="text-5xl lg:text-6xl font-bold text-[#C9A84C] mb-2 leading-none"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                <CountUp target={stat.value} suffix={stat.suffix} active={visible} />
              </div>
              <div
                className="text-white font-semibold text-sm lg:text-base mb-1"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {stat.label}
              </div>
              <div
                className="text-white/50 text-xs lg:text-sm leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
