import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Animated,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Search,
  MapPin,
  Bell,
  ChevronRight,
  Home,
  Building2,
  Store,
  Bed,
  Navigation,
} from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import * as Location from "expo-location";

const { width } = Dimensions.get("window");

const CATEGORIES = [
  {
    id: "house",
    label: "Rumah",
    icon: Home,
    color: "#eff6ff",
    textColor: "#2563eb",
  },
  {
    id: "apartment",
    label: "Apartemen",
    icon: Building2,
    color: "#f0fdf4",
    textColor: "#16a34a",
  },
  {
    id: "shophouse",
    label: "Ruko",
    icon: Store,
    color: "#fefce8",
    textColor: "#ca8a04",
  },
  {
    id: "boarding_house",
    label: "Kos",
    icon: Bed,
    color: "#fff1f2",
    textColor: "#e11d48",
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  // Location state
  const [locationParts, setLocationParts] = useState([]);
  const [locationIndex, setLocationIndex] = useState(0);
  const [locationLoading, setLocationLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef(null);

  // Request location permission and get coords + reverse geocode
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocationParts(["Indonesia"]);
          setLocationLoading(false);
          return;
        }
        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const [geocode] = await Location.reverseGeocodeAsync({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        const city =
          geocode?.city || geocode?.subregion || geocode?.district || "";
        const province = geocode?.region || "";
        const parts = [city, province].filter(Boolean);
        setLocationParts(parts.length > 0 ? parts : ["Indonesia"]);
      } catch {
        setLocationParts(["Indonesia"]);
      } finally {
        setLocationLoading(false);
      }
    })();
  }, []);

  // Cycle between city and province with fade animation
  const animateTransition = (nextIndex) => {
    // Fade out + slide up
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -8,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setLocationIndex(nextIndex);
      slideAnim.setValue(8);
      // Fade in + slide to center
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  useEffect(() => {
    if (locationParts.length < 2) return;
    intervalRef.current = setInterval(() => {
      setLocationIndex((prev) => {
        const next = (prev + 1) % locationParts.length;
        animateTransition(next);
        return prev; // state update happens inside animateTransition
      });
    }, 2500);
    return () => clearInterval(intervalRef.current);
  }, [locationParts]);

  const displayLocation = locationParts[locationIndex] || "Indonesia";

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["mobile-featured"],
    queryFn: async () => {
      const res = await fetch("/api/properties?limit=10");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  return (
    <View
      style={{ flex: 1, backgroundColor: "#ffffff", paddingTop: insets.top }}
    >
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 16,
        }}
      >
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 2,
            }}
          >
            <Navigation size={11} color="#16a34a" />
            <Text
              style={{
                fontSize: 11,
                color: "#16a34a",
                fontWeight: "700",
                marginLeft: 4,
                letterSpacing: 0.5,
                textTransform: "uppercase",
              }}
            >
              {locationLoading ? "Mendeteksi lokasi..." : "Lokasi Anda"}
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", alignItems: "center", marginTop: 1 }}
          >
            <MapPin size={15} color="#2563eb" />
            {locationLoading ? (
              <View
                style={{
                  marginLeft: 6,
                  width: 120,
                  height: 16,
                  backgroundColor: "#e2e8f0",
                  borderRadius: 8,
                }}
              />
            ) : (
              <Animated.Text
                style={{
                  fontSize: 15,
                  fontWeight: "800",
                  marginLeft: 5,
                  color: "#1e293b",
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }}
              >
                {displayLocation}
              </Animated.Text>
            )}
          </View>
          {/* Location dots indicator */}
          {!locationLoading && locationParts.length > 1 && (
            <View style={{ flexDirection: "row", gap: 4, marginTop: 5 }}>
              {locationParts.map((_, i) => (
                <View
                  key={i}
                  style={{
                    height: 4,
                    width: i === locationIndex ? 16 : 4,
                    borderRadius: 2,
                    backgroundColor:
                      i === locationIndex ? "#2563eb" : "#cbd5e1",
                  }}
                />
              ))}
            </View>
          )}
        </View>
        <TouchableOpacity
          style={{ padding: 10, backgroundColor: "#f8fafc", borderRadius: 12 }}
        >
          <Bell size={20} color="#1e293b" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Search Bar */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#f1f5f9",
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            <Search size={20} color="#94a3b8" />
            <TextInput
              placeholder={
                !locationLoading &&
                locationParts[0] &&
                locationParts[0] !== "Indonesia"
                  ? `Cari properti di ${locationParts[0]}...`
                  : "Cari rumah, apartemen..."
              }
              style={{
                flex: 1,
                marginLeft: 12,
                fontSize: 14,
                color: "#1e293b",
              }}
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        {/* Categories */}
        <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "800", color: "#1e293b" }}>
              Kategori
            </Text>
            <TouchableOpacity>
              <Text
                style={{ color: "#2563eb", fontWeight: "600", fontSize: 14 }}
              >
                Lihat Semua
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            {CATEGORIES.map((cat) => (
              <TouchableOpacity key={cat.id} style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 20,
                    backgroundColor: cat.color,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 8,
                  }}
                >
                  <cat.icon size={24} color={cat.textColor} />
                </View>
                <Text
                  style={{ fontSize: 12, fontWeight: "600", color: "#64748b" }}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Card */}
        <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
          <View
            style={{
              backgroundColor: "#1e293b",
              borderRadius: 24,
              padding: 20,
              overflow: "hidden",
            }}
          >
            <View style={{ maxWidth: "60%" }}>
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 20,
                  fontWeight: "800",
                  marginBottom: 8,
                }}
              >
                Diskon Sewa 20%
              </Text>
              <Text
                style={{ color: "#94a3b8", fontSize: 12, marginBottom: 16 }}
              >
                Gunakan kode PROPERTIID20 untuk sewa pertama Anda.
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: "#2563eb",
                  alignSelf: "flex-start",
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 12,
                }}
              >
                <Text
                  style={{ color: "#ffffff", fontWeight: "700", fontSize: 12 }}
                >
                  Ambil Promo
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Listings */}
        <View style={{ marginBottom: 24 }}>
          <View
            style={{
              paddingHorizontal: 20,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "800", color: "#1e293b" }}>
              {!locationLoading &&
              locationParts[0] &&
              locationParts[0] !== "Indonesia"
                ? `Properti di ${locationParts[0]}`
                : "Rekomendasi Utama"}
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20 }}
          >
            {isLoading ? (
              <View
                style={{
                  width: width * 0.7,
                  height: 200,
                  backgroundColor: "#f1f5f9",
                  borderRadius: 24,
                  marginRight: 16,
                }}
              />
            ) : (
              properties.map((prop) => (
                <TouchableOpacity
                  key={prop.id}
                  style={{
                    width: width * 0.7,
                    backgroundColor: "#ffffff",
                    borderRadius: 24,
                    marginRight: 16,
                    borderColor: "#f1f5f9",
                    borderWidth: 1,
                    overflow: "hidden",
                  }}
                >
                  <Image
                    source={{
                      uri:
                        prop.images?.[0] ||
                        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
                    }}
                    style={{ width: "100%", height: 150 }}
                    contentFit="cover"
                  />
                  <View style={{ padding: 16 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "800",
                        color: "#1e293b",
                      }}
                      numberOfLines={1}
                    >
                      {prop.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#94a3b8",
                        marginVertical: 4,
                      }}
                      numberOfLines={1}
                    >
                      {prop.address}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "900",
                        color: "#2563eb",
                      }}
                    >
                      Rp {Number(prop.price).toLocaleString("id-ID")}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}
