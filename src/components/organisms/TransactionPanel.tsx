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
    downloadReceipt,
  } = useTransaction();

  const [selectedRekeningDP, setSelectedRekeningDP] = useState("");
  const [selectedRekeningPelunasan, setSelectedRekeningPelunasan] =
    useState("");
  const [selectedRekeningFull, setSelectedRekeningFull] = useState("");
  const [fileDP, setFileDP] = useState<File | null>(null);
  const [filePelunasan, setFilePelunasan] = useState<File | null>(null);
  const [fileFull, setFileFull] = useState<File | null>(null);
  const [initialChoice, setInitialChoice] = useState<"DP" | "FULL" | null>(
    null,
  );

  const getPaymentState = (payment?: any) => {
    if (!payment) return "EMPTY";
    if (payment.status === "PENDING") return "PENDING";
    if (payment.status === "REJECTED") return "REJECTED";
    if (payment.status === "VERIFIED") return "VERIFIED";
    return "EMPTY";
  };

  // =============================
  // FLAGS
  // =============================
  const dpPending = detail.pembayaran?.find(
    (p: any) => p.tipe === "DP" && p.status === "PENDING",
  );

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

  const hasPaidPelunasan = !!pelunasanVerified;
  const isLunas = detail.status_bayar === "LUNAS";
  const hasActiveDP = detail.pembayaran?.some(
    (p: any) =>
      p.tipe === "DP" && (p.status === "PENDING" || p.status === "VERIFIED"),
  );

  // Cek apakah DP sudah diverifikasi (bukan hanya status_bayar)
  const isDPVerified = detail.status_bayar === "DP_DITERIMA" || hasPaidDP;

  // =============================
  // LOAD REKENING
  // =============================
  useEffect(() => {
    fetchRekening();
  }, [fetchRekening]);

  // =============================
  // CREATE DP
  // =============================
  const handleCreateDP = async () => {
    if (!selectedRekeningDP) return showError("Pilih rekening");

    try {
      await createPayment("DP", detail.id, selectedRekeningDP);
      showSuccess(
        "Tagihan DP berhasil dibuat. Silakan upload bukti pembayaran.",
      );
      await onRefresh();
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
      showSuccess("Bukti berhasil diupload. Menunggu verifikasi admin.");
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

    try {
      await createPayment("PELUNASAN", detail.id, selectedRekeningPelunasan);
      showSuccess(
        "Tagihan pelunasan berhasil dibuat. Silakan upload bukti pembayaran.",
      );
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
      showSuccess("Bukti berhasil diupload. Menunggu verifikasi admin.");
      setFilePelunasan(null);
      await onRefresh();
      onSuccess?.();
    } catch (err: any) {
      showError(err.message || "Gagal upload bukti");
    }
  };

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
      showSuccess(
        "Tagihan full berhasil dibuat! Silakan upload bukti pembayaran Anda.",
      );
      setInitialChoice("FULL");
      await onRefresh();
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
      showSuccess("Bukti berhasil diupload. Menunggu verifikasi admin.");
      setFileFull(null);
      await onRefresh();
      onSuccess?.();
    } catch (err: any) {
      showError(err.message || "Gagal upload bukti");
    }
  };

  const handlePrint = async (type: "DP" | "PELUNASAN" | "FULL") => {
    await downloadReceipt(detail.id, type);
  };

  const dendaPending = detail.pembayaran?.find(
    (p: any) => p.tipe === "DENDA" && p.status === "PENDING",
  );

  const dendaVerified = detail.pembayaran?.find(
    (p: any) => p.tipe === "DENDA" && p.status === "VERIFIED",
  );
  const dendaRejected = detail.pembayaran?.find(
    (p: any) => p.tipe === "DENDA" && p.status === "REJECTED",
  );

  // State untuk denda
  const [selectedRekeningDenda, setSelectedRekeningDenda] = useState("");
  const [fileDenda, setFileDenda] = useState<File | null>(null);

  const handleUploadDenda = async () => {
    if (!dendaPending) return showError("Belum ada tagihan denda");
    if (!fileDenda) return showError("Upload file dulu");

    if (fileDenda.size > 2 * 1024 * 1024) return showError("File maksimal 2MB");
    if (!fileDenda.type.startsWith("image/"))
      return showError("File harus berupa gambar");

    try {
      await uploadProof(dendaPending.id, fileDenda);
      showSuccess("Bukti pembayaran denda berhasil diupload");
      setFileDenda(null);
      await onRefresh();
      onSuccess?.();
    } catch (err: any) {
      showError(err.message || "Gagal upload bukti");
    }
  };

  // =============================
  // COMPUTED VALUES
  // =============================
  const dp = detail.pembayaran?.find((p: any) => p.tipe === "DP");
  const dpState = getPaymentState(dp);
  const pelunasan = detail.pembayaran?.find((p: any) => p.tipe === "PELUNASAN");
  const pelunasanState = getPaymentState(pelunasan);
  const full = detail.pembayaran?.find((p: any) => p.tipe === "FULL");
  const fullState = getPaymentState(full);

  const totalSewa = detail.total_sewa;
  const ongkir =
    detail.biayaDetails?.find((b: any) => b.tipe === "ONGKIR")?.jumlah || 0;
  const depositAmount =
    detail.jaminan_tipe === "DEPOSIT_UANG" ? detail.deposit : 0;
  const totalFull = totalSewa + ongkir + depositAmount;
  const totalDP = detail.nominal_dp + depositAmount + ongkir;

  // Reset state ketika REJECTED
  useEffect(() => {
    if (dpState === "REJECTED") {
      setSelectedRekeningDP("");
      setFileDP(null);
    }
    if (pelunasanState === "REJECTED") {
      setSelectedRekeningPelunasan("");
      setFilePelunasan(null);
    }
    if (fullState === "REJECTED") {
      setSelectedRekeningFull("");
      setFileFull(null);
    }
  }, [dpState, pelunasanState, fullState]);

  // =============================
  // EARLY RETURN - MENUNGGU PERSETUJUAN
  // =============================
  if (
    detail.metode_ambil === "DIANTAR" &&
    detail.status_pinjam === "MENUNGGU_PERSETUJUAN"
  ) {
    return (
      <Card className="p-4">
        <div className="text-yellow-700 font-medium">
          Menunggu persetujuan admin sebelum pembayaran bisa dilakukan
        </div>
      </Card>
    );
  }

  // =============================
  // EARLY RETURN - PILIH METODE
  // =============================
  if (
    detail.status_bayar === "BELUM_BAYAR" &&
    !initialChoice &&
    !dpPending &&
    !fullPending &&
    !hasActiveDP &&
    !hasPaidFull
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

  return (
    <Card className="space-y-6">
      <h3 className="font-bold text-lg">Transaksi</h3>

      <PaymentStatus
        statusBayar={detail.status_bayar}
        nominalDp={detail.nominal_dp}
        sisaTagihan={detail.sisa_tagihan}
        pembayaran={detail.pembayaran}
      />

      <div className="flex gap-2 flex-wrap">
        {!isLunas && hasPaidDP && (
          <Button onClick={() => handlePrint("DP")}>Cetak Struk DP</Button>
        )}
        {isLunas && (
          <Button onClick={() => {
            const lastPayment = detail.pembayaran?.find((p: any) => p.status === 'VERIFIED');
            const receiptType = lastPayment?.tipe === 'FULL' ? 'FULL' : 'PELUNASAN';
            handlePrint(receiptType);
          }}>
            Cetak Struk
          </Button>
        )}
      </div>

      {/* ===================== */}
      {/* SECTION DP */}
      {/* ===================== */}
      {!hasPaidDP &&
        !fullPending &&
        !hasPaidFull &&
        (initialChoice === "DP" || hasActiveDP) && (
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
              {!dpPending && (
                <div className="flex justify-between border-t border-yellow-300 pt-1 font-bold text-base">
                  <span>Total Bayar Sekarang:</span>
                  <span>Rp {totalDP.toLocaleString()}</span>
                </div>
              )}
            </div>

            <p className="text-[10px] text-yellow-700 italic">
              *Uang deposit akan dikembalikan setelah alat kembali dalam kondisi
              baik.
            </p>

            {dpPending && !dp?.bukti_pembayaran ? (
              <>
                <div className="bg-blue-100 p-2 rounded text-sm">
                  ⚠️ Tagihan DP sudah dibuat. Silakan upload bukti pembayaran
                  Anda.
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFileDP(e.target.files?.[0] || null)}
                />
                <Button onClick={handleUploadDP}>Upload Bukti DP</Button>
              </>
            ) : dpPending && dp?.bukti_pembayaran ? (
              <div className="bg-blue-100 p-3 rounded text-blue-700">
                ✅ Bukti sudah diupload. Menunggu verifikasi admin.
              </div>
            ) : (
              <>
                {dpState === "REJECTED" && (
                  <div className="bg-red-100 p-2 rounded text-red-600">
                    ❌ DP ditolak. Silakan pilih rekening dan buat tagihan
                    ulang.
                  </div>
                )}
                <select
                  value={selectedRekeningDP}
                  onChange={(e) => setSelectedRekeningDP(e.target.value)}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Pilih rekening tujuan</option>
                  {rekeningList.map((rek) => (
                    <option key={rek.id} value={rek.id}>
                      {rek.nama} - {rek.nomor} (a.n. {rek.atas_nama})
                    </option>
                  ))}
                </select>
                <Button onClick={handleCreateDP}>Buat Tagihan DP</Button>
              </>
            )}
          </div>
        )}

      {/* ===================== */}
      {/* SECTION PELUNASAN */}
      {/* ===================== */}
      {hasPaidDP && !hasPaidPelunasan && !hasPaidFull && (
        <div className="border p-4 rounded bg-blue-50 space-y-3">
          <h4 className="font-semibold">Pelunasan</h4>

          {pelunasanPending && !pelunasan?.bukti_pembayaran ? (
            <>
              <div className="bg-blue-100 p-2 rounded text-sm">
                ⚠️ Tagihan pelunasan sudah dibuat. Silakan upload bukti
                pembayaran Anda.
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFilePelunasan(e.target.files?.[0] || null)}
              />
              <Button onClick={handleUploadPelunasan}>
                Upload Bukti Pelunasan
              </Button>
            </>
          ) : pelunasanPending && pelunasan?.bukti_pembayaran ? (
            <div className="bg-blue-100 p-3 rounded text-blue-700">
              ✅ Bukti sudah diupload. Menunggu verifikasi admin.
            </div>
          ) : (
            <>
              {pelunasanState === "REJECTED" && (
                <div className="bg-red-100 p-2 rounded text-red-600">
                  ❌ Pelunasan ditolak. Silakan pilih rekening dan buat tagihan
                  ulang.
                </div>
              )}
              <select
                value={selectedRekeningPelunasan}
                onChange={(e) => setSelectedRekeningPelunasan(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="">Pilih rekening tujuan</option>
                {rekeningList.map((rek) => (
                  <option key={rek.id} value={rek.id}>
                    {rek.nama} - {rek.nomor} (a.n. {rek.atas_nama})
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
      {(initialChoice === "FULL" || fullPending) && !hasPaidFull && (
        <div className="border p-4 rounded bg-green-50 space-y-3">
          <h4 className="font-semibold">Pembayaran Full</h4>

          {fullPending ? (
            !full?.bukti_pembayaran ? (
              <>
                <div className="bg-yellow-100 p-2 rounded text-sm">
                  ⚠️ Tagihan full sudah dibuat. Silakan upload bukti pembayaran
                  Anda.
                </div>
                {fileFull && (
                  <div className="text-sm text-green-600">
                    File siap upload: {fileFull.name}
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFileFull(e.target.files?.[0] || null)}
                  className="border p-2 rounded"
                />
                <Button onClick={handleUploadFull} disabled={!fileFull}>
                  Upload Bukti Full
                </Button>
                <div className="text-xs text-gray-500">
                  ℹ️ Setelah upload, admin akan memverifikasi pembayaran Anda.
                </div>
              </>
            ) : (
              <div className="bg-blue-100 p-3 rounded text-blue-700">
                ✅ Bukti sudah diupload. Menunggu verifikasi admin.
              </div>
            )
          ) : (
            <>
              {fullState === "REJECTED" && (
                <div className="bg-red-100 p-2 rounded text-red-600">
                  ❌ Pembayaran ditolak. Silakan pilih rekening dan buat tagihan
                  ulang.
                </div>
              )}

              <div className="space-y-1 text-sm bg-white p-2 rounded">
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
                <option value="">Pilih rekening tujuan</option>
                {rekeningList.map((rek) => (
                  <option key={rek.id} value={rek.id}>
                    {rek.nama} - {rek.nomor} (a.n. {rek.atas_nama})
                  </option>
                ))}
              </select>

              <Button
                onClick={handleCreateFull}
                disabled={!selectedRekeningFull}
              >
                Buat Tagihan Full
              </Button>

              <div className="text-xs text-gray-500 mt-2">
                ℹ️ Setelah membuat tagihan, Anda akan diminta untuk upload bukti
                pembayaran.
              </div>
            </>
          )}
        </div>
      )}
      {/* ===================== */}
      {/* SECTION DENDA */}
      {/* ===================== */}
      {detail.status_pinjam === "SELESAI" && detail.total_denda > 0 && (
        <div className="border-t pt-4 mt-4">
          {dendaPending && !dendaVerified && (
            <div className="border p-4 rounded bg-red-50 space-y-3">
              <h4 className="font-semibold text-red-900 flex items-center gap-2">
                <span className="text-xl">⚠️</span> Tagihan Denda
              </h4>

              <div className="bg-white p-3 rounded space-y-2">
                <p className="text-sm text-gray-600">
                  Terdapat denda yang harus dibayar:
                </p>

                {/* Detail denda dari biayaDetails */}
                {detail.biayaDetails
                  ?.filter((b: any) => b.tipe === "DENDA")
                  .map((denda: any, idx: number) => (
                    <div
                      key={idx}
                      className="text-sm border-l-4 border-red-400 pl-3"
                    >
                      <p className="font-medium">{denda.label}</p>
                      <p className="text-red-600 font-semibold">
                        Rp {denda.jumlah.toLocaleString()}
                      </p>
                    </div>
                  ))}

                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total Denda:</span>
                    <span className="text-red-600">
                      Rp {(detail.total_denda || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {!dendaPending?.bukti_pembayaran ? (
                <>
                  <div className="bg-yellow-100 p-2 rounded text-sm">
                    ⚠️ Silakan transfer ke rekening di bawah dan upload bukti
                    pembayaran
                  </div>

                  <select
                    value={selectedRekeningDenda}
                    onChange={(e) => setSelectedRekeningDenda(e.target.value)}
                    className="w-full border p-2 rounded"
                  >
                    <option value="">Pilih rekening tujuan</option>
                    {rekeningList.map((rek) => (
                      <option key={rek.id} value={rek.id}>
                        {rek.nama} - {rek.nomor} (a.n. {rek.atas_nama})
                      </option>
                    ))}
                  </select>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFileDenda(e.target.files?.[0] || null)}
                    className="border p-2 rounded w-full"
                  />

                  <Button
                    onClick={handleUploadDenda}
                    disabled={!selectedRekeningDenda || !fileDenda || loading}
                    className="w-full"
                  >
                    {loading ? "Memproses..." : "Upload Bukti Pembayaran Denda"}
                  </Button>

                  <p className="text-xs text-gray-500">
                    *Jaminan akan dikembalikan setelah pembayaran denda
                    diverifikasi
                  </p>
                </>
              ) : (
                <div className="bg-blue-100 p-3 rounded text-blue-700">
                  ✅ Bukti pembayaran denda sudah diupload. Menunggu verifikasi
                  admin.
                </div>
              )}
            </div>
          )}

          {dendaVerified && (
            <div className="border p-4 rounded bg-green-50">
              <h4 className="font-semibold text-green-900 flex items-center gap-2">
                <span>✅</span> Denda Lunas
              </h4>
              <p className="text-sm text-green-700 mt-1">
                Pembayaran denda telah diverifikasi.
                {detail.jaminan_tipe !== "DEPOSIT_UANG" &&
                  " Silakan hubungi petugas untuk pengembalian jaminan."}
              </p>
              {detail.jaminan_status === "DIKEMBALIKAN" && (
                <p className="text-sm text-green-600 mt-2 font-medium">
                  🎉 Jaminan sudah dikembalikan
                </p>
              )}
            </div>
          )}

          {dendaRejected && (
            <div className="border p-4 rounded bg-red-50">
              <h4 className="font-semibold text-red-900">
                ❌ Pembayaran Denda Ditolak
              </h4>
              <p className="text-sm text-red-700 mt-1">
                Bukti pembayaran ditolak. Silakan upload ulang dengan bukti yang
                benar.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Alasan: {dendaRejected.keterangan_ditolak || "Tidak disebutkan"}
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
