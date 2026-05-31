import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Search,
  MapPin,
  Home,
  Building2,
  Store,
  Bed,
  LandPlot,
  Warehouse,
  Building,
} from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";

// DB enum value → display label + icon
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
  sale: "Dijual",
  rent_monthly: "Sewa/Bln",
  rent_yearly: "Sewa/Thn",
};

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState(""); // DB enum value

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["mobile-search", search, activeType],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("location", search);
      if (activeType) params.append("type", activeType);
      const res = await fetch(`/api/properties?${params.toString()}`);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  return (
    <View
      style={{ flex: 1, backgroundColor: "#f8fafc", paddingTop: insets.top }}
    >
      {/* Header */}
      <View
        style={{
          backgroundColor: "#ffffff",
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: "#f1f5f9",
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "900",
            color: "#1e293b",
            marginBottom: 12,
          }}
        >
          Cari Properti
        </Text>

        {/* Search bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#f1f5f9",
            borderRadius: 16,
            paddingHorizontal: 14,
            paddingVertical: 12,
          }}
        >
          <Search size={18} color="#94a3b8" />
          <TextInput
            placeholder="Cari lokasi, kota, atau area..."
            style={{ flex: 1, marginLeft: 10, fontSize: 14, color: "#1e293b" }}
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search !== "" && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Text
                style={{ color: "#94a3b8", fontWeight: "700", fontSize: 14 }}
              >
                ✕
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Category filter chips — value is the DB enum */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0, marginTop: 12 }}
          contentContainerStyle={{ gap: 8 }}
        >
          {CATEGORY_FILTERS.map((cat) => {
            const active = cat.value === activeType;
            return (
              <TouchableOpacity
                key={cat.value}
                onPress={() => setActiveType(cat.value)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: active ? "#2563eb" : "#ffffff",
                  borderWidth: 1,
                  borderColor: active ? "#2563eb" : "#e2e8f0",
                  gap: 5,
                }}
              >
                <cat.icon size={13} color={active ? "#ffffff" : "#64748b"} />
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "700",
                    color: active ? "#ffffff" : "#64748b",
                  }}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Results count */}
      <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
        <Text style={{ fontSize: 13, fontWeight: "700", color: "#94a3b8" }}>
          {isLoading ? "Memuat..." : `${properties.length} properti ditemukan`}
          {activeType
            ? ` • ${CATEGORY_FILTERS.find((c) => c.value === activeType)?.label}`
            : ""}
          {search ? ` • "${search}"` : ""}
        </Text>
      </View>

      {/* Property list */}
      {isLoading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : properties.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 40,
          }}
        >
          <Home size={48} color="#e2e8f0" />
          <Text
            style={{
              fontSize: 18,
              fontWeight: "800",
              color: "#94a3b8",
              marginTop: 16,
              textAlign: "center",
            }}
          >
            Tidak ada properti ditemukan
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: "#cbd5e1",
              marginTop: 8,
              textAlign: "center",
            }}
          >
            Coba ubah filter atau kata kunci pencarian
          </Text>
          <TouchableOpacity
            onPress={() => {
              setSearch("");
              setActiveType("");
            }}
            style={{
              marginTop: 20,
              backgroundColor: "#2563eb",
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 16,
            }}
          >
            <Text style={{ color: "#ffffff", fontWeight: "800", fontSize: 14 }}>
              Reset Filter
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={properties}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: insets.bottom + 90,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                marginBottom: 16,
                backgroundColor: "#ffffff",
                borderRadius: 24,
                overflow: "hidden",
                borderWidth: 1,
                borderColor: "#f1f5f9",
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 2 },
              }}
            >
              {/* Image */}
              <View style={{ position: "relative" }}>
                <Image
                  source={{
                    uri:
                      item.images?.[0] ||
                      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400",
                  }}
                  style={{ width: "100%", height: 180 }}
                  contentFit="cover"
                />
                {/* Mode badge */}
                <View
                  style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    backgroundColor: "#2563eb",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 20,
                  }}
                >
                  <Text
                    style={{ color: "#fff", fontSize: 10, fontWeight: "800" }}
                  >
                    {MODE_LABEL[item.listing_mode] || item.listing_mode}
                  </Text>
                </View>
                {/* Subscription badge */}
                {item.badge_label && (
                  <View
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      backgroundColor: item.badge_color || "#3b82f6",
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 20,
                    }}
                  >
                    <Text
                      style={{ color: "#fff", fontSize: 10, fontWeight: "800" }}
                    >
                      {item.badge_label}
                    </Text>
                  </View>
                )}
              </View>

              {/* Info */}
              <View style={{ padding: 16 }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "800",
                    color: "#1e293b",
                    marginBottom: 6,
                  }}
                  numberOfLines={2}
                >
                  {item.title}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <MapPin size={12} color="#94a3b8" />
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#94a3b8",
                      marginLeft: 4,
                      flex: 1,
                    }}
                    numberOfLines={1}
                  >
                    {item.address}
                  </Text>
                </View>

                {/* Room info */}
                {(item.bedrooms || item.bathrooms || item.building_size) && (
                  <View
                    style={{ flexDirection: "row", gap: 12, marginBottom: 10 }}
                  >
                    {item.bedrooms && (
                      <Text
                        style={{
                          fontSize: 11,
                          color: "#64748b",
                          fontWeight: "700",
                        }}
                      >
                        {item.bedrooms} KT
                      </Text>
                    )}
                    {item.bathrooms && (
                      <Text
                        style={{
                          fontSize: 11,
                          color: "#64748b",
                          fontWeight: "700",
                        }}
                      >
                        {item.bathrooms} KM
                      </Text>
                    )}
                    {item.building_size && (
                      <Text
                        style={{
                          fontSize: 11,
                          color: "#64748b",
                          fontWeight: "700",
                        }}
                      >
                        {item.building_size} m²
                      </Text>
                    )}
                    {item.land_size && !item.building_size && (
                      <Text
                        style={{
                          fontSize: 11,
                          color: "#64748b",
                          fontWeight: "700",
                        }}
                      >
                        {item.land_size} m²
                      </Text>
                    )}
                  </View>
                )}

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "900",
                        color: "#2563eb",
                      }}
                    >
                      Rp {Number(item.price).toLocaleString("id-ID")}
                    </Text>
                    {item.listing_mode === "rent_monthly" && (
                      <Text
                        style={{
                          fontSize: 10,
                          color: "#94a3b8",
                          fontWeight: "600",
                        }}
                      >
                        per bulan
                      </Text>
                    )}
                    {item.listing_mode === "rent_yearly" && (
                      <Text
                        style={{
                          fontSize: 10,
                          color: "#94a3b8",
                          fontWeight: "600",
                        }}
                      >
                        per tahun
                      </Text>
                    )}
                  </View>
                  <View
                    style={{
                      backgroundColor: "#eff6ff",
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        color: "#2563eb",
                        fontWeight: "800",
                      }}
                    >
                      Lihat Detail →
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
