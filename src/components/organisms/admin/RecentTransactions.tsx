// src/components/organisms/admin/RecentTransactions.tsx
"use client";

import { useEffect, useState } from "react";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

interface Transaction {
  id: string;
  user: string;
  item: string;
  amount: string;
  status: string;
  date: string;
}

const statusConfig = {
  completed: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
  pending: { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
  processing: { icon: AlertCircle, color: "text-blue-600", bg: "bg-blue-50" },
  failed: { icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
};

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiFetch('/admin/dashboard/transactions');
      setTransactions(data);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-32 bg-gray-200 rounded mt-1 animate-pulse"></div>
        </div>
        <div className="p-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded mb-2 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
        </div>
        <div className="p-6 text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <button
            onClick={fetchTransactions}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
            {transactions.map((transaction) => {
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
          href="/admin/verifikasi-pembayaran"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View all transactions →
        </Link>
      </div>
    </div>
  );
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}