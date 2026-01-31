"use client";

import { useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export function useInitAuth() {
  const setAuth = useAuthStore((s) => s.setAuth);
   const finishInit = useAuthStore((s) => s.finishInit);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      finishInit();
      return;
    }


    apiFetch("/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setAuth(res.user, token, res.isComplete))

      .catch(() => {
        localStorage.removeItem("token");
        logout();
      });
  }, []);
}
