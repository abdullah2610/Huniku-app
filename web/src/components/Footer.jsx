import { useNavigate } from "react-router";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-950 text-white py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-16">
        <div className="sm:col-span-2 md:col-span-2">
          <button
            onClick={() => navigate("/")}
            className="text-3xl font-black mb-6 tracking-tighter text-left"
          >
            Huni<span className="text-blue-500">Ku</span>
          </button>
          <p className="text-gray-400 text-base md:text-lg mb-8 max-w-md leading-relaxed">
            Platform ekosistem properti terbesar di Indonesia yang
            menghubungkan pemilik dan pencari hunian dengan transparansi
            penuh.
          </p>
        </div>
        <div>
          <h4 className="text-lg font-bold mb-6">Navigasi</h4>
          <ul className="space-y-3 text-gray-400 text-base">
            <li>
              <button
                onClick={() => navigate("/search")}
                className="hover:text-blue-500 transition-colors"
              >
                Cari Properti
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/search?mode=rent_monthly")}
                className="hover:text-blue-500 transition-colors"
              >
                Sewa Bulanan
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/search?mode=sale")}
                className="hover:text-blue-500 transition-colors"
              >
                Jual Beli
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/onboarding")}
                className="hover:text-blue-500 transition-colors"
              >
                Pasang Iklan
              </button>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-bold mb-6">Perusahaan</h4>
          <ul className="space-y-3 text-gray-400 text-base">
            <li>
              <button
                onClick={() => navigate("/about")}
                className="hover:text-blue-500 transition-colors"
              >
                Tentang Kami
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/help")}
                className="hover:text-blue-500 transition-colors"
              >
                Pusat Bantuan
              </button>
            </li>
            <li>
              <a
                href="mailto:halo@huniku.id"
                className="hover:text-blue-500 transition-colors"
              >
                Kontak
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-white/5 mt-16 pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm font-medium">
        <p>&copy; {new Date().getFullYear()} HuniKu. All rights reserved.</p>
        <div className="flex gap-6">
          <button
            onClick={() => navigate("/terms")}
            className="hover:text-white transition-colors"
          >
            Syarat & Ketentuan
          </button>
          <button
            onClick={() => navigate("/privacy")}
            className="hover:text-white transition-colors"
          >
            Kebijakan Privasi
          </button>
        </div>
      </div>
    </footer>
  );
}
