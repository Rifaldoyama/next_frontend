import { Button } from '../atoms/Buttons';
import { Modal } from '../atoms/Modal';

export function ConfirmCompleteProfile({
  open,
  onComplete,
  onSkip,
}: {
  open: boolean;
  onComplete: () => void;
  onSkip: () => void;
}) {
  return (
    <Modal open={open}>
      <h2 className="text-lg font-semibold">
        Lengkapi Data Diri
      </h2>

      <p className="text-sm text-gray-600 mt-2">
        Untuk mengakses semua fitur, silakan lengkapi data diri Anda.
      </p>

      <div className="flex gap-3 mt-6">
        <Button onClick={onComplete}>
          Lengkapi Sekarang
        </Button>

        <Button
          onClick={onSkip}
          className="bg-gray-200 text-black"
        >
          Lihat Katalog Dulu
        </Button>
      </div>
    </Modal>
  );
}
