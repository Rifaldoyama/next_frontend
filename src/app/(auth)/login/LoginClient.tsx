"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthForm } from "@/components/organisms/AuthForm";
import { useAuthStore } from "@/store/authStore";
import { redirectByRole } from "@/lib/redirectByRole";
import { CheckCircle, XCircle } from "lucide-react";

export default function LoginClient() {
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
      {registered && (
        <div className="rounded-xl bg-green-50 border p-4">
          <p>Pendaftaran berhasil, silakan login</p>
        </div>
      )}

      {errorMsg && (
        <div className="rounded-xl bg-red-50 border p-4">
          <p>{errorMsg}</p>
        </div>
      )}

      <AuthForm type="login" onError={setErrorMsg} />
    </div>
  );
}