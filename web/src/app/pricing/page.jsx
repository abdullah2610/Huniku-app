import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Check,
  Zap,
  Star,
  Crown,
  TrendingUp,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import useUser from "@/utils/useUser";

const TIER_ICONS = {
  free: Zap,
  pro: Star,
  business: Crown,
};

const TIER_COLORS = {
  free: "from-gray-600 to-gray-700",
  pro: "from-blue-600 to-blue-700",
  business: "from-yellow-600 to-yellow-700",
};

const TIER_ACCENTS = {
  free: "border-gray-200",
  pro: "border-blue-500 shadow-xl shadow-blue-200",
  business: "border-yellow-500 shadow-xl shadow-yellow-200",
};

function Toast({ message, type, onClose }) {
  return (
    <div
      className={`fixed top-6 right-6 z-[999] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl font-semibold text-sm ${type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
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

function UpgradeModal({ plan, onClose, onSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [proofUrl, setProofUrl] = useState("");

  const upgradeMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/subscriptions/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_id: plan.id,
          payment_method: "bank_transfer",
          payment_proof_url: proofUrl || null,
        }),
      });
      if (!res.ok) throw new Error("Gagal upgrade");
      return res.json();
    },
    onSuccess: (data) => {
      onSuccess(data.message);
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden">
        <div
          className={`bg-gradient-to-r ${TIER_COLORS[plan.id]} p-8 text-white`}
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-black">Upgrade ke {plan.name}</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition"
            >
              <X size={18} />
            </button>
          </div>
          <p className="text-3xl font-black">
            Rp {Number(plan.price).toLocaleString("id-ID")}
            <span className="text-sm font-medium opacity-80">/bulan</span>
          </p>
        </div>

        <div className="p-8 space-y-6">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <div className="font-black text-blue-900 text-sm mb-3">
              Transfer ke Rekening:
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Bank BCA</span>
                <span className="font-mono font-bold">1234567890</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">a.n.</span>
                <span className="font-bold">PT HuniKu Indonesia</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Jumlah</span>
                <span className="font-black text-blue-600">
                  Rp {Number(plan.price).toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Upload Bukti Transfer (Opsional)
            </label>
            <input
              type="url"
              placeholder="https://..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
            />
            <p className="text-xs text-gray-400 mt-2">
              Upload bukti ke hosting publik (Imgur, Cloudinary, dll) lalu paste
              URL di sini untuk verifikasi otomatis.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition border border-gray-200"
            >
              Batal
            </button>
            <button
              onClick={() => upgradeMutation.mutate()}
              disabled={upgradeMutation.isPending}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl font-black transition shadow-lg"
            >
              {upgradeMutation.isPending
                ? "Memproses..."
                : proofUrl
                  ? "Verifikasi & Aktifkan"
                  : "Konfirmasi Transfer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  const { data: user } = useUser();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [toast, setToast] = useState(null);

  const { data: plans = [] } = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: async () => {
      const res = await fetch("/api/subscriptions/plans");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const { data: status } = useQuery({
    queryKey: ["subscription-status"],
    queryFn: async () => {
      const res = await fetch("/api/subscriptions/status");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: !!user,
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {selectedPlan && (
        <UpgradeModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onSuccess={(msg) => showToast(msg)}
        />
      )}

      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/30 backdrop-blur-sm border border-blue-400/30 px-4 py-2 rounded-full mb-6">
            <TrendingUp size={16} />
            <span className="text-sm font-bold">
              Paket Berlangganan HuniKu
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            Pilih Paket yang Sesuai <br />
            dengan Kebutuhan Anda
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Tingkatkan visibilitas properti Anda dan raih lebih banyak calon
            pembeli dengan fitur premium kami.
          </p>
        </div>
      </section>

      {/* Current Status Banner */}
      {status && (
        <div className="max-w-7xl mx-auto px-4 -mt-12">
          <div className="bg-white rounded-[28px] border border-gray-100 shadow-xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 bg-gradient-to-br ${TIER_COLORS[status.subscription_tier]} rounded-2xl flex items-center justify-center`}
              >
                {(() => {
                  const Icon = TIER_ICONS[status.subscription_tier];
                  return <Icon size={24} className="text-white" />;
                })()}
              </div>
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Paket Saat Ini
                </div>
                <div className="text-xl font-black text-gray-900">
                  {status.plan_name}
                </div>
                <div className="text-xs text-gray-500 font-medium mt-0.5">
                  {status.current_listings} / {status.max_listings} iklan aktif
                  {status.subscription_expires_at && (
                    <span className="ml-2">
                      • Berlaku hingga{" "}
                      {new Date(
                        status.subscription_expires_at,
                      ).toLocaleDateString("id-ID")}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {status.subscription_tier !== "business" && (
              <button
                onClick={() =>
                  setSelectedPlan(
                    plans.find(
                      (p) =>
                        p.id ===
                        (status.subscription_tier === "free"
                          ? "pro"
                          : "business"),
                    ),
                  )
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition shadow-lg"
              >
                Upgrade Sekarang
              </button>
            )}
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const Icon = TIER_ICONS[plan.id];
            const isCurrentPlan = status?.subscription_tier === plan.id;
            const features = (() => {
              try {
                const raw = plan.features;
                return Array.isArray(raw) ? raw : JSON.parse(raw || "[]");
              } catch {
                return [];
              }
            })();

            return (
              <div
                key={plan.id}
                className={`bg-white rounded-[40px] border-2 overflow-hidden transition-all hover:scale-105 ${TIER_ACCENTS[plan.id]} ${plan.id === "pro" ? "md:-mt-4 md:mb-0" : ""}`}
              >
                {/* Header */}
                <div
                  className={`bg-gradient-to-br ${TIER_COLORS[plan.id]} text-white p-8`}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Icon size={24} />
                    </div>
                    <h3 className="text-2xl font-black">{plan.name}</h3>
                  </div>
                  <div className="mb-2">
                    <span className="text-5xl font-black">
                      {plan.price === 0
                        ? "Gratis"
                        : `${(plan.price / 1000).toFixed(0)}K`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-lg opacity-80 ml-1">/bulan</span>
                    )}
                  </div>
                  {plan.price > 0 && (
                    <div className="text-sm opacity-80">
                      Rp {Number(plan.price).toLocaleString("id-ID")}
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="p-8">
                  <ul className="space-y-4 mb-8">
                    {features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${plan.id === "business" ? "bg-yellow-100" : plan.id === "pro" ? "bg-blue-100" : "bg-gray-100"}`}
                        >
                          <Check
                            size={12}
                            className={
                              plan.id === "business"
                                ? "text-yellow-700"
                                : plan.id === "pro"
                                  ? "text-blue-700"
                                  : "text-gray-600"
                            }
                          />
                        </div>
                        <span className="text-gray-700 font-medium leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {isCurrentPlan ? (
                    <button
                      disabled
                      className="w-full bg-gray-100 text-gray-400 px-6 py-4 rounded-2xl font-black text-sm cursor-not-allowed"
                    >
                      Paket Aktif
                    </button>
                  ) : user ? (
                    <button
                      onClick={() => setSelectedPlan(plan)}
                      className={`w-full ${plan.id === "pro" ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200" : plan.id === "business" ? "bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg shadow-yellow-200" : "bg-gray-800 hover:bg-gray-900 text-white"} px-6 py-4 rounded-2xl font-black text-sm transition`}
                    >
                      {plan.price === 0
                        ? "Downgrade ke Free"
                        : `Upgrade ke ${plan.name}`}
                    </button>
                  ) : (
                    <a
                      href="/account/signup"
                      className={`block w-full text-center ${plan.id === "pro" ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200" : plan.id === "business" ? "bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg shadow-yellow-200" : "bg-gray-800 hover:bg-gray-900 text-white"} px-6 py-4 rounded-2xl font-black text-sm transition`}
                    >
                      Daftar Sekarang
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ / CTA */}
      <section className="max-w-4xl mx-auto px-4 pb-24">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-[40px] p-12 text-white text-center">
          <h2 className="text-3xl font-black mb-4">Punya Pertanyaan?</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Tim support kami siap membantu Anda memilih paket yang tepat untuk
            bisnis properti Anda.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://wa.me/6281200000001"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-black transition shadow-lg"
            >
              Chat via WhatsApp
            </a>
            <a
              href="mailto:halo@huniku.id"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-2xl font-black transition"
            >
              Email Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
