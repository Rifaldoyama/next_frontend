"use client";

import { useEffect, useRef } from "react";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export function useInitAuth() {
  const { user, setAuth, finishInit } = useAuthStore();
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    const token = localStorage.getItem("token");

    if (!token) {
      finishInit();
      return;
    }

    // Jika user sudah ada di store dari sesi yang sama, skip fetch
    if (user?.detail) {
      finishInit();
      return;
    }

    apiFetch("/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        // Gabungkan data user + need_profile
        setAuth(
          {
            ...res.user,
            need_profile: res.need_profile,
          },
          token,
        );
      })
      .catch(() => {
        localStorage.removeItem("token");
      })
      .finally(() => {
        finishInit();
      });
  }, []);
}
