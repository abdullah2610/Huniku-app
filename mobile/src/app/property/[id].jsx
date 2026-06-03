import { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Share2,
  Heart,
  Shield,
  MapPin,
  Eye,
  CheckCircle2,
  FileText,
  Lock,
  Phone,
  MessageSquare,
  Bed,
  Bath,
  Home,
  Ruler,
  Star,
} from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, router } from 'expo-router';
import {
  T,
  fmtPrice,
  catLabel,
  modeBadgeLabel,
  modeSuffix,
  isSale,
} from '../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GALLERY_HEIGHT = 300;

function Gallery({ images }) {
  const [idx, setIdx] = useState(0);
  const scrollRef = useRef(null);

  const onScroll = (e) => {
    const newIdx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setIdx(newIdx);
  };

  const fallback = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1200';
  const imgs = images?.length ? images : [fallback];

  return (
    <View style={s.galleryWrap}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={s.galleryScroll}
      >
        {imgs.map((src, i) => (
          <Image
            key={i}
            source={{ uri: src }}
            style={s.galleryImg}
            contentFit="cover"
          />
        ))}
      </ScrollView>

      {/* Gradient overlay */}
      <LinearGradient
        colors={['rgba(10,20,40,0.42)', 'transparent', 'transparent', 'rgba(10,20,40,0.28)']}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />

      {/* Photo counter */}
      <View style={s.counter}>
        <Text style={s.counterText}>{idx + 1} / {imgs.length}</Text>
      </View>

      {/* Dots */}
      <View style={s.dots}>
        {imgs.map((_, i) => (
          <View
            key={i}
            style={[s.dot, i === idx && s.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

function SpecTile({ icon: Icon, value, label }) {
  return (
    <View style={s.specTile}>
      <Icon size={20} color={T.action} strokeWidth={1.9} />
      <Text style={s.specTileValue}>{value}</Text>
      <Text style={s.specTileLabel}>{label}</Text>
    </View>
  );
}

export default function PropertyDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const [saved, setSaved] = useState(false);

  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const res = await fetch(`/api/properties/${id}`);
      if (!res.ok) throw new Error('Tidak ditemukan');
      return res.json();
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <View style={[s.root, s.center, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={T.action} />
      </View>
    );
  }

  if (error || !property) {
    return (
      <View style={[s.root, s.center, { paddingTop: insets.top }]}>
        <Text style={s.errText}>Properti tidak ditemukan</Text>
        <TouchableOpacity style={s.errBack} onPress={() => router.back()}>
          <Text style={s.errBackText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const sale = isSale(property.listing_mode);
  const suffix = modeSuffix(property.listing_mode);

  const specs = [
    property.bedrooms > 0 && { icon: Bed, value: property.bedrooms, label: 'K. Tidur' },
    property.bathrooms > 0 && { icon: Bath, value: property.bathrooms, label: 'K. Mandi' },
    property.building_size > 0 && { icon: Home, value: `${property.building_size}`, label: 'L. Bangun (m²)' },
    property.land_size > 0 && { icon: Ruler, value: `${property.land_size}`, label: 'L. Tanah (m²)' },
  ].filter(Boolean);

  const handleCall = () => {
    const phone = property.agent_phone || property.contact_phone;
    if (phone) Linking.openURL(`tel:${phone}`);
  };

  return (
    <View style={[s.root, { paddingBottom: insets.bottom }]}>
      {/* Gallery */}
      <View style={{ position: 'relative' }}>
        <Gallery images={property.images} />

        {/* Top bar: back + actions */}
        <View style={[s.topBar, { top: insets.top + 12 }]}>
          <TouchableOpacity style={s.topBtn} onPress={() => router.back()} activeOpacity={0.85}>
            <ChevronLeft size={21} color={T.text} strokeWidth={2.3} />
          </TouchableOpacity>
          <View style={s.topActions}>
            <TouchableOpacity style={s.topBtn} activeOpacity={0.85}>
              <Share2 size={18} color={T.text} strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity
              style={s.topBtn}
              onPress={() => setSaved(!saved)}
              activeOpacity={0.85}
            >
              <Heart
                size={18}
                color={saved ? '#E11D48' : T.text}
                fill={saved ? '#E11D48' : 'none'}
                strokeWidth={2}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Scrollable content */}
      <ScrollView style={s.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
        {/* Slide-up sheet */}
        <View style={s.sheet}>
          {/* Mode + verified + views */}
          <View style={s.sheetTopRow}>
            <View style={[s.modeBadge, { backgroundColor: sale ? T.primary : '#0E9466' }]}>
              <Text style={s.modeBadgeText}>{modeBadgeLabel(property.listing_mode)}</Text>
            </View>
            <View style={s.verifiedPill}>
              <Shield size={12} color={T.verify} strokeWidth={2.2} />
              <Text style={s.verifiedText}>Terverifikasi</Text>
            </View>
            {property.views > 0 && (
              <View style={s.views}>
                <Eye size={14} color={T.muted} strokeWidth={1.8} />
                <Text style={s.viewsText}>{Number(property.views).toLocaleString('id-ID')}</Text>
              </View>
            )}
          </View>

          {/* Title */}
          <Text style={s.title}>{property.title}</Text>

          {/* Location */}
          <View style={s.location}>
            <MapPin size={15} color={T.action} strokeWidth={2} />
            <Text style={s.locationText}>{property.address}</Text>
          </View>

          {/* Price */}
          <View style={s.priceRow}>
            <Text style={s.price}>
              {fmtPrice(property.price)}
              {suffix ? <Text style={s.priceSuffix}>{suffix}</Text> : null}
            </Text>
            <Text style={s.priceType}>{catLabel(property.property_type)}</Text>
          </View>

          {/* Spec tiles */}
          {specs.length > 0 && (
            <View style={s.specRow}>
              {specs.map((spec, i) => (
                <SpecTile key={i} {...spec} />
              ))}
            </View>
          )}

          {/* Legality strip */}
          {property.certificate && (
            <View style={s.legalStrip}>
              <FileText size={22} color={T.verify} strokeWidth={2} />
              <View style={{ flex: 1 }}>
                <Text style={s.legalTitle}>Legalitas {property.certificate} terverifikasi</Text>
                <Text style={s.legalSub}>Dokumen diperiksa tim legal Huniku</Text>
              </View>
              <CheckCircle2 size={20} color={T.verify} strokeWidth={2.6} />
            </View>
          )}

          {/* Description */}
          {property.description && (
            <View style={s.descBlock}>
              <Text style={s.descHead}>Deskripsi</Text>
              <Text style={s.descText}>{property.description}</Text>
            </View>
          )}

          {/* Tags */}
          {property.tags?.length > 0 && (
            <View style={s.tagRow}>
              {property.tags.map((tag, i) => (
                <View key={i} style={s.tag}>
                  <Text style={s.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Agent card */}
          {(property.agent_name || property.contact_name) && (
            <View style={s.agentCard}>
              <View style={s.agentAvatar}>
                <Text style={s.agentAvatarText}>
                  {(property.agent_name || property.contact_name)
                    .split(' ')
                    .map((w) => w[0])
                    .join('')
                    .slice(0, 2)}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={s.agentNameRow}>
                  <Text style={s.agentName}>{property.agent_name || property.contact_name}</Text>
                  <Shield size={15} color={T.verify} strokeWidth={2.4} />
                </View>
                <Text style={s.agentOrg}>Huniku Verified Agent</Text>
                <View style={s.agentMeta}>
                  <Star size={13} color={T.action} fill={T.action} strokeWidth={0} />
                  <Text style={s.agentRating}>4.9</Text>
                  <Text style={s.agentDeals}>· Agen terverifikasi</Text>
                </View>
              </View>
            </View>
          )}

          {/* Safe transaction banner */}
          <View style={s.safeBanner}>
            <Lock size={22} color={T.action} strokeWidth={2} style={{ marginTop: 1, flexShrink: 0 }} />
            <View>
              <Text style={s.safeTitle}>Dilindungi Transaksi Aman Huniku</Text>
              <Text style={s.safeDesc}>
                Dana Anda ditahan di rekening bersama dan baru diteruskan setelah serah terima selesai.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View style={[s.cta, { paddingBottom: insets.bottom > 0 ? insets.bottom : 14 }]}>
        <TouchableOpacity style={s.ctaChat}>
          <MessageSquare size={21} color={T.action} strokeWidth={2} />
        </TouchableOpacity>
        <TouchableOpacity style={s.ctaCall} onPress={handleCall} activeOpacity={0.87}>
          <LinearGradient colors={T.primaryGradColors} style={s.ctaCallGrad}>
            <Phone size={19} color="#fff" strokeWidth={2.1} />
            <Text style={s.ctaCallText}>Hubungi Agen</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: T.bg,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errText: {
    fontSize: 16,
    color: T.muted,
    marginBottom: 16,
  },
  errBack: {
    backgroundColor: T.action,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  errBackText: {
    color: '#fff',
    fontWeight: '700',
  },

  // Gallery
  galleryWrap: {
    height: GALLERY_HEIGHT,
    position: 'relative',
  },
  galleryScroll: {
    height: GALLERY_HEIGHT,
  },
  galleryImg: {
    width: SCREEN_WIDTH,
    height: GALLERY_HEIGHT,
  },
  counter: {
    position: 'absolute',
    bottom: 14,
    right: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(10,20,40,0.6)',
  },
  counterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  dots: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  dotActive: {
    width: 18,
    backgroundColor: '#fff',
  },

  // Top bar
  topBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topActions: {
    flexDirection: 'row',
    gap: 8,
  },
  topBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },

  // Content sheet
  content: {
    flex: 1,
  },
  sheet: {
    backgroundColor: T.surface,
    borderTopLeftRadius: T.radiusLg,
    borderTopRightRadius: T.radiusLg,
    marginTop: -18,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },

  // Sheet top row
  sheetTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
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
    letterSpacing: 0.6,
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 999,
    backgroundColor: T.verifySoft,
  },
  verifiedText: {
    color: T.verify,
    fontSize: 11,
    fontWeight: '700',
  },
  views: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewsText: {
    fontSize: 12,
    fontWeight: '600',
    color: T.muted,
  },

  // Title, location, price
  title: {
    fontSize: 23,
    fontWeight: '800',
    color: T.text,
    letterSpacing: -0.4,
    lineHeight: 30,
    marginBottom: 8,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  locationText: {
    flex: 1,
    fontSize: 13.5,
    color: T.sub,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 18,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: T.line,
  },
  price: {
    fontSize: 28,
    fontWeight: '800',
    color: T.primary,
    letterSpacing: -0.5,
  },
  priceSuffix: {
    fontSize: 15,
    fontWeight: '700',
    color: T.muted,
  },
  priceType: {
    fontSize: 12,
    fontWeight: '700',
    color: T.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  // Spec tiles
  specRow: {
    flexDirection: 'row',
    gap: 9,
    marginBottom: 18,
  },
  specTile: {
    flex: 1,
    backgroundColor: T.surfaceAlt,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: T.radiusSm,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 4,
  },
  specTileValue: {
    fontSize: 15,
    fontWeight: '800',
    color: T.text,
  },
  specTileLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: T.muted,
    textAlign: 'center',
  },

  // Legality strip
  legalStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: T.verifySoft,
    borderWidth: 1,
    borderColor: `${T.verify}33`,
    borderRadius: T.radius,
    padding: 13,
    marginBottom: 20,
  },
  legalTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: T.text,
  },
  legalSub: {
    fontSize: 11.5,
    color: T.sub,
  },

  // Description
  descBlock: {
    marginBottom: 14,
  },
  descHead: {
    fontSize: 16,
    fontWeight: '800',
    color: T.text,
    marginBottom: 8,
  },
  descText: {
    fontSize: 13.5,
    lineHeight: 22,
    color: T.sub,
  },

  // Tags
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 22,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: T.surfaceAlt,
    borderWidth: 1,
    borderColor: T.border,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
    color: T.sub,
  },

  // Agent card
  agentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: T.surfaceAlt,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: T.radius,
    padding: 16,
    marginBottom: 18,
  },
  agentAvatar: {
    width: 50,
    height: 50,
    borderRadius: 999,
    backgroundColor: T.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  agentAvatarText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
  },
  agentNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  agentName: {
    fontSize: 15,
    fontWeight: '800',
    color: T.text,
  },
  agentOrg: {
    fontSize: 12,
    color: T.muted,
    marginTop: 1,
  },
  agentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 5,
  },
  agentRating: {
    fontSize: 12,
    fontWeight: '700',
    color: T.text,
  },
  agentDeals: {
    fontSize: 12,
    color: T.muted,
  },

  // Safe banner
  safeBanner: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: T.actionSoft,
    borderRadius: T.radius,
    padding: 15,
    marginBottom: 16,
  },
  safeTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: T.text,
    marginBottom: 2,
  },
  safeDesc: {
    fontSize: 12,
    lineHeight: 18,
    color: T.sub,
  },

  // Sticky CTA
  cta: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: T.surface,
    borderTopWidth: 1,
    borderTopColor: T.border,
    paddingHorizontal: 16,
    paddingTop: 12,
    shadowColor: '#10284014',
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaChat: {
    width: 52,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: T.action,
    backgroundColor: T.surface,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  ctaCall: {
    flex: 1,
    borderRadius: 13,
    overflow: 'hidden',
  },
  ctaCallGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    shadowColor: '#1C61D8',
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 4,
  },
  ctaCallText: {
    color: '#fff',
    fontSize: 15.5,
    fontWeight: '800',
  },
});
