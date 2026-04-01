"use client";

import { useEffect, useState } from "react";
import { Card } from "../atoms/Card";
import { PaymentStatus } from "../molecules/PaymentStatus";
import { Button } from "../atoms/Buttons";
import { useTransaction } from "@/hooks/peminjaman/useTransaction";
import { showConfirm, showError, showSuccess } from "@/lib/alert";

interface Props {
  detail: any;
  onRefresh: () => void;
  onSuccess?: () => void;
}

export function TransactionPanel({ detail, onRefresh, onSuccess }: Props) {
  const {
    loading,
    rekeningList,
    fetchRekening,
    createPayment,
    createFullPayment,
    uploadProof,
  } = useTransaction();

  const [selectedRekeningDP, setSelectedRekeningDP] = useState("");
  const [selectedRekeningPelunasan, setSelectedRekeningPelunasan] =
    useState("");

  const [fileDP, setFileDP] = useState<File | null>(null);
  const [filePelunasan, setFilePelunasan] = useState<File | null>(null);
  const [selectedRekeningFull, setSelectedRekeningFull] = useState("");
  const [fileFull, setFileFull] = useState<File | null>(null);

  const [initialChoice, setInitialChoice] = useState<"DP" | "FULL" | null>(
    null,
  );

  // =============================
  // FLAGS
  // =============================

  const dpPending = detail.pembayaran?.find(
    (p: any) => p.tipe === "DP" && p.status === "PENDING",
  );

  const dpRejected = detail.pembayaran?.find(
    (p: any) => p.tipe === "DP" && p.status === "REJECTED",
  );

  const pelunasanRejected = detail.pembayaran?.find(
    (p: any) => p.tipe === "PELUNASAN" && p.status === "REJECTED",
  );

  const fullRejected = detail.pembayaran?.find(
    (p: any) => p.tipe === "FULL" && p.status === "REJECTED",
  );
  // =============================
  // FLAGS
  const hasPaidDP = detail.pembayaran?.some(
    (p: any) => p.tipe === "DP" && p.status === "VERIFIED",
  );

  const hasPaidFull = detail.pembayaran?.some(
    (p: any) => p.tipe === "FULL" && p.status === "VERIFIED",
  );

  const pelunasanPending = detail.pembayaran?.find(
    (p: any) => p.tipe === "PELUNASAN" && p.status === "PENDING",
  );

  const pelunasanVerified = detail.pembayaran?.find(
    (p: any) => p.tipe === "PELUNASAN" && p.status === "VERIFIED",
  );

  const fullPending = detail.pembayaran?.find(
    (p: any) => p.tipe === "FULL" && p.status === "PENDING",
  );

  const hasPelunasanPending = !!pelunasanPending;

  const hasPaidPelunasan = !!pelunasanVerified;

  useEffect(() => {
    if (hasPaidDP && !hasPaidPelunasan) setInitialChoice(null);

    if (hasPaidFull) setInitialChoice(null);
  }, [hasPaidDP, hasPaidPelunasan, hasPaidFull]);

  // =============================
  // LOAD REKENING
  // =============================

  useEffect(() => {
    fetchRekening();
  }, []);

  // =============================
  // CREATE DP
  // =============================

  const handleCreateDP = async () => {
    if (!selectedRekeningDP) return showError("Pilih rekening");

    try {
      await createPayment("DP", detail.id, selectedRekeningDP);

      showSuccess("Tagihan DP berhasil dibuat");

      await onRefresh(); // 🔥 penting
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleUploadDP = async () => {
    if (!dpPending) return showError("Belum ada pembayaran DP");
    if (!fileDP) return showError("Upload file dulu");

    if (fileDP.size > 2 * 1024 * 1024) return showError("File maksimal 2MB");

    if (!fileDP.type.startsWith("image/"))
      return showError("File harus berupa gambar");

    try {
      await uploadProof(dpPending.id, fileDP);
      showSuccess("Bukti berhasil diupload");
      setFileDP(null);
      await onRefresh();
      onSuccess?.();
    } catch (err: any) {
      showError(err.message || "Gagal upload bukti");
    }
  };

  // =============================
  // CREATE PELUNASAN
  // =============================

  const handleCreatePelunasan = async () => {
    if (loading) return;
    if (!selectedRekeningPelunasan) return showError("Pilih rekening tujuan");

    if (pelunasanRejected) {
      const confirm = await showConfirm("Buat ulang pembayaran pelunasan?");
      if (!confirm) return;
    }

    try {
      await createPayment("PELUNASAN", detail.id, selectedRekeningPelunasan);
      showSuccess("Tagihan pelunasan berhasil dibuat");
      await onRefresh();
    } catch (err: any) {
      showError(err.message || "Gagal membuat pelunasan");
    }
  };

  const handleUploadPelunasan = async () => {
    if (!pelunasanPending) return showError("Belum ada pelunasan");
    if (!filePelunasan) return showError("Upload file dulu");

    if (filePelunasan.size > 2 * 1024 * 1024)
      return showError("File maksimal 2MB");

    if (!filePelunasan.type.startsWith("image/"))
      return showError("File harus berupa gambar");

    try {
      await uploadProof(pelunasanPending.id, filePelunasan);

      showSuccess("Bukti berhasil diupload");
      setFilePelunasan(null);

      await onRefresh();
      onSuccess?.();
    } catch (err: any) {
      showError(err.message || "Gagal upload bukti");
    }
  };
  const dp = detail.pembayaran?.find((p: any) => p.tipe === "DP");

  const canUploadDP = dp?.status === "PENDING";
  const isRejectedDP = dp?.status === "REJECTED";

  // =============================
  // CREATE FULL
  // =============================

  const handleCreateFull = async () => {
    if (loading) return;
    if (!selectedRekeningFull) return showError("Pilih rekening");

    const confirmPay = await showConfirm(
      `Anda akan membayar penuh sebesar Rp ${totalFull.toLocaleString()}`,
    );

    if (!confirmPay) return;

    try {
      await createFullPayment(detail.id, selectedRekeningFull);
      showSuccess("Tagihan full berhasil dibuat");
      await onRefresh();
      setInitialChoice(null);
      onSuccess?.();
    } catch (err: any) {
      showError(err.message || "Gagal membuat pembayaran full");
    }
  };

  const handleUploadFull = async () => {
    if (!fullPending) return showError("Belum ada pembayaran full");
    if (!fileFull) return showError("Upload file dulu");

    if (fileFull.size > 2 * 1024 * 1024) return showError("File maksimal 2MB");

    if (!fileFull.type.startsWith("image/"))
      return showError("File harus berupa gambar");

    try {
      await uploadProof(fullPending.id, fileFull);
      showSuccess("Bukti berhasil diupload");
      setFileFull(null);
      await onRefresh();
      onSuccess?.();
    } catch (err: any) {
      showError(err.message || "Gagal upload bukti");
    }
  };

  // =============================
  // INITIAL CHOICE
  // =============================

  if (
    detail.status_bayar === "BELUM_BAYAR" &&
    !initialChoice &&
    !dpPending &&
    !fullPending
  ) {
    return (
      <Card className="p-4 space-y-2">
        <h3 className="font-bold">Pilih metode pembayaran</h3>

        <Button onClick={() => setInitialChoice("DP")}>Bayar DP dulu</Button>

        <Button onClick={() => setInitialChoice("FULL")}>
          Bayar Full langsung
        </Button>
      </Card>
    );
  }

  const totalSewa = detail.total_sewa;
  const ongkir = detail.biaya_tambahan || 0;
  const depositAmount =
    detail.jaminan_tipe === "DEPOSIT_UANG" ? detail.deposit : 0;

  const totalFull = totalSewa + ongkir + depositAmount;
  const totalDP = detail.nominal_dp + depositAmount + ongkir;

  console.log(
    "Detail pembayaran:",
    detail.total_biaya,
    detail.nominal_dp,
    depositAmount,
  );

  return (
    <Card className="space-y-6">
      <h3 className="font-bold text-lg">Transaksi</h3>

      <PaymentStatus
        statusBayar={detail.status_bayar}
        nominalDp={detail.nominal_dp}
        sisaTagihan={detail.sisa_tagihan}
        pembayaran={detail.pembayaran}
      />

      {/* ===================== */}
      {/* SECTION DP */}
      {/* ===================== */}

      {!hasPaidDP && !fullPending && initialChoice === "DP" && (
        <div className="border p-4 rounded bg-yellow-50 space-y-3">
          <h4 className="font-semibold text-yellow-900">
            Pembayaran DP & Jaminan
          </h4>

          <div className="space-y-1 text-sm text-yellow-800 bg-white/50 p-2 rounded border border-yellow-200">
            <div className="flex justify-between">
              <span>DP Sewa (35%):</span>
              <span>Rp {detail.nominal_dp.toLocaleString()}</span>
            </div>
            {depositAmount > 0 && (
              <div className="flex justify-between font-medium">
                <span>Deposit Jaminan (40%):</span>
                <span>Rp {depositAmount.toLocaleString()}</span>
              </div>
            )}
            {ongkir > 0 && (
              <div className="flex justify-between">
                <span>Biaya Pengiriman:</span>
                <span>Rp {ongkir.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-yellow-300 pt-1 font-bold text-base">
              <span>Total Bayar Sekarang:</span>
              <span>Rp {totalDP.toLocaleString()}</span>
            </div>
          </div>

          <p className="text-[10px] text-yellow-700 italic">
            *Uang deposit akan dikembalikan setelah alat kembali dalam kondisi
            baik.
          </p>

          <select
            value={selectedRekeningDP}
            onChange={(e) => setSelectedRekeningDP(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">Pilih rekening tujuan</option>

            {rekeningList.map((rek) => (
              <option key={rek.id} value={rek.id}>
                {rek.nama} - {rek.nomor}
              </option>
            ))}
          </select>

          {/* BELUM ADA DP */}
          {!dpPending && (
            <Button disabled={loading} onClick={handleCreateDP}>
              Buat Tagihan DP
            </Button>
          )}

          {/* DP PENDING */}
          {canUploadDP && (
            <>
              {!dp?.bukti_pembayaran ? (
                <>
                  <input
                    type="file"
                    onChange={(e) => setFileDP(e.target.files?.[0] || null)}
                  />

                  <Button onClick={handleUploadDP}>Upload Bukti DP</Button>
                </>
              ) : (
                <div>Menunggu verifikasi admin</div>
              )}
            </>
          )}

          {/* DP REJECTED */}
          {isRejectedDP && (
            <>
              <div className="text-red-600">Pembayaran ditolak</div>

              <Button onClick={handleCreateDP}>Buat Ulang</Button>
            </>
          )}
        </div>
      )}

      {/* ===================== */}
      {/* SECTION PELUNASAN */}
      {/* ===================== */}

      {hasPaidDP && !hasPaidPelunasan && (
        <div className="border p-4 rounded bg-blue-50 space-y-3">
          <h4 className="font-semibold">Pelunasan</h4>

          {pelunasanRejected ? (
            <>
              <div className="text-red-600">
                Pelunasan ditolak, silakan buat ulang
              </div>

              <Button onClick={handleCreatePelunasan}>
                Buat Ulang Pelunasan
              </Button>
            </>
          ) : pelunasanPending ? (
            <>
              {!pelunasanPending.bukti_pembayaran ? (
                <>
                  <input
                    type="file"
                    onChange={(e) =>
                      setFilePelunasan(e.target.files?.[0] || null)
                    }
                  />
                  <Button onClick={handleUploadPelunasan}>
                    Upload Bukti Pelunasan
                  </Button>
                </>
              ) : (
                <div className="text-blue-700">
                  Bukti sudah diupload, menunggu verifikasi admin
                </div>
              )}
            </>
          ) : (
            <>
              <select
                value={selectedRekeningPelunasan}
                onChange={(e) => setSelectedRekeningPelunasan(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="">Pilih rekening tujuan</option>

                {rekeningList.map((rek) => (
                  <option key={rek.id} value={rek.id}>
                    {rek.nama} - {rek.nomor}
                  </option>
                ))}
              </select>

              <Button onClick={handleCreatePelunasan}>
                Buat Tagihan Pelunasan
              </Button>
            </>
          )}
        </div>
      )}

      {/* ===================== */}
      {/* SECTION FULL */}
      {/* ===================== */}

      {initialChoice === "FULL" && !hasPaidFull && (
        <div className="border p-4 rounded bg-green-50 space-y-3">
          <h4 className="font-semibold">Pembayaran Full</h4>

          {fullRejected ? (
            <>
              <div className="text-red-600">
                Pembayaran full ditolak, silakan buat ulang
              </div>

              <Button onClick={handleCreateFull}>
                Buat Ulang Full Payment
              </Button>
            </>
          ) : fullPending ? (
            <>
              {!fullPending.bukti_pembayaran ? (
                <>
                  <input
                    type="file"
                    onChange={(e) => setFileFull(e.target.files?.[0] || null)}
                  />
                  <Button onClick={handleUploadFull}>Upload Bukti Full</Button>
                </>
              ) : (
                <div className="text-green-700">
                  Bukti sudah diupload, menunggu verifikasi admin
                </div>
              )}
            </>
          ) : (
            <>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Total Sewa:</span>
                  <span>Rp {totalSewa.toLocaleString()}</span>
                </div>

                {ongkir > 0 && (
                  <div className="flex justify-between">
                    <span>Ongkir:</span>
                    <span>Rp {ongkir.toLocaleString()}</span>
                  </div>
                )}

                {depositAmount > 0 && (
                  <div className="flex justify-between text-orange-600">
                    <span>Deposit:</span>
                    <span>Rp {depositAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between font-bold border-t pt-1">
                  <span>Total Bayar:</span>
                  <span>Rp {totalFull.toLocaleString()}</span>
                </div>
              </div>

              <select
                value={selectedRekeningFull}
                onChange={(e) => setSelectedRekeningFull(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="">Pilih rekening</option>
                {rekeningList.map((rek) => (
                  <option key={rek.id} value={rek.id}>
                    {rek.nama} - {rek.nomor}
                  </option>
                ))}
              </select>

              <Button onClick={handleCreateFull}>Buat Tagihan Full</Button>
            </>
          )}
        </div>
      )}
    </Card>
  );
}
