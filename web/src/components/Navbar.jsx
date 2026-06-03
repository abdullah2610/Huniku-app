import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  Menu,
  X,
  Search,
  Home,
  Building2,
  CreditCard,
  User,
  LogIn,
  UserPlus,
  LayoutDashboard,
} from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/search", label: "Cari", icon: Search },
  { href: "/pricing", label: "Harga", icon: CreditCard },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Detect scroll for shadow effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav
        className={`sticky top-0 z-50 backdrop-blur-xl transition-all ${
          scrolled ? "shadow-sm border-b border-[#E2E9F2]" : ""
        }`}
        style={{ backgroundColor: "rgba(238,242,248,0.9)" }}
        role="navigation"
        aria-label="Navigasi utama"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center font-black text-2xl tracking-tighter shrink-0"
            style={{ color: "#0E1F38" }}
            aria-label="HuniKu - Beranda"
          >
            Huni<span style={{ color: "#1C61D8" }}>Ku</span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => navigate(link.href)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  isActive(link.href)
                    ? "text-[#1C61D8]"
                    : "text-[#46586F] hover:text-[#0E1F38]"
                }`}
                style={isActive(link.href) ? { backgroundColor: "#E7EFFC" } : {}}
                aria-label={link.label}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate("/account/signin")}
              className="px-4 py-2 text-sm font-bold transition-colors"
              style={{ color: "#46586F" }}
              aria-label="Masuk"
            >
              Masuk
            </button>
            <button
              onClick={() => navigate("/account/signup")}
              className="px-5 py-2.5 text-white text-sm font-black rounded-xl transition-opacity hover:opacity-90 shadow-sm"
              style={{ backgroundColor: "#1C61D8" }}
              aria-label="Daftar"
            >
              Daftar
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 -mr-2 rounded-xl transition-colors"
            style={{ color: "#0E1F38" }}
            aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-white md:hidden animate-in slide-in-from-top-2 duration-200">
          <div className="p-6 space-y-2">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => navigate(link.href)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-base font-bold transition-all ${
                  isActive(link.href) ? "text-[#1C61D8]" : "text-[#0E1F38]"
                }`}
                style={isActive(link.href) ? { backgroundColor: "#E7EFFC" } : {}}
              >
                <link.icon size={20} />
                {link.label}
              </button>
            ))}
            <hr className="my-4 border-[#E2E9F2]" />
            <button
              onClick={() => navigate("/account/signin")}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-base font-bold text-[#0E1F38] transition-all"
            >
              <LogIn size={20} />
              Masuk
            </button>
            <button
              onClick={() => navigate("/account/signup")}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-base font-black text-white hover:opacity-90 transition-all mt-2"
              style={{ backgroundColor: "#1C61D8" }}
            >
              <UserPlus size={20} />
              Daftar Akun
            </button>
          </div>
        </div>
      )}

      {/* Mobile bottom navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl border-t border-[#E2E9F2] safe-area-bottom"
        style={{ backgroundColor: "rgba(238,242,248,0.95)" }}>
        <div className="flex items-center justify-around h-16">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => navigate(link.href)}
              className="flex flex-col items-center justify-center gap-0.5 px-3 py-1 min-w-0 flex-1 transition-all"
              style={{ color: isActive(link.href) ? "#1C61D8" : "#7A8AA0" }}
              aria-label={link.label}
            >
              <link.icon size={20} strokeWidth={isActive(link.href) ? 2.5 : 2} />
              <span className="text-[11px] font-bold">{link.label}</span>
            </button>
          ))}
          <button
            onClick={() => navigate("/account/signin")}
            className="flex flex-col items-center justify-center gap-0.5 px-3 py-1 min-w-0 flex-1 transition-all"
            style={{ color: isActive("/account") ? "#1C61D8" : "#7A8AA0" }}
            aria-label="Akun"
          >
            <User size={20} strokeWidth={isActive("/account") ? 2.5 : 2} />
            <span className="text-[11px] font-bold">Akun</span>
          </button>
        </div>
      </div>
    </>
  );
}
