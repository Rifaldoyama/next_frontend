"use client";

import { Button } from "../atoms/Buttons";
import { AuthField } from "../molecules/AuthField";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import {
  Mail,
  Lock,
  User,
  Sparkles,
  PartyPopper,
  Mic,
  Users,
} from "lucide-react";

type AuthFormProps = {
  type: "login" | "register";
  className?: string;
  onError?: (msg: string) => void;
};

export function AuthForm({ type, className, onError }: AuthFormProps) {
  const { submit, loading, error } = useAuth(type);
  const [form, setForm] = useState<Record<string, string>>({});
  const router = useRouter();

  const isLogin = type === "login";

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  const eventIcons = [
    { icon: PartyPopper, color: "text-yellow-500" },
    { icon: Mic, color: "text-purple-500" },
    { icon: Users, color: "text-pink-500" },
  ];

  return (
    <div className={clsx("space-y-6", className)}>
      {/* Header with Event Theme */}
      <div className="text-center space-y-3">
        <div className="flex justify-center gap-2 mb-4">
          {eventIcons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="w-10 h-10 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full flex items-center justify-center animate-bounce"
                style={{ animationDelay: `${idx * 0.2}s` }}
              >
                <Icon className={`w-5 h-5 ${item.color}`} />
              </div>
            );
          })}
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
          {isLogin ? "Welcome Back!" : "Join the Party!"}
        </h2>
        <p className="text-sm text-gray-500">
          {isLogin
            ? "Masuk ke akun Anda untuk mulai menyewa peralatan event"
            : "Daftar sekarang dan dapatkan diskon pertama Anda"}
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(form);
        }}
        className="space-y-4"
      >
        {/* Username Field - Only for Register */}
        {type === "register" && (
          <AuthField
            label="Username"
            icon={<User className="w-4 h-4" />}
            placeholder="Masukkan username"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
        )}

        {/* Email Field */}
        <AuthField
          label="Email"
          type="email"
          icon={<Mail className="w-4 h-4" />}
          placeholder="contoh@email.com"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        {/* Password Field */}
        <AuthField
          label="Password"
          type="password"
          icon={<Lock className="w-4 h-4" />}
          placeholder="••••••••"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        {/* Submit Button with Gradient */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{isLogin ? "Memproses..." : "Mendaftarkan..."}</span>
            </div>
          ) : isLogin ? (
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Masuk
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <PartyPopper className="w-4 h-4" />
              Daftar Sekarang
            </span>
          )}
        </Button>
      </form>

      {/* Divider with Event Theme */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-white text-gray-400">atau</span>
        </div>
      </div>

      {/* Switch Auth Mode */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => router.push(isLogin ? "/register" : "/login")}
          className="text-sm text-gray-600 hover:text-orange-600 transition-colors duration-200"
        >
          {isLogin
            ? "Belum punya akun? Daftar sekarang"
            : "Sudah punya akun? Masuk disini"}
        </button>
      </div>
    </div>
  );
}
