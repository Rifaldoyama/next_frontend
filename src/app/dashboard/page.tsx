"use client";

import { useRouter } from "next/navigation";
import { useDashboard } from "@/hooks/useDashboard";
import { Header } from "@/components/molecules/Header";
import { HelpSection } from "@/components/molecules/HelpSection";
import { RecommendationSection } from "@/components/organisms/RecommendationSection";
import { KategoriSection } from "@/components/organisms/KategoriSection";
import { PartyPopper, Music, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  const { user, logout, helpNumber, recommendedPackages, categories } =
    useDashboard();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const handlePackageSelect = (id: number) => {
    console.log(`Package ${id} selected`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      {/* Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-orange-200/20 to-pink-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-yellow-200/10 to-orange-200/10 rounded-full blur-3xl" />
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        {/* Welcome Banner */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <PartyPopper className="w-6 h-6 animate-bounce" />
                  <span className="text-sm font-semibold uppercase tracking-wider">
                    Event Rental
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                  Selamat Datang, {user?.username || "Event Organizer"}! 🎉
                </h1>
                <p className="text-orange-100 text-sm sm:text-base">
                  Siapkan peralatan terbaik untuk event Anda
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm">Ready to Rent</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mb-8">
          <HelpSection phoneNumber={helpNumber} />
        </div>

        {/* Recommendation Section */}
        <div className="mb-12">
          <RecommendationSection packages={recommendedPackages} />
        </div>

        {/* Kategori Section */}
        <div className="mb-12">
          <KategoriSection items={categories} />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-12 py-6 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-orange-500" />
              <span>Event Rental System</span>
            </div>
            <span>•</span>
            <span>©2026 Sistem Rental Alat Event. All rights reserved.</span>
            <span>•</span>
            <span className="text-orange-500">v1.0.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
