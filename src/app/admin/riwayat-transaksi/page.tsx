"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Package,
  Users,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface Transaction {
  id: string;
  invoiceNumber: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  dates: {
    start: string;
    end: string;
    createdAt: string;
  };
  financials: {
    totalBiaya: number;
    paid: number;
    remaining: number;
    paymentHistory: Array<any>;
  };
  status: {
    peminjaman: string;
    pembayaran: string;
  };
}

export default function RiwayatTransaksiPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    startDate: "",
    endDate: "",
    page: 1,
    limit: 10,
  });
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append("search", filters.search);
      if (filters.status) queryParams.append("status", filters.status);
      if (filters.startDate) queryParams.append("startDate", filters.startDate);
      if (filters.endDate) queryParams.append("endDate", filters.endDate);
      queryParams.append("page", filters.page.toString());
      queryParams.append("limit", filters.limit.toString());

      const [transactionsRes, statsRes, logsRes] = await Promise.all([
        apiFetch(`/admin/riwayat-transaksi?${queryParams.toString()}`),
        apiFetch("/admin/riwayat-transaksi/stats"),
        apiFetch("/admin/riwayat-transaksi/logs"),
      ]);

      setTransactions(transactionsRes.data);
      setMeta(transactionsRes.meta);
      setStats(statsRes);
      setLogs(logsRes);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setError(error instanceof Error ? error.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (id: string) => {
    try {
      const data = await apiFetch(`/admin/riwayat-transaksi/${id}`);
      setSelectedTransaction(data);
      setShowDetailModal(true);
    } catch (error) {
      console.error("Failed to fetch transaction detail:", error);
      alert("Gagal memuat detail transaksi");
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      MENUNGGU_PERSETUJUAN: "bg-yellow-100 text-yellow-800",
      SIAP_DIPROSES: "bg-indigo-100 text-indigo-800",
      DIPROSES: "bg-blue-100 text-blue-800",
      DIPAKAI: "bg-purple-100 text-purple-800",
      SELESAI: "bg-green-100 text-green-800",
      DITOLAK: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      MENUNGGU_PERSETUJUAN: "Menunggu Persetujuan",
      SIAP_DIPROSES: "Siap Diproses",
      DIPROSES: "Diproses",
      DIPAKAI: "Dipinjam",
      SELESAI: "Selesai",
      DITOLAK: "Ditolak",
    };
    return statusMap[status] || status;
  };

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString("id-ID")}`;
  };

  const handleDownload = async () => {
    const queryParams = new URLSearchParams();

    if (filters.search) queryParams.append("search", filters.search);
    if (filters.status) queryParams.append("status", filters.status);
    if (filters.startDate) queryParams.append("startDate", filters.startDate);
    if (filters.endDate) queryParams.append("endDate", filters.endDate);

    const token = localStorage.getItem("token"); // atau dari store

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/riwayat-transaksi/export/excel?${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Riwayat Transaksi
          </h1>
          <p className="text-gray-500 mt-1">
            Kelola dan lihat semua transaksi peminjaman
          </p>
        </div>
        <button
          onClick={() => fetchData()}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600">
          Error: {error}
        </div>
      )}

      {/* Stats Cards */}
      {stats && !error && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Transaksi</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Pendapatan</p>
                <p className="text-2xl font-bold text-gray-800">
                  {formatCurrency(stats.revenue / 1000000)}M
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Rata-rata Transaksi</p>
                <p className="text-2xl font-bold text-gray-800">
                  {formatCurrency(stats.average / 1000)}K
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Status Aktif</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.statusBreakdown
                    ?.filter(
                      (s: any) =>
                        s.status_pinjam !== "SELESAI" &&
                        s.status_pinjam !== "DITOLAK",
                    )
                    .reduce((acc: number, s: any) => acc + s._count, 0) || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari transaksi..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value, page: 1 })
              }
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filters.status}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value, page: 1 })
            }
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Semua Status</option>
            <option value="MENUNGGU_PERSETUJUAN">Menunggu Persetujuan</option>
            <option value="SIAP_DIPROSES">Siap Diproses</option>
            <option value="DIPROSES">Diproses</option>
            <option value="DIPAKAI">Dipinjam</option>
            <option value="SELESAI">Selesai</option>
            <option value="DITOLAK">Ditolak</option>
          </select>

          <input
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value, page: 1 })
            }
            className="px-3 py-2 border border-gray-300 rounded-lg"
          />

          <input
            type="date"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value, page: 1 })
            }
            className="px-3 py-2 border border-gray-300 rounded-lg"
          />

          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-green-600 text-white rounded-lg whitespace-nowrap"
          >
            Download CSV
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Invoice
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  User
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Items
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Tanggal
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Tidak ada transaksi ditemukan
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {tx.invoiceNumber}
                      </div>
                      <div className="text-xs text-gray-500">
                        {tx.id.slice(0, 8)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {tx.user.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {tx.user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {tx.items.length} item(s)
                      </div>
                      <div className="text-xs text-gray-500">
                        {tx.items
                          .slice(0, 2)
                          .map((i) => i.name)
                          .join(", ")}
                        {tx.items.length > 2 && "..."}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(tx.financials.totalBiaya)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Dibayar: {formatCurrency(tx.financials.paid)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(tx.status.peminjaman)}`}
                      >
                        {formatStatus(tx.status.peminjaman)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {format(new Date(tx.dates.createdAt), "dd MMM yyyy", {
                        locale: id,
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewDetail(tx.id)}
                        className="text-blue-600 hover:text-blue-800 transition"
                        title="Lihat detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
              disabled={filters.page === 1}
              className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600">
              Halaman {filters.page} dari {meta.totalPages}
            </span>
            <button
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              disabled={filters.page === meta.totalPages}
              className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Activity Logs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Activity Logs</h3>
          <p className="text-sm text-gray-500 mt-1">
            Real-time system activities
          </p>
        </div>
        <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              Belum ada aktivitas
            </div>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} className="px-6 py-3 hover:bg-gray-50">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 mt-2 rounded-full ${
                      log.type === "PEMINJAMAN"
                        ? "bg-blue-500"
                        : log.type === "PEMBAYARAN"
                          ? "bg-green-500"
                          : "bg-purple-500"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {log.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        {format(new Date(log.timestamp), "dd MMM yyyy HH:mm", {
                          locale: id,
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{log.action}</p>
                    <p className="text-xs text-gray-400 mt-1">By: {log.user}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                Detail Transaksi - {selectedTransaction.invoiceNumber}
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <pre className="text-xs bg-gray-50 p-4 rounded-lg overflow-auto">
                {JSON.stringify(selectedTransaction, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
