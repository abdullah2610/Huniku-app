import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Search,
  Bell,
  MapPin,
  Home,
  Building2,
  Bed,
  Store,
  LandPlot,
  Warehouse,
  Shield,
  FileText,
  Lock,
  Star,
  ChevronRight,
  ArrowRight,
  SlidersHorizontal,
  Eye,
  CheckCircle2,
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
  HERO_IMAGE,
  STATS,
  TRUST,
  TESTIMONIALS,
  CATEGORIES,
} from '../../theme';

const CAT_ICONS = {
  house: Home,
  apartment: Building2,
  boarding_house: Bed,
  shophouse: Store,
  land: LandPlot,
  warehouse: Warehouse,
};

const TRUST_ICONS = {
  shield: Shield,
  doc: FileText,
  lock: Lock,
};

function Brand() {
  return (
    <View style={s.brand}>
      <View style={s.brandLeft}>
        <LinearGradient colors={T.primaryGradColors} style={s.brandIcon}>
          <Home size={17} color="#fff" strokeWidth={2.2} />
        </LinearGradient>
        <Text style={s.brandName}>
          Huni<Text style={{ color: T.action }}>ku</Text>
        </Text>
      </View>
      <View style={s.bellWrap}>
        <Bell size={19} color={T.text} strokeWidth={1.9} />
        <View style={s.bellDot} />
      </View>
    </View>
  );
}

