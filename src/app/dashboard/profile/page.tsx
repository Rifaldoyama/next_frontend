"use client";

import { ProfileInfo } from "@/components/organisms/ProfileInfo";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, initialized, logout, setAuth } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null);

  // redirect jika tidak ada user
  useEffect(() => {
    if (!initialized) return;
    if (!user) {
      router.replace("/login");
    }
  }, [initialized, user, router]);

  // fetch data user lengkap
  const fetchUserData = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await apiFetch("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Fetched user data:", response);

      // Update store dengan data terbaru
      setAuth(
        {
          ...response.user,
          need_profile: response.need_profile,
        },
        token!,
      );

      setProfileData(response.user);
    } catch (err: any) {
      console.error("Error fetching profile:", err);
      setError(err.message || "Gagal mengambil data profil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserData();
    }
  }, [user?.id]);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  if (!initialized || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4" />
        <p className="text-gray-500">Memuat data profil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Gagal Memuat Data</h3>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button
            onClick={fetchUserData}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const currentUser = profileData || user;
  const detail = currentUser?.detail;
  const verificationStatus = detail?.verification_status;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Kembali ke Dashboard</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Alert Banner */}
        {verificationStatus === "REJECTED" && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
            <p className="font-semibold text-red-800">Verifikasi Ditolak</p>
            <p className="text-sm text-red-700 mt-1">
              Silakan perbarui data Anda sesuai instruksi admin untuk dapat bertransaksi kembali.
            </p>
          </div>
        )}

        {verificationStatus === "PENDING" && (
          <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-amber-800">Data Sedang Diverifikasi</p>
                <p className="text-sm text-amber-700 mt-1">
                  Data Anda sedang dalam proses peninjauan oleh Admin. Proses ini membutuhkan waktu 1x24 jam.
                </p>
              </div>
            </div>
          </div>
        )}

        {verificationStatus === "UNVERIFIED" && (
          <div className="mb-6 p-4 bg-gray-50 border-l-4 border-gray-400 rounded-r-lg">
            <p className="font-semibold text-gray-700">Belum Mengirimkan Verifikasi</p>
            <p className="text-sm text-gray-600 mt-1">
              Silakan lengkapi data diri Anda untuk dapat melakukan transaksi penyewaan.
            </p>
          </div>
        )}

        {/* Profile Info */}
        <ProfileInfo user={currentUser} />
      </main>
    </div>
  );
}