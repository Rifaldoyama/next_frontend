"use client";

import { useEffect } from "react";
import { usePeminjamanData, Peminjaman } from "@/hooks/peminjaman/usePeminjamanData";
import { Badge } from "@/components/atoms/Badge";
import { Card } from "@/components/atoms/Card";
import { 
  Package, 
  Calendar, 
  MapPin, 
  Wallet, 
  ChevronRight, 
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Truck
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

const statusConfig = {
  MENUNGGU_PERSETUJUAN: { label: "Menunggu", color: "yellow", icon: Clock },
  SIAP_DIPROSES: { label: "Siap Diproses", color: "blue", icon: Package },
  DIPROSES: { label: "Diproses", color: "blue", icon: Truck },
  DIPAKAI: { label: "Sedang Digunakan", color: "green", icon: CheckCircle2 },
  SELESAI: { label: "Selesai", color: "gray", icon: CheckCircle2 },
  DITOLAK: { label: "Ditolak", color: "red", icon: XCircle },
};

export default function MyPeminjamanPage() {
  const { data, loading, error, fetchHistory } = usePeminjamanData();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  if (loading && data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium">Memuat riwayat peminjaman...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex flex-col items-center text-center gap-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <div>
            <h3 className="text-lg font-bold text-red-800">Oops! Terjadi Kesalahan</h3>
            <p className="text-red-600">{error}</p>
          </div>
          <button 
            onClick={() => fetchHistory()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Peminjaman Saya</h1>
          <p className="text-gray-500">Pantau status dan riwayat transaksi peminjaman alat event Anda.</p>
        </div>
      </div>

      {data.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <Package className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Peminjaman</h3>
          <p className="text-gray-500 mb-8 max-w-sm">
            Anda belum memiliki riwayat peminjaman. Mulai sewa alat event sekarang!
          </p>
          <Link 
            href="/dashboard/katalog" 
            className="px-8 py-3 bg-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all hover:scale-105"
          >
            Lihat Katalog
          </Link>
        </Card>
      ) : (
        <div className="grid gap-6">
          {data.map((item: Peminjaman) => {
            const config = statusConfig[item.status_pinjam as keyof typeof statusConfig] || statusConfig.MENUNGGU_PERSETUJUAN;
            const StatusIcon = config.icon;

            return (
              <Card key={item.id} className="hover:shadow-lg transition-all border-none ring-1 ring-gray-100 group">
                <Link href={`/dashboard/peminjaman/${item.id}`} className="block">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Status & Date Info */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <Badge color={config.color as any} className="flex items-center gap-1.5">
                          <StatusIcon className="w-3 h-3" />
                          {config.label}
                        </Badge>
                        <span className="text-sm text-gray-400">
                          ID: #{item.id.slice(0, 8).toUpperCase()}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-y-4 gap-x-8">
                        <div className="flex items-center gap-3 text-gray-600">
                          <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-orange-500" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 uppercase font-semibold">Periode Sewa</p>
                            <p className="text-sm font-medium">
                              {new Date(item.tanggal_mulai).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })} - {new Date(item.tanggal_selesai).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-gray-600">
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-blue-500" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 uppercase font-semibold">Metode Pengambilan</p>
                            <p className="text-sm font-medium">{item.metode_ambil === "DIANTAR" ? "Diantar ke Alamat" : "Ambil Sendiri"}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-gray-600">
                          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-green-500" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 uppercase font-semibold">Total Pembayaran</p>
                            <p className="text-sm font-bold text-gray-900">{formatCurrency(item.total_biaya)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Item Preview */}
                      <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center -space-x-3 overflow-hidden">
                          {item.items.slice(0, 4).map((subItem, idx) => (
                            <div 
                              key={idx} 
                              className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 overflow-hidden"
                              title={subItem.barang?.nama || "Item"}
                            >
                               {subItem.barang?.gambar ? (
                                 <img src={subItem.barang.gambar} alt={subItem.barang.nama} className="w-full h-full object-cover" />
                               ) : (
                                 <span>{subItem.barang?.nama.charAt(0)}</span>
                               )}
                            </div>
                          ))}
                          {item.items.length > 4 && (
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                              +{item.items.length - 4}
                            </div>
                          )}
                          <span className="ml-5 text-sm text-gray-500 font-medium">
                            {item.items.length} item peralatan
                          </span>
                        </div>
                        
                        <div className="flex items-center text-orange-500 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                          Detail Transaksi
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
