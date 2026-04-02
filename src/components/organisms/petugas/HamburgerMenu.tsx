// components/organisms/petugas/HamburgerMenu.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  User,
  Home,
  LogOut,
  ClipboardList,
  Package,
} from "lucide-react";

interface MenuItem {
  label: string;
  href?: string;
  action?: () => void;
  icon?: string;
}

interface Props {
  items: MenuItem[];
}

const getIcon = (iconName?: string, label?: string) => {
  switch (iconName) {
    case "Home":
      return <Home className="w-5 h-5" />;
    case "User":
      return <User className="w-5 h-5" />;
    case "LogOut":
      return <LogOut className="w-5 h-5" />;
    case "Package":
      return <Package className="w-5 h-5" />;
    default:
      if (label === "Dashboard") return <Home className="w-5 h-5" />;
      if (label === "Profile") return <User className="w-5 h-5" />;
      if (label === "History") return <ClipboardList className="w-5 h-5" />;
      return <ClipboardList className="w-5 h-5" />;
  }
};

export const HamburgerMenu = ({ items }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-gray-100 transition"
        aria-label="Menu"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white z-50 shadow-xl transform transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-5 border-b">
          <div>
            <h2 className="font-bold text-lg text-gray-800">Menu Petugas</h2>
            <p className="text-xs text-gray-500">Rental Alat</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-col p-4 space-y-1">
          {items.map((item, i) =>
            item.href ? (
              <Link
                key={i}
                href={item.href}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition text-gray-700"
                onClick={() => setOpen(false)}
              >
                {getIcon(item.icon, item.label)}
                <span>{item.label}</span>
              </Link>
            ) : (
              <button
                key={i}
                onClick={() => {
                  item.action?.();
                  setOpen(false);
                }}
                className="flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition w-full"
              >
                {getIcon(item.icon, item.label)}
                <span>{item.label}</span>
              </button>
            ),
          )}
        </nav>
      </div>
    </>
  );
};
