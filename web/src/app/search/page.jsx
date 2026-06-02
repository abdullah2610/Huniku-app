import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  LayoutGrid,
  Map as MapIcon,
  Star,
  Home,
  Building2,
  Store,
  Bed,
  LandPlot,
  Warehouse,
  Building,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

// Maps Indonesian label → DB enum value
const CATEGORY_FILTERS = [
  { label: "Semua", value: "", icon: Home },
  { label: "Rumah", value: "house", icon: Home },
  { label: "Apartemen", value: "apartment", icon: Building2 },
  { label: "Kos", value: "boarding_house", icon: Bed },
  { label: "Ruko", value: "shophouse", icon: Store },
  { label: "Tanah", value: "land", icon: LandPlot },
  { label: "Gudang", value: "warehouse", icon: Warehouse },
  { label: "Komersial", value: "commercial", icon: Building },
];

const MODE_LABEL = {
  sale: "DIJUAL",
  rent_monthly: "DISEWA/BULAN",
  rent_yearly: "DISEWA/TAHUN",
};

// Maps display label → DB enum value
const TYPE_MAP = {
  Rumah: "house",
  Apartemen: "apartment",
  Kos: "boarding_house",
  Ruko: "shophouse",
  Tanah: "land",
  Gudang: "warehouse",
  Komersial: "commercial",
};

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get("type") || "";
  const query = searchParams.get("q") || "";

  const [view, setView] = useState("grid");
  const [search, setSearch] = useState(query);

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["properties", typeParam, query],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (typeParam) params.append("type", typeParam);
      if (query) params.append("location", query);
      const url = `/api/properties${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const activeCategory =
    CATEGORY_FILTERS.find((c) => c.value === typeParam) || CATEGORY_FILTERS[0];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Top bar */}
      <div className="bg-white border-b p-4 md:p-6 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="hidden md:flex items-center font-black text-2xl tracking-tighter shrink-0"
          >
            Huni<span className="text-blue-600">Ku</span>
          </button>

          {/* Search input */}
          <div className="flex-1 w-full relative">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Cari lokasi, kota, atau area..."
              className="w-full bg-gray-100 rounded-2xl py-3.5 pl-13 pr-5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-base font-medium"
              style={{ paddingLeft: "3rem" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const params = new URLSearchParams();
                  if (typeParam) params.append("type", typeParam);
                  if (search) params.append("q", search);
                  navigate(`/search?${params.toString()}`);
                }
              }}
            />
          </div>

          {/* Category filter buttons — use DB enum values */}
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  const params = new URLSearchParams();
                  if (cat.value) params.append("type", cat.value);
                  if (search) params.append("q", search);
                  navigate(`/search?${params.toString()}`);
                }}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full border text-sm font-bold transition-all whitespace-nowrap shrink-0 ${
                  cat.value === typeParam
                    ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                    : "bg-white border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600"
                }`}
              >
                <cat.icon size={14} />
                {cat.label}
              </button>
            ))}
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 bg-white text-sm font-bold hover:border-blue-400 shrink-0 transition-all">
              <SlidersHorizontal size={15} /> Filter
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Grid panel */}
        <div
          className={`flex-1 overflow-y-auto p-6 md:p-8 transition-all ${view === "map" ? "hidden lg:block lg:w-1/2" : "w-full"}`}
        >
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-black text-gray-900">
                  {isLoading
                    ? "Memuat..."
                    : `${properties.length} properti ditemukan`}
                </h1>
                <p className="text-gray-400 font-medium text-sm mt-1">
                  {activeCategory.label !== "Semua"
                    ? `Kategori: ${activeCategory.label}`
                    : "Semua kategori"}
                  {query && ` • "${query}"`}
                </p>
              </div>
              <div className="flex bg-white rounded-2xl border border-gray-100 p-1.5 shadow-sm">
                <button
                  onClick={() => setView("grid")}
                  className={`p-2.5 rounded-xl transition-all ${view === "grid" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-gray-400 hover:text-blue-600"}`}
                >
                  <LayoutGrid size={20} />
                </button>
                <button
                  onClick={() => setView("map")}
                  className={`p-2.5 rounded-xl transition-all ${view === "map" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-gray-400 hover:text-blue-600"}`}
                >
                  <MapIcon size={20} />
                </button>
              </div>
            </div>

            {/* Empty state */}
            {!isLoading && properties.length === 0 && (
              <div className="text-center py-24">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home size={36} className="text-gray-300" />
                </div>
                <h3 className="text-xl font-black text-gray-700 mb-2">
                  Tidak ada properti ditemukan
                </h3>
                <p className="text-gray-400 font-medium mb-6">
                  Coba ubah filter atau kata kunci pencarian Anda
                </p>
                <button
                  onClick={() => navigate("/search")}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
                >
                  Reset Filter
                </button>
              </div>
            )}

            <div
              className={`grid gap-6 ${view === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 md:grid-cols-2"}`}
            >
              {isLoading
                ? Array(6)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-[32px] h-96 opacity-60 bg-gradient-to-br from-gray-100 to-gray-200"
                      />
                    ))
                : properties.map((prop) => (
                    <button
                      key={prop.id}
                      onClick={() => navigate(`/property/${prop.id}`)}
                      className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all group border border-gray-100 flex flex-col h-full block w-full text-left"
                    >
                      <div className="relative h-56">
                        <img
                          src={
                            prop.images?.[0] ||
                            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800"
                          }
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          alt={prop.title}
                          loading="lazy"
                        />
                        <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow">
                          {MODE_LABEL[prop.listing_mode] || prop.listing_mode}
                        </div>
                        {prop.badge_label && (
                          <div
                            style={{
                              backgroundColor: prop.badge_color || "#3b82f6",
                            }}
                            className="absolute top-4 right-12 px-3 py-1 rounded-full text-[10px] font-black text-white uppercase"
                          >
                            {prop.badge_label}
                          </div>
                        )}
                        <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm">
                          <Star size={16} />
                        </button>
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-black text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {prop.title}
                          </h3>
                          <div className="flex items-center text-gray-400 text-sm mb-3">
                            <MapPin size={13} className="mr-1.5 shrink-0" />
                            <span className="truncate font-medium">
                              {prop.address}
                            </span>
                          </div>
                          <div className="flex gap-3 text-xs text-gray-400 font-bold uppercase tracking-wider mb-4">
                            {prop.bedrooms && <span>{prop.bedrooms} KT</span>}
                            {prop.bathrooms && <span>{prop.bathrooms} KM</span>}
                            {prop.building_size && (
                              <span>{prop.building_size} m²</span>
                            )}
                            {prop.land_size && !prop.building_size && (
                              <span>{prop.land_size} m²</span>
                            )}
                          </div>
                        </div>
                        <div className="text-xl font-black text-blue-600">
                          Rp {Number(prop.price).toLocaleString("id-ID")}
                          {prop.listing_mode === "rent_monthly" && (
                            <span className="text-sm font-bold text-gray-400">
                              /bln
                            </span>
                          )}
                          {prop.listing_mode === "rent_yearly" && (
                            <span className="text-sm font-bold text-gray-400">
                              /thn
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
            </div>
          </div>
        </div>

        {/* Map panel — only render if API key is available */}
        {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
          <div
            className={`flex-1 h-full transition-all ${view === "map" ? "block" : "hidden lg:block lg:w-1/2 border-l border-gray-100"}`}
          >
            <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
              <Map
                defaultCenter={{ lat: -6.2, lng: 106.816666 }}
                defaultZoom={12}
                gestureHandling={"greedy"}
                disableDefaultUI={false}
                className="w-full h-full"
              >
                {properties.map((prop) =>
                  prop.latitude && prop.longitude ? (
                    <Marker
                      key={prop.id}
                      position={{
                        lat: Number(prop.latitude),
                        lng: Number(prop.longitude),
                      }}
                      title={prop.title}
                    />
                  ) : null,
                )}
              </Map>
            </APIProvider>
          </div>
        ) : (
          view === "grid" ? null : (
            <div className="flex-1 h-full flex items-center justify-center bg-gray-100">
              <p className="text-gray-400 font-medium text-sm">Peta tidak tersedia</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
