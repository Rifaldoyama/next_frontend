"use client";

interface DecisionModalProps {
  onReview: () => void;
  onContinue: () => void;
}

export function DecisionModal({ onReview, onContinue }: DecisionModalProps) {
  return (
    <div className="space-y-6 text-center">
      <p className="text-gray-700">
        Mau review peminjaman atau pilih barang lagi?
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onReview}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Review Peminjaman
        </button>
        <button
          onClick={onContinue}
          className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-6 py-2.5 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Tambah Barang
        </button>
      </div>
    </div>
  );
}
