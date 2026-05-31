import { View, Text, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#ffffff",
        paddingTop: insets.top,
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "800", marginBottom: 20 }}>
        Properti Favorit
      </Text>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: "#94a3b8" }}>Belum ada properti favorit</Text>
      </View>
    </View>
  );
}
