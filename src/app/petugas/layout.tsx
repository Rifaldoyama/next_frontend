"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HamburgerMenu } from "@/components/organisms/petugas/HamburgerMenu";
import { useAuthStore } from "@/store/authStore";

interface Props {
  children: ReactNode;
}

export default function MobilePetugasLayout({ children }: Props) {
  const router = useRouter();
  const { logout, token, user } = useAuthStore();

  useEffect(() => {
    if (!token || !user || user.role !== "PETUGAS") {
      router.replace("/login");
    }
  }, [token, user, router]);

  const handleLogout = () => {
    logout();
    router.replace("/login"); 
  };

  const menuItems = [
    { label: "Dashboard", href: "/petugas/dashboard" },
    { label: "Peminjaman", href: "/petugas/peminjaman" },
    { label: "Pengembalian", href: "/petugas/pengembalian" },
    { label: "Scan Barang", href: "/petugas/scan" },
    { label: "Logout", action: handleLogout },
  ];

  if (!token || !user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-black">
      <header className="h-14 bg-white shadow flex items-center px-4 justify-between">
        <HamburgerMenu items={menuItems} />
        <h1 className="font-semibold">Petugas</h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
