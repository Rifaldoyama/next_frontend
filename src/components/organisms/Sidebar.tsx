'use client';

import Link from 'next/link';

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r">
      <div className="p-4 font-bold text-lg">
        Peminjaman
      </div>

      <nav className="space-y-2 px-4">
        <Link href="/dashboard" className="block hover:text-blue-600">
          Dashboard
        </Link>

        <Link href="/dashboard/katalog" className="block hover:text-blue-600">
          Katalog Barang
        </Link>

        <Link href="/dashboard/peminjaman" className="block hover:text-blue-600">
          Peminjaman Saya
        </Link>
      </nav>
    </aside>
  );
}
