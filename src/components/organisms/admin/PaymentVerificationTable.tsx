"use client";

import { useState } from "react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Buttons";
import { Modal } from "@/components/atoms/Modal";

export function PaymentVerificationTable({
  payments,
  onVerify,
  onReject,
}: any) {
  const [selected, setSelected] = useState<any>(null);

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val || 0);

  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL;

  const handleVerify = () => {
    if (selected) {
      onVerify(selected.id);
      setSelected(null);
    }
  };

  const handleReject = () => {
    if (selected) {
      onReject(selected.id);
      setSelected(null);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "PENDING") return <Badge color="yellow">Menunggu</Badge>;

    if (status === "VERIFIED")
      return <Badge color="green">Terverifikasi</Badge>;

    if (status === "REJECTED") return <Badge color="red">Ditolak</Badge>;

    return null;
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full bg-white border rounded-lg">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-bold text-gray-600 uppercase">
              <th className="p-4">Tanggal</th>
              <th className="p-4">User</th>
              <th className="p-4">Tipe</th>
              <th className="p-4">Jumlah</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {payments?.map((p: any) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="p-4 text-sm">
                  {new Date(p.createdAt).toLocaleDateString("id-ID")}
                </td>

                <td className="p-4">
                  <p className="font-bold text-sm">
                    {p.peminjaman?.user?.username}
                  </p>
                  <p className="text-xs text-gray-500">
                    {p.peminjaman?.user?.email}
                  </p>
                </td>

                <td className="p-4">
                  <Badge color={p.tipe === "DP" ? "gray" : "blue"}>
                    {p.tipe}
                  </Badge>
                </td>

                <td className="p-4 font-bold text-blue-600">
                  {formatRupiah(p.jumlah || 0)}
                </td>

                {/* STATUS BADGE */}
                <td className="p-4">{getStatusBadge(p.status)}</td>

                {/* AKSI */}
                <td className="p-4 text-center">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setSelected(p)}
                  >
                    Review
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <Modal open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div className="flex flex-col md:flex-row gap-6 max-w-4xl w-full">
            {/* IMAGE */}
            <div className="md:w-1/2">
              <h4 className="font-bold mb-2">Bukti Transfer</h4>

              <div className="bg-gray-100 rounded-lg border flex items-center justify-center min-h-[300px]">
                {selected.bukti_url || selected.bukti_pembayaran ? (
                  <img
                    src={
                      selected.bukti_url ||
                      `${IMAGE_BASE_URL}${selected.bukti_pembayaran}`
                    }
                    className="max-h-[500px]"
                    alt="bukti"
                  />
                ) : (
                  <span className="text-gray-400">Tidak ada bukti</span>
                )}
              </div>
            </div>

            {/* INFO */}
            <div className="md:w-1/2 space-y-4">
              <h4 className="font-bold text-lg border-b pb-2">
                Detail Transaksi
              </h4>

              {/* INFO - GANTI DENGAN INI */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span>Total Sewa:</span>
                <span className="font-bold">
                  {formatRupiah(selected.peminjaman?.total_sewa)}
                </span>

                <span>Ongkir:</span>
                <span className="font-bold">
                  {formatRupiah(
                    selected.peminjaman?.biayaDetails?.find(
                      (b: any) => b.tipe === "ONGKIR",
                    )?.jumlah || 0,
                  )}
                </span>

                <span>Deposit:</span>
                <span className="font-bold text-amber-500">
                  {formatRupiah(selected.peminjaman?.deposit)}
                </span>

                <span>Total Tagihan:</span>
                <span className="font-bold text-blue-600">
                  {formatRupiah(selected.peminjaman?.total_tagihan)}
                </span>

                <span>Total Biaya:</span>
                <span className="font-bold text-gray-600">
                  {formatRupiah(selected.peminjaman?.total_biaya)}
                </span>

                <span>Dibayarkan:</span>
                <span className="font-bold text-green-600">
                  {formatRupiah(selected.jumlah)}
                </span>

                <span>Rekening:</span>
                <span>
                  {selected.rekeningTujuan?.nama} (
                  {selected.rekeningTujuan?.nomor})
                </span>

                <span>Status:</span>
                <span>{getStatusBadge(selected.status)}</span>
              </div>

              {/* Tampilkan breakdown allocation */}
              {selected.allocations && selected.allocations.length > 0 && (
                <div className="border-t pt-2 mt-2">
                  <p className="text-xs text-gray-500 mb-1">
                    Alokasi Pembayaran:
                  </p>
                  {selected.allocations.map((alloc: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span>{alloc.tipe}:</span>
                      <span className="font-medium">
                        {formatRupiah(alloc.jumlah)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* ONLY SHOW BUTTON IF PENDING */}
              {selected.status === "PENDING" && (
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={handleVerify}
                  >
                    Verifikasi
                  </Button>

                  <Button variant="danger" onClick={handleReject}>
                    Tolak
                  </Button>
                </div>
              )}

              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setSelected(null)}
              >
                Tutup
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
