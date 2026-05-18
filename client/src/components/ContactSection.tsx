/*
 * ContactSection — Refined European Elegance
 * Navy background with gold accents, contact form, embedded map
 * Editorial layout, trust signals
 */
import { useState } from "react";
import { Phone, MapPin, Clock, Mail, Send, CheckCircle2 } from "lucide-react";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: "", phone: "", message: "" });
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-[#1A2B4A]">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-[#C9A84C]" />
            <span className="section-label text-[#C9A84C]">Luați Legătura</span>
            <div className="h-px w-10 bg-[#C9A84C]" />
          </div>
          <h2
            className="text-4xl lg:text-5xl font-bold text-white leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Suntem aici pentru
            <br />
            <span className="italic text-[#C9A84C]">dumneavoastră</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact info + form */}
          <div>
            {/* Contact details */}
            <div className="space-y-5 mb-10">
              {[
                {
                  icon: Phone,
                  label: "Telefon",
                  value: "0743 691 717",
                  href: "tel:0743691717",
                },
                {
                  icon: MapPin,
                  label: "Adresă",
                  value: "727573 Spătărești, România",
                  href: "https://maps.google.com/?q=Spătărești,Romania",
                },
                {
                  icon: Clock,
                  label: "Program",
                  value: "Lun–Vin: 08–18 | Sâm: 09–15",
                  href: undefined,
                },
                {
                  icon: Mail,
                  label: "Email",
                  value: "ovi_beredecasa@yahoo.com",
                  href: "mailto:ovi_beredecasa@yahoo.com",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded bg-[#C9A84C]/15 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-[#C9A84C]" strokeWidth={1.8} />
                    </div>
                    <div>
                      <div
                        className="text-white/50 text-xs uppercase tracking-wider mb-0.5"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {item.label}
                      </div>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-white font-medium text-base hover:text-[#C9A84C] transition-colors duration-200"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span
                          className="text-white font-medium text-base"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {item.value}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Gold divider */}
            <div className="gold-rule mb-8" />

            {/* Contact form */}
            <div>
              <h3
                className="text-white font-bold text-xl mb-5"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Trimiteți un mesaj
              </h3>

              {submitted ? (
                <div className="flex items-center gap-3 bg-[#C9A84C]/15 border border-[#C9A84C]/30 rounded-lg p-5">
                  <CheckCircle2 className="w-6 h-6 text-[#C9A84C]" />
                  <div>
                    <div
                      className="text-white font-semibold text-sm"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Mesaj trimis cu succes!
                    </div>
                    <div
                      className="text-white/60 text-xs"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Vă vom contacta în cel mai scurt timp.
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      className="block text-white/60 text-xs uppercase tracking-wider mb-1.5"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Nume complet
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-white/8 border border-white/15 rounded px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#C9A84C]/60 transition-colors duration-200 text-sm"
                      placeholder="Ion Popescu"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-white/60 text-xs uppercase tracking-wider mb-1.5"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Număr de telefon
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-white/8 border border-white/15 rounded px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#C9A84C]/60 transition-colors duration-200 text-sm"
                      placeholder="07XX XXX XXX"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-white/60 text-xs uppercase tracking-wider mb-1.5"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Mesaj
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full bg-white/8 border border-white/15 rounded px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#C9A84C]/60 transition-colors duration-200 text-sm resize-none"
                      placeholder="Sunt interesat de... / Aș dori informații despre..."
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#b8943d] text-[#1A2B4A] font-semibold py-3.5 rounded transition-colors duration-200"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    <Send className="w-4 h-4" />
                    Trimite Mesajul
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Map */}
          <div className="flex flex-col gap-6">
            <div className="rounded-xl overflow-hidden flex-1 min-h-80 lg:min-h-0 shadow-xl shadow-black/30">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d389.99342782619374!2d26.291647777483835!3d47.433068229807205!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47351b3f06c4c0b7%3A0xce495e3931347cd8!2sAutomobile%20Fitzel%20Pot!5e0!3m2!1sro!2sro!4v1778882338603!5m2!1sro!2sro"
                width="100%"
                height="450"
                style={{ border: "none", borderRadius: "12px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Automobile Fitzel Pot — locație pe hartă"
              />
            </div>

            {/* Directions CTA */}
            <a
              href="https://maps.google.com/?q=Spătărești,Neamț,Romania"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-white/20 hover:border-[#C9A84C]/50 text-white hover:text-[#C9A84C] font-medium py-3.5 rounded transition-all duration-200"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <MapPin className="w-4 h-4" />
              Obțineți indicații de orientare
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
