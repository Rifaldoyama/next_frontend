import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";

export function useProfileGate() {
  const { user, initialized, profileGateSeen, markProfileGateSeen } =
    useAuthStore();
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Jika auth belum siap, atau user sudah melihat modal di sesi ini, jangan munculkan
    if (!initialized || !user || profileGateSeen) {
      setOpen(false);
      return;
    }

    const isRejected = user.detail?.verification_status === "REJECTED";
    const needsAction = user.need_profile || isRejected;

    // Hanya untuk role USER
    if (user.role === "USER" && needsAction) {
      setOpen(true);
    }
  }, [initialized, user, profileGateSeen]);

  const goComplete = () => {
    markProfileGateSeen(); // Panggil ini agar di sessionStorage tersimpan 'true'
    setOpen(false);
    setShowForm(true);
  };

  const goSkip = () => {
    markProfileGateSeen(); // Panggil ini agar di sessionStorage tersimpan 'true'
    setOpen(false);
  };

  return {
    open,
    showForm,
    closeForm: () => setShowForm(false),
    goComplete,
    goSkip,
  };
}
