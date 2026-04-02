"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useDashboardStore } from "@/store/dashboardStore";
import { Header } from "@/components/molecules/Header";
import { useDashboard } from "@/hooks/useDashboard";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useVerification } from "@/hooks/useVerification";
import { Modal } from "@/components/atoms/Modal";
import { DecisionModal } from "@/components/molecules/DecisionModal";
import { SewaForm } from "@/components/organisms/SewaForm";

interface HeaderProps {
  userName?: string;
  onLogout: () => void;
  isLoggedIn: boolean;
}

export default function KategoriDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDecisionModal, setShowDecisionModal] = useState(false);

  // Props untuk header - sesuaikan dengan data autentikasi Anda
  const headerProps: HeaderProps = {
    userName: "User", // Ganti dengan data user sesungguhnya
    onLogout: () => console.log("Logout clicked"), // Ganti dengan fungsi logout sesungguhnya
    isLoggedIn: true, // Ganti dengan state login sesungguhnya
  };

  const {
    activeKategori,
    kategoriItems,
    fetchKategoriById,
    fetchKategoriList,
    kategoriList,
    fetchBarangByKategori,
    loading,
  } = useDashboardStore();

  const router = useRouter();
  const {
    user,
    isLoggedIn,
    logout,
    helpNumber,
    recommendedPackages,
    categories,
  } = useDashboard();

  const {
    isVerified,
    isPending,
    isRejected,
    loading: verifying,
  } = useVerification();

  useEffect(() => {
    if (!id) return;

    fetchKategoriById(id);
    fetchBarangByKategori(id);
  }, [id]);

  useEffect(() => {
    fetchKategoriList();
  }, []);

  const handleAuthAction = () => {
    if (isLoggedIn) {
      logout();
      router.replace("/");
    } else {
      router.push("/login");
    }
  };

  // Loading state untuk seluruh halaman
  if (loading && !activeKategori) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header {...headerProps} />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="border rounded-md p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!activeKategori) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header {...headerProps} />
        <div className="container mx-auto px-4 py-8">
          <p className="text-gray-500">Kategori tidak ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - sesuai contoh pertama */}
      <Header
        userName={user?.username || "Tamu"}
        // Ubah label tombol di Header berdasarkan status login
        onLogout={handleAuthAction}
        isLoggedIn={isLoggedIn}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb - sesuai contoh kedua */}
        <div className="mb-6 text-sm text-gray-600">
          <span className="hover:text-orange-600 cursor-pointer transition-colors">
            Home
          </span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="hover:text-orange-600 cursor-pointer transition-colors">
            Product categories
          </span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent font-medium">
            {activeKategori.nama}
          </span>
        </div>

        {/* Page Title dan Sorting */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-4 md:mb-0">
            {activeKategori.nama}
          </h1>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="text-sm text-gray-500">
              Showing all {kategoriItems.length} results
            </div>
            <div className="relative w-full sm:w-auto">
              <select className="appearance-none w-full sm:w-auto border border-gray-200 rounded-lg py-2 px-4 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white hover:border-orange-300 transition-colors cursor-pointer">
                <option>Default sorting</option>
                <option>Sort by price: low to high</option>
                <option>Sort by price: high to low</option>
                <option>Sort by popularity</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          {/* Sidebar Categories */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden sticky top-24">
              <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3z" />
                  </svg>
                  Product categories
                </h3>
              </div>
              <ul className="p-4 space-y-1">
                {kategoriList.map((kategori) => {
                  const isActive = kategori.id === activeKategori.id;

                  return (
                    <li key={kategori.id}>
                      <a
                        href={`/kategori/${kategori.id}`}
                        className={`block py-2.5 px-3 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-orange-50 to-pink-50 text-orange-600 font-medium border-l-4 border-orange-500"
                            : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                        }`}
                      >
                        {kategori.nama}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Product Grid */}
          <div className="md:col-span-3">
            {kategoriItems.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 shadow-md p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-10 h-10 text-orange-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg font-medium">
                  Tidak ada barang di kategori ini
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Coba pilih kategori lain
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {kategoriItems.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-white rounded-xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
                  >
                    {/* Product Image */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-50 to-pink-50">
                      {item.gambar ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.gambar}`}
                          alt={item.nama}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                          <svg
                            className="w-12 h-12 mb-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-xs">No Image</span>
                        </div>
                      )}

                      {/* Stock Badge */}
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-md">
                        <div className="flex items-center gap-1 text-xs">
                          <svg
                            className="w-3 h-3 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="font-medium text-gray-700">
                            Stok: {item.stok_tersedia}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                        {item.nama}
                      </h3>

                      <div className="flex items-baseline gap-2 mb-4">
                        <p className="text-xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                          Rp {item.harga_sewa.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">/hari</p>
                      </div>

                      <button
                        onClick={() => {
                          if (!isLoggedIn) {
                            setShowLoginModal(true);
                            return;
                          }
                          if (verifying) return;
                          if (isPending)
                            return alert("Akun masih diverifikasi");
                          if (isRejected) return alert("Verifikasi ditolak");
                          if (!isVerified)
                            return alert("Akun belum bisa menyewa");

                          setSelectedItem({
                            ...item,
                          kategoriId: id,});
                          setShowFormModal(true);
                        }}
                        className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] flex items-center justify-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                        </svg>
                        Sewa Sekarang
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {showFormModal && selectedItem && (
            <Modal open={showFormModal} onClose={() => setShowFormModal(false)}>
              <SewaForm
                barang={selectedItem}
                onClose={() => {
                  setShowFormModal(false);
                  setSelectedItem(null);
                }}
                onDone={() => {
                  setShowFormModal(false);
                  setShowDecisionModal(true);
                }}
              />
            </Modal>
          )}

          {showDecisionModal && (
            <Modal
              open={showDecisionModal}
              onClose={() => setShowDecisionModal(false)}
            >
              <DecisionModal
                onReview={() => {
                  setShowDecisionModal(false);
                  router.push("/dashboard/sewa/review");
                }}
                onContinue={() => {
                  setShowDecisionModal(false);
                }}
              />
            </Modal>
          )}

          {showLoginModal && (
            <Modal
              open={showLoginModal}
              onClose={() => setShowLoginModal(false)}
            >
              <div className="p-6 text-center text-black">
                <h2 className="text-xl font-bold mb-2">Login diperlukan</h2>

                <p className="text-gray-600 mb-6">
                  Silakan login terlebih dahulu untuk menyewa barang
                </p>

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setShowLoginModal(false)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Batal
                  </button>

                  <button
                    onClick={() => {
                      setShowLoginModal(false);
                      router.push("/login");
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Login Sekarang
                  </button>
                </div>
              </div>
            </Modal>
          )}
        </div>
      </main>
    </div>
  );
}
