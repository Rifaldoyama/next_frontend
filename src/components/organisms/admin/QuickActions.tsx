"use client";

import {
  Plus,
  CheckCircle,
  Search,
  Users,
  Package,
  CreditCard,
    ChevronRight,
} from "lucide-react";
import Link from "next/link";

const quickActions = [
  {
    title: "Add New Item",
    description: "Add equipment or items to inventory",
    icon: Plus,
    href: "/admin/kelolabarang",
    color: "blue",
  },
  {
    title: "Verify Users",
    description: "Approve pending user registrations",
    icon: Users,
    href: "/admin/verifikasi-user",
    color: "green",
    badge: 8,
  },
  {
    title: "Process Payments",
    description: "Review pending transactions",
    icon: CreditCard,
    href: "/admin/verifikasi-pembayaran",
    color: "orange",
    badge: 3,
  },
  {
    title: "Manage Loans",
    description: "View and manage active loans",
    icon: Package,
    href: "/admin/kelola-peminjaman",
    color: "purple",
  },
];

export function QuickActions() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Quick Actions
      </h3>
      <div className="space-y-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          const colorClasses = {
            blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
            green:
              "bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white",
            orange:
              "bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white",
            purple:
              "bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
          };

          return (
            <Link
              key={action.title}
              href={action.href}
              className="group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              <div
                className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  colorClasses[action.color as keyof typeof colorClasses],
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {action.title}
                  </p>
                  {action.badge && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                      {action.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {action.description}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-all" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// Helper function
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}
