"use client";

import { Header } from "@/components/molecules/Header";
import { ProfileInfo } from "@/components/organisms/ProfileInfo";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function ProfilePage() {
  const { user, initialized, logout, setAuth } = useAuthStore();
  const router = useRouter();
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<any>(null);

  // redirect jika tidak ada user
  useEffect(() => {
    if (!initialized) return;
    if (!user) router.replace("/login");
  }, [initialized, user]);

  // fetch detail user
  useEffect(() => {
    if (!user?.id) return;

    setLoadingDetail(true);
    apiFetch(`/users/me`)
      .then((res) => {
        setDetail(res.user.detail || null);
        console.log("Fetched user detail:", res.user.detail);

        // update store user dengan detail
        setAuth(
          { ...res.user, detail: res.user.detail },
          localStorage.getItem("token")!,
        );
      })
      .catch((err) => {
        setError(err.message || "Gagal fetch detail user");
      })
      .finally(() => {
        setLoadingDetail(false);
      });
  }, [user?.id, setAuth]);

  if (!initialized || !user || loadingDetail) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">Menyiapkan profil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {detail?.verification_status === "REJECTED" && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <p className="font-bold">Verifikasi Ditolak</p>
            <p className="text-sm">
              Silakan perbarui data Anda sesuai instruksi admin untuk dapat
              bertransaksi kembali.
            </p>
          </div>
        )}

        {detail?.verification_status === "PENDING" && (
          <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-700">
            <p className="text-sm font-medium">
              Data Anda sedang dalam proses peninjauan oleh Admin.
            </p>
          </div>
        )}
        <ProfileInfo user={{ ...user, detail }} />
      </main>
    </div>
  );
}
