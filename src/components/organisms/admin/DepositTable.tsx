"use client";

import { useState } from "react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Buttons";
import { Modal } from "@/components/atoms/Modal";
import { formatRupiah } from "@/lib/format";

interface DepositTableProps {
  data: any[];
  onKembalikan: (id: string) => Promise<void>;
  isProcessing: boolean;
}

export function DepositTable({
  data,
  onKembalikan,
  isProcessing,
}: DepositTableProps) {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleKembalikanClick = (item: any) => {
    setSelectedItem(item);
    setShowConfirmModal(true);
  };

  const handleDetailClick = (item: any) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const handleConfirmKembalikan = async () => {
    if (selectedItem) {
      await onKembalikan(selectedItem.id);
      setShowConfirmModal(false);
      setSelectedItem(null);
    }
  };

  const calculateDepositKembali = (item: any) => {
    return Math.max(0, (item.deposit || 0) - (item.total_denda || 0));
  };

  // ✅ Untuk deposit, tidak perlu cek denda pending karena langsung dipotong
  const canReturn = (item: any) => {
    if (item.deposit_dikembalikan) return false;
    if (item.status_pinjam !== "SELESAI") return false;

    // Deposit selalu bisa dikembalikan (denda sudah otomatis terpotong)
    return true;
  };

  // Cek apakah ada info rekening
  const hasRekeningInfo = (item: any) => {
    return (
      item.nama_rekening_pengembalian &&
      item.bank_pengembalian &&
      item.nomor_rekening_pengembalian
    );
  };

  return (
    <>
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Customer
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Tgl Selesai
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Deposit
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Denda
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Kembali
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="p-4 text-center text-sm font-semibold text-gray-600">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.map((item: any) => {
                const depositKembali = calculateDepositKembali(item);
                const canReturnItem = canReturn(item);
                const hasRekening = hasRekeningInfo(item);

                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <p className="font-medium">
                        {item.user?.username || "-"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.user?.email || "-"}
                      </p>
                    </td>
                    <td className="p-4 text-sm">
                      {item.tanggal_selesai
                        ? new Date(item.tanggal_selesai).toLocaleDateString(
                            "id-ID",
                          )
                        : "-"}
                    </td>
                    <td className="p-4 font-medium">
                      {formatRupiah(item.deposit || 0)}
                    </td>
                    <td className="p-4">
                      <span
                        className={
                          (item.total_denda || 0) > 0
                            ? "text-red-600 font-medium"
                            : "text-gray-500"
                        }
                      >
                        {formatRupiah(item.total_denda || 0)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-green-600">
                        {item.deposit_dikembalikan
                          ? formatRupiah(item.deposit_kembali || 0)
                          : formatRupiah(depositKembali)}
                      </span>
                    </td>
                    <td className="p-4">
                      {item.deposit_dikembalikan ? (
                        <Badge color="green">Sudah Dikembalikan</Badge>
                      ) : !hasRekening ? (
                        <Badge color="red">Butuh Info Rekening</Badge>
                      ) : canReturnItem ? (
                        <Badge color="blue">Siap Dikembalikan</Badge>
                      ) : (
                        <Badge color="gray">-</Badge>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleDetailClick(item)}
                        >
                          Detail
                        </Button>
                        {canReturnItem && hasRekening && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleKembalikanClick(item)}
                            disabled={isProcessing}
                          >
                            Kembalikan
                          </Button>
                        )}
                      </div>
                      {item.deposit_dikembalikan && (
                        <span className="text-xs text-gray-500 block mt-1">
                          Selesai
                        </span>
                      )}
                      {!hasRekening && !item.deposit_dikembalikan && (
                        <span className="text-xs text-red-500 block mt-1">
                          Rekening belum diisi
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail (Rekening Info) */}
      <Modal open={showDetailModal} onClose={() => setShowDetailModal(false)}>
        {selectedItem && (
          <div className="p-6 max-w-md">
            <h3 className="text-lg font-bold mb-4">
              Detail Pengembalian Deposit
            </h3>

            <div className="space-y-4">
              {/* Info Customer */}
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Customer
                </p>
                <p className="font-medium">{selectedItem.user?.username}</p>
                <p className="text-sm text-gray-600">
                  {selectedItem.user?.email}
                </p>
              </div>

              {/* Info Deposit */}
              <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Deposit Awal:</span>
                  <span className="font-medium">
                    {formatRupiah(selectedItem.deposit || 0)}
                  </span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Total Denda:</span>
                  <span>- {formatRupiah(selectedItem.total_denda || 0)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Deposit Dikembalikan:</span>
                  <span className="text-green-600">
                    {formatRupiah(calculateDepositKembali(selectedItem))}
                  </span>
                </div>
              </div>

              {/* Info Rekening Tujuan */}
              <div className="border-t pt-3">
                <p className="text-sm font-medium text-gray-500 mb-2">
                  Rekening Tujuan Transfer
                </p>
                {hasRekeningInfo(selectedItem) ? (
                  <div className="bg-blue-50 p-3 rounded-lg space-y-1">
                    <p>
                      <span className="text-gray-600">Nama:</span>{" "}
                      {selectedItem.nama_rekening_pengembalian}
                    </p>
                    <p>
                      <span className="text-gray-600">Bank:</span>{" "}
                      {selectedItem.bank_pengembalian}
                    </p>
                    <p>
                      <span className="text-gray-600">Nomor Rekening:</span>{" "}
                      <span className="font-mono font-medium">
                        {selectedItem.nomor_rekening_pengembalian}
                      </span>
                    </p>
                  </div>
                ) : (
                  <div className="bg-yellow-50 p-3 rounded-lg text-yellow-700">
                    ⚠️ Customer belum mengisi informasi rekening untuk
                    pengembalian deposit.
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="border-t pt-3">
                <p className="text-sm font-medium text-gray-500 mb-2">Status</p>
                <div>
                  {selectedItem.deposit_dikembalikan ? (
                    <Badge color="green">Sudah Dikembalikan</Badge>
                  ) : (
                    <Badge color="blue">Menunggu Pengembalian</Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setShowDetailModal(false)}
              >
                Tutup
              </Button>
              {canReturn(selectedItem) && hasRekeningInfo(selectedItem) && (
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => {
                    setShowDetailModal(false);
                    handleKembalikanClick(selectedItem);
                  }}
                >
                  Proses Kembalikan
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Konfirmasi Pengembalian */}
      <Modal open={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
        {selectedItem && (
          <div className="p-6 max-w-md">
            <h3 className="text-lg font-bold mb-4">
              Konfirmasi Pengembalian Deposit
            </h3>

            <div className="space-y-3 mb-4 bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between">
                <span className="text-gray-600">Customer:</span>
                <span className="font-medium">
                  {selectedItem.user?.username}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Deposit Awal:</span>
                <span className="font-medium">
                  {formatRupiah(selectedItem.deposit || 0)}
                </span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Total Denda:</span>
                <span>- {formatRupiah(selectedItem.total_denda || 0)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold">
                <span>Deposit Dikembalikan:</span>
                <span className="text-green-600">
                  {formatRupiah(calculateDepositKembali(selectedItem))}
                </span>
              </div>
            </div>

            {/* Info Rekening di Konfirmasi */}
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium mb-1">Transfer ke:</p>
              <p className="text-sm">
                {selectedItem.nama_rekening_pengembalian}
              </p>
              <p className="text-sm">{selectedItem.bank_pengembalian}</p>
              <p className="font-mono text-sm font-medium">
                {selectedItem.nomor_rekening_pengembalian}
              </p>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Pastikan Anda sudah mentransfer ke rekening di atas. Klik "Ya,
              Kembalikan" untuk mencatat pengembalian deposit.
            </p>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setShowConfirmModal(false)}
              >
                Batal
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleConfirmKembalikan}
                disabled={isProcessing}
              >
                {isProcessing ? "Memproses..." : "Ya, Kembalikan"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
