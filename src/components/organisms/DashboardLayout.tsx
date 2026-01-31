"use client";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CompleteProfileGate } from "./CompleteProfileGate";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, initialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;

    if (!user) {
      router.replace("/login");
    }
  }, [user, initialized]);

  if (!initialized) return null;
  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-6">{children}</main>
      </div>
      <CompleteProfileGate />
    </div>
  );
}
