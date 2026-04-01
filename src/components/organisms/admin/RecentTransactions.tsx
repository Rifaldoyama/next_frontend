"use client";

import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

const recentTransactions = [
  {
    id: "TRX-001",
    user: "John Doe",
    item: "Canon EOS R6",
    amount: "Rp 250.000",
    status: "completed",
    date: "2024-03-15",
  },
  {
    id: "TRX-002",
    user: "Jane Smith",
    item: "Sony A7 III",
    amount: "Rp 300.000",
    status: "pending",
    date: "2024-03-14",
  },
  {
    id: "TRX-003",
    user: "Mike Johnson",
    item: "DJI Mini 3 Pro",
    amount: "Rp 180.000",
    status: "processing",
    date: "2024-03-14",
  },
  {
    id: "TRX-004",
    user: "Sarah Williams",
    item: "Rode NT1-A",
    amount: "Rp 120.000",
    status: "completed",
    date: "2024-03-13",
  },
  {
    id: "TRX-005",
    user: "David Brown",
    item: "GoPro Hero 11",
    amount: "Rp 150.000",
    status: "failed",
    date: "2024-03-13",
  },
];

const statusConfig = {
  completed: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
  pending: { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
  processing: { icon: AlertCircle, color: "text-blue-600", bg: "bg-blue-50" },
  failed: { icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
};

export function RecentTransactions() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">
          Recent Transactions
        </h3>
        <p className="text-sm text-gray-500 mt-1">Latest payment activities</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {recentTransactions.map((transaction) => {
              const StatusIcon =
                statusConfig[transaction.status as keyof typeof statusConfig]
                  .icon;
              const statusStyle =
                statusConfig[transaction.status as keyof typeof statusConfig];

              return (
                <tr
                  key={transaction.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">
                    {transaction.id}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {transaction.user}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {transaction.item}
                  </td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">
                    {transaction.amount}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                        statusStyle.bg,
                        statusStyle.color,
                      )}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {transaction.status.charAt(0).toUpperCase() +
                        transaction.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">
                    {transaction.date}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <Link
          href="/admin/kel-pembayaran"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View all transactions →
        </Link>
      </div>
    </div>
  );
}

// Helper function
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}
