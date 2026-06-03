import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  MapPin,
  Home,
  Building2,
  Warehouse,
  LandPlot,
  Store,
  Bed,
  ChevronRight,
  ArrowRight,
  Shield,
  FileText,
  Lock,
  Star,
  SlidersHorizontal,
  Navigation,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Daylight theme constants ─────────────────────────────────────
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600";

const STATS = [
  { value: "32.000+", label: "Properti aktif" },
  { value: "120+", label: "Kota di Indonesia" },
  { value: "98%", label: "Transaksi aman" },
];

const CATEGORIES = [
  { id: "house", label: "Rumah", icon: Home },
  { id: "apartment", label: "Apartemen", icon: Building2 },
  { id: "boarding_house", label: "Kos", icon: Bed },
  { id: "shophouse", label: "Ruko", icon: Store },
  { id: "land", label: "Tanah", icon: LandPlot },
  { id: "warehouse", label: "Gudang", icon: Warehouse },
];

const TRUST = [
  {
    icon: Shield,
    title: "Agen Terverifikasi",
    desc: "Identitas & lisensi setiap agen kami validasi.",
  },
  {
    icon: FileText,
    title: "Legalitas Dicek",
    desc: "Sertifikat & dokumen diperiksa tim legal.",
  },
  {
    icon: Lock,
    title: "Transaksi Aman",
    desc: "Dana ditahan hingga serah terima selesai.",
  },
];

