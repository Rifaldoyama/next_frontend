"use client";

import { StatCard } from "../../molecules/admin/StatCard";
import {
  Package,
  Users,
  BookOpen,
  CreditCard,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

// Dummy data for admin stats
const dummyStats = {
  totalItems: 156,
  activeLoans: 23,
  pendingVerifications: 8,
  totalUsers: 342,
  monthlyRevenue: 12500000,
  pendingPayments: 3,
};

export function AdminStats() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Items"
          value={dummyStats.totalItems}
          subtitle="Available for rent"
          icon={Package}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />

        <StatCard
          title="Active Loans"
          value={dummyStats.activeLoans}
          subtitle="Currently borrowed"
          icon={BookOpen}
          color="green"
          trend={{ value: 5, isPositive: true }}
        />

        <StatCard
          title="Total Users"
          value={dummyStats.totalUsers}
          subtitle="Registered members"
          icon={Users}
          color="purple"
          trend={{ value: 8, isPositive: true }}
        />

        <StatCard
          title="Monthly Revenue"
          value={`Rp ${(dummyStats.monthlyRevenue / 1000000).toFixed(1)}M`}
          subtitle="This month"
          icon={CreditCard}
          color="emerald"
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          title="Pending Verifications"
          value={dummyStats.pendingVerifications}
          subtitle="Users awaiting approval"
          icon={AlertCircle}
          color="yellow"
          trend={{ value: 2, isPositive: false }}
        />

        <StatCard
          title="Pending Payments"
          value={dummyStats.pendingPayments}
          subtitle="Awaiting confirmation"
          icon={TrendingUp}
          color="orange"
          trend={{ value: 1, isPositive: false }}
        />
      </div>
    </>
  );
}
