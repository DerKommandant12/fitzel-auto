/*
 * InventorySection — Refined European Elegance
 * Display cars with advanced filters: budget, transmission, fuel, mileage
 * Enhanced carousel with lightbox for full-size image viewing
 */
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Phone, MessageSquare, CheckCircle2, Fuel, Settings, Calendar, Filter, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCarInventory } from "@/hooks/useCarInventory";
import ImageLightbox from "./ImageLightbox";

const INVENTORY_IMAGE = "/manus-storage/inventory-cars_f3fb4bd2.jpg";

const highlights = [
  "Mașini second-hand verificate tehnic",
  "Documentație completă și legală",
  "Prețuri corecte, fără costuri ascunse",
  "Posibilitate de test drive",
  "Consiliere personalizată la fața locului",
  "Stoc în continuă reînnoire",
];

const priceRanges = [
  { label: "Toate", min: 0, max: Infinity },
  { label: "0 - 5.000€", min: 0, max: 5000 },
  { label: "5.000€ - 10.000€", min: 5000, max: 10000 },
  { label: "10.000€ - 20.000€", min: 10000, max: 20000 },
  { label: "20.000€+", min: 20000, max: Infinity },
];

const transmissionOptions = ["Toate", "Manual", "Automat", "CVT"];
const fuelOptions = ["Toate", "Benzină", "Diesel", "Hibrid", "Electric", "GPL"];
const mileageRanges = [
  { label: "Toate", min: 0, max: Infinity },
  { label: "0 - 50.000 km", min: 0, max: 50000 },
  { label: "50.000 - 100.000 km", min: 50000, max: 100000 },
  { label: "100.000 - 150.000 km", min: 100000, max: 150000 },
  { label: "150.000+ km", min: 150000, max: Infinity },
];

function parsePriceString(priceStr: string): number {
  const cleaned = priceStr.replace(/[^\d,.-]/g, "").replace(",", ".");
  return parseFloat(cleaned) || 0;
}

function parseKmString(kmStr: string): number {
  const cleaned = kmStr.replace(/[^\d,.-]/g, "").replace(",", ".");
  return parseFloat(cleaned) || 0;
}

