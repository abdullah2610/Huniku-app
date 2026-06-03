// Daylight theme — navy premium, structured, trusted
export const T = {
  bg: '#EEF2F8',
  surface: '#FFFFFF',
  surfaceAlt: '#F4F7FC',
  primary: '#0F3D73',
  primaryGradColors: ['#13447E', '#0C2F5C'],
  action: '#1C61D8',
  actionSoft: '#E7EFFC',
  verify: '#0E9466',
  verifySoft: '#E2F4EC',
  text: '#0E1F38',
  sub: '#46586F',
  muted: '#7A8AA0',
  border: '#E2E9F2',
  line: '#EDF1F7',
  radius: 16,
  radiusSm: 12,
  radiusLg: 22,
};

export const fmtPrice = (n) => {
  if (!n) return 'Harga —';
  const num = Number(n);
  if (num >= 1_000_000_000) {
    const val = num / 1_000_000_000;
    return 'Rp ' + (Number.isInteger(val) ? val : val.toFixed(1)).toString().replace('.', ',') + ' M';
  }
  if (num >= 1_000_000) return 'Rp ' + Math.round(num / 1_000_000) + ' jt';
  return 'Rp ' + num.toLocaleString('id-ID');
};

const TYPE_LABELS = {
  house: 'Rumah',
  apartment: 'Apartemen',
  boarding_house: 'Kos',
  shophouse: 'Ruko',
  land: 'Tanah',
  warehouse: 'Gudang',
  commercial: 'Komersial',
};

export const catLabel = (type) => TYPE_LABELS[type] || type || '';

export const isSale = (mode) => mode === 'sale';

export const modeBadgeLabel = (mode) => {
  if (mode === 'sale') return 'DIJUAL';
  return 'DISEWA';
};

export const modeSuffix = (mode) => {
  if (mode === 'rent_monthly') return '/bln';
  if (mode === 'rent_yearly') return '/thn';
  return '';
};

export const HERO_IMAGE = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200';

export const STATS = [
  { value: '32.000+', label: 'Properti aktif' },
  { value: '120+', label: 'Kota di Indonesia' },
  { value: '98%', label: 'Transaksi aman' },
];

export const TRUST = [
  { icon: 'shield', title: 'Agen Terverifikasi', desc: 'Identitas & lisensi setiap agen kami validasi.' },
  { icon: 'doc', title: 'Legalitas Dicek', desc: 'Sertifikat & dokumen diperiksa tim legal.' },
  { icon: 'lock', title: 'Transaksi Aman', desc: 'Dana ditahan hingga serah terima selesai.' },
];

export const TESTIMONIALS = [
  {
    name: 'Anita Rahmawati',
    role: 'Beli rumah di Bintaro',
    quote: 'Semua dokumen dicek tim Huniku sebelum transaksi. Prosesnya transparan dan saya merasa aman dari awal sampai serah terima kunci.',
    avatar: 'AR',
  },
  {
    name: 'Budi Santoso',
    role: 'Sewa apartemen di Sudirman',
    quote: 'Agennya terverifikasi dan responsif. Tidak ada biaya tersembunyi, kontrak jelas. Jauh lebih meyakinkan dari platform lain.',
    avatar: 'BS',
  },
  {
    name: 'Maria Tanudjaja',
    role: 'Jual ruko di BSD',
    quote: 'Iklan saya cepat dapat pembeli serius. Tim Huniku bantu validasi calon pembeli. Sangat profesional.',
    avatar: 'MT',
  },
];

export const CATEGORIES = [
  { id: 'house', label: 'Rumah' },
  { id: 'apartment', label: 'Apartemen' },
  { id: 'boarding_house', label: 'Kos' },
  { id: 'shophouse', label: 'Ruko' },
  { id: 'land', label: 'Tanah' },
  { id: 'warehouse', label: 'Gudang' },
];
