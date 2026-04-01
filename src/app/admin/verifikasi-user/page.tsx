"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api"; 
import { Check, X, Eye, UserCheck, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/atoms/Buttons";

// --- INTERFACES ---
interface UserDetail {
  nama_lengkap: string;
  no_hp: string;
  alamat: string;
  no_ktp: string | null;
  foto_ktp: string | null;
  verification_status: "UNVERIFIED" | "PENDING" | "APPROVED" | "REJECTED";
}

interface User {
  id: string;
  email: string;
  username: string;
  detail: UserDetail | null;
}

export default function VerifikasiUserPage() {
  // --- STATES ---
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<string>("PENDING");
  const [loading, setLoading] = useState<boolean>(true);

  // States untuk Modal Detail
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- API CALLS ---
  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Gunakan prefix /api sesuai dengan setGlobalPrefix di NestJS
      const data = await apiFetch(`/admin/users?status=${filter}`);
      setUsers(data);
    } catch (err: any) {
      console.error("Fetch Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const handleAction = async (userId: string, status: string) => {
    if (!confirm(`Yakin ingin mengubah status ke ${status}?`)) return;
    try {
      await apiFetch("/admin/users/action", {
        method: "PATCH",
        body: JSON.stringify({ userId, status }),
      });
      setIsModalOpen(false); // Tutup modal jika sedang terbuka
      fetchUsers(); // Refresh data tabel
    } catch (err: any) {
      alert("Gagal memproses verifikasi: " + err.message);
    }
  };

  const handleShowDetail = async (id: string) => {
    try {
      const data = await apiFetch(`/admin/users/${id}`);
      setSelectedUser(data);
      setIsModalOpen(true);
    } catch (err: any) {
      alert("Gagal mengambil detail user");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <UserCheck className="text-blue-600" /> Verifikasi User
          </h1>
          <p className="text-sm text-gray-500">
            Kelola persetujuan identitas pelanggan
          </p>
        </div>

        <div className="flex gap-2 bg-white p-1 rounded-lg border shadow-sm">
          {["PENDING", "APPROVED", "REJECTED"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                filter === s
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Tabel User */}
      <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-700">
                Identitas User
              </th>
              <th className="px-6 py-4 font-semibold text-gray-700">Kontak</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-center">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-10 text-center text-blue-600 animate-pulse"
                >
                  Memuat data...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-10 text-center text-gray-400 italic"
                >
                  Tidak ada user dengan status {filter}
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">
                      {user.detail?.nama_lengkap || "Tanpa Nama"}
                    </div>
                    <div className="text-xs text-gray-500">
                      @{user.username}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Mail className="w-3 h-3" /> {user.email}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Phone className="w-3 h-3" />{" "}
                        {user.detail?.no_hp || "-"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                        user.detail?.verification_status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : user.detail?.verification_status === "REJECTED"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {user.detail?.verification_status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <Button
                        onClick={() => handleShowDetail(user.id)}
                        className="bg-blue-500 hover:bg-blue-400 text-white p-2 h-auto rounded-md border"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      {filter === "PENDING" && (
                        <>
                          <Button
                            onClick={() => handleAction(user.id, "APPROVED")}
                            className="bg-green-600 hover:bg-green-700 p-2 h-auto rounded-md shadow-sm"
                          >
                            <Check className="w-4 h-4 text-white" />
                          </Button>
                          <Button
                            onClick={() => handleAction(user.id, "REJECTED")}
                            className="bg-red-600 hover:bg-red-700 p-2 h-auto rounded-md shadow-sm"
                          >
                            <X className="w-4 h-4 text-white" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- MODAL DETAIL USER --- */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-800">
                Detail Identitas Pelanggan
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Info Dasar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <DetailItem
                    label="Nama Lengkap"
                    value={selectedUser.detail?.nama_lengkap}
                    icon={<UserCheck className="w-4 h-4" />}
                  />
                  <DetailItem
                    label="Nomor KTP"
                    value={selectedUser.detail?.no_ktp || "Belum diisi"}
                  />
                  <DetailItem
                    label="Alamat Tinggal"
                    value={selectedUser.detail?.alamat}
                    icon={<MapPin className="w-4 h-4" />}
                  />
                </div>

                {/* Bagian Foto KTP */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                    Dokumen KTP
                  </label>
                  <div className="border-2 border-dashed rounded-xl overflow-hidden bg-gray-50 aspect-[3/2] flex items-center justify-center relative group">
                    {selectedUser.detail?.foto_ktp ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${selectedUser.detail.foto_ktp}`}
                        alt="Foto KTP"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <p className="text-gray-400 text-xs">
                          Foto KTP tidak tersedia
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Modal / Action */}
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
              <Button
                onClick={() => setIsModalOpen(false)}
                className="bg-white border text-gray-600 hover:bg-gray-100"
              >
                Tutup
              </Button>
              {selectedUser.detail?.verification_status === "PENDING" && (
                <>
                  <Button
                    onClick={() => handleAction(selectedUser.id, "REJECTED")}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Tolak Verifikasi
                  </Button>
                  <Button
                    onClick={() => handleAction(selectedUser.id, "APPROVED")}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Setujui & Verifikasi
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Komponen Kecil untuk Detail Item
function DetailItem({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
        {label}
      </label>
      <div className="flex items-center gap-2 text-gray-700 font-medium bg-gray-50 p-2 rounded-lg border border-gray-100">
        {icon && <span className="text-blue-500">{icon}</span>}
        <span className="text-sm">{value || "-"}</span>
      </div>
    </div>
  );
}
