"use client";
import { Button } from "@/components/atoms/Buttons";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
export default function AdminPage() {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login"); // arahkan ke login
  };
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p>Welcome to the admin panel. Here you can manage the application.</p>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}
