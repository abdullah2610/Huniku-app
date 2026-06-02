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
  TrendingUp,
  Navigation,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PROPERTY_TYPES = [
  { id: "house", label: "Rumah", icon: Home },
  { id: "apartment", label: "Apartemen", icon: Building2 },
  { id: "shophouse", label: "Ruko", icon: Store },
  { id: "boarding_house", label: "Kos", icon: Bed },
  { id: "land", label: "Tanah", icon: LandPlot },
  { id: "warehouse", label: "Gudang", icon: Warehouse },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [locationParts, setLocationParts] = useState([]);
  const [locationIndex, setLocationIndex] = useState(0);
  const [locationLoading, setLocationLoading] = useState(true);
  const intervalRef = useRef(null);
  const animKeyRef = useRef(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Geolocation + reverse geocode via Nominatim (no API key needed)
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
          const city =
            addr.city || addr.town || addr.municipality || addr.county || "";
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

  // Cycle between city and province every 2.5s
  useEffect(() => {
    if (locationParts.length < 2) return;
    intervalRef.current = setInterval(() => {
      animKeyRef.current += 1;
      setLocationIndex((i) => (i + 1) % locationParts.length);
    }, 2500);
    return () => clearInterval(intervalRef.current);
  }, [locationParts]);

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["featured-properties"],
    queryFn: async () => {
      const res = await fetch("/api/properties?limit=6");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const displayLocation = locationParts[locationIndex] || "Indonesia";

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <Navbar />

      {/* Animation styles */}
      <style jsx global>{`
        @keyframes locFadeUp {
          0% { opacity: 0; transform: translateY(14px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes locFadeOut {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-14px); }
        }
        .loc-text-in {
          animation: locFadeUp 0.45s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        @keyframes locationPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .loc-loading {
          animation: locationPulse 1.2s ease-in-out infinite;
        }
      `}</style>

      <section className="relative h-[550px] md:h-[650px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-10" />
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6199f74039?auto=format&fit=crop&q=80&w=2000"
          className="absolute inset-0 w-full h-full object-cover"
          alt="Modern House"
          loading="eager"
        />

        <div className="relative z-20 text-center text-white px-4 max-w-5xl mx-auto w-full">
          {/* Hero title with animated location */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-7xl font-black leading-[1.1] mb-2">
              Temukan Properti <span className="text-blue-400">Impianmu</span>
            </h1>
            <div className="flex items-center justify-center gap-2 md:gap-3 mt-2">
              <span className="text-3xl sm:text-4xl md:text-7xl font-black text-white leading-[1.1]">
                di
              </span>
              <div
                className="relative overflow-hidden"
                style={{ minWidth: 120 }}
              >
                {locationLoading ? (
                  <span className="text-3xl sm:text-4xl md:text-7xl font-black text-yellow-400 leading-[1.1] loc-loading inline-block">
                    ...
                  </span>
                ) : (
                  <span
                    key={`${displayLocation}-${animKeyRef.current}`}
                    className="text-3xl sm:text-4xl md:text-7xl font-black text-yellow-400 leading-[1.1] loc-text-in inline-block whitespace-nowrap"
                  >
                    {displayLocation}
                  </span>
                )}
              </div>
            </div>
            {/* Location indicator dots */}
            {locationParts.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {locationParts.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: i === locationIndex ? 20 : 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor:
                        i === locationIndex
                          ? "#facc15"
                          : "rgba(255,255,255,0.4)",
                      transition: "all 0.4s ease",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Location detection badge */}
          {!locationLoading &&
            locationParts.length > 0 &&
            locationParts[0] !== "Indonesia" && (
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full">
                  <Navigation size={13} className="text-green-400" />
                  <span className="text-sm font-semibold text-white/90">
                    Lokasi terdeteksi: {locationParts.join(", ")}
                  </span>
                </div>
              </div>
            )}

          <p className="text-xl mb-10 text-gray-200 max-w-2xl mx-auto">
            Platform properti terpercaya untuk jual, beli, dan sewa rumah,
            apartemen, kos, dan ruang komersial.
          </p>

          <div className="bg-white/10 backdrop-blur-xl p-3 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-3 max-w-3xl mx-auto border border-white/20">
            <div className="flex-1 flex items-center px-5 py-3 bg-white/10 rounded-2xl border border-white/10">
              <MapPin className="text-blue-400 mr-3 shrink-0" size={24} />
              <input
                type="text"
                placeholder="Cari lokasi (cth: Jakarta Selatan, Bali)..."
                className="w-full text-white outline-none placeholder:text-gray-300 bg-transparent text-lg font-medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && navigate(`/search?q=${search}`)
                }
              />
            </div>
            <button
              onClick={() => navigate(`/search?q=${search}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center shadow-lg shadow-blue-600/30"
            >
              <Search size={22} className="mr-2" />
              Cari
            </button>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-gray-900 mb-4">
            Eksplorasi Kategori
          </h2>
          <p className="text-gray-500 text-lg">
            Pilih tipe properti yang sesuai dengan gaya hidup dan kebutuhan Anda
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {PROPERTY_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => navigate(`/search?type=${type.id}`)}
              className="flex flex-col items-center p-8 rounded-[40px] bg-gray-50 border border-transparent hover:border-blue-500 hover:bg-white hover:shadow-2xl hover:shadow-blue-100 transition-all group w-full text-left"
            >
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-blue-600 transition-colors">
                <type.icon
                  size={36}
                  className="text-blue-600 group-hover:text-white transition-colors"
                />
              </div>
              <span className="font-bold text-gray-900 text-lg">
                {type.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="py-24 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-4xl font-black text-gray-900 mb-2">
                Rekomendasi Terbaik
              </h2>
              <p className="text-gray-500 text-lg">
                Iklan pilihan yang sedang tren hari ini
              </p>
            </div>
            <button
              onClick={() => navigate("/search")}
              className="bg-white px-6 py-3 rounded-full text-blue-600 font-bold border border-gray-200 hover:border-blue-600 transition-all flex items-center"
            >
              Lihat Semua <ChevronRight size={20} className="ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {isLoading
              ? Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-[40px] h-[450px] animate-pulse"
                    />
                  ))
              : properties.map((prop) => (
                  <button
                    key={prop.id}
                    onClick={() => navigate(`/property/${prop.id}`)}
                    className="bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl transition-all group border border-gray-100 flex flex-col h-full block w-full text-left"
                  >
                    <div className="relative h-72">
                      <img
                        src={
                          prop.images?.[0] ||
                          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800"
                        }
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt={prop.title}
                      />
                      <div className="absolute top-6 left-6 bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-black tracking-widest">
                        {prop.listing_mode === "sale" ? "DIJUAL" : "DISEWA"}
                      </div>
                      {prop.badge_label && (
                        <div
                          style={{ backgroundColor: prop.badge_color }}
                          className="absolute top-6 right-6 text-white px-4 py-1.5 rounded-full text-xs font-black tracking-wider shadow-lg"
                        >
                          {prop.badge_label}
                        </div>
                      )}
                    </div>
                    <div className="p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-2xl font-black text-gray-900 mb-3 truncate group-hover:text-blue-600 transition-colors">
                          {prop.title}
                        </h3>
                        <div className="flex items-center text-gray-500 mb-6">
                          <MapPin size={18} className="mr-2 shrink-0" />
                          <span className="text-sm truncate font-medium">
                            {prop.address}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                            Harga
                          </span>
                          <span className="text-2xl font-black text-blue-600">
                            Rp {Number(prop.price).toLocaleString("id-ID")}
                          </span>
                        </div>
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                          <ChevronRight
                            className="text-gray-300 group-hover:text-white transition-colors"
                            size={24}
                          />
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="bg-blue-600 rounded-[60px] p-12 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl shadow-blue-200">
          <div className="relative z-10 max-w-xl text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Miliki Properti Idaman Sekarang Juga
            </h2>
            <p className="text-blue-100 text-lg mb-10">
              Beri tahu kami preferensi Anda, dan sistem AI kami akan mencarikan
              properti yang paling cocok untuk Anda.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <button
                onClick={() => navigate('/search')}
                className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black text-lg hover:shadow-xl transition-all"
              >
                Mulai Cari
              </button>
              <button
                onClick={() => navigate('/account/signup')}
                className="bg-blue-500 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-blue-400 transition-all border border-blue-400"
              >
                Daftar Akun
              </button>
            </div>
          </div>
          <div className="relative z-10 w-full md:w-1/3 flex justify-center">
            <div className="w-64 h-64 bg-white/10 backdrop-blur-2xl rounded-[60px] flex items-center justify-center border border-white/20">
              <TrendingUp size={100} className="text-white" />
            </div>
          </div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-50" />
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-blue-700 rounded-full blur-3xl opacity-30" />
        </div>
      </section>

      <Footer />
    </div>
  );
}
