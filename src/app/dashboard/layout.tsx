"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { CompleteProfileGate } from "@/components/organisms/CompleteProfileGate";
import { DashboardAlert } from "@/components/molecules/DashboardAlert";
import { Header } from "@/components/molecules/Header";
import { useSewaDraft } from "@/hooks/useSewaDraft";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, initialized, logout } = useAuthStore();

  // State utama untuk mengontrol modal form
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    useSewaDraft.getState();
  }, [user?.id]);

  useEffect(() => {
    if (!initialized) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role === "ADMIN") {
      router.replace("/admin");
      return;
    }
    if (user.role === "PETUGAS") {
      router.replace("/petugas");
      return;
    }
  }, [user, initialized, router]);

  if (!initialized || !user || user.role !== "USER") {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  const verificationStatus = user.detail?.verification_status;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        {/* ✅ Tombol di Alert sekarang memicu setIsModalOpen(true) */}
        <DashboardAlert
          status={verificationStatus}
          onOpenModal={() => setIsModalOpen(true)}
        />

        <main className="flex-1">
          <Header userName={user.username} onLogout={logout} isLoggedIn />
          {children}
        </main>
      </div>

      {/* ✅ Kirim state ke Gate agar dia tahu kapan harus muncul */}
      <CompleteProfileGate
        externalOpen={isModalOpen}
        setExternalOpen={setIsModalOpen}
      />
    </div>
  );
}
