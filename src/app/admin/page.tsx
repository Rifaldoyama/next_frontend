"use client";

import { AdminStats } from "@/components/organisms/admin/AdminStats";
import { RecentTransactions } from "@/components/organisms/admin/RecentTransactions";
import { PopularItems } from "@/components/organisms/admin/PopularItems";
import { ActivityChart } from "@/components/organisms/admin/ActivityChart";
import { QuickActions } from "@/components/organisms/admin/QuickActions";

export default function AdminPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-gray-500 mt-1">
          Welcome back! Here's what's happening with your rental business today.
        </p>
      </div>

      {/* Statistics Cards */}
      <AdminStats />

      {/* Charts and Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityChart />
        </div>
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>

      {/* Recent Transactions and Popular Items Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactions />
        <PopularItems />
      </div>
    </div>
  );
}
