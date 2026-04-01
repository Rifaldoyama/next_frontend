"use client";

interface Props {
  statusBayar: string;
  nominalDp: number;
  sisaTagihan: number;
  pembayaran?: any[];
}

export function PaymentStatus({
  statusBayar,
  nominalDp,
  sisaTagihan,
  pembayaran,
}: Props) {
  const fullPending = pembayaran?.find(
    (p: any) => p.tipe === "FULL" && p.status === "PENDING",
  );

  if (fullPending) {
    return (
      <div className="bg-yellow-100 text-yellow-800 p-3 rounded">
        Menunggu verifikasi pembayaran FULL oleh admin
      </div>
    );
  }
  // =========================
  // BELUM BAYAR
  // =========================
  if (statusBayar === "BELUM_BAYAR") {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded">
        <span className="font-semibold">Belum Bayar DP</span>
        <div className="text-sm">
          Nominal DP: Rp {nominalDp.toLocaleString()}
        </div>
      </div>
    );
  }

  // =========================
  // MENUNGGU VERIFIKASI
  // =========================
  if (statusBayar === "") {
    return (
      <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded">
        <span className="font-semibold">Menunggu Verifikasi Admin</span>
      </div>
    );
  }

  if (statusBayar === "FULL") {
    return (
      <div className="bg-green-200 border border-green-400 text-green-900 p-3 rounded">
        <span className="font-semibold">Pembayaran Full Diterima</span>
      </div>
    );
  }

  // =========================
  // REJECTED (INI YANG DIMINTA)
  // =========================
  if (statusBayar === "REJECTED") {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">
        <span className="font-semibold">Pembayaran Ditolak</span>

        <div className="text-sm">Silahkan upload ulang bukti pembayaran</div>
      </div>
    );
  }

  // =========================
  // DP DITERIMA
  // =========================
  if (statusBayar === "DP_DITERIMA") {
    return (
      <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded">
        <span className="font-semibold">DP diterima</span>

        <div className="text-sm">
          Sisa tagihan: Rp {sisaTagihan.toLocaleString()}
        </div>
      </div>
    );
  }

  // =========================
  // LUNAS
  // =========================
  if (statusBayar === "LUNAS") {
    return (
      <div className="bg-green-100 border border-green-300 text-green-900 p-3 rounded">
        <span className="font-semibold">Pembayaran Lunas</span>
      </div>
    );
  }

  return null;
}
