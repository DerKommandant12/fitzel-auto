/*
 * ImageLightbox — Full-size image viewer modal with zoom and thumbnail gallery
 * Displays image in lightbox with navigation, zoom, close button, and thumbnail gallery
 */
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useState, useRef } from "react";

export default function ImageLightbox({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const [zoom, setZoom] = useState(1);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  // Desktop: Double-click to zoom
  const handleDoubleClick = () => {
    if (zoom > 1) {
      setZoom(1);
      setPanX(0);
      setPanY(0);
    } else {
      setZoom(2);
    }
  };

  // Desktop: Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => Math.max(1, Math.min(3, prev + delta)));
  };

  // Desktop: Click and drag when zoomed
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPanX(e.clientX - dragStart.x);
      setPanY(e.clientY - dragStart.y);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Mobile: Pinch to zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setTouchStart({ x: dist, y: 0 });
    } else if (e.touches.length === 1) {
      setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = (dist - touchStart.x) * 0.01;
      setZoom((prev) => Math.max(1, Math.min(3, prev + delta)));
      setTouchStart({ x: dist, y: 0 });
    }
  };

  // Mobile: Double tap to zoom
  const [lastTap, setLastTap] = useState(0);
  const handleTouchEnd = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      handleDoubleClick();
    }
    setLastTap(now);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "+") setZoom((prev) => Math.min(prev + 0.2, 3));
      if (e.key === "-") setZoom((prev) => Math.max(prev - 0.2, 1));
      if (e.key === "t") setShowThumbnails((prev) => !prev);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrev]);

  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 3));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 1));
  const resetZoom = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  if (!images || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4">
      {/* Top bar: Close button and image counter */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <div className="text-white/60 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Imagine {currentIndex + 1} din {images.length}
        </div>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white transition-colors"
          title="Închide (Esc)"
        >
          <X className="w-8 h-8" />
        </button>
      </div>

      {/* Main image container with zoom */}
      <div
        className="relative w-full flex-1 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          ref={imgRef}
          src={currentImage}
          alt={`Imagine ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain transition-transform duration-200 select-none"
          style={{
            transform: `scale(${zoom}) translate(${panX / zoom}px, ${panY / zoom}px)`,
            cursor: zoom > 1 ? "grab" : "default",
          }}
          onDoubleClick={handleDoubleClick}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={onPrev}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-colors"
              title="Precedenta (←)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-colors"
              title="Următoarea (→)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail gallery */}
      {showThumbnails && images.length > 1 && (
        <div className="w-full mt-4 px-4 pb-4">
          <div className="flex gap-2 overflow-x-auto pb-2 justify-center">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  // Update current index by clicking thumbnail
                  const diff = idx - currentIndex;
                  if (diff > 0) {
                    for (let i = 0; i < diff; i++) onNext();
                  } else if (diff < 0) {
                    for (let i = 0; i < -diff; i++) onPrev();
                  }
                }}
                className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all ${
                  idx === currentIndex
                    ? "border-[#C9A84C] shadow-lg shadow-[#C9A84C]/50"
                    : "border-white/20 hover:border-white/40"
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom bar: Zoom controls and toggle thumbnails */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-3 bg-black/50 px-4 py-3 rounded-full">
        <button
          onClick={zoomOut}
          disabled={zoom <= 1}
          className="text-white/60 hover:text-white disabled:opacity-30 transition-colors"
          title="Micșorează (−)"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <div className="text-white/60 text-sm min-w-12 text-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {Math.round(zoom * 100)}%
        </div>
        <button
          onClick={zoomIn}
          disabled={zoom >= 3}
          className="text-white/60 hover:text-white disabled:opacity-30 transition-colors"
          title="Mărește (+)"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        {zoom > 1 && (
          <>
            <div className="w-px h-5 bg-white/20" />
            <button
              onClick={resetZoom}
              className="text-white/60 hover:text-white text-xs font-medium transition-colors"
              title="Resetează zoom"
            >
              Reset
            </button>
          </>
        )}
        {images.length > 1 && (
          <>
            <div className="w-px h-5 bg-white/20" />
            <button
              onClick={() => setShowThumbnails((prev) => !prev)}
              className="text-white/60 hover:text-white text-xs font-medium transition-colors"
              title="Toggle galerie (T)"
            >
              {showThumbnails ? "Ascunde" : "Galerie"}
            </button>
          </>
        )}
      </div>

      {/* Keyboard hints */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white/30 text-xs text-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div>Esc = Închide | ← → = Navighează | + − = Zoom | T = Galerie</div>
        <div className="text-white/20 mt-1">PC: Dublu-click/Scroll = Zoom | Drag = Mișcare | Mobil: Pinch/Tap = Zoom | Swipe = Navighează</div>
      </div>
    </div>
  );
}
