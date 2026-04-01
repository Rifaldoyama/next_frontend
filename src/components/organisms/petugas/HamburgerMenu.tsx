"use client";

import { useState } from "react";
import Link from "next/link";

interface MenuItem {
  label: string;
  href?: string;
  action?: () => void;
}

interface Props {
  items: MenuItem[];
}

export const HamburgerMenu = ({ items }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex flex-col justify-center items-center w-10 h-10 space-y-1"
      >
        <span className="w-6 h-0.5 bg-black"></span>
        <span className="w-6 h-0.5 bg-black"></span>
        <span className="w-6 h-0.5 bg-black"></span>
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-lg transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-semibold">Menu</h2>
          <button onClick={() => setOpen(false)}>Close</button>
        </div>

        <nav className="flex flex-col p-4 space-y-2">
          {items.map((item, i) =>
            item.href ? (
              <Link
                key={i}
                href={item.href}
                className="p-3 rounded hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ) : (
              <button
                key={i}
                onClick={() => {
                  item.action?.();
                  setOpen(false);
                }}
                className="p-3 rounded text-left text-red-600 hover:bg-red-50"
              >
                {item.label}
              </button>
            ),
          )}
        </nav>
      </div>
    </>
  );
};
