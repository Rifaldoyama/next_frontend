"use client";

import { User, Mail, ShieldCheck, Sparkles } from "lucide-react";

export function ProfileInfo({ user }: { user: any }) {
  const detail = user.detail;

  if (!detail) {
    return (
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-10 h-10 text-orange-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Data Profil Tidak Tersedia
        </h3>
        <p className="text-gray-500 text-sm">
          Silakan lengkapi data profil Anda
        </p>
      </div>
    );
  }

  const userData = [
    { label: "Nama Lengkap", value: detail.nama_lengkap || "-", icon: User },
    { label: "Email", value: user.email || "-", icon: Mail },
    {
      label: "Status Verifikasi",
      value: detail.verification_status,
      isStatus: true,
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-pink-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Informasi Profil
            </h3>
            <p className="text-gray-500 text-sm mt-0.5">
              Detail informasi akun Anda
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-4">
          {userData.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center py-2"
              >
                <div className="flex items-center gap-2 sm:w-1/3 mb-1 sm:mb-0">
                  <Icon className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-medium text-gray-600">
                    {item.label}
                  </span>
                </div>
                <div className="sm:w-2/3">
                  {item.isStatus ? (
                    renderVerificationStatus(item.value)
                  ) : (
                    <span className="text-gray-800">{item.value}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <Sparkles className="w-3 h-3 text-orange-400" />
          <span>Event Rental System</span>
        </div>
      </div>
    </div>
  );
}

function renderVerificationStatus(status?: string) {
  const config = {
    APPROVED: {
      text: "✅ Disetujui",
      className: "bg-green-50 text-green-700 border-green-200",
    },
    PENDING: {
      text: "⏳ Menunggu Verifikasi",
      className: "bg-yellow-50 text-yellow-700 border-yellow-200",
    },
    REJECTED: {
      text: "❌ Ditolak",
      className: "bg-red-50 text-red-700 border-red-200",
    },
    DEFAULT: {
      text: "⚠️ Belum Diverifikasi",
      className: "bg-gray-50 text-gray-700 border-gray-200",
    },
  };

  const statusKey = status?.toUpperCase() as keyof typeof config;
  const { text, className } = config[statusKey] || config.DEFAULT;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${className}`}
    >
      {text}
    </span>
  );
}
