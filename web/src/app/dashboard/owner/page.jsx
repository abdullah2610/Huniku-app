import { useState, useRef } from "react";
import {
  Camera,
  MapPin,
  Info,
  CheckCircle2,
  DollarSign,
  Video,
  ArrowLeft,
  X,
  Upload,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import useUpload from "@/utils/useUpload";
import { toast } from "sonner";

export default function OwnerDashboard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "house",
    listing_mode: "sale",
    price: "",
    address: "",
    land_size: "",
    building_size: "",
    bedrooms: "",
    bathrooms: "",
    facilities: [],
    images: [],
    video_url: "",
  });

  const [upload, { loading: uploading }] = useUpload();

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Gagal membuat iklan");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Iklan berhasil diterbitkan!");
      window.location.href = "/";
    },
    onError: () => {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    },
  });

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      const { url, error } = await upload({ url: URL.createObjectURL(file) });
      if (url) {
        setFormData((prev) => ({ ...prev, images: [...prev.images, url] }));
      }
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const toggleFacility = (facility) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((f) => f !== facility)
        : [...prev.facilities, facility],
    }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
            className="text-gray-600 hover:text-black"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-bold text-lg">Pasang Iklan Properti</h1>
          <div className="w-6" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto mt-8 px-4">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= s ? "bg-blue-600" : "bg-gray-200"}`}
            />
          ))}
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold flex items-center">
                <Info className="mr-2 text-blue-600" /> Informasi Dasar
              </h2>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Judul Iklan</label>
                  <input
                    className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                    placeholder="Contoh: Rumah Mewah Minimalis di Jakarta Selatan"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Tipe Properti</label>
                    <select
                      className="w-full border rounded-xl p-3 outline-none focus:border-blue-500 bg-white"
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                    >
                      <option value="house">Rumah</option>
                      <option value="apartment">Apartemen</option>
                      <option value="shophouse">Ruko</option>
                      <option value="boarding_house">Kos</option>
                      <option value="land">Tanah</option>
                      <option value="warehouse">Gudang</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Mode Iklan</label>
                    <select
                      className="w-full border rounded-xl p-3 outline-none focus:border-blue-500 bg-white"
                      value={formData.listing_mode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          listing_mode: e.target.value,
                        })
                      }
                    >
                      <option value="sale">Dijual</option>
                      <option value="rent_monthly">Sewa Bulanan</option>
                      <option value="rent_yearly">Sewa Tahunan</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Harga (IDR)</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-400">
                      Rp
                    </div>
                    <input
                      type="number"
                      className="w-full border rounded-xl p-3 pl-10 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                      placeholder="1,500,000,000"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Alamat Lengkap</label>
                  <textarea
                    className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 h-24 resize-none"
                    placeholder="Jl. Melati No. 123, Kebayoran Baru, Jakarta Selatan"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold flex items-center">
                <CheckCircle2 className="mr-2 text-blue-600" /> Detail &
                Fasilitas
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Luas Tanah (m2)</label>
                  <input
                    type="number"
                    className="w-full border rounded-xl p-3 outline-none focus:border-blue-500"
                    value={formData.land_size}
                    onChange={(e) =>
                      setFormData({ ...formData, land_size: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">
                    Luas Bangunan (m2)
                  </label>
                  <input
                    type="number"
                    className="w-full border rounded-xl p-3 outline-none focus:border-blue-500"
                    value={formData.building_size}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        building_size: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Kamar Tidur</label>
                  <input
                    type="number"
                    className="w-full border rounded-xl p-3 outline-none focus:border-blue-500"
                    value={formData.bedrooms}
                    onChange={(e) =>
                      setFormData({ ...formData, bedrooms: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Kamar Mandi</label>
                  <input
                    type="number"
                    className="w-full border rounded-xl p-3 outline-none focus:border-blue-500"
                    value={formData.bathrooms}
                    onChange={(e) =>
                      setFormData({ ...formData, bathrooms: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Fasilitas</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {[
                    "WiFi",
                    "AC",
                    "Kolam Renang",
                    "Keamanan 24 Jam",
                    "Parkir",
                    "Dapur",
                    "Taman",
                    "Gym",
                  ].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => toggleFacility(f)}
                      className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${formData.facilities.includes(f) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-blue-200"}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Deskripsi Lengkap</label>
                <textarea
                  className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 h-32 resize-none"
                  placeholder="Ceritakan keunggulan properti Anda..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold flex items-center">
                <Camera className="mr-2 text-blue-600" /> Media Properti
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-2xl overflow-hidden group"
                    >
                      <img src={img} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition-all text-gray-400 hover:text-blue-500">
                    <Upload size={32} className="mb-2" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Tambah Foto
                    </span>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                      accept="image/*"
                    />
                  </label>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium flex items-center">
                    <Video size={16} className="mr-1" /> Video Tour URL
                    (YouTube/TikTok)
                  </label>
                  <input
                    className="w-full border rounded-xl p-3 outline-none focus:border-blue-500"
                    placeholder="https://youtube.com/watch?v=..."
                    value={formData.video_url}
                    onChange={(e) =>
                      setFormData({ ...formData, video_url: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2 className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-900">
                      Siap untuk Diterbitkan!
                    </h4>
                    <p className="text-sm text-blue-700">
                      Pastikan semua data sudah benar sebelum mempublikasikan
                      iklan properti Anda.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4 mt-10 pt-6 border-t border-gray-50">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="flex-1 py-4 px-6 rounded-2xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-all"
              >
                Kembali
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={nextStep}
                className="flex-[2] py-4 px-6 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                Lanjutkan
              </button>
            ) : (
              <button
                onClick={() => createMutation.mutate(formData)}
                disabled={createMutation.isLoading || uploading}
                className="flex-[2] py-4 px-6 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
              >
                {createMutation.isLoading
                  ? "Menerbitkan..."
                  : "Terbitkan Iklan"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
