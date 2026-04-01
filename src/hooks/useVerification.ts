"use client";

import { useEffect, useState } from "react";

type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED";

export function useVerification() {
  const [status, setStatus] = useState<VerificationStatus>("PENDING");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkVerification = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/me/verification-status`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!res.ok) throw new Error("Gagal cek verifikasi");

        const data = await res.json();
        setStatus(data.status);
      } catch {
        setStatus("PENDING");
      } finally {
        setLoading(false);
      }
    };

    checkVerification();
  }, []);

  return {
    status,
    isVerified: status === "APPROVED",
    isPending: status === "PENDING",
    isRejected: status === "REJECTED",
    loading,
  };
}
