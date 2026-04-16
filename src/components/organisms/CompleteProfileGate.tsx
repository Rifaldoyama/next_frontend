"use client";

import { ConfirmCompleteProfile } from "../molecules/ConfirmCompleteProfile";
import { CompleteProfileModal } from "./CompleteProfileModal";
import { useProfileGate } from "@/hooks/useProfileGate";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useState, useEffect } from "react";

interface CompleteProfileGateProps {
  externalOpen: boolean;     // State dari layout
  setExternalOpen: (v: boolean) => void;
}

export function CompleteProfileGate({ externalOpen, setExternalOpen }: CompleteProfileGateProps) {
  // Logic bawaan untuk popup otomatis (Confirm & Modal)
  const { open, showForm, closeForm, goComplete, goSkip } = useProfileGate();
  const { user, token, setAuth } = useAuthStore();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // ✅ SYNC: Jika tombol di Alert diklik (externalOpen), maka jalankan goComplete()
  useEffect(() => {
    if (externalOpen) {
      goComplete(); 
      setExternalOpen(false); // Reset state di layout agar bisa diklik lagi nanti
    }
  }, [externalOpen, goComplete, setExternalOpen]);

  async function submitProfile(data: any) {
    const fd = new FormData();
    if (data.nama_lengkap) fd.append("nama_lengkap", data.nama_lengkap);
    if (data.no_hp) fd.append("no_hp", data.no_hp);
    if (data.alamat) fd.append("alamat", data.alamat);
    if (data.no_ktp) fd.append("no_ktp", data.no_ktp);
    if (data.foto_ktp) fd.append("foto_ktp", data.foto_ktp);

    try {
      await apiFetch("/user-detail", { method: "POST", body: fd });
      setSuccessMsg("✅ Data berhasil dikirim, menunggu verifikasi admin.");

      if (user) {
        setAuth({
          ...user,
          need_profile: false,
          detail: {
            ...user.detail!,
            nama_lengkap: data.nama_lengkap || user.detail?.nama_lengkap || "",
            verification_status: "PENDING",
          },
        }, token!);
      }

      closeForm();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (error) {
      alert("Gagal mengirim data.");
    }
  }

  const isRejected = user?.detail?.verification_status === "REJECTED";

  return (
    <>
      {/* Ini popup otomatis (Skip/Lengkapi) */}
      <ConfirmCompleteProfile
        open={open}
        onComplete={goComplete}
        onSkip={goSkip}
        isRejected={isRejected}
        onClose={closeForm}
      />

      {/* Ini modal form-nya */}
      <CompleteProfileModal
        open={showForm}
        onClose={closeForm}
        onSubmit={submitProfile}
        initialData={isRejected ? user?.detail : undefined}
      />

      {successMsg && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 font-medium">
          {successMsg}
        </div>
      )}
    </>
  );
}