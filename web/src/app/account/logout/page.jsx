import useAuth from "@/utils/useAuth";
import { useEffect } from "react";

function MainComponent() {
  const { signOut } = useAuth();

  useEffect(() => {
    signOut({
      callbackUrl: "/",
      redirect: true,
    });
  }, [signOut]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Sedang keluar...</p>
      </div>
    </div>
  );
}

export default MainComponent;
