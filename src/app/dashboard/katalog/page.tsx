'use client'
import { useRouter } from "next/navigation";
import { useDashboard } from "@/hooks/useDashboard";
import { Header } from "@/components/molecules/Header";

export default function KatalogPage() {
  const router = useRouter();
  const { user, logout, helpNumber, recommendedPackages, catalogItems } =
    useDashboard();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };
  return (
    <div>

      <h1 className="text-xl font-semibold mb-4">Katalog Barang</h1>

      <p>Daftar barang tersedia...</p>
    </div>
  );
}
