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

  const fullPendingNoProof = fullPending && !fullPending.bukti_pembayaran;
  const fullPendingWithProof = fullPending && fullPending.bukti_pembayaran;

  // Jika FULL PENDING tapi BELUM upload bukti, tampilkan pesan upload
  if (fullPendingNoProof) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg">
        <span className="font-semibold block mb-1">
          Menunggu Upload Bukti Pembayaran FULL
        </span>
        <div className="text-sm">
          Silakan upload bukti pembayaran Anda untuk melanjutkan
        </div>
      </div>
    );
  }

  // Jika FULL PENDING dan SUDAH upload bukti, tunggu verifikasi
  if (fullPendingWithProof) {
    return (
      <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-lg">
        <span className="font-semibold block mb-1">
          Menunggu Verifikasi Admin
        </span>
        <div className="text-sm">
          Bukti pembayaran sudah diupload, menunggu verifikasi admin
        </div>
      </div>
    );
  }

  // BELUM BAYAR
  if (statusBayar === "BELUM_BAYAR") {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg">
        <span className="font-semibold block mb-1">Belum Bayar DP</span>
        <div className="text-sm">
          Nominal DP: Rp {nominalDp.toLocaleString()}
        </div>
      </div>
    );
  }

  // MENUNGGU VERIFIKASI (DP atau PELUNASAN atau FULL)
  if (
    statusBayar === "MENUNGGU_VERIFIKASI_DP" ||
    statusBayar === "MENUNGGU_VERIFIKASI_PELUNASAN" ||
    statusBayar === "MENUNGGU_VERIFIKASI_FULL"
  ) {
    return (
      <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-lg">
        <span className="font-semibold block mb-1">
          Menunggu Verifikasi Admin
        </span>
        <div className="text-sm">Bukti pembayaran sedang diverifikasi</div>
      </div>
    );
  }

  if (statusBayar === "FULL") {
    return (
      <div className="bg-green-100 border border-green-300 text-green-900 p-3 rounded-lg">
        <span className="font-semibold block">Pembayaran Full Diterima</span>
      </div>
    );
  }

  if (statusBayar === "DP_DITERIMA") {
    return (
      <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded-lg">
        <span className="font-semibold block mb-1">DP Diterima</span>
        <div className="text-sm">
          Sisa tagihan: Rp {sisaTagihan.toLocaleString()}
        </div>
      </div>
    );
  }

  if (statusBayar === "MENUNGGU_VERIFIKASI_PELUNASAN") {
    return (
      <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-lg">
        <span className="font-semibold block mb-1">
          Menunggu Verifikasi Pelunasan
        </span>
        <div className="text-sm">Bukti pelunasan sedang diverifikasi admin</div>
      </div>
    );
  }

  // LUNAS
  if (statusBayar === "LUNAS") {
    return (
      <div className="bg-green-100 border border-green-300 text-green-900 p-3 rounded-lg">
        <span className="font-semibold block">Pembayaran Lunas</span>
      </div>
    );
  }

  // REJECTED
  if (statusBayar === "REJECTED") {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">
        <span className="font-semibold block mb-1">Pembayaran Ditolak</span>
        <div className="text-sm">Silahkan upload ulang bukti pembayaran</div>
      </div>
    );
  }

  return null;
}