function CarCard({ car, delay }: { car: any; delay: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [visible, setVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [lightboxOpen]);

  const images = car.images && car.images.length > 0 ? car.images : [];
  const realImages = images.filter((img: string) => img !== "icon-car");
  const currentImage = images[currentImageIndex];

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Only open lightbox if there are real images
    if (realImages.length > 0) {
      setLightboxOpen(true);
    }
  };

  return (
    <>
      <Link
        ref={ref}
        to={`/masini/${car.id}`}
        className={`reveal ${visible ? "visible" : ""} card-hover bg-white rounded-lg overflow-hidden shadow-sm border border-[#e8e4dc] block`}
        style={{ transitionDelay: `${delay}s` }}
      >
        {/* Image carousel */}
        <div className="relative overflow-hidden h-48 bg-[#F8F6F2] cursor-pointer group flex items-center justify-center">
          {currentImage === "icon-car" ? (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <svg className="w-20 h-20 text-[#1A2B4A]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm11 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM5 11l1.5-4.5h11L19 11H5z" />
              </svg>
              <p className="text-xs text-[#1A2B4A] mt-2 font-medium">Imagine indisponibila</p>
            </div>
          ) : currentImage ? (
            <>
              <img
                src={currentImage}
                alt={`${car.make} ${car.model}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onClick={openLightbox}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              {/* Image counter and nav - ALWAYS VISIBLE */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all z-10"
                    title="Poza anterioara"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all z-10"
                    title="Poza urmatoare"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <div className="absolute bottom-1 sm:bottom-2 left-1/2 transform -translate-x-1/2 bg-black/60 text-white text-xs px-2 sm:px-3 py-1 rounded font-semibold">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
              {/* Click to expand hint */}
              <div className="absolute top-2 right-2 bg-white/80 text-[#1A2B4A] text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Apasă pentru mărire
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#1A2B4A]/20">
              <span className="text-sm">Fără imagine</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="mb-3">
            <h3
              className="text-xl font-bold text-[#1A2B4A] leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {car.make} {car.model}
            </h3>
            <p
              className="text-[#C9A84C] font-semibold text-sm"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {car.year}
            </p>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-y border-[#f0ece4]">
            <div className="text-center">
              <Fuel className="w-4 h-4 text-[#C9A84C] mx-auto mb-1" />
              <span
                className="text-xs text-[#1A2B4A]/70 block"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {car.fuel}
              </span>
            </div>
            <div className="text-center">
              <Settings className="w-4 h-4 text-[#C9A84C] mx-auto mb-1" />
              <span
                className="text-xs text-[#1A2B4A]/70 block"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {car.transmission}
              </span>
            </div>
            <div className="text-center">
              <Calendar className="w-4 h-4 text-[#C9A84C] mx-auto mb-1" />
              <span
                className="text-xs text-[#1A2B4A]/70 block"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {car.km}
              </span>
            </div>
          </div>

          {/* Description */}
          {car.description && (
            <p
              className="text-[#1A2B4A]/60 text-xs mb-3 line-clamp-2"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {car.description}
            </p>
          )}

          {/* Price + CTA */}
          <div className="flex items-center justify-between">
            <div
              className="text-2xl font-bold text-[#1A2B4A]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {car.price}
            </div>
            <a
              href="tel:0743691717"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 bg-[#1A2B4A] hover:bg-[#243d5e] text-white text-sm font-medium px-4 py-2 rounded transition-colors duration-200"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <Phone className="w-3.5 h-3.5" />
              Sună
            </a>
          </div>
        </div>
      </Link>

      {/* Lightbox - pass all images, filter happens inside */}
      {lightboxOpen && realImages.length > 0 && (
        <ImageLightbox
          images={realImages}
          currentIndex={Math.max(0, realImages.indexOf(currentImage))}
          onClose={() => setLightboxOpen(false)}
          onNext={() => {
            const idx = Math.max(0, realImages.indexOf(currentImage));
            const nextIdx = (idx + 1) % realImages.length;
            setCurrentImageIndex(images.indexOf(realImages[nextIdx]));
          }}
          onPrev={() => {
            const idx = Math.max(0, realImages.indexOf(currentImage));
            const prevIdx = (idx - 1 + realImages.length) % realImages.length;
            setCurrentImageIndex(images.indexOf(realImages[prevIdx]));
          }}
        />
      )}
    </>
  );
}

const CARS_PER_PAGE = 6;

export default function InventorySection() {
  const { cars, loaded } = useCarInventory();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter states
  const [selectedPrice, setSelectedPrice] = useState(0); // "Toate"
  const [selectedTransmission, setSelectedTransmission] = useState("Toate");
  const [selectedFuel, setSelectedFuel] = useState("Toate");
  const [selectedMileage, setSelectedMileage] = useState(0); // "Toate"

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  if (!loaded) return null;

  // Apply all filters
  const filteredCars = cars.filter((car) => {
    // Price filter
    const priceRange = priceRanges[selectedPrice];
    const carPrice = parsePriceString(car.price);
    if (carPrice < priceRange.min || carPrice >= priceRange.max) return false;

    // Transmission filter
    if (selectedTransmission !== "Toate" && car.transmission !== selectedTransmission) return false;

    // Fuel filter
    if (selectedFuel !== "Toate" && car.fuel !== selectedFuel) return false;

    // Mileage filter
    const mileageRange = mileageRanges[selectedMileage];
    const carKm = parseKmString(car.km);
    if (carKm < mileageRange.min || carKm >= mileageRange.max) return false;

    return true;
  });

  // Check if any filter is active (not default)
  const hasActiveFilters =
    selectedPrice !== 0 ||
    selectedTransmission !== "Toate" ||
    selectedFuel !== "Toate" ||
    selectedMileage !== 0;

  const resetFilters = () => {
    setSelectedPrice(0);
    setSelectedTransmission("Toate");
    setSelectedFuel("Toate");
    setSelectedMileage(0);
    setCurrentPage(1);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredCars.length / CARS_PER_PAGE);
  const startIdx = (currentPage - 1) * CARS_PER_PAGE;
  const paginatedCars = filteredCars.slice(startIdx, startIdx + CARS_PER_PAGE);

  // Reset to page 1 when filters change
  const handleFilterChange = (setter: any, value: any) => {
    setter(value);
    setCurrentPage(1);
  };

  // Scroll to top when page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // If no cars, show inquiry form
  if (cars.length === 0) {
    return (
      <section id="inventory" className="py-20 lg:py-28 bg-[#F8F6F2]" ref={ref}>
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-14 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-10 bg-[#C9A84C]" />
                <span className="section-label">Inventar Auto</span>
              </div>
              <h2
                className="text-4xl lg:text-5xl font-bold text-[#1A2B4A] leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Mașini pentru
                <br />
                <span className="italic text-[#C9A84C]">orice buget</span>
              </h2>
            </div>
            <div className="max-w-sm">
              <p
                className="text-[#1A2B4A]/60 text-base leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Stocul nostru se reînnoiește permanent. Sunați-ne sau vizitați-ne 
                pentru a afla vehiculele disponibile în acest moment.
              </p>
            </div>
          </div>

          {/* Full-width image banner */}
          <div
            className={`reveal ${visible ? "visible" : ""} relative rounded-xl overflow-hidden mb-14 h-64 lg:h-96 shadow-xl shadow-[#1A2B4A]/10`}
          >
            <img
              src={INVENTORY_IMAGE}
              alt="Inventar auto Fitzel Pot"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A2B4A]/75 via-[#1A2B4A]/40 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="px-8 lg:px-14 max-w-lg">
                <p
                  className="text-[#C9A84C] text-xs uppercase tracking-widest mb-2"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Stoc permanent disponibil
                </p>
                <h3
                  className="text-white text-3xl lg:text-4xl font-bold leading-tight mb-4"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Vehicule verificate,
                  <br />
                  prețuri corecte
                </h3>
                <a
                  href="tel:0743691717"
                  className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#b8943d] text-[#1A2B4A] font-semibold px-6 py-3 rounded text-sm transition-colors duration-200"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <Phone className="w-4 h-4" strokeWidth={2.5} />
                  Aflați stocul disponibil
                </a>
              </div>
            </div>
          </div>

          {/* Two-column: highlights + CTA card */}
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Highlights list */}
            <div className={`reveal ${visible ? "visible" : ""}`} style={{ transitionDelay: "0.1s" }}>
              <h3
                className="text-2xl font-bold text-[#1A2B4A] mb-6"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                De ce să cumpărați de la noi?
              </h3>
              <ul className="space-y-4">
                {highlights.map((item, i) => (
                  <li
                    key={item}
                    className={`reveal ${visible ? "visible" : ""} flex items-start gap-3`}
                    style={{ transitionDelay: `${0.15 + i * 0.07}s` }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#C9A84C] flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <span
                      className="text-[#1A2B4A]/75 text-base"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA card */}
            <div
              className={`reveal ${visible ? "visible" : ""} bg-[#1A2B4A] rounded-xl p-8 lg:p-10`}
              style={{ transitionDelay: "0.2s" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-[#C9A84C]" />
                <span className="section-label text-[#C9A84C]">Contactați-ne</span>
              </div>
              <h3
                className="text-white text-2xl lg:text-3xl font-bold mb-3 leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Căutați o anumită mașină?
              </h3>
              <p
                className="text-white/60 text-sm leading-relaxed mb-8"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Spuneți-ne ce model, an și buget aveți în vedere. Vă ajutăm să găsiți 
                vehiculul potrivit din stocul nostru sau vă anunțăm când apare.
              </p>

              <div className="space-y-3">
                <a
                  href="tel:0743691717"
                  className="flex items-center justify-center gap-2.5 w-full bg-[#C9A84C] hover:bg-[#b8943d] text-[#1A2B4A] font-semibold py-4 rounded transition-colors duration-200"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <Phone className="w-4 h-4" strokeWidth={2.5} />
                  Sunați: 0743 691 717
                </a>
                <button
                  onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
                  className="flex items-center justify-center gap-2.5 w-full border border-white/20 hover:border-[#C9A84C]/50 text-white hover:text-[#C9A84C] font-medium py-4 rounded transition-all duration-200"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <MessageSquare className="w-4 h-4" />
                  Trimiteți un mesaj
                </button>
              </div>

              <p
                className="text-white/30 text-xs text-center mt-5"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Program: Lun–Vin 08–18 · Sâm 09–15
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // If cars exist, show them in a grid with filters
  return (
    <section id="inventory" className="py-20 lg:py-28 bg-[#F8F6F2]" ref={ref}>
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-8 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-[#C9A84C]" />
              <span className="section-label">Inventar Curent</span>
            </div>
            <h2
              className="text-4xl lg:text-5xl font-bold text-[#1A2B4A] leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Vehicule disponibile
              <br />
              <span className="italic text-[#C9A84C]">acum</span>
            </h2>
          </div>
          <div className="max-w-xs">
            <p
              className="text-[#1A2B4A]/60 text-base leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Toate vehiculele sunt verificate tehnic și au documentele în regulă. 
              Sunați pentru detalii sau o programare de test drive.
            </p>
          </div>
        </div>

        {/* Filter Toggle Button */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-[#1A2B4A] hover:bg-[#243d5e] text-white font-medium px-4 py-2.5 rounded transition-colors"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <Filter className="w-4 h-4" />
            {showFilters ? "Ascunde Filtre" : "Arată Filtre"}
          </button>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 text-[#1A2B4A]/60 hover:text-[#C9A84C] text-sm font-medium transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <X className="w-4 h-4" />
              Resetează Filtre
            </button>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-8 p-6 bg-white rounded-lg border border-[#e8e4dc] space-y-6">
            {/* Price Filter */}
            <div>
              <label
                className="block text-xs uppercase tracking-wider text-[#1A2B4A]/60 mb-3 font-semibold"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Preț
              </label>
              <div className="flex flex-wrap gap-2">
                {priceRanges.map((range, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleFilterChange(setSelectedPrice, idx)}
                    className={`px-3 py-2 rounded text-sm font-medium transition-all duration-200 ${
                      selectedPrice === idx
                        ? "bg-[#1A2B4A] text-white"
                        : "bg-[#F8F6F2] border border-[#e8e4dc] text-[#1A2B4A] hover:border-[#C9A84C]"
                    }`}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Transmission Filter */}
            <div>
              <label
                className="block text-xs uppercase tracking-wider text-[#1A2B4A]/60 mb-3 font-semibold"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Transmisie
              </label>
              <div className="flex flex-wrap gap-2">
                {transmissionOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleFilterChange(setSelectedTransmission, option)}
                    className={`px-3 py-2 rounded text-sm font-medium transition-all duration-200 ${
                      selectedTransmission === option
                        ? "bg-[#1A2B4A] text-white"
                        : "bg-[#F8F6F2] border border-[#e8e4dc] text-[#1A2B4A] hover:border-[#C9A84C]"
                    }`}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Fuel Filter */}
            <div>
              <label
                className="block text-xs uppercase tracking-wider text-[#1A2B4A]/60 mb-3 font-semibold"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Combustibil
              </label>
              <div className="flex flex-wrap gap-2">
                {fuelOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleFilterChange(setSelectedFuel, option)}
                    className={`px-3 py-2 rounded text-sm font-medium transition-all duration-200 ${
                      selectedFuel === option
                        ? "bg-[#1A2B4A] text-white"
                        : "bg-[#F8F6F2] border border-[#e8e4dc] text-[#1A2B4A] hover:border-[#C9A84C]"
                    }`}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Mileage Filter */}
            <div>
              <label
                className="block text-xs uppercase tracking-wider text-[#1A2B4A]/60 mb-3 font-semibold"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Kilometraj
              </label>
              <div className="flex flex-wrap gap-2">
                {mileageRanges.map((range, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleFilterChange(setSelectedMileage, idx)}
                    className={`px-3 py-2 rounded text-sm font-medium transition-all duration-200 ${
                      selectedMileage === idx
                        ? "bg-[#1A2B4A] text-white"
                        : "bg-[#F8F6F2] border border-[#e8e4dc] text-[#1A2B4A] hover:border-[#C9A84C]"
                    }`}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results count and pagination info */}
        <div className="mb-6 flex items-center justify-between text-sm text-[#1A2B4A]/60" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <span>{filteredCars.length} {filteredCars.length === 1 ? "mașină" : "mașini"} găsite</span>
          {totalPages > 1 && (
            <span>Pagina {currentPage} din {totalPages}</span>
          )}
        </div>

        {/* Cars Grid */}
        {filteredCars.length === 0 ? (
          <div className="text-center py-12">
            <p
              className="text-[#1A2B4A]/60 text-base mb-4"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Nu avem mașini care să corespundă criteriilor dvs. Încercați alte filtre sau contactați-ne!
            </p>
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-2 bg-[#1A2B4A] hover:bg-[#243d5e] text-white font-medium px-6 py-2.5 rounded transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <X className="w-4 h-4" />
              Resetează Filtre
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
              {paginatedCars.map((car, i) => (
                <CarCard key={car.id} car={car} delay={i * 0.1} />
              ))}
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mb-12">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1.5 px-4 py-2 rounded border border-[#e8e4dc] text-[#1A2B4A] hover:border-[#C9A84C] hover:text-[#C9A84C] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded font-medium text-sm transition-all ${
                        currentPage === page
                          ? "bg-[#1A2B4A] text-white"
                          : "border border-[#e8e4dc] text-[#1A2B4A] hover:border-[#C9A84C] hover:text-[#C9A84C]"
                      }`}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1.5 px-4 py-2 rounded border border-[#e8e4dc] text-[#1A2B4A] hover:border-[#C9A84C] hover:text-[#C9A84C] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Următor
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}

        {/* Bottom CTA */}
        <div className="text-center">
          <p
            className="text-[#1A2B4A]/60 mb-4"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Nu ați găsit ce căutați? Contactați-ne — avem mai multe opțiuni disponibile.
          </p>
          <a
            href="tel:0743691717"
            className="inline-flex items-center gap-2 bg-[#1A2B4A] hover:bg-[#243d5e] text-white font-semibold px-8 py-4 rounded transition-colors duration-200"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <Phone className="w-4 h-4" />
            Contactați-ne: 0743 691 717
          </a>
        </div>
      </div>
    </section>
  );
}
