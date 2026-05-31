import { useEffect, useState } from "react";
import useUser from "@/utils/useUser";

export default function OnboardingPage() {
  const { data: user, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const completeOnboarding = async () => {
      if (userLoading || !user) return;

      const role = localStorage.getItem("pendingRole") || "seeker";
      const name = localStorage.getItem("pendingName") || user.name;

      try {
        const res = await fetch("/api/onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role, name }),
        });

        if (res.ok) {
          localStorage.removeItem("pendingRole");
          localStorage.removeItem("pendingName");
          window.location.href = role === "owner" ? "/dashboard/owner" : "/";
        }
      } catch (err) {
        console.error("Onboarding failed", err);
      } finally {
        setLoading(false);
      }
    };

    completeOnboarding();
  }, [user, userLoading]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-bounce mb-4 text-blue-600">
          <svg
            className="w-12 h-12 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Menyiapkan Akun Anda
        </h2>
        <p className="text-gray-500">Mohon tunggu sebentar...</p>
      </div>
    </div>
  );
}
