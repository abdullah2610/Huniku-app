import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <section className="py-24 px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-gray-900 mb-4">Kebijakan Privasi</h1>
        <p className="text-gray-400 mb-12">Terakhir diperbarui: 1 Juni 2026</p>
        <div className="prose max-w-none text-gray-600 space-y-6">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-3">Informasi yang Kami Kumpulkan</h3>
            <p>Kami mengumpulkan informasi yang Anda berikan saat mendaftar (nama, email), data properti yang Anda unggah, serta data penggunaan platform untuk meningkatkan layanan.</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-3">Penggunaan Data</h3>
            <p>Data Anda digunakan untuk mengoperasikan platform, menampilkan properti yang relevan, memproses transaksi, dan berkomunikasi dengan Anda. Kami tidak menjual data pribadi Anda.</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-3">Keamanan Data</h3>
            <p>Kami menerapkan langkah keamanan teknis dan organisasional untuk melindungi data Anda, termasuk enkripsi SSL, akses terbatas, dan audit berkala.</p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
