/*
 * AdminButton — Admin access button in bottom-left corner
 * Discrete Portal link with icon
 */
import { Lock } from "lucide-react";

export default function AdminButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1A2B4A]/10 hover:bg-[#1A2B4A]/20 text-[#1A2B4A]/60 hover:text-[#1A2B4A] transition-all duration-200"
      title="Admin Portal"
      aria-label="Admin Portal"
    >
      <Lock className="w-4 h-4" strokeWidth={1.5} />
      <span className="text-sm font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        Portal
      </span>
    </button>
  );
}
