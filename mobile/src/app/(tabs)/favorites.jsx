import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart } from 'lucide-react-native';
import { T } from '../../theme';

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <Text style={s.heading}>Favorit</Text>
      <View style={s.empty}>
        <View style={s.emptyIcon}>
          <Heart size={32} color={T.action} strokeWidth={1.8} />
        </View>
        <Text style={s.emptyTitle}>Favorit Anda</Text>
        <Text style={s.emptyDesc}>
          Properti yang Anda simpan akan tampil di sini agar mudah dibandingkan.
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: T.bg,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: T.text,
    letterSpacing: -0.4,
    marginTop: 16,
    marginBottom: 20,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  emptyIcon: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: T.actionSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  emptyTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: T.text,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  emptyDesc: {
    fontSize: 13.5,
    color: T.sub,
    lineHeight: 21,
    textAlign: 'center',
    maxWidth: 220,
  },
});
