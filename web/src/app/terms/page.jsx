import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, FileText, Lock, Eye } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <section className="py-24 px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-gray-900 mb-4">Syarat & Ketentuan</h1>
        <p className="text-gray-400 mb-12">Terakhir diperbarui: 1 Juni 2026</p>
        <div className="space-y-8 text-gray-600 leading-relaxed">
          {[
            { icon: FileText, title: "Penggunaan Layanan", text: "Dengan menggunakan HuniKu, Anda menyetujui syarat dan ketentuan ini. Layanan kami tersedia untuk pengguna berusia minimal 18 tahun." },
            { icon: Shield, title: "Akun Pengguna", text: "Anda bertanggung jawab menjaga kerahasiaan akun dan password. HuniKu berhak menonaktifkan akun yang melanggar ketentuan." },
            { icon: Lock, title: "Konten & Iklan", text: "Pengguna bertanggung jawab atas konten yang diunggah. Iklan properti harus akurat dan tidak menyesatkan." },
            { icon: Eye, title: "Privasi", text: "Data pribadi Anda dilindungi sesuai Kebijakan Privasi kami. Kami tidak menjual data Anda ke pihak ketiga." },
          ].map((section) => (
            <div key={section.title} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                <section.icon size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">{section.title}</h3>
                <p>{section.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
