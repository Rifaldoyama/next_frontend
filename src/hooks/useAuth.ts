"use client";

import { login, register } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";

export function useAuth(type: "login" | "register") {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(data: any) {
    try {
      setLoading(true);
      setError(null);

      const res = type === "login" ? await login(data) : await register(data);
      if (!res?.user) throw new Error("Invalid auth response");

      localStorage.setItem("token", res.accessToken);
      document.cookie = `token=${res.accessToken}; path=/; max-age=${60 * 60 * 24}`;

      setAuth(res.user, res.accessToken, res.isComplete);

      setTimeout(() => {
        switch (res.user.role) {
          case "ADMIN":
            router.replace("/admin");
            break;
          case "PETUGAS":
            router.replace("/petugas");
            break;
          case "USER":
            router.replace("/dashboard");
            break;
        }
      }, 0);
    } catch (err: any) {
      setError(err.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  }

  return { submit, loading, error };
}
