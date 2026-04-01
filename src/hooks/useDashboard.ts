// hooks/useDashboard.ts
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useDashboardStore } from "@/store/dashboardStore";

export const useDashboard = () => {
  const { user, logout } = useAuthStore();

  const {
    catalogItems,
    paketList,
    kategoriList,
    loading,
    error,
    fetchDashboard,
    fetchKategoriList,
  } = useDashboardStore();

  useEffect(() => {
    fetchDashboard();
    fetchKategoriList();
  }, [fetchDashboard, fetchKategoriList]);

  return {
    user,
    isLoggedIn: !!user,
    logout,
    helpNumber: "081212121",
    catalogItems,
    recommendedPackages: paketList,
    categories: kategoriList, 
    loading,
    error,
  };
};
