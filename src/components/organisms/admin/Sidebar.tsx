"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Grid3X3,
  Users,
  BookOpen,
  CreditCard,
  ShieldCheck,
  Gift,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Overview & statistics",
  },
  {
    category: "Inventory",
    items: [
      {
        href: "/admin/kelolabarang",
        label: "Kelola Barang",
        icon: Package,
        description: "Manage items",
      },
      {
        href: "/admin/kategori",
        label: "Kategori Barang",
        icon: Grid3X3,
        description: "Item categories",
      },
    ],
  },
  {
    category: "Users",
    items: [
      {
        href: "/admin/verifikasi-user",
        label: "Verifikasi User",
        icon: Users,
        description: "User verification",
      },
      {
        href: "/admin/kelola-peminjaman",
        label: "Kelola Peminjaman",
        icon: BookOpen,
        description: "Manage loans",
      },
    ],
  },
  {
    category: "Transactions",
    items: [
      {
        href: "/admin/kel-pembayaran",
        label: "Kelola Pembayaran",
        icon: CreditCard,
        description: "Payment management",
      },
      {
        href: "/admin/verifikasi-pembayaran",
        label: "Verifikasi Pembayaran",
        icon: ShieldCheck,
        description: "Payment verification",
      },
      {
        href: "/admin/kel-paket",
        label: "Kelola Paket",
        icon: Gift,
        description: "Package management",
      },
    ],
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className = "" }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <aside
      className={cn(
        "relative bg-gradient-to-b from-gray-50 via-white to-gray-50 border-r border-gray-200 flex flex-col h-screen sticky top-0 transition-all duration-300",
        isCollapsed ? "w-20" : "w-72",
        className,
      )}
    >
      {/* Collapse Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          "absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:shadow-lg transition-all z-50",
          "hover:bg-gray-50",
        )}
      >
        <ChevronRight
          className={cn(
            "w-4 h-4 text-gray-500 transition-transform duration-300",
            isCollapsed && "rotate-180",
          )}
        />
      </button>

      {/* Logo/Header */}
      <div
        className={cn(
          "p-6 border-b border-gray-200 transition-all",
          isCollapsed ? "px-4" : "px-6",
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <span className="text-white font-bold text-xl">AR</span>
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                AdminRental
              </h1>
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                Management System
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
        <div className="space-y-6">
          {navItems.map((item, idx) => {
            if ("items" in item && item.items) {
              // Category with items
              return (
                <div key={idx} className="space-y-2">
                  {!isCollapsed && (
                    <div className="px-3">
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {item.category}
                      </h3>
                    </div>
                  )}
                  <div className="space-y-1">
                    {item.items.map((subItem) => {
                      const active = isActive(subItem.href);
                      const Icon = subItem.icon;

                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={cn(
                            "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative",
                            active
                              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-200"
                              : "text-gray-600 hover:bg-blue-50 hover:text-blue-600",
                            isCollapsed && "justify-center px-2",
                          )}
                        >
                          <Icon
                            className={cn(
                              "w-5 h-5 transition-all",
                              active
                                ? "text-white"
                                : "text-gray-400 group-hover:text-blue-600",
                              isCollapsed && "w-6 h-6",
                            )}
                          />

                          {!isCollapsed && (
                            <div className="flex-1">
                              <span className="text-sm font-medium">
                                {subItem.label}
                              </span>
                              {active && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                </div>
                              )}
                            </div>
                          )}

                          {/* Tooltip for collapsed mode */}
                          {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                              {subItem.label}
                            </div>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            } else {
              // Single item (Dashboard)
              const active = isActive(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative",
                    active
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-200"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-600",
                    isCollapsed && "justify-center px-2",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-all",
                      active
                        ? "text-white"
                        : "text-gray-400 group-hover:text-blue-600",
                      isCollapsed && "w-6 h-6",
                    )}
                  />

                  {!isCollapsed && (
                    <div className="flex-1">
                      <span className="text-sm font-medium">{item.label}</span>
                      <p className="text-xs opacity-75">{item.description}</p>
                      {active && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tooltip for collapsed mode */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            }
          })}
        </div>
      </nav>

      {/* Simple Footer with Version Info Only */}
      <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div
          className={cn(
            "flex items-center justify-center",
            !isCollapsed && "justify-start",
          )}
        >
          <p className="text-[10px] text-gray-400">
            {!isCollapsed ? "© 2024 AdminRental - Version 1.0.0" : "v1.0.0"}
          </p>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </aside>
  );
}
