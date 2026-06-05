"use client";

import { useState, useRef } from "react";
import {
  Users,
  Home,
  CreditCard,
  BarChart3,
  ShieldAlert,
  Search,
  Pencil,
  Trash2,
  X,
  ChevronDown,
  Eye,
  EyeOff,
  Building2,
  Store,
  Bed,
  LandPlot,
  Warehouse,
  CheckCircle2,
  AlertCircle,
  Upload,
  ImagePlus,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useUpload from "@/utils/useUpload";

const TYPE_LABELS = {
  house: "Rumah",
  apartment: "Apartemen",
  shophouse: "Ruko",
  boarding_house: "Kos",
  land: "Tanah",
  warehouse: "Gudang",
  commercial: "Komersial",
};

const TYPE_ICONS = {
  house: Home,
  apartment: Building2,
  shophouse: Store,
  boarding_house: Bed,
  land: LandPlot,
  warehouse: Warehouse,
  commercial: Building2,
};

const TYPE_COLORS = {
  house: "bg-blue-100 text-blue-700",
  apartment: "bg-purple-100 text-purple-700",
  shophouse: "bg-orange-100 text-orange-700",
  boarding_house: "bg-green-100 text-green-700",
  land: "bg-yellow-100 text-yellow-700",
  warehouse: "bg-gray-100 text-gray-700",
  commercial: "bg-red-100 text-red-700",
};

const MODE_LABELS = {
  sale: "Dijual",
  rent_monthly: "Sewa/Bulan",
  rent_yearly: "Sewa/Tahun",
};

const MODE_COLORS = {
  sale: "bg-emerald-100 text-emerald-700",
  rent_monthly: "bg-sky-100 text-sky-700",
  rent_yearly: "bg-indigo-100 text-indigo-700",
};

function Toast({ message, type, onClose }) {
  return (
    <div
      className={`fixed top-6 right-6 z-[999] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl font-semibold text-sm transition-all ${
        type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
      }`}
    >
      {type === "success" ? (
        <CheckCircle2 size={18} />
      ) : (
        <AlertCircle size={18} />
      )}
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <X size={16} />
      </button>
    </div>
  );
}

function EditModal({ property, onClose, onSave }) {
  const [form, setForm] = useState({
    title: property.title || "",
    description: property.description || "",
    type: property.type || "house",
    listing_mode: property.listing_mode || "sale",
    price: property.price || "",
    address: property.address || "",
    land_size: property.land_size || "",
    building_size: property.building_size || "",
    bedrooms: property.bedrooms || "",
    bathrooms: property.bathrooms || "",
    is_active: property.is_active ?? true,
    facilities: Array.isArray(property.facilities)
      ? property.facilities.join(", ")
      : "",
    images: Array.isArray(property.images) ? [...property.images] : [],
  });

  const [upload, { loading: uploading }] = useUpload();
  const fileInputRef = useRef(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleImageFiles = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      const { url, error } = await upload({ url: URL.createObjectURL(file) });
      if (url) {
        setForm((f) => ({ ...f, images: [...f.images, url] }));
      }
    }
    e.target.value = "";
  };

  const removeImage = (index) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      price: Number(form.price),
      land_size: form.land_size ? Number(form.land_size) : null,
      building_size: form.building_size ? Number(form.building_size) : null,
      bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
      facilities: form.facilities
        ? form.facilities
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
    });
  };

  const inputCls =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-gray-50 transition";
  const labelCls =
    "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-[32px] w-full max-w-2xl mx-4 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Edit Properti</h2>
            <p className="text-sm text-gray-400 mt-1 font-medium">
              ID: {property.id.slice(0, 8)}...
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto p-8 space-y-5 flex-1"
        >
          <div>
            <label className={labelCls}>Judul Properti</label>
            <input
              className={inputCls}
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Tipe Properti</label>
              <div className="relative">
                <select
                  className={inputCls + " appearance-none pr-10"}
                  value={form.type}
                  onChange={(e) => set("type", e.target.value)}
                >
                  {Object.entries(TYPE_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={15}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Mode Listing</label>
              <div className="relative">
                <select
                  className={inputCls + " appearance-none pr-10"}
                  value={form.listing_mode}
                  onChange={(e) => set("listing_mode", e.target.value)}
                >
                  <option value="sale">Dijual</option>
                  <option value="rent_monthly">Sewa per Bulan</option>
                  <option value="rent_yearly">Sewa per Tahun</option>
                </select>
                <ChevronDown
                  size={15}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className={labelCls}>Harga (Rp)</label>
            <input
              className={inputCls}
              type="number"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              required
            />
          </div>

          <div>
            <label className={labelCls}>Alamat</label>
            <input
              className={inputCls}
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Luas Tanah (m²)</label>
              <input
                className={inputCls}
                type="number"
                value={form.land_size}
                onChange={(e) => set("land_size", e.target.value)}
                placeholder="-"
              />
            </div>
            <div>
              <label className={labelCls}>Luas Bangunan (m²)</label>
              <input
                className={inputCls}
                type="number"
                value={form.building_size}
                onChange={(e) => set("building_size", e.target.value)}
                placeholder="-"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Kamar Tidur</label>
              <input
                className={inputCls}
                type="number"
                value={form.bedrooms}
                onChange={(e) => set("bedrooms", e.target.value)}
                placeholder="-"
              />
            </div>
            <div>
              <label className={labelCls}>Kamar Mandi</label>
              <input
                className={inputCls}
                type="number"
                value={form.bathrooms}
                onChange={(e) => set("bathrooms", e.target.value)}
                placeholder="-"
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Deskripsi</label>
            <textarea
              className={inputCls}
              rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>

          <div>
            <label className={labelCls}>Fasilitas (pisahkan koma)</label>
            <input
              className={inputCls}
              value={form.facilities}
              onChange={(e) => set("facilities", e.target.value)}
              placeholder="Garasi, Kolam Renang, CCTV..."
            />
          </div>

          <div>
            <label className={labelCls}>Foto Properti</label>
            <div className="space-y-3">
              {form.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {form.images.map((url, i) => (
                    <div key={i} className="relative group aspect-video">
                      <img
                        src={url}
                        alt={`foto ${i + 1}`}
                        className="w-full h-full object-cover rounded-xl border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageFiles}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full border-2 border-dashed border-gray-200 rounded-xl py-4 flex items-center justify-center gap-2 text-sm font-bold text-gray-400 hover:border-blue-300 hover:text-blue-500 transition disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Upload size={16} className="animate-bounce" />
                    Mengupload...
                  </>
                ) : (
                  <>
                    <ImagePlus size={16} />
                    Tambah Foto
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => set("is_active", !form.is_active)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition ${
                form.is_active
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {form.is_active ? <Eye size={15} /> : <EyeOff size={15} />}
              {form.is_active
                ? "Aktif / Ditampilkan"
                : "Nonaktif / Disembunyikan"}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex gap-3 justify-end bg-gray-50 rounded-b-[32px]">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black transition shadow-lg shadow-blue-200"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ property, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-[32px] w-full max-w-md mx-4 shadow-2xl p-10 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trash2 size={36} className="text-red-600" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-3">
          Hapus Properti?
        </h2>
        <p className="text-gray-500 mb-2 font-medium">"{property.title}"</p>
        <p className="text-sm text-gray-400 mb-8">
          Tindakan ini tidak dapat dibatalkan. Data properti akan dihapus secara
          permanen.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition border border-gray-200"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black transition shadow-lg shadow-red-200"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [editingProperty, setEditingProperty] = useState(null);
  const [deletingProperty, setDeletingProperty] = useState(null);
  const [toast, setToast] = useState(null);
  const queryClient = useQueryClient();

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch all properties
  const { data: properties = [], isLoading, error: propertiesError } = useQuery({
    queryKey: ["admin-properties"],
    queryFn: async () => {
      const res = await fetch("/api/admin/properties");
      if (res.status === 403) throw Object.assign(new Error("Forbidden"), { status: 403 });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    retry: false,
  });

  // Fetch real stats
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    retry: false,
    enabled: !propertiesError,
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await fetch(`/api/admin/properties/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Gagal memperbarui");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      setEditingProperty(null);
      showToast("Properti berhasil diperbarui!", "success");
    },
    onError: () => showToast("Gagal memperbarui properti.", "error"),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/admin/properties/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      setDeletingProperty(null);
      showToast("Properti berhasil dihapus!", "success");
    },
    onError: () => showToast("Gagal menghapus properti.", "error"),
  });

  const filtered = properties.filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.address?.toLowerCase().includes(search.toLowerCase()) ||
      TYPE_LABELS[p.type]?.toLowerCase().includes(search.toLowerCase()),
  );

  const activeCount = properties.filter((p) => p.is_active).length;
  const inactiveCount = properties.filter((p) => !p.is_active).length;

  const STATS = [
    { label: "Total Properti", value: properties.length, trend: `${Object.keys(TYPE_LABELS).length} kategori` },
    {
      label: "Aktif",
      value: activeCount,
      trend: "tampil di publik",
    },
    {
      label: "Nonaktif",
      value: inactiveCount,
      trend: "tersembunyi",
    },
    {
      label: "Total User",
      value: stats ? Number(stats.users).toLocaleString("id-ID") : "—",
      trend: stats ? `+${stats.properties?.new_this_month ?? 0} properti baru bulan ini` : "memuat...",
    },
  ];

  const NAV = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "properties", label: "Manajemen Iklan", icon: Home },
    { id: "users", label: "Manajemen User", icon: Users },
    { id: "payments", label: "Transaksi", icon: CreditCard },
  ];

  if (propertiesError?.status === 403) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-16 rounded-[32px] border border-gray-100 shadow-sm text-center max-w-md">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert size={40} className="text-red-400" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">Akses Ditolak</h2>
          <p className="text-gray-400 font-medium mb-2">
            Akun Anda belum memiliki hak admin.
          </p>
          <p className="text-xs text-gray-300">
            Hubungi developer untuk mendaftarkan akun sebagai admin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Modals */}
      {editingProperty && (
        <EditModal
          property={editingProperty}
          onClose={() => setEditingProperty(null)}
          onSave={(data) =>
            updateMutation.mutate({ id: editingProperty.id, data })
          }
        />
      )}
      {deletingProperty && (
        <DeleteConfirmModal
          property={deletingProperty}
          onClose={() => setDeletingProperty(null)}
          onConfirm={() => deleteMutation.mutate(deletingProperty.id)}
        />
      )}

      {/* Sidebar */}
      <div className="w-72 bg-gray-900 text-white p-8 hidden lg:flex flex-col shrink-0">
        <div className="mb-12">
          <h1 className="text-2xl font-black tracking-tighter">
            HuniKu{" "}
            <span className="text-blue-500 text-sm align-top font-bold">
              Admin
            </span>
          </h1>
          <p className="text-gray-400 text-xs mt-1 font-medium">
            Dashboard Manajemen Platform
          </p>
        </div>
        <nav className="space-y-2 flex-1">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold text-sm ${
                activeTab === item.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="pt-8 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <ShieldAlert size={18} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-bold">Super Admin</div>
              <div className="text-xs text-gray-400">admin@huniku.com</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-900">
              {NAV.find((n) => n.id === activeTab)?.label}
            </h2>
            <p className="text-sm text-gray-400 font-medium mt-0.5">
              HuniKu Admin Panel
            </p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                className="bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-11 pr-5 outline-none focus:ring-2 focus:ring-blue-100 text-sm w-64 transition"
                placeholder="Cari properti, alamat..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white p-7 rounded-[28px] border border-gray-100 shadow-sm"
                  >
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                      {stat.label}
                    </div>
                    <div className="text-4xl font-black text-gray-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs font-bold text-blue-500">
                      {stat.trend}
                    </div>
                  </div>
                ))}
              </div>

              {/* Category breakdown */}
              <div className="bg-white p-8 rounded-[28px] border border-gray-100 shadow-sm">
                <h3 className="text-lg font-black text-gray-900 mb-6">
                  Properti per Kategori
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  {Object.entries(TYPE_LABELS).map(([type, label]) => {
                    const count = properties.filter(
                      (p) => p.type === type,
                    ).length;
                    const Icon = TYPE_ICONS[type];
                    return (
                      <div
                        key={type}
                        className="text-center p-4 rounded-2xl bg-gray-50"
                      >
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 ${TYPE_COLORS[type]}`}
                        >
                          <Icon size={22} />
                        </div>
                        <div className="text-2xl font-black text-gray-900">
                          {count}
                        </div>
                        <div className="text-xs font-bold text-gray-400 mt-1">
                          {label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick property list */}
              <div className="bg-white p-8 rounded-[28px] border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-black text-gray-900">
                    Iklan Terbaru
                  </h3>
                  <button
                    onClick={() => setActiveTab("properties")}
                    className="text-sm font-bold text-blue-600 hover:underline"
                  >
                    Lihat Semua →
                  </button>
                </div>
                <div className="space-y-3">
                  {properties.slice(0, 5).map((p) => {
                    const Icon = TYPE_ICONS[p.type] || Home;
                    return (
                      <div
                        key={p.id}
                        className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition group"
                      >
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${TYPE_COLORS[p.type]}`}
                        >
                          <Icon size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-gray-900 text-sm truncate">
                            {p.title}
                          </div>
                          <div className="text-xs text-gray-400 truncate mt-0.5">
                            {p.address}
                          </div>
                        </div>
                        <div className="text-sm font-black text-blue-600 whitespace-nowrap">
                          Rp {Number(p.price).toLocaleString("id-ID")}
                        </div>
                        <div
                          className={`text-xs font-bold px-3 py-1 rounded-full ${p.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                        >
                          {p.is_active ? "Aktif" : "Nonaktif"}
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={() => setEditingProperty(p)}
                            className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setDeletingProperty(p)}
                            className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* PROPERTIES TAB */}
          {activeTab === "properties" && (
            <div className="space-y-6">
              {/* Filter chips */}
              <div className="flex gap-3 flex-wrap">
                {Object.entries(TYPE_LABELS).map(([type, label]) => {
                  const count = properties.filter(
                    (p) => p.type === type,
                  ).length;
                  return (
                    <button
                      key={type}
                      onClick={() => setSearch(label)}
                      className={`px-4 py-2 rounded-full text-xs font-bold border transition ${
                        search === label
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      {label} ({count})
                    </button>
                  );
                })}
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="px-4 py-2 rounded-full text-xs font-bold border border-red-200 text-red-500 bg-white hover:bg-red-50 transition flex items-center gap-1"
                  >
                    <X size={12} /> Reset
                  </button>
                )}
              </div>

              {/* Table */}
              <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <th className="text-left px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">
                          Properti
                        </th>
                        <th className="text-left px-4 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">
                          Kategori
                        </th>
                        <th className="text-left px-4 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">
                          Mode
                        </th>
                        <th className="text-left px-4 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">
                          Harga
                        </th>
                        <th className="text-left px-4 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="text-center px-4 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {isLoading
                        ? Array(7)
                            .fill(0)
                            .map((_, i) => (
                              <tr key={i}>
                                {Array(6)
                                  .fill(0)
                                  .map((__, j) => (
                                    <td key={j} className="px-6 py-5">
                                      <div className="h-4 bg-gray-100 rounded-lg animate-pulse" />
                                    </td>
                                  ))}
                              </tr>
                            ))
                        : filtered.map((prop) => {
                            const Icon = TYPE_ICONS[prop.type] || Home;
                            return (
                              <tr
                                key={prop.id}
                                className="hover:bg-gray-50/80 transition group"
                              >
                                {/* Property */}
                                <td className="px-6 py-5">
                                  <div className="flex items-center gap-4">
                                    <img
                                      src={
                                        prop.images?.[0] ||
                                        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=100"
                                      }
                                      alt={prop.title}
                                      className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-gray-100"
                                    />
                                    <div className="min-w-0">
                                      <div className="font-bold text-gray-900 text-sm truncate max-w-[240px]">
                                        {prop.title}
                                      </div>
                                      <div className="text-xs text-gray-400 truncate max-w-[240px] mt-0.5">
                                        {prop.address}
                                      </div>
                                      <div className="text-xs text-gray-300 mt-0.5 font-mono">
                                        {prop.id.slice(0, 12)}...
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                {/* Type */}
                                <td className="px-4 py-5">
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${TYPE_COLORS[prop.type]}`}
                                  >
                                    <Icon size={13} />
                                    {TYPE_LABELS[prop.type]}
                                  </span>
                                </td>
                                {/* Mode */}
                                <td className="px-4 py-5">
                                  <span
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold ${MODE_COLORS[prop.listing_mode]}`}
                                  >
                                    {MODE_LABELS[prop.listing_mode]}
                                  </span>
                                </td>
                                {/* Price */}
                                <td className="px-4 py-5">
                                  <div className="font-black text-gray-900 text-sm">
                                    Rp{" "}
                                    {Number(prop.price).toLocaleString("id-ID")}
                                  </div>
                                </td>
                                {/* Status */}
                                <td className="px-4 py-5">
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${
                                      prop.is_active
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-500"
                                    }`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${prop.is_active ? "bg-green-500" : "bg-gray-400"}`}
                                    />
                                    {prop.is_active ? "Aktif" : "Nonaktif"}
                                  </span>
                                </td>
                                {/* Actions */}
                                <td className="px-4 py-5">
                                  <div className="flex items-center justify-center gap-2">
                                    <a
                                      href={`/property/${prop.id}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 transition"
                                      title="Lihat Detail"
                                    >
                                      <Eye size={15} />
                                    </a>
                                    <button
                                      onClick={() => setEditingProperty(prop)}
                                      className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition"
                                      title="Edit"
                                    >
                                      <Pencil size={15} />
                                    </button>
                                    <button
                                      onClick={() => setDeletingProperty(prop)}
                                      className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition"
                                      title="Hapus"
                                    >
                                      <Trash2 size={15} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                    </tbody>
                  </table>
                  {!isLoading && filtered.length === 0 && (
                    <div className="text-center py-16 text-gray-400">
                      <Home size={40} className="mx-auto mb-4 opacity-30" />
                      <p className="font-bold">Tidak ada properti ditemukan</p>
                    </div>
                  )}
                </div>
                {/* Footer count */}
                <div className="px-6 py-4 border-t border-gray-50 bg-gray-50/50">
                  <span className="text-xs font-bold text-gray-400">
                    Menampilkan {filtered.length} dari {properties.length}{" "}
                    properti
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* OTHER TABS */}
          {(activeTab === "users" || activeTab === "payments") && (
            <div className="bg-white p-16 rounded-[32px] border border-gray-100 shadow-sm text-center">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <BarChart3 size={40} className="text-blue-400" />
              </div>
              <h3 className="text-2xl font-black mb-3 text-gray-900">
                Segera Hadir
              </h3>
              <p className="text-gray-400 max-w-sm mx-auto font-medium">
                Modul{" "}
                <strong className="text-gray-700">
                  {NAV.find((n) => n.id === activeTab)?.label}
                </strong>{" "}
                sedang dalam pengembangan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
