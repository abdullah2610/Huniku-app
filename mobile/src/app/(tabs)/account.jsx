import { View, Text, TouchableOpacity, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/utils/auth/useAuth";
import {
  User,
  Settings,
  LogOut,
  ChevronRight,
  Home,
} from "lucide-react-native";

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const { auth, signOut, signIn } = useAuth();

  return (
    <View
      style={{ flex: 1, backgroundColor: "#ffffff", paddingTop: insets.top }}
    >
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "800", marginBottom: 32 }}>
          Akun Saya
        </Text>

        {auth ? (
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 32,
              }}
            >
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: "#f1f5f9",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <User size={40} color="#cbd5e1" />
              </View>
              <View style={{ marginLeft: 20 }}>
                <Text
                  style={{ fontSize: 20, fontWeight: "800", color: "#1e293b" }}
                >
                  {auth.user.name || "Pengguna"}
                </Text>
                <Text style={{ color: "#64748b" }}>{auth.user.email}</Text>
              </View>
            </View>

            <View style={{ gap: 8 }}>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 16,
                  backgroundColor: "#f8fafc",
                  borderRadius: 20,
                }}
              >
                <Home size={20} color="#64748b" />
                <Text style={{ flex: 1, marginLeft: 16, fontWeight: "600" }}>
                  Properti Saya
                </Text>
                <ChevronRight size={20} color="#cbd5e1" />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 16,
                  backgroundColor: "#f8fafc",
                  borderRadius: 20,
                }}
              >
                <Settings size={20} color="#64748b" />
                <Text style={{ flex: 1, marginLeft: 16, fontWeight: "600" }}>
                  Pengaturan
                </Text>
                <ChevronRight size={20} color="#cbd5e1" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => signOut()}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 16,
                  backgroundColor: "#fff1f2",
                  borderRadius: 20,
                  marginTop: 20,
                }}
              >
                <LogOut size={20} color="#e11d48" />
                <Text
                  style={{
                    flex: 1,
                    marginLeft: 16,
                    fontWeight: "600",
                    color: "#e11d48",
                  }}
                >
                  Keluar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={{ alignItems: "center", py: 40, paddingVertical: 40 }}>
            <Text
              style={{
                color: "#64748b",
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              Masuk untuk mengelola properti dan melihat favorit Anda.
            </Text>
            <TouchableOpacity
              onPress={() => signIn()}
              style={{
                backgroundColor: "#2563eb",
                px: 40,
                py: 16,
                borderRadius: 20,
                paddingHorizontal: 40,
                paddingVertical: 16,
              }}
            >
              <Text
                style={{ color: "#ffffff", fontWeight: "800", fontSize: 16 }}
              >
                Masuk / Daftar
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
