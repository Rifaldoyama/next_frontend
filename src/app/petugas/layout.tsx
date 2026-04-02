"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HamburgerMenu } from "@/components/organisms/petugas/HamburgerMenu";
import { useAuthStore } from "@/store/authStore";
import { Package } from "lucide-react";

interface Props {
  children: ReactNode;
}

export default function MobilePetugasLayout({ children }: Props) {
  const router = useRouter();
  const { logout, token, user, initialized } = useAuthStore();

  useEffect(() => {
    if (initialized) {
      if (!token || !user || user.role !== "PETUGAS") {
        router.replace("/login");
      }
    }
  }, [token, user, router, initialized]);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const menuItems = [
    { label: "Dashboard", href: "/petugas", icon: "Home" },
    { label: "History", href: "/petugas/peminjaman", icon: "History" },
    { label: "Logout", action: handleLogout, icon: "LogOut" },
  ];

  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!token || !user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <HamburgerMenu items={menuItems} />

          {/* Logo dan Nama Aplikasi */}
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 rounded-lg p-1.5">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-800 text-lg">Rental Alat</h1>
              <p className="text-xs text-gray-500 leading-tight">
                Petugas Lapangan
              </p>
            </div>
          </div>

          {/* Avatar/Profile Indicator */}
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 text-sm font-medium">
              {user?.detail?.nama_lengkap?.charAt(0) ||
                user?.username?.charAt(0) ||
                "P"}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
