"use client";

import { useRouter } from "next/navigation";
import { useDashboard } from "@/hooks/useDashboard";
import { Header } from "@/components/molecules/Header";
import { HelpSection } from "@/components/molecules/HelpSection";
import { RecommendationSection } from "@/components/organisms/RecommendationSection";
import { KategoriSection } from "@/components/organisms/KategoriSection";
import { useEffect } from "react";
import { PartyPopper, Sparkles, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  const {
    user,
    isLoggedIn,
    logout,
    helpNumber,
    recommendedPackages,
    categories,
  } = useDashboard();

  // ✅ Redirect guard
  useEffect(() => {
    if (!isLoggedIn || !user) return;

    if (user.role === "ADMIN") router.replace("/admin");
    else if (user.role === "PETUGAS") router.replace("/petugas");
    else if (user.role === "USER") router.replace("/dashboard");
  }, [isLoggedIn, user, router]);

  // ✅ Prevent flicker & prevent back showing index
  if (isLoggedIn && user) {
    return null;
  }

  // ✅ Auth button handler
  const handleAuthAction = () => {
    if (isLoggedIn) {
      logout();

      router.replace("/");
    } else {
      router.push("/login");
    }
  };

  const handlePackageSelect = (id: number) => {
    if (!isLoggedIn) {
      router.push("/login");

      return;
    }

    console.log("Package selected:", id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      {/* Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-orange-200/20 to-pink-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl" />
      </div>

      <Header
        userName={user?.username || "Tamu"}
        onLogout={handleAuthAction}
        isLoggedIn={isLoggedIn}
      />

      <main className="container mx-auto px-4 py-8 relative z-10">
        {!isLoggedIn && (
          <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-pink-500 to-orange-500 text-white p-8 sm:p-12 rounded-2xl mb-8 text-center shadow-xl">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative">
              <div className="flex justify-center mb-4">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <PartyPopper className="w-4 h-4 animate-bounce" />
                  <span className="text-sm font-semibold">
                    Event Rental Specialist
                  </span>
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                Sewa Alat Event Jadi Mudah
              </h1>
              <p className="text-base sm:text-lg text-white/90 mb-6 max-w-2xl mx-auto">
                Silakan login untuk mulai melakukan peminjaman alat event
                profesional
              </p>
              <button
                onClick={() => router.push("/login")}
                className="group bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:shadow-xl transition-all transform hover:scale-105 inline-flex items-center gap-2"
              >
                Mulai Sekarang
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        <div className="mb-8">
          <HelpSection phoneNumber={helpNumber} />
        </div>

        <RecommendationSection packages={recommendedPackages} />

        <KategoriSection items={categories} />
      </main>

      <footer className="relative z-10 mt-12 py-6 border-t border-gray-200 bg-white/50 backdrop-blur-sm text-center">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>Event Rental System</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <span>© 2026 Sistem Peminjaman Barang. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
