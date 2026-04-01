"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { AuthForm } from "@/components/organisms/AuthForm";
import { useAuthStore } from "@/store/authStore";
import { redirectByRole } from "@/lib/redirectByRole";
import { CheckCircle, XCircle } from "lucide-react";

export default function LoginPage() {
  const params = useSearchParams();
  const registered = params.get("registered");
  const router = useRouter();

  const { user, initialized } = useAuthStore();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!initialized) return;

    if (user) {
      redirectByRole(user.role, router);
    }
  }, [initialized, user, router]);

  if (!initialized || user) return null;

  return (
    <div className="space-y-6">
      {/* Success Alert */}
      {registered && (
        <div className="rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-4 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-green-800">
                Pendaftaran Berhasil!
              </p>
              <p className="text-xs text-green-600">
                Silakan login untuk melanjutkan
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMsg && (
        <div className="rounded-xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 p-4 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
              <XCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-800">Login Gagal</p>
              <p className="text-xs text-red-600">{errorMsg}</p>
            </div>
          </div>
        </div>
      )}

      <AuthForm type="login" onError={setErrorMsg} />
    </div>
  );
}
