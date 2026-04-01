// src/components/organisms/admin/AdminStats.tsx
"use client";

import { useEffect, useState } from "react";
import { StatCard } from "../../molecules/admin/StatCard";
import {
  Package,
  Users,
  BookOpen,
  CreditCard,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

interface DashboardStats {
  totalItems: number;
  activeLoans: number;
  pendingVerifications: number;
  totalUsers: number;
  monthlyRevenue: number;
  pendingPayments: number;
}

export function AdminStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiFetch('/admin/dashboard/stats');
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Error loading stats: {error}
        <button
          onClick={fetchStats}
          className="ml-4 text-sm underline hover:no-underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Items"
          value={stats.totalItems}
          subtitle="Available for rent"
          icon={Package}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />

        <StatCard
          title="Active Loans"
          value={stats.activeLoans}
          subtitle="Currently borrowed"
          icon={BookOpen}
          color="green"
          trend={{ value: 5, isPositive: true }}
        />

        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          subtitle="Registered members"
          icon={Users}
          color="purple"
          trend={{ value: 8, isPositive: true }}
        />

        <StatCard
          title="Monthly Revenue"
          value={`Rp ${(stats.monthlyRevenue / 1000000).toFixed(1)}M`}
          subtitle="This month"
          icon={CreditCard}
          color="emerald"
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          title="Pending Verifications"
          value={stats.pendingVerifications}
          subtitle="Users awaiting approval"
          icon={AlertCircle}
          color="yellow"
          trend={{ value: 2, isPositive: false }}
        />

        <StatCard
          title="Pending Payments"
          value={stats.pendingPayments}
          subtitle="Awaiting confirmation"
          icon={TrendingUp}
          color="orange"
          trend={{ value: 1, isPositive: false }}
        />
      </div>
    </>
  );
}