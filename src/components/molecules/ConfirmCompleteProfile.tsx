import { Button } from "../atoms/Buttons";
import { Modal } from "../atoms/Modal";

export function ConfirmCompleteProfile({
  open,
  onComplete,
  onSkip,
  isRejected,
}: {
  open: boolean;
  onComplete: () => void;
  onSkip: () => void;
  isRejected: boolean;
}) {
  return (
    <Modal open={open}>
      <h2 className="text-lg font-semibold text-red-600">
        {isRejected ? "Verifikasi Ditolak" : "Lengkapi Data Diri"}
      </h2>
      <p className="text-sm text-gray-600 mt-2">
        {isRejected
          ? "Maaf, data KTP Anda sebelumnya ditolak Admin. Silakan perbarui data Anda agar bisa menyewa."
          : "Untuk mengakses semua fitur, silakan lengkapi data diri Anda."}
      </p>

      <div className="flex gap-3 mt-6">
        <Button onClick={onComplete}>Lengkapi Sekarang</Button>

        {!isRejected && (
          <Button onClick={onSkip} className="bg-gray-900 text-black">
            Lihat Katalog Dulu
          </Button>
        )}
      </div>
    </Modal>
  );
}