const TESTIMONIALS = [
  {
    name: "Anita Rahmawati",
    role: "Beli rumah di Bintaro",
    quote:
      "Semua dokumen dicek tim Huniku sebelum transaksi. Prosesnya transparan dan saya merasa aman dari awal sampai serah terima kunci.",
    avatar: "AR",
  },
  {
    name: "Budi Santoso",
    role: "Sewa apartemen di Sudirman",
    quote:
      "Agennya terverifikasi dan responsif. Tidak ada biaya tersembunyi, kontrak jelas. Jauh lebih meyakinkan dari platform lain.",
    avatar: "BS",
  },
  {
    name: "Maria Tanudjaja",
    role: "Jual ruko di BSD",
    quote:
      "Iklan saya cepat dapat pembeli serius. Tim Huniku bantu validasi calon pembeli. Sangat profesional.",
    avatar: "MT",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────
function fmtPrice(n) {
  if (!n) return "Harga —";
  const num = Number(n);
  if (num >= 1_000_000_000) {
    const val = num / 1_000_000_000;
    return (
      "Rp " +
      (Number.isInteger(val) ? val : val.toFixed(1)).toString().replace(".", ",") +
      " M"
    );
  }
  if (num >= 1_000_000) return "Rp " + Math.round(num / 1_000_000) + " jt";
  return "Rp " + num.toLocaleString("id-ID");
}

function modeBadgeLabel(mode) {
  return mode === "sale" ? "DIJUAL" : "DISEWA";
}

function modeSuffix(mode) {
  if (mode === "rent_monthly") return "/bln";
  if (mode === "rent_yearly") return "/thn";
  return "";
}

const TYPE_LABELS = {
  house: "Rumah",
  apartment: "Apartemen",
  boarding_house: "Kos",
  shophouse: "Ruko",
  land: "Tanah",
  warehouse: "Gudang",
  commercial: "Komersial",
};

function catLabel(type) {
  return TYPE_LABELS[type] || type || "";
}

// ─── Sub-components ───────────────────────────────────────────────
function PropertyCard({ property, onClick }) {
  const [imgErr, setImgErr] = useState(false);
  const imgSrc =
    !imgErr && property.images?.[0]
      ? property.images[0]
      : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800";
  const sale = property.listing_mode === "sale";
  const suffix = modeSuffix(property.listing_mode);

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-2xl overflow-hidden border border-[#E2E9F2] shadow-sm hover:shadow-lg transition-all group"
    >
      {/* Image */}
      <div className="relative h-52">
        <img
          src={imgSrc}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={() => setImgErr(true)}
        />
        {/* Mode badge */}
        <div
          className="absolute top-3 left-3 px-3 py-1 rounded-md text-[10px] font-black tracking-widest text-white"
          style={{ backgroundColor: sale ? "#0F3D73" : "#0E9466" }}
        >
          {modeBadgeLabel(property.listing_mode)}
        </div>
        {/* Verified pill */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-[#0E9466]">
          <Shield size={11} color="#fff" strokeWidth={2.4} />
          <span className="text-white text-[11px] font-bold">Terverifikasi</span>
        </div>
        {/* Heart */}
        <div className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm text-sm">
          ♡
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <span className="text-[18px] font-black text-[#0F3D73] leading-tight">
            {fmtPrice(property.price)}
            {suffix && (
              <span className="text-[12px] font-bold text-[#7A8AA0]">{suffix}</span>
            )}
          </span>
          <span className="text-[10px] font-bold text-[#7A8AA0] uppercase tracking-wide shrink-0">
            {catLabel(property.property_type)}
          </span>
        </div>
        <p className="text-[15px] font-bold text-[#0E1F38] line-clamp-2 mb-2">
          {property.title}
        </p>
        <div className="flex items-center gap-1 mb-3">
          <MapPin size={13} color="#7A8AA0" strokeWidth={1.9} />
          <span className="text-[13px] text-[#46586F] truncate">{property.address}</span>
        </div>
        <div className="border-t border-[#EDF1F7] pt-3 flex items-center gap-4">
          {property.bedrooms > 0 && (
            <span className="text-[12px] font-semibold text-[#46586F]">
              🛏 {property.bedrooms} KT
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="text-[12px] font-semibold text-[#46586F]">
              🚿 {property.bathrooms} KM
            </span>
          )}
          {(property.building_size > 0 || property.land_size > 0) && (
            <span className="text-[12px] font-semibold text-[#46586F]">
              📐 {property.building_size || property.land_size} m²
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── Main page ────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [locationParts, setLocationParts] = useState(["Indonesia"]);
  const [locationIndex, setLocationIndex] = useState(0);
  const [locationLoading, setLocationLoading] = useState(true);
  const intervalRef = useRef(null);
  const animKeyRef = useRef(0);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationParts(["Indonesia"]);
      setLocationLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=id`,
            { headers: { "Accept-Language": "id" } },
          );
          const data = await res.json();
          const addr = data.address || {};
          const city = addr.city || addr.town || addr.municipality || addr.county || "";
          const province = addr.state || "";
          const parts = [city, province].filter(Boolean);
          if (parts.length > 0) {
            setLocationParts(parts);
            setSearch(parts[0]);
          } else {
            setLocationParts(["Indonesia"]);
          }
        } catch {
          setLocationParts(["Indonesia"]);
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        setLocationParts(["Indonesia"]);
        setLocationLoading(false);
      },
      { timeout: 8000 },
    );
  }, []);

  useEffect(() => {
    if (locationParts.length < 2) return;
    intervalRef.current = setInterval(() => {
      animKeyRef.current += 1;
      setLocationIndex((i) => (i + 1) % locationParts.length);
    }, 2500);
    return () => clearInterval(intervalRef.current);
  }, [locationParts]);

  const displayLocation = locationParts[locationIndex] || "Indonesia";

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["featured-properties"],
    queryFn: async () => {
      const res = await fetch("/api/properties?limit=6");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: "#EEF2F8" }}>
      <Navbar />

      {/* ── Hero ── */}
      <style>{`
        @keyframes locFadeUp {
          0% { opacity: 0; transform: translateY(14px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .loc-text-in { animation: locFadeUp 0.45s cubic-bezier(0.22,1,0.36,1) forwards; }
        @keyframes locationPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .loc-loading { animation: locationPulse 1.2s ease-in-out infinite; }
      `}</style>

      <section className="relative overflow-hidden mx-4 mt-4 rounded-3xl md:mx-8 md:mt-6 lg:mx-12">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Hero"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, rgba(12,35,64,0.18), rgba(12,35,64,0.82))",
            }}
          />
        </div>

        <div className="relative z-10 px-6 pt-10 pb-20 md:px-16 md:pt-16 md:pb-28 text-center md:text-left">
          {/* Hero title */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white leading-tight mb-2"
              style={{ letterSpacing: "-0.5px" }}>
              Temukan Properti <span style={{ color: "#facc15" }}>Impianmu</span>
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
              <span className="text-3xl sm:text-4xl md:text-6xl font-black text-white leading-tight">
                di
              </span>
              <div className="relative overflow-hidden" style={{ minWidth: 120 }}>
                {locationLoading ? (
                  <span className="text-3xl sm:text-4xl md:text-6xl font-black leading-tight loc-loading inline-block"
                    style={{ color: "#facc15" }}>
                    ...
                  </span>
                ) : (
                  <span
                    key={`${displayLocation}-${animKeyRef.current}`}
                    className="text-3xl sm:text-4xl md:text-6xl font-black leading-tight loc-text-in inline-block whitespace-nowrap"
                    style={{ color: "#facc15" }}
                  >
                    {displayLocation}
                  </span>
                )}
              </div>
            </div>
            {/* Location dots */}
            {locationParts.length > 1 && (
              <div className="flex justify-center md:justify-start gap-2 mt-4">
                {locationParts.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: i === locationIndex ? 20 : 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: i === locationIndex ? "#facc15" : "rgba(255,255,255,0.4)",
                      transition: "all 0.4s ease",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Location detected badge */}
          {!locationLoading && locationParts.length > 0 && locationParts[0] !== "Indonesia" && (
            <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20"
                style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
                <Navigation size={13} className="text-green-400" />
                <span className="text-sm font-semibold text-white/90">
                  Lokasi terdeteksi: {locationParts.join(", ")}
                </span>
              </div>
            </div>
          )}

          <p className="text-white/80 text-base md:text-lg max-w-xl mx-auto md:mx-0 mb-8">
            Platform properti terpercaya untuk jual, beli, dan sewa rumah, apartemen, kos, dan ruang komersial.
          </p>

          {/* Search bar */}
          <div className="rounded-2xl p-3 flex items-center gap-3 max-w-2xl mx-auto md:mx-0 shadow-xl"
            style={{ backgroundColor: "rgba(255,255,255,0.97)" }}>
            <div className="flex-1 flex items-center gap-3 px-2">
              <Search size={20} style={{ color: "#1C61D8" }} strokeWidth={2.1} />
              <input
                type="text"
                placeholder="Cari kota, area, atau proyek…"
                className="w-full outline-none text-[15px] font-medium bg-transparent"
                style={{ color: "#0E1F38" }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && navigate(`/search?q=${search}`)
                }
              />
            </div>
            <button
              onClick={() => navigate(`/search?q=${search}`)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-white font-bold text-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#1C61D8" }}
            >
              <SlidersHorizontal size={16} color="#fff" strokeWidth={2} />
              <span className="hidden sm:inline">Filter & Cari</span>
              <span className="sm:hidden">Cari</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats ribbon ── */}
      <div className="mx-4 md:mx-8 lg:mx-12 -mt-6 relative z-20">
        <div className="bg-white rounded-2xl border border-[#E2E9F2] shadow-sm flex divide-x divide-[#EDF1F7]">
          {STATS.map((stat, i) => (
            <div key={i} className="flex-1 flex flex-col items-center py-4 px-2">
              <span className="text-xl md:text-2xl font-black text-[#0F3D73]">{stat.value}</span>
              <span className="text-[11px] font-semibold text-[#7A8AA0] mt-1 text-center">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Categories ── */}
      <section className="px-4 md:px-8 lg:px-12 pt-10 pb-4">
        <h2 className="text-2xl font-black text-[#0E1F38] mb-5" style={{ letterSpacing: "-0.4px" }}>
          Kategori
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => navigate(`/search?type=${cat.id}`)}
                className="flex flex-col items-center gap-2 py-4 rounded-2xl border border-[#E2E9F2] bg-white hover:border-[#1C61D8] hover:shadow-md transition-all group"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-colors group-hover:bg-[#0F3D73]"
                  style={{ backgroundColor: "#E7EFFC" }}
                >
                  <Icon size={26} className="transition-colors group-hover:text-white" style={{ color: "#1C61D8" }} strokeWidth={1.9} />
                </div>
                <span className="text-[12px] font-bold text-[#46586F]">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Recommendations ── */}
      <section className="px-4 md:px-8 lg:px-12 pt-8 pb-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-black text-[#0E1F38]" style={{ letterSpacing: "-0.4px" }}>
            Rekomendasi Pilihan
          </h2>
          <button
            onClick={() => navigate("/search")}
            className="flex items-center gap-1 text-[14px] font-bold text-[#1C61D8] hover:underline"
          >
            Lihat semua
            <ChevronRight size={15} strokeWidth={2.4} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading
            ? Array(6).fill(0).map((_, i) => (
                <div
                  key={i}
                  className="h-72 rounded-2xl border border-[#E2E9F2] animate-pulse"
                  style={{ backgroundColor: "#F4F7FC" }}
                />
              ))
            : properties.map((p) => (
                <PropertyCard
                  key={p.id}
                  property={p}
                  onClick={() => navigate(`/property/${p.id}`)}
                />
              ))}
        </div>
      </section>

      {/* ── Trust ── */}
      <section className="px-4 md:px-8 lg:px-12 pt-8 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TRUST.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-[#E2E9F2] shadow-sm"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#E2F4EC" }}
                >
                  <Icon size={22} style={{ color: "#0E9466" }} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-[#0E1F38] mb-1">{item.title}</p>
                  <p className="text-[13px] text-[#46586F] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="pt-8 pb-4">
        <div className="px-4 md:px-8 lg:px-12 mb-5">
          <h2 className="text-2xl font-black text-[#0E1F38]" style={{ letterSpacing: "-0.4px" }}>
            Kata Mereka
          </h2>
        </div>
        <div className="flex gap-4 overflow-x-auto px-4 md:px-8 lg:px-12 pb-2 scroll-smooth"
          style={{ scrollbarWidth: "none" }}>
          {TESTIMONIALS.map((item, i) => (
            <div
              key={i}
              className="shrink-0 w-72 bg-white rounded-2xl border border-[#E2E9F2] p-5 shadow-sm"
            >
              <div className="flex gap-1 mb-3">
                {[0,1,2,3,4].map((j) => (
                  <Star key={j} size={14} fill="#1C61D8" color="#1C61D8" strokeWidth={0} />
                ))}
              </div>
              <p className="text-[13px] text-[#0E1F38] leading-relaxed mb-4">"{item.quote}"</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-black shrink-0"
                  style={{ backgroundColor: "#E7EFFC", color: "#1C61D8" }}
                >
                  {item.avatar}
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[#0E1F38]">{item.name}</p>
                  <p className="text-[11px] text-[#7A8AA0]">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-4 md:px-8 lg:px-12 pt-6 pb-10">
        <div
          className="rounded-3xl p-8 md:p-12 text-center shadow-xl"
          style={{
            background: "linear-gradient(135deg, #13447E 0%, #0C2F5C 100%)",
          }}
        >
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3" style={{ letterSpacing: "-0.4px" }}>
            Punya properti untuk dijual?
          </h2>
          <p className="text-white/80 text-[14px] md:text-base mb-7 max-w-lg mx-auto">
            Pasang iklan gratis & jangkau ribuan pencari serius.
          </p>
          <button
            onClick={() => navigate("/search")}
            className="inline-flex items-center gap-2 bg-white font-black text-[15px] px-7 py-4 rounded-2xl hover:opacity-90 transition-opacity"
            style={{ color: "#0F3D73" }}
          >
            Pasang Iklan
            <ArrowRight size={17} strokeWidth={2.3} />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
