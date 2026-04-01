"use client";

import { ReactNode, useEffect } from "react";
import { Topbar } from "@/components/organisms/admin/Topbar";
import { Sidebar } from "@/components/organisms/admin/Sidebar";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, initialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;

    // belum login
    if (!user) {
      router.replace("/login");
      return;
    }

    // bukan admin → redirect sesuai role
    if (user.role !== "ADMIN") {
      if (user.role === "PETUGAS") router.replace("/petugas");
      else router.replace("/dashboard");
    }
  }, [user, initialized, router]);

  // loading
  if (!initialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  // block render jika bukan admin
  if (!user || user.role !== "ADMIN") return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 text-black">{children}</main>
      </div>
    </div>
  );
}
