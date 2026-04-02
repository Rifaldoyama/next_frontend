"use client";

import { UserDetailForm } from "../molecules/UserDetailForm";
import { useState } from "react";

type CompleteProfileModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
};

type AlertType = {
  show: boolean;
  message: string;
  type: "success" | "error" | "info";
};

export function CompleteProfileModal({
  open,
  onClose,
  onSubmit,
  initialData,
}: CompleteProfileModalProps) {
  const [alert, setAlert] = useState<AlertType>({
    show: false,
    message: "",
    type: "info",
  });
  const [isLoading, setIsLoading] = useState(false);

  const showAlert = (message: string, type: "success" | "error" | "info") => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "info" });
    }, 3000);
  };

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      showAlert(
        initialData
          ? "Data berhasil diperbarui! 🎉"
          : "Data berhasil disimpan! 🎉",
        "success"
      );
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error: any) {
      showAlert(
        error.message || "Terjadi kesalahan. Silakan coba lagi.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-md space-y-4 text-black overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
          {/* Header dengan Gradasi */}
          <div className="bg-gradient-to-r from-[#ff5b52] to-pink-500 p-6">
            <h2 className="text-xl font-bold text-white">
              {initialData ? "✏️ Perbaiki Data Diri" : "📝 Lengkapi Data Diri"}
            </h2>
            <p className="text-white/80 text-sm mt-1">
              {initialData
                ? "Perbaiki data yang perlu diperbarui"
                : "Isi data diri Anda dengan lengkap"}
            </p>
          </div>

          {/* Content */}
          <div className="p-6 pt-2 max-h-[60vh] overflow-y-auto">
            <UserDetailForm onSubmit={handleSubmit} initialData={initialData} />
          </div>

          {/* Footer */}
          <div className="px-6 pb-6">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="text-sm text-gray-500 w-full py-2 hover:text-gray-700 transition-colors disabled:opacity-50"
            >
              {initialData ? "← Batal Perbaikan" : "Nanti saja →"}
            </button>
          </div>
        </div>
      </div>

      {/* Custom Alert Modal */}
      {alert.show && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
          <div
            className={`px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 ${alert.type === "success"
              ? "bg-green-500 text-white"
              : alert.type === "error"
                ? "bg-red-500 text-white"
                : "bg-blue-500 text-white"
              }`}
          >
            {alert.type === "success" && (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
            {alert.type === "error" && (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            {alert.type === "info" && (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
            <span className="font-medium">{alert.message}</span>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-xl">
            <div className="w-5 h-5 border-3 border-[#ff5b52] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-700">Menyimpan data...</span>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-100%);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes zoom-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-in {
          animation-duration: 0.2s;
          animation-fill-mode: both;
        }
        .fade-in {
          animation-name: fade-in;
        }
        .zoom-in {
          animation-name: zoom-in;
        }
      `}</style>
    </>
  );
}