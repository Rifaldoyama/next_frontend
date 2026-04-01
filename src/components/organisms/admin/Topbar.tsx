"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { LogOut, User, Bell, Settings, ChevronDown } from "lucide-react";
import { useState } from "react";

export function Topbar() {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  // Helper function for className merging
  const cn = (...classes: (string | undefined | false)[]) => {
    return classes.filter(Boolean).join(" ");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm sticky top-0 z-40">
      {/* Left Section - Welcome Message */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-xs font-bold">AR</span>
        </div>
        <div className="hidden sm:block">
          <p className="text-sm text-gray-600">
            Selamat datang,{" "}
            <span className="font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {user?.username || "Administrator"}
            </span>
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Right Section - Actions & User Menu */}
      <div className="flex items-center gap-2">
        {/* Settings Button */}
        <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
          <Settings className="w-5 h-5" />
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-200 mx-1" />

        {/* User Menu Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-all duration-200"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-md">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-semibold text-gray-800">
                {user?.username || "Administrator"}
              </p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <ChevronDown
              className={cn(
                "hidden lg:block w-4 h-4 text-gray-400 transition-transform duration-200",
                showUserMenu && "rotate-180",
              )}
            />
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                {/* User Info Section */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-md">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {user?.username || "Administrator"}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {user?.email || "admin@rental.com"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 my-1" />

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
