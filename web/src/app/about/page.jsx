import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <section className="py-24 px-4 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
          Tentang <span className="text-blue-600">HuniKu</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed mb-8">
          HuniKu adalah platform ekosistem properti terbesar di Indonesia yang
          menghubungkan pemilik properti dengan pencari hunian. Misi kami adalah
          menciptakan pengalaman jual-beli dan sewa properti yang transparan,
          aman, dan efisien.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {[
            { value: "10.000+", label: "Properti Terdaftar" },
            { value: "500+", label: "Kota Tercakup" },
            { value: "50.000+", label: "Pengguna Aktif" },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
              <div className="text-4xl font-black text-blue-600 mb-2">{stat.value}</div>
              <div className="text-gray-500 font-bold">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
