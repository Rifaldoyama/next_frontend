'use client';

import { useAuthStore } from '@/store/authStore';

export function Topbar() {
  const { user } = useAuthStore();

  return (
    <header className="h-14 bg-white border-b flex items-center px-6 justify-between">
      <span className="text-sm text-gray-600">
        Selamat datang, <b>{user?.username}</b>
      </span>
    </header>
  );
}
