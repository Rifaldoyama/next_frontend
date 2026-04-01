"use client";

import { AuthForm } from "@/components/organisms/AuthForm";
import { useState } from "react";
import { Gift, Sparkles, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Promo Banner */}
      {/* <div className="rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 p-4 text-white animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold">Special Offer!</p>
            <p className="text-xs opacity-90">
              Dapatkan diskon 20% untuk pendaftaran pertama
            </p>
          </div>
        </div>
      </div> */}

      {/* Error Alert */}
      {errorMsg && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-800">
                Pendaftaran Gagal
              </p>
              <p className="text-xs text-red-600">{errorMsg}</p>
            </div>
          </div>
        </div>
      )}

      <AuthForm type="register" onError={setErrorMsg} />

      {/* Additional Info */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full">
          <Sparkles className="w-3 h-3 text-orange-500" />
          <p className="text-xs text-gray-600">
            Bergabung dengan ribuan event organizer lainnya
          </p>
        </div>
      </div>
    </div>
  );
}