function Hero({ onSearchPress }) {
  return (
    <View style={s.heroWrap}>
      <View style={s.heroImg}>
        <Image
          source={{ uri: HERO_IMAGE }}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
        />
        <LinearGradient
          colors={['rgba(12,35,64,0.15)', 'rgba(12,35,64,0.82)']}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={s.heroBadge}>
          <Shield size={12} color="#fff" strokeWidth={2.2} />
          <Text style={s.heroBadgeText}>100% iklan terverifikasi</Text>
        </View>
        <Text style={s.heroTitle}>Temukan hunian tepercaya{'\n'}di seluruh Indonesia</Text>
      </View>

      {/* Search bar overlapping hero bottom */}
      <View style={s.searchOverlap}>
        <TouchableOpacity style={s.searchBar} onPress={onSearchPress} activeOpacity={0.9}>
          <Search size={19} color={T.action} strokeWidth={2.1} />
          <Text style={s.searchPlaceholder}>Cari kota, area, atau proyek…</Text>
          <View style={s.searchBtn}>
            <SlidersHorizontal size={16} color="#fff" strokeWidth={2} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function StatRibbon() {
  return (
    <View style={s.ribbon}>
      {STATS.map((stat, i) => (
        <View key={i} style={s.ribbonItem}>
          {i > 0 && <View style={s.ribbonDivider} />}
          <View style={s.ribbonCenter}>
            <Text style={s.ribbonValue}>{stat.value}</Text>
            <Text style={s.ribbonLabel}>{stat.label}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function CategoryTile({ cat, active, onPress }) {
  const Icon = CAT_ICONS[cat.id] || Home;
  return (
    <TouchableOpacity style={s.catTile} onPress={onPress} activeOpacity={0.75}>
      <View style={[s.catIconWrap, active && s.catIconWrapActive]}>
        <Icon size={26} color={active ? '#fff' : T.action} strokeWidth={1.9} />
      </View>
      <Text style={[s.catLabel, active && s.catLabelActive]}>{cat.label}</Text>
    </TouchableOpacity>
  );
}

function PropertyCard({ property, onPress }) {
  const sale = isSale(property.listing_mode);
  const suffix = modeSuffix(property.listing_mode);
  const [imgErr, setImgErr] = useState(false);
  const imgUri =
    !imgErr && property.images?.[0]
      ? property.images[0]
      : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800';

  return (
    <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.92}>
      <View style={s.cardImgWrap}>
        <Image
          source={{ uri: imgUri }}
          style={s.cardImg}
          contentFit="cover"
          onError={() => setImgErr(true)}
        />
        <View style={s.cardBadgeRow}>
          <View style={[s.modeBadge, { backgroundColor: sale ? T.primary : '#0E9466' }]}>
            <Text style={s.modeBadgeText}>{modeBadgeLabel(property.listing_mode)}</Text>
          </View>
        </View>
        <View style={s.cardHeart}>
          <View style={s.heartBtn}>
            <Text style={{ fontSize: 14 }}>♡</Text>
          </View>
        </View>
        <View style={s.verifiedPill}>
          <Shield size={11} color="#fff" strokeWidth={2.4} />
          <Text style={s.verifiedText}>Terverifikasi</Text>
        </View>
      </View>
      <View style={s.cardBody}>
        <View style={s.cardPriceRow}>
          <Text style={s.cardPrice}>
            {fmtPrice(property.price)}
            {suffix ? <Text style={s.cardPriceSuffix}>{suffix}</Text> : null}
          </Text>
          <Text style={s.cardType}>{catLabel(property.property_type)}</Text>
        </View>
        <Text style={s.cardTitle} numberOfLines={2}>{property.title}</Text>
        <View style={s.cardLocation}>
          <MapPin size={13} color={T.muted} strokeWidth={1.9} />
          <Text style={s.cardLocationText} numberOfLines={1}>{property.address}</Text>
        </View>
        <View style={s.cardDivider} />
        <View style={s.cardSpecs}>
          {property.bedrooms > 0 && (
            <Text style={s.specText}>🛏 {property.bedrooms} KT</Text>
          )}
          {property.bathrooms > 0 && (
            <Text style={s.specText}>🚿 {property.bathrooms} KM</Text>
          )}
          {(property.building_size > 0 || property.land_size > 0) && (
            <Text style={s.specText}>📐 {property.building_size || property.land_size} m²</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

function TrustSection() {
  return (
    <View style={s.trustWrap}>
      {TRUST.map((item, i) => {
        const Icon = TRUST_ICONS[item.icon] || Shield;
        return (
          <View key={i} style={s.trustCard}>
            <View style={s.trustIconWrap}>
              <Icon size={21} color={T.verify} strokeWidth={2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.trustTitle}>{item.title}</Text>
              <Text style={s.trustDesc}>{item.desc}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

function TestimonialCard({ item }) {
  return (
    <View style={s.testimonialCard}>
      <View style={s.starRow}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} size={14} color={T.action} fill={T.action} strokeWidth={0} />
        ))}
      </View>
      <Text style={s.testimonialQuote}>"{item.quote}"</Text>
      <View style={s.testimonialAuthor}>
        <View style={s.avatarCircle}>
          <Text style={s.avatarText}>{item.avatar}</Text>
        </View>
        <View>
          <Text style={s.authorName}>{item.name}</Text>
          <Text style={s.authorRole}>{item.role}</Text>
        </View>
      </View>
    </View>
  );
}

function SectionHead({ title, action, onAction }) {
  return (
    <View style={s.sectionHead}>
      <Text style={s.sectionTitle}>{title}</Text>
      {action && (
        <TouchableOpacity style={s.sectionAction} onPress={onAction}>
          <Text style={s.sectionActionText}>{action}</Text>
          <ChevronRight size={15} color={T.action} strokeWidth={2.4} />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState(null);

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['mobile-featured'],
    queryFn: async () => {
      const res = await fetch('/api/properties?limit=8');
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
  });

  const goSearch = () => router.push('/(tabs)/search');

  const displayed = properties.slice(0, 6);

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <Brand />

        <View style={s.heroPad}>
          <Hero onSearchPress={goSearch} />
        </View>

        <View style={s.pad}>
          <StatRibbon />
        </View>

        {/* Categories */}
        <View style={s.section}>
          <SectionHead title="Kategori" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 4 }}
          >
            {CATEGORIES.map((cat) => (
              <CategoryTile
                key={cat.id}
                cat={cat}
                active={activeCategory === cat.id}
                onPress={() => {
                  setActiveCategory(activeCategory === cat.id ? null : cat.id);
                  goSearch();
                }}
              />
            ))}
          </ScrollView>
        </View>

        {/* Recommendations */}
        <View style={s.section}>
          <SectionHead
            title="Rekomendasi Pilihan"
            action="Lihat semua"
            onAction={goSearch}
          />
          {isLoading ? (
            <View style={s.loadingCard} />
          ) : (
            <View style={{ gap: 16 }}>
              {displayed.map((p) => (
                <PropertyCard
                  key={p.id}
                  property={p}
                  onPress={() => router.push(`/property/${p.id}`)}
                />
              ))}
            </View>
          )}
        </View>

        {/* Trust */}
        <View style={s.section}>
          <TrustSection />
        </View>

        {/* Testimonials */}
        <View style={{ paddingTop: 24, paddingBottom: 6 }}>
          <View style={s.pad}>
            <SectionHead title="Kata Mereka" />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
          >
            {TESTIMONIALS.map((item, i) => (
              <TestimonialCard key={i} item={item} />
            ))}
          </ScrollView>
        </View>

        {/* CTA */}
        <View style={s.padCTA}>
          <LinearGradient colors={T.primaryGradColors} style={s.ctaBox}>
            <Text style={s.ctaTitle}>Punya properti untuk dijual?</Text>
            <Text style={s.ctaDesc}>Pasang iklan gratis & jangkau ribuan pencari serius.</Text>
            <TouchableOpacity style={s.ctaBtn} onPress={goSearch} activeOpacity={0.85}>
              <Text style={s.ctaBtnText}>Pasang Iklan</Text>
              <ArrowRight size={17} color={T.primary} strokeWidth={2.3} />
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: T.bg,
  },
  pad: {
    paddingHorizontal: 20,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 6,
  },
  padCTA: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 28,
  },

  // Brand
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  brandLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 21,
    fontWeight: '800',
    color: T.text,
    letterSpacing: -0.4,
  },
  bellWrap: {
    width: 40,
    height: 40,
    borderRadius: 999,
    border: `1px solid ${T.border}`,
    borderWidth: 1,
    borderColor: T.border,
    backgroundColor: T.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: '#E11D48',
    borderWidth: 1.5,
    borderColor: T.surface,
  },

  // Hero
  heroPad: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  heroWrap: {
    marginBottom: 0,
  },
  heroImg: {
    height: 232,
    borderRadius: T.radiusLg,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    paddingHorizontal: 18,
    paddingBottom: 68,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 10,
  },
  heroBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 30,
    letterSpacing: -0.4,
  },
  searchOverlap: {
    marginTop: -42,
    zIndex: 2,
    paddingHorizontal: 6,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 14,
    padding: 13,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  searchPlaceholder: {
    flex: 1,
    color: T.muted,
    fontSize: 14.5,
    fontWeight: '500',
  },
  searchBtn: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: T.action,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Stats ribbon
  ribbon: {
    flexDirection: 'row',
    backgroundColor: T.surface,
    borderRadius: T.radius,
    borderWidth: 1,
    borderColor: T.border,
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginTop: 14,
    shadowColor: '#1028500D',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  ribbonItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ribbonDivider: {
    width: 1,
    height: 30,
    backgroundColor: T.line,
    position: 'absolute',
    left: 0,
  },
  ribbonCenter: {
    alignItems: 'center',
  },
  ribbonValue: {
    fontSize: 17,
    fontWeight: '800',
    color: T.primary,
    letterSpacing: -0.3,
  },
  ribbonLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: T.muted,
    marginTop: 2,
  },

  // Category tiles
  catTile: {
    width: 76,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  catIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: T.actionSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  catIconWrapActive: {
    backgroundColor: T.primary,
    borderColor: T.primary,
  },
  catLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: T.sub,
    textAlign: 'center',
  },
  catLabelActive: {
    color: T.action,
  },

  // Section head
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: T.text,
    letterSpacing: -0.4,
  },
  sectionAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  sectionActionText: {
    color: T.action,
    fontSize: 13.5,
    fontWeight: '700',
  },

  // Property card
  card: {
    backgroundColor: T.surface,
    borderRadius: T.radius,
    borderWidth: 1,
    borderColor: T.border,
    overflow: 'hidden',
    shadowColor: '#10284014',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardImgWrap: {
    height: 178,
    position: 'relative',
  },
  cardImg: {
    width: '100%',
    height: '100%',
  },
  cardBadgeRow: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    gap: 6,
  },
  modeBadge: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 7,
  },
  modeBadgeText: {
    color: '#fff',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  cardHeart: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  heartBtn: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  verifiedPill: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 999,
    backgroundColor: '#0E9466',
  },
  verifiedText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  cardBody: {
    padding: 16,
  },
  cardPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardPrice: {
    fontSize: 19,
    fontWeight: '800',
    color: T.primary,
    letterSpacing: -0.3,
  },
  cardPriceSuffix: {
    fontSize: 12,
    fontWeight: '700',
    color: T.muted,
  },
  cardType: {
    fontSize: 11,
    fontWeight: '700',
    color: T.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardTitle: {
    marginTop: 7,
    marginBottom: 6,
    fontSize: 16.5,
    fontWeight: '700',
    color: T.text,
    letterSpacing: -0.2,
    lineHeight: 22,
  },
  cardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 12,
  },
  cardLocationText: {
    color: T.sub,
    fontSize: 13,
    flex: 1,
  },
  cardDivider: {
    height: 1,
    backgroundColor: T.line,
    marginBottom: 12,
  },
  cardSpecs: {
    flexDirection: 'row',
    gap: 14,
    flexWrap: 'wrap',
  },
  specText: {
    color: T.sub,
    fontSize: 12,
    fontWeight: '600',
  },

  // Trust
  trustWrap: {
    gap: 10,
  },
  trustCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    backgroundColor: T.surface,
    borderRadius: T.radius,
    borderWidth: 1,
    borderColor: T.border,
    padding: 14,
    shadowColor: '#10284010',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  trustIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: T.verifySoft,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  trustTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: T.text,
    marginBottom: 2,
  },
  trustDesc: {
    fontSize: 12.5,
    color: T.sub,
    lineHeight: 18,
  },

  // Testimonials
  testimonialCard: {
    width: 280,
    backgroundColor: T.surface,
    borderRadius: T.radius,
    borderWidth: 1,
    borderColor: T.border,
    padding: 18,
    shadowColor: '#10284010',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  starRow: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 11,
  },
  testimonialQuote: {
    fontSize: 13.5,
    lineHeight: 21,
    color: T.text,
    marginBottom: 16,
  },
  testimonialAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 999,
    backgroundColor: T.actionSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '800',
    color: T.action,
  },
  authorName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: T.text,
  },
  authorRole: {
    fontSize: 11.5,
    color: T.muted,
  },

  // CTA
  ctaBox: {
    borderRadius: T.radiusLg,
    padding: 22,
    alignItems: 'center',
    shadowColor: '#0C2F5C',
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 8,
  },
  ctaTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  ctaDesc: {
    fontSize: 13,
    lineHeight: 19,
    color: 'rgba(255,255,255,0.78)',
    textAlign: 'center',
    marginBottom: 16,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#fff',
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 12,
  },
  ctaBtnText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: T.primary,
  },

  // Loading placeholder
  loadingCard: {
    height: 280,
    backgroundColor: T.surfaceAlt,
    borderRadius: T.radius,
    borderWidth: 1,
    borderColor: T.border,
  },
});
