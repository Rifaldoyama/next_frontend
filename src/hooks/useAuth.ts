"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { apiFetch } from "@/lib/api";

export function useAuth(type: "login" | "register") {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  function mapErrorMessage(err: any): string {
    const msg =
      err?.response?.data?.message || 
      err?.data?.message || 
      err?.message || 
      "";

    if (msg === "Invalid credentials") {
      return "Email atau password salah";
    }

    if (msg.toLowerCase().includes("email")) {
      return "Email sudah terdaftar";
    }

    if (msg.toLowerCase().includes("username")) {
      return "Username sudah digunakan";
    }

    return "Terjadi kesalahan, silakan coba lagi";
  }

  const submit = async (form: Record<string, string>) => {
    setLoading(true);
    setError(null);

    try {
      const endpoint = type === "login" ? "/auth/login" : "/auth/register";
      const res = await apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (type === "register") {
        router.push("/login?registered=true");
        return;
      }

      // 1. Ambil token dari response login
      // Cek apakah backendmu pakai 'token' atau 'accessToken'
      const token = res.token || res.accessToken;

      if (!token) throw new Error("Token tidak ditemukan dalam response");

      // 2. Simpan ke localStorage
      localStorage.setItem("token", token);

      // 3. Ambil data user LENGKAP.
      // KUNCI: Kita masukkan headers secara manual di sini untuk memastikan
      // request ini tidak "Unauthorized" karena nunggu state/localStorage
      const userRes = await apiFetch("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 4. Update Global State (Zustand)
      setAuth(
        {
          ...userRes.user,
          need_profile: userRes.need_profile,
        },
        token,
      );

      // 5. Redirect berdasarkan role
      const role = userRes.user.role;
      if (role === "ADMIN") router.replace("/admin");
      else if (role === "PETUGAS") router.replace("/petugas");
      else router.replace("/dashboard");
    } catch (err: any) {
      console.error("Auth Error:", err);

      const mappedError = mapErrorMessage(err);
      setError(mappedError);
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
}
