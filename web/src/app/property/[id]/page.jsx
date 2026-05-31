import { useState } from "react";
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  ChevronLeft,
  Share2,
  Heart,
  Calendar,
  MessageSquare,
  Phone,
  CheckCircle2,
  Star,
  Play,
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

function MortgageCalculator({ price }) {
  const [downPayment, setDownPayment] = useState(price * 0.2);
  const [interestRate, setInterestRate] = useState(5);
  const [years, setYears] = useState(20);

  const loanAmount = price - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = years * 12;
  const monthlyPayment =
    (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalMonths));

  return (
    <div className="bg-gray-50 p-8 rounded-[40px] border border-gray-100">
      <h3 className="text-2xl font-black mb-6">Simulasi KPR</h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
            Uang Muka (Rp)
          </label>
          <input
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full p-4 rounded-2xl border-none bg-white shadow-sm font-bold text-blue-600 outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
              Bunga (%)
            </label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full p-4 rounded-2xl border-none bg-white shadow-sm font-bold text-blue-600 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
              Tenor (Tahun)
            </label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full p-4 rounded-2xl border-none bg-white shadow-sm font-bold text-blue-600 outline-none"
            />
          </div>
        </div>
        <div className="pt-6 border-t border-gray-200">
          <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">
            Estimasi Cicilan
          </div>
          <div className="text-3xl font-black text-blue-600">
            Rp {Math.round(monthlyPayment).toLocaleString("id-ID")}
            <span className="text-sm font-normal text-gray-400">/bln</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PropertyDetailPage({ params }) {
  const { id } = params;
  const [activeImage, setActiveImage] = useState(0);

  const { data: property, isLoading } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const res = await fetch(`/api/properties/${id}`);
      if (!res.ok) throw new Error("Gagal memuat properti");
      return res.json();
    },
  });

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  if (!property)
    return (
      <div className="p-20 text-center text-gray-500">
        Properti tidak ditemukan
      </div>
    );

  return (
    <div className="min-h-screen bg-white font-sans pb-24">
      {/* Navigation Header */}
      <div className="bg-white border-b sticky top-0 z-50 px-4 md:px-8 h-20 flex items-center justify-between">
        <a
          href="/search"
          className="flex items-center text-gray-600 font-bold hover:text-blue-600 transition-colors"
        >
          <ChevronLeft size={24} className="mr-1" /> Kembali ke Pencarian
        </a>
        <div className="flex gap-4">
          <button className="p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all text-gray-600">
            <Share2 size={22} />
          </button>
          <button className="p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all text-gray-600">
            <Heart size={22} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
        {/* Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
            <div className="relative aspect-[16/9] rounded-[40px] overflow-hidden shadow-2xl group">
              <img
                src={
                  property.images?.[activeImage] ||
                  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6"
                }
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt={property.title}
              />
              {property.video_url && (
                <a
                  href={property.video_url}
                  target="_blank"
                  className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-all group"
                >
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all">
                    <Play size={32} className="text-blue-600 ml-1" />
                  </div>
                </a>
              )}
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {property.images?.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-32 aspect-[4/3] rounded-2xl overflow-hidden shrink-0 border-4 transition-all ${activeImage === idx ? "border-blue-600" : "border-transparent opacity-60 hover:opacity-100"}`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gray-50 p-8 rounded-[40px] border border-gray-100 shadow-sm sticky top-28">
              <div className="mb-6">
                <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase mb-4 inline-block">
                  {property.listing_mode === "sale" ? "DIJUAL" : "DISEWA"}
                </span>
                <h1 className="text-3xl font-black text-gray-900 leading-tight mb-4">
                  {property.title}
                </h1>
                <div className="flex items-center text-gray-500 mb-6">
                  <MapPin size={20} className="mr-2 shrink-0 text-blue-600" />
                  <span className="font-medium">{property.address}</span>
                </div>
                <div className="text-4xl font-black text-blue-600 mb-2">
                  Rp {Number(property.price).toLocaleString("id-ID")}
                </div>
                {property.listing_mode.includes("rent") && (
                  <div className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                    Per Bulan
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white p-4 rounded-3xl border border-gray-100 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <Bed size={20} />
                  </div>
                  <div>
                    <div className="text-xl font-black">
                      {property.bedrooms}
                    </div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Kamar Tidur
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-3xl border border-gray-100 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <Bath size={20} />
                  </div>
                  <div>
                    <div className="text-xl font-black">
                      {property.bathrooms}
                    </div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Kamar Mandi
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[24px] font-black text-lg transition-all flex items-center justify-center shadow-xl shadow-blue-200">
                  <Calendar size={22} className="mr-2" /> Booking Jadwal
                  Kunjungan
                </button>
                <button className="w-full bg-white border-2 border-blue-600 text-blue-600 py-5 rounded-[24px] font-black text-lg transition-all flex items-center justify-center hover:bg-blue-50">
                  <MessageSquare size={22} className="mr-2" /> Tanya Pemilik
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-16">
          <div className="lg:col-span-8 space-y-12">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-6">
                Deskripsi
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap">
                {property.description}
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-8">
                Fasilitas Properti
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {property.facilities?.map((f) => (
                  <div
                    key={f}
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-3xl border border-gray-100"
                  >
                    <CheckCircle2 className="text-green-500" size={24} />
                    <span className="font-bold text-gray-700">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <MortgageCalculator price={property.price} />

            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-8">
                Lokasi Properti
              </h2>
              <div className="h-[400px] rounded-[40px] overflow-hidden border border-gray-100 shadow-sm">
                <APIProvider
                  apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                >
                  <Map
                    defaultCenter={{
                      lat: Number(property.latitude),
                      lng: Number(property.longitude),
                    }}
                    defaultZoom={15}
                    gestureHandling={"greedy"}
                    disableDefaultUI={false}
                  >
                    <Marker
                      position={{
                        lat: Number(property.latitude),
                        lng: Number(property.longitude),
                      }}
                    />
                  </Map>
                </APIProvider>
              </div>
            </div>

            {/* Owner Section */}
            <div className="bg-gray-950 p-10 rounded-[40px] flex flex-col md:flex-row items-center gap-8">
              <div className="w-24 h-24 bg-blue-600 rounded-[32px] flex items-center justify-center shadow-2xl">
                <span className="text-4xl font-black text-white">
                  {property.owner_name?.[0]}
                </span>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-black text-white mb-2">
                  {property.owner_name}
                </h3>
                <p className="text-gray-400 font-medium mb-6">
                  Pemilik HuniKu Terverifikasi
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <a
                    href={`tel:${property.owner_phone}`}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all"
                  >
                    <Phone size={18} /> Hubungi via Telepon
                  </a>
                  <button className="flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-2xl font-bold hover:bg-white/20 transition-all border border-white/10">
                    Lihat Profil
                  </button>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-gray-900">
                  Ulasan Pengguna
                </h2>
                <div className="flex items-center gap-2">
                  <Star className="text-orange-500 fill-orange-500" size={24} />
                  <span className="text-2xl font-black">4.8</span>
                  <span className="text-gray-400 font-bold">(12 Ulasan)</span>
                </div>
              </div>
              <div className="space-y-6">
                {property.reviews?.map((review) => (
                  <div
                    key={review.id}
                    className="p-8 bg-gray-50 rounded-[32px] border border-gray-100"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 flex items-center justify-center font-bold text-blue-600 shadow-sm">
                          {review.user_name?.[0]}
                        </div>
                        <div>
                          <div className="font-black text-gray-900">
                            {review.user_name}
                          </div>
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            {new Date(review.created_at).toLocaleDateString(
                              "id-ID",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={
                                i < review.rating
                                  ? "text-orange-500 fill-orange-500"
                                  : "text-gray-200"
                              }
                            />
                          ))}
                      </div>
                    </div>
                    <p className="text-gray-600 font-medium leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
