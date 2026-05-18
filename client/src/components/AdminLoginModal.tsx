/*
 * AdminLoginModal — Firebase Authentication for admin panel
 * Login with email and password
 */
import { useState } from "react";
import { Lock, X, AlertCircle } from "lucide-react";

export default function AdminLoginModal({
  isOpen,
  onClose,
  onLogin,
}: {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<boolean>;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await onLogin(email, password);
      if (success) {
        setEmail("");
        setPassword("");
        onClose();
      } else {
        setError("Email sau parolă incorectă. Încercați din nou.");
      }
    } catch (err) {
      setError("Eroare la conectare. Încercați din nou.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e8e4dc] p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/15 flex items-center justify-center">
              <Lock className="w-5 h-5 text-[#C9A84C]" strokeWidth={2} />
            </div>
            <h2
              className="text-xl font-bold text-[#1A2B4A]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Acces Admin
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#1A2B4A]/40 hover:text-[#1A2B4A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p
            className="text-[#1A2B4A]/60 text-sm mb-6"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Introduceți email și parola pentru a accesa panoul de administrare.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-xs uppercase tracking-wider text-[#1A2B4A]/60 mb-2 font-semibold"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="Introduceți email-ul..."
                className="w-full border border-[#e8e4dc] rounded px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C] transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                disabled={loading}
              />
            </div>

            <div>
              <label
                className="block text-xs uppercase tracking-wider text-[#1A2B4A]/60 mb-2 font-semibold"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Parolă
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleSubmit(e as any);
                }}
                placeholder="Introduceți parola..."
                className="w-full border border-[#e8e4dc] rounded px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C] transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                disabled={loading}
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 rounded p-3">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p
                  className="text-red-600 text-xs"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full bg-[#C9A84C] hover:bg-[#b8943d] disabled:bg-[#C9A84C]/50 disabled:cursor-not-allowed text-[#1A2B4A] font-semibold py-3 rounded transition-colors duration-200"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {loading ? "Se conectează..." : "Conectare"}
            </button>

            <p
              className="text-[#1A2B4A]/40 text-xs text-center"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Doar administratorii au acces la această secțiune.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
