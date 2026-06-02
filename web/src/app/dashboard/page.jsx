import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import {
  Plus,
  Eye,
  MapPin,
  TrendingUp,
  Crown,
  Star,
  Zap,
  ArrowUpRight,
  X,
  Home as HomeIcon,
  BarChart3,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useUser from "@/utils/useUser";

const TIER_ICONS = { free: Zap, pro: Star, business: Crown };
const TIER_COLORS = {
  free: "from-gray-600 to-gray-700",
  pro: "from-blue-600 to-blue-700",
  business: "from-yellow-600 to-yellow-700",
};

function UpgradeModal({ onClose, currentTier }) {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition"
          >
            <X size={18} />
          </button>
          <Crown size={48} className="mb-4" />
          <h2 className="text-3xl font-black mb-2">Batas Iklan Tercapai</h2>
          <p className="text-blue-100">
            Upgrade untuk menambah lebih banyak properti!
          </p>
        </div>
        <div className="p-8">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-6">
            <div className="font-black text-blue-900 mb-3">
              Paket {currentTier === "free" ? "Pro" : "Business"} memberi Anda:
            </div>
            <ul className="space-y-2 text-sm text-blue-800">
              {currentTier === "free" ? (
                <>
                  <li className="flex items-center gap-2">
                    <Star size={14} /> 10 iklan aktif
                  </li>
                  <li className="flex items-center gap-2">
                    <Star size={14} /> 10 foto + 1 video per iklan
                  </li>
                  <li className="flex items-center gap-2">
                    <Star size={14} /> Badge "Pro Verified"
                  </li>
                  <li className="flex items-center gap-2">
                    <Star size={14} /> Priority placement
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-center gap-2">
                    <Crown size={14} /> Unlimited iklan
                  </li>
                  <li className="flex items-center gap-2">
                    <Crown size={14} /> Unlimited foto + video
                  </li>
                  <li className="flex items-center gap-2">
                    <Crown size={14} /> Badge "Premium Partner"
                  </li>
                  <li className="flex items-center gap-2">
                    <Crown size={14} /> Analytics dashboard
                  </li>
                </>
              )}
            </ul>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition border border-gray-200"
            >
              Nanti Saja
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black transition shadow-lg text-center"
            >
              Lihat Paket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const { data: subscription } = useQuery({
    queryKey: ["subscription-status"],
    queryFn: async () => {
      const res = await fetch("/api/subscriptions/status");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: !!user,
  });

  const { data: myProperties = [] } = useQuery({
    queryKey: ["my-properties"],
    queryFn: async () => {
      const res = await fetch("/api/properties");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: !!user,
  });

  const handleCreateClick = () => {
    if (
      subscription &&
      subscription.current_listings >= subscription.max_listings
    ) {
      setShowUpgradeModal(true);
      return;
    }
    navigate("/dashboard/owner");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-4">
            Login Required
          </h2>
          <button
            onClick={() => navigate('/account/signin')}
            className="text-blue-600 font-bold hover:underline"
          >
            Sign in to continue
          </button>
        </div>
      </div>
    );
  }

  const TierIcon = subscription
    ? TIER_ICONS[subscription.subscription_tier]
    : Zap;
  const tierGradient = subscription
    ? TIER_COLORS[subscription.subscription_tier]
    : TIER_COLORS.free;
  const usagePercent = subscription
    ? (subscription.current_listings / subscription.max_listings) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {showUpgradeModal && (
        <UpgradeModal
          onClose={() => setShowUpgradeModal(false)}
          currentTier={subscription?.subscription_tier}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-2">
                Dashboard Owner
              </h1>
              <p className="text-gray-500 font-medium">
                Kelola semua iklan properti Anda
              </p>
            </div>
            <button
              onClick={handleCreateClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 transition shadow-lg shadow-blue-200"
            >
              <Plus size={20} />
              Tambah Iklan Baru
            </button>
          </div>

          {/* Subscription Banner */}
          {subscription && (
            <div
              className={`bg-gradient-to-r ${tierGradient} rounded-[28px] p-6 text-white flex items-center justify-between shadow-lg mb-4`}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <TierIcon size={28} />
                </div>
                <div>
                  <div className="text-sm font-bold opacity-90">
                    Paket Langganan
                  </div>
                  <div className="text-2xl font-black">
                    {subscription.plan_name}
                  </div>
                  <div className="text-sm opacity-80 mt-1">
                    {subscription.current_listings} /{" "}
                    {subscription.max_listings} iklan aktif
                    {subscription.subscription_expires_at &&
                      ` • Berlaku hingga ${new Date(subscription.subscription_expires_at).toLocaleDateString("id-ID")}`}
                  </div>
                </div>
              </div>
              {subscription.subscription_tier !== "business" && (
                <button
                  onClick={() => navigate('/pricing')}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 px-6 py-3 rounded-xl font-bold text-sm transition flex items-center gap-2"
                >
                  <ArrowUpRight size={16} />
                  Upgrade Paket
                </button>
              )}
            </div>
          )}

          {/* Usage bar */}
          {subscription && (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-gray-600">
                  Penggunaan Iklan
                </span>
                <span className="text-sm font-black text-gray-900">
                  {subscription.current_listings} / {subscription.max_listings}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${usagePercent >= 100 ? "bg-red-500" : usagePercent >= 80 ? "bg-yellow-500" : "bg-blue-600"}`}
                  style={{ width: `${Math.min(usagePercent, 100)}%` }}
                />
              </div>
              {usagePercent >= 80 &&
                subscription.subscription_tier !== "business" && (
                  <p className="text-xs text-yellow-700 mt-2 font-medium">
                    ⚠️ Hampir mencapai batas.{" "}
                    <button onClick={() => navigate('/pricing')} className="underline font-bold">
                      Upgrade sekarang
                    </button>
                  </p>
                )}
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              label: "Total Iklan",
              value: myProperties.length,
              icon: HomeIcon,
              color: "bg-blue-50 text-blue-600",
            },
            {
              label: "Total Views",
              value: subscription?.monthly_views_count || 0,
              icon: Eye,
              color: "bg-green-50 text-green-600",
            },
            {
              label: "Performance",
              value: "↑ 24%",
              icon: TrendingUp,
              color: "bg-purple-50 text-purple-600",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}
                >
                  <stat.icon size={24} />
                </div>
              </div>
              <div className="text-3xl font-black text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-bold text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Properties List */}
        <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-gray-900">Iklan Saya</h2>
            {subscription?.has_analytics && (
              <button
                onClick={() => navigate('/dashboard/analytics')}
                className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <BarChart3 size={16} />
                Lihat Analytics
              </button>
            )}
          </div>

          {myProperties.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HomeIcon size={36} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-black text-gray-700 mb-2">
                Belum ada iklan
              </h3>
              <p className="text-gray-400 mb-6">
                Mulai pasang iklan properti pertama Anda sekarang!
              </p>
              <button
                onClick={handleCreateClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition shadow-lg inline-flex items-center gap-2"
              >
                <Plus size={18} />
                Tambah Iklan
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProperties.map((prop) => (
                <button
                  key={prop.id}
                  onClick={() => navigate(`/property/${prop.id}`)}
                  className="group bg-gray-50 rounded-[24px] overflow-hidden border border-gray-100 hover:shadow-xl transition-all block w-full text-left"
                >
                  <div className="relative h-48">
                    <img
                      src={
                        prop.images?.[0] ||
                        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=400"
                      }
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div
                      className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${prop.is_active ? "bg-green-500 text-white" : "bg-gray-500 text-white"}`}
                    >
                      {prop.is_active ? "Aktif" : "Nonaktif"}
                    </div>
                    {subscription?.badge_label && (
                      <div
                        style={{ backgroundColor: subscription.badge_color }}
                        className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white"
                      >
                        {subscription.badge_label}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-black text-gray-900 mb-2 truncate group-hover:text-blue-600 transition">
                      {prop.title}
                    </h3>
                    <div className="flex items-center text-gray-400 text-sm mb-3">
                      <MapPin size={14} className="mr-1" />
                      <span className="truncate">{prop.address}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-black text-blue-600">
                        Rp {Number(prop.price).toLocaleString("id-ID")}
                      </span>
                      <div className="flex items-center gap-1 text-gray-400">
                        <Eye size={14} />
                        <span className="text-xs font-bold">
                          {prop.views_count || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
