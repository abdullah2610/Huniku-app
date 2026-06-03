import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Search,
  X,
  SlidersHorizontal,
  MapPin,
  Shield,
  Map,
  ArrowUpDown,
} from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import {
  T,
  fmtPrice,
  catLabel,
  modeBadgeLabel,
  modeSuffix,
  isSale,
  CATEGORIES,
} from '../../theme';

const MODE_CHIPS = [
  { id: 'all', label: 'Semua' },
  { id: 'sale', label: 'Dijual' },
  { id: 'rent', label: 'Disewa' },
];

const SORT_OPTIONS = ['Relevan', 'Termurah', 'Termahal'];

function CompactCard({ property, onPress }) {
  const [imgErr, setImgErr] = useState(false);
  const sale = isSale(property.listing_mode);
  const suffix = modeSuffix(property.listing_mode);
  const imgUri =
    !imgErr && property.images?.[0]
      ? property.images[0]
      : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=400';

  return (
    <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.9}>
      <View style={s.cardImgWrap}>
        <Image
          source={{ uri: imgUri }}
          style={s.cardImg}
          contentFit="cover"
          onError={() => setImgErr(true)}
        />
        <View style={[s.modeBadge, { backgroundColor: sale ? T.primary : '#0E9466' }]}>
          <Text style={s.modeBadgeText}>{modeBadgeLabel(property.listing_mode)}</Text>
        </View>
      </View>
      <View style={s.cardBody}>
        <View style={s.cardTopRow}>
          <Text style={s.cardPrice} numberOfLines={1}>
            {fmtPrice(property.price)}
            {suffix ? <Text style={s.cardPriceSuffix}>{suffix}</Text> : null}
          </Text>
          {property.verified !== false && (
            <Shield size={15} color={T.verify} strokeWidth={2.2} />
          )}
        </View>
        <Text style={s.cardTitle} numberOfLines={1}>{property.title}</Text>
        <View style={s.cardLocation}>
          <MapPin size={13} color={T.muted} strokeWidth={1.9} />
          <Text style={s.cardLocationText} numberOfLines={1}>{property.address}</Text>
        </View>
        <View style={s.cardSpecs}>
          {property.bedrooms > 0 && (
            <Text style={s.specText}>{property.bedrooms} KT</Text>
          )}
          {property.bathrooms > 0 && (
            <Text style={s.specText}>{property.bathrooms} KM</Text>
          )}
          {(property.building_size || property.land_size) ? (
            <Text style={s.specText}>{property.building_size || property.land_size} m²</Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState('all');
  const [activeType, setActiveType] = useState('');
  const [sortIdx, setSortIdx] = useState(0);

  const sort = SORT_OPTIONS[sortIdx];

  const { data: rawProperties = [], isLoading } = useQuery({
    queryKey: ['mobile-search', search, activeType],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('location', search);
      if (activeType) params.append('type', activeType);
      const res = await fetch(`/api/properties?${params.toString()}`);
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
  });

  let properties = rawProperties.filter((p) => {
    if (mode === 'all') return true;
    if (mode === 'sale') return p.listing_mode === 'sale';
    return p.listing_mode === 'rent_monthly' || p.listing_mode === 'rent_yearly';
  });

  if (sort === 'Termurah') properties = [...properties].sort((a, b) => Number(a.price) - Number(b.price));
  if (sort === 'Termahal') properties = [...properties].sort((a, b) => Number(b.price) - Number(a.price));

  const nextSort = () => setSortIdx((sortIdx + 1) % SORT_OPTIONS.length);

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.75}>
          <ChevronLeft size={20} color={T.text} strokeWidth={2.2} />
        </TouchableOpacity>
        <View style={s.searchBar}>
          <Search size={18} color={T.action} strokeWidth={2.1} />
          <TextInput
            style={s.searchInput}
            placeholder="Cari lokasi, kota, atau area…"
            placeholderTextColor={T.muted}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search !== '' && (
            <TouchableOpacity onPress={() => setSearch('')} hitSlop={8}>
              <X size={16} color={T.muted} strokeWidth={2} />
            </TouchableOpacity>
          )}
        </View>
        <View style={s.filterBtn}>
          <SlidersHorizontal size={18} color="#fff" strokeWidth={2} />
        </View>
      </View>

      {/* Filter chips */}
      <View style={s.chipRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chipScroll}>
          {MODE_CHIPS.map((chip) => {
            const on = mode === chip.id;
            return (
              <TouchableOpacity
                key={chip.id}
                style={[s.chip, on && s.chipActive]}
                onPress={() => setMode(chip.id)}
                activeOpacity={0.8}
              >
                <Text style={[s.chipText, on && s.chipTextActive]}>{chip.label}</Text>
              </TouchableOpacity>
            );
          })}
          <View style={s.chipDivider} />
          {[{ id: '', label: 'Semua Tipe' }, ...CATEGORIES].map((cat) => {
            const on = activeType === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[s.chip, on && s.chipBlue]}
                onPress={() => setActiveType(cat.id)}
                activeOpacity={0.8}
              >
                <Text style={[s.chipText, on && s.chipTextBlue]}>{cat.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Scroll body */}
      <FlatList
        data={properties}
        keyExtractor={(item, idx) => item.id + '-' + idx}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.listContent}
        ListHeaderComponent={
          <>
            {/* Map banner */}
            <TouchableOpacity style={s.mapBanner} activeOpacity={0.9}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200' }}
                style={StyleSheet.absoluteFillObject}
                contentFit="cover"
              />
              <View style={s.mapOverlay} />
              <View style={s.mapBannerInner}>
                <View>
                  <Text style={s.mapTitle}>Lihat di peta</Text>
                  <Text style={s.mapSub}>{properties.length} properti di area ini</Text>
                </View>
                <View style={s.mapIconBtn}>
                  <Map size={20} color={T.action} strokeWidth={2} />
                </View>
              </View>
            </TouchableOpacity>

            {/* Count + sort */}
            <View style={s.countRow}>
              <Text style={s.countText}>
                <Text style={s.countBold}>{properties.length} properti</Text> ditemukan
              </Text>
              <TouchableOpacity style={s.sortBtn} onPress={nextSort} activeOpacity={0.8}>
                <ArrowUpDown size={14} color={T.action} strokeWidth={2} />
                <Text style={s.sortText}>{sort}</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        ListEmptyComponent={
          isLoading ? (
            <View style={s.center}>
              <ActivityIndicator size="large" color={T.action} />
            </View>
          ) : (
            <View style={s.empty}>
              <Text style={s.emptyTitle}>Tidak ada properti</Text>
              <Text style={s.emptySub}>Coba ubah filter atau kata kunci</Text>
              <TouchableOpacity
                style={s.resetBtn}
                onPress={() => { setSearch(''); setMode('all'); setActiveType(''); }}
              >
                <Text style={s.resetText}>Reset Filter</Text>
              </TouchableOpacity>
            </View>
          )
        }
        renderItem={({ item }) => (
          <CompactCard
            property={item}
            onPress={() => router.push(`/property/${item.id}`)}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: T.bg,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: T.surface,
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
    shadowColor: '#10284010',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 5,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: T.border,
    backgroundColor: T.surface,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    backgroundColor: T.surfaceAlt,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 11,
  },
  searchInput: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '700',
    color: T.text,
    padding: 0,
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: T.action,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  // Chips
  chipRow: {
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  chipScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: T.border,
    backgroundColor: T.surface,
  },
  chipActive: {
    backgroundColor: T.primary,
    borderColor: T.primary,
  },
  chipBlue: {
    backgroundColor: T.actionSoft,
    borderColor: T.action,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: T.sub,
  },
  chipTextActive: {
    color: '#fff',
  },
  chipTextBlue: {
    color: T.action,
  },
  chipDivider: {
    width: 1,
    backgroundColor: T.border,
    marginHorizontal: 2,
    alignSelf: 'stretch',
  },

  // List
  listContent: {
    paddingBottom: 100,
  },

  // Map banner
  mapBanner: {
    margin: 14,
    marginBottom: 0,
    height: 92,
    borderRadius: T.radius,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: T.border,
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(12,35,64,0.34)',
  },
  mapBannerInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  mapTitle: {
    color: '#fff',
    fontSize: 14.5,
    fontWeight: '800',
  },
  mapSub: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 12,
  },
  mapIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  // Count + sort
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  countText: {
    fontSize: 13.5,
    color: T.sub,
    fontWeight: '600',
  },
  countBold: {
    color: T.text,
    fontWeight: '800',
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: T.border,
    backgroundColor: T.surface,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  sortText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: T.text,
  },

  // Compact card
  card: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: T.radius,
    overflow: 'hidden',
    padding: 10,
    marginHorizontal: 16,
    shadowColor: '#10284010',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  cardImgWrap: {
    width: 104,
    height: 104,
    borderRadius: T.radiusSm,
    overflow: 'hidden',
    flexShrink: 0,
    position: 'relative',
  },
  cardImg: {
    width: '100%',
    height: '100%',
  },
  modeBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
  },
  modeBadgeText: {
    color: '#fff',
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  cardBody: {
    flex: 1,
    minWidth: 0,
    paddingTop: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: T.primary,
  },
  cardPriceSuffix: {
    fontSize: 11,
    fontWeight: '700',
    color: T.muted,
  },
  cardTitle: {
    marginTop: 4,
    marginBottom: 3,
    fontSize: 14.5,
    fontWeight: '700',
    color: T.text,
  },
  cardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  cardLocationText: {
    fontSize: 12,
    color: T.sub,
    flex: 1,
  },
  cardSpecs: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  specText: {
    fontSize: 12,
    fontWeight: '600',
    color: T.sub,
  },

  // Empty / loading
  center: {
    paddingTop: 80,
    alignItems: 'center',
  },
  empty: {
    paddingTop: 60,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: T.muted,
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 13,
    color: T.border,
    textAlign: 'center',
  },
  resetBtn: {
    marginTop: 20,
    backgroundColor: T.action,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  resetText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
});
