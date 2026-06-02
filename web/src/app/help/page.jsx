import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <section className="py-24 px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 text-center">
          Pusat Bantuan
        </h1>
        <p className="text-lg text-gray-500 text-center max-w-2xl mx-auto mb-16">
          Temukan jawaban untuk pertanyaan Anda seputar HuniKu
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { q: "Bagaimana cara memasang iklan?", a: "Daftar sebagai pemilik properti, lalu buka dashboard dan klik 'Tambah Iklan Baru'. Ikuti langkah-langkahnya dan iklan Anda akan tayang setelah kami verifikasi." },
            { q: "Berapa biaya berlangganan?", a: "HuniKu menawarkan paket Gratis, Pro, dan Business. Lihat halaman Harga untuk detail lengkap fitur setiap paket." },
            { q: "Bagaimana cara mencari properti?", a: "Gunakan fitur pencarian di beranda atau halaman Cari. Filter berdasarkan lokasi, tipe properti, dan rentang harga." },
            { q: "Apakah data saya aman?", a: "Ya. Kami menggunakan enkripsi SSL dan tidak membagikan data pribadi Anda kepada pihak ketiga tanpa izin." },
          ].map((faq) => (
            <div key={faq.q} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-16">
          <p className="text-gray-500 mb-4">Tidak menemukan jawaban?</p>
          <a
            href="mailto:halo@huniku.id"
            className="inline-flex bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition shadow-sm"
          >
            Hubungi Kami
          </a>
        </div>
      </section>
      <Footer />
    </div>
  );
}
