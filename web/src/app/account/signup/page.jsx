import { useState } from "react";
import { useNavigate } from "react-router";
import useAuth from "@/utils/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function MainComponent() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("seeker");

  const { signUpWithCredentials } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password || !name) {
      setError("Harap isi semua field");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      setLoading(false);
      return;
    }

    try {
      localStorage.setItem("pendingRole", role);
      localStorage.setItem("pendingName", name);

      await signUpWithCredentials({
        email,
        password,
        name,
        callbackUrl: "/onboarding",
        redirect: true,
      });
    } catch (err) {
      setError("Gagal mendaftar. Silakan coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <div className="flex items-center justify-center bg-gray-50 p-4 py-20 min-h-[70vh]">
        <form
          noValidate
          onSubmit={onSubmit}
          className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-gray-100"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Buat Akun</h1>
            <p className="text-gray-500">
              Mulai temukan properti impianmu di Indonesia
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Nama Lengkap
              </label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Budi Santoso"
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@contoh.com"
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Saya mendaftar sebagai:
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setRole("seeker")}
                  className={`flex-1 py-2 rounded-lg border transition-all ${role === "seeker" ? "bg-blue-50 border-blue-500 text-blue-600" : "bg-white border-gray-200 text-gray-600"}`}
                >
                  Pencari
                </button>
                <button
                  type="button"
                  onClick={() => setRole("owner")}
                  className={`flex-1 py-2 rounded-lg border transition-all ${role === "owner" ? "bg-blue-50 border-blue-500 text-blue-600" : "bg-white border-gray-200 text-gray-600"}`}
                >
                  Pemilik
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500 border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Daftar Sekarang"}
            </button>

            <p className="text-center text-sm text-gray-600">
              Sudah punya akun?{" "}
              <button
                type="button"
                onClick={() => navigate("/account/signin")}
                className="text-blue-600 font-semibold hover:underline"
              >
                Masuk
              </button>
            </p>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default MainComponent;
