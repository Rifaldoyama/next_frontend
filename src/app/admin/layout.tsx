'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, initialized } = useAuthStore();

  useEffect(() => {
    if (!initialized) return;

    if (!user) {
      router.replace('/login');
    } else if (user.role !== 'ADMIN') {
      router.replace('/dashboard');
    }
  }, [user, initialized]);

  if (!initialized) return null;
  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1">{children}</main>
    </div>
  );
}

