import { Button } from "../atoms/Buttons";
import { Modal } from "../atoms/Modal";

export function ConfirmCompleteProfile({
  open,
  onComplete,
  onSkip,
  isRejected,
  onClose
}: {
  open: boolean;
  onComplete: () => void;
  onSkip: () => void;
  isRejected: boolean;
  onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="relative overflow-hidden text-black">
        {/* Background gradasi untuk header area */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff5b52] to-pink-500" />

        <div className="p-6">
          {/* Icon berdasarkan status */}
          <div className="flex justify-center mb-4">
            {isRejected ? (
              // Icon Error/Rejected
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#ff5b52]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            ) : (
              // Icon Info/Warning
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#ff5b52]/10 to-pink-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#ff5b52]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
          </div>

          {/* Title dengan warna tema */}
          <h2 className={`text-xl font-bold text-center ${isRejected ? "text-[#ff5b52]" : "text-gray-800"
            }`}>
            {isRejected ? "Verifikasi Ditolak" : "Lengkapi Data Diri"}
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-600 text-center mt-3 leading-relaxed">
            {isRejected
              ? "Maaf, data KTP Anda sebelumnya ditolak Admin. Silakan perbarui data Anda agar bisa menyewa."
              : "Untuk mengakses semua fitur, silakan lengkapi data diri Anda terlebih dahulu."}
          </p>

          {/* Buttons */}
          <div className="flex gap-3 mt-8">
            <Button
              onClick={onComplete}
              className="flex-1 bg-gradient-to-r from-[#ff5b52] to-pink-500 text-white hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Lengkapi Sekarang
              </span>
            </Button>

            {!isRejected && (
              <Button
                onClick={onSkip}
                className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300 border border-gray-200"
              >
                <span className="flex items-center justify-center gap-2 text-black">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  Lihat Katalog Dulu
                </span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}