"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { PackageCard } from "../molecules/PackageCard";
import { Paket } from "@/store/dashboardStore";
import { PaketSewaForm } from "./PaketSewaForm";
import { Modal } from "@/components/atoms/Modal";
import { Star, Sparkles, Gift } from "lucide-react";

interface RecommendationSectionProps {
  packages: Paket[];
}

export const RecommendationSection = ({
  packages,
}: RecommendationSectionProps) => {
  const [selectedPaket, setSelectedPaket] = useState<Paket | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [detailPaket, setDetailPaket] = useState<Paket | null>(null);

  const router = useRouter();
  const { user, initialized } = useAuthStore();

  const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL;

  const handleSelect = (pkg: Paket) => {
    if (!initialized) return;

    if (!user) {
      setShowLoginModal(true);
      return;
    }

    setSelectedPaket(pkg);
  };

  const handleDetail = (pkg: Paket) => {
    setDetailPaket(pkg);
  };

  const calculateOriginalPrice = (pkg: Paket): number => {
    if (!pkg.items || pkg.items.length === 0) return pkg.harga_final;

    const totalHarga = pkg.items.reduce((sum, item) => {
      const harga = item.barang?.harga_sewa || item.harga_saat_itu || 0;
      return sum + harga * item.jumlah;
    }, 0);

    return totalHarga; // Menghitung dari data barang
  };

  return (
    <section className="relative">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Rekomendasi Paket
            </h2>
          </div>
          <p className="text-sm text-gray-500">
            Paket terbaik untuk kebutuhan event Anda
          </p>
        </div>
        <div className="flex items-center gap-2 bg-gradient-to-r from-orange-100 to-pink-100 px-3 py-1.5 rounded-full">
          <Gift className="w-4 h-4 text-orange-500" />
          <span className="text-xs font-medium text-gray-700">
            {packages.length} Paket Tersedia
          </span>
        </div>
      </div>

      {/* Grid Packages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg, index) => {
          const image =
            pkg.gambar ||
            (pkg.items?.length
              ? `${IMAGE_URL}${pkg.items[0].barang.gambar}`
              : "/no-image.png");

          return (
            <div
              key={pkg.id}
              className="animate-in fade-in slide-in-from-bottom-3 duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <PackageCard
                name={pkg.nama}
                description={pkg.deskripsi}
                itemCount={pkg.items.length}
                image={image}
                price={pkg.harga_final}
                discount={pkg.diskon_persen}
                onSelect={() => handleSelect(pkg)}
                onDetail={() => handleDetail(pkg)}
              />
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {packages.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">Belum ada paket rekomendasi</p>
        </div>
      )}

      {/* Paket Sewa Form Modal */}
      {selectedPaket && (
        <PaketSewaForm
          paket={selectedPaket}
          onClose={() => setSelectedPaket(null)}
          onDone={() => setSelectedPaket(null)}
        />
      )}

      {/* Detail Paket Modal */}
      <Modal open={!!detailPaket} onClose={() => setDetailPaket(null)}>
        {detailPaket && (
          <div className="space-y-5 max-w-xl max-h-[80vh] overflow-y-auto p-1">
            {/* Image */}
            <div className="relative">
              <img
                src={detailPaket.gambar}
                className="w-full h-48 sm:h-56 object-cover rounded-xl"
                alt={detailPaket.nama}
              />
              {detailPaket.diskon_persen > 0 && (
                <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  -{detailPaket.diskon_persen}%
                </div>
              )}
            </div>

            {/* Title & Description */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                {detailPaket.nama}
              </h2>
              <p className="text-gray-600 text-sm mt-2">
                {detailPaket.deskripsi}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 flex-wrap text-black">
              <span className="text-2xl font-bold ...">
                Rp {detailPaket.harga_final.toLocaleString()} {/* 910.800 */}
              </span>
              {detailPaket.diskon_persen > 0 && (
                <span className="line-through text-gray-400 text-sm">
                  Rp {calculateOriginalPrice(detailPaket).toLocaleString()}{" "}
                  {/* 1.012.000 */}
                </span>
              )}
            </div>

            {/* Package Items */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-500" />
                Isi Paket
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {detailPaket.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors"
                  >
                    <img
                      src={`${IMAGE_URL}${item.barang.gambar}`}
                      className="w-12 h-12 object-cover rounded-lg"
                      alt={item.barang.nama}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        {item.barang.nama}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.jumlah} unit
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setDetailPaket(null)}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  setDetailPaket(null);
                  handleSelect(detailPaket);
                }}
                className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-[1.02]"
              >
                Pilih Paket Ini
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Login Modal */}
      <Modal open={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <div className="space-y-5 text-center p-2">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Login Diperlukan
            </h2>
            <p className="text-sm text-gray-600">
              Anda harus login terlebih dahulu untuk menyewa paket.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => setShowLoginModal(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={() => {
                setShowLoginModal(false);
                router.push("/login");
              }}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-lg font-semibold transition-all"
            >
              Login Sekarang
            </button>
          </div>
        </div>
      </Modal>
    </section>
  );
};
