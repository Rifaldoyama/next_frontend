"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { apiFetch } from "@/lib/api";

interface ActivityData {
  name: string;
  loans: number;
  returns: number;
}

export function ActivityChart() {
  const [data, setData] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFetch('/admin/dashboard/activity');
      setData(response);
    } catch (err) {
      console.error('Failed to fetch activity:', err);
      setError(err instanceof Error ? err.message : 'Failed to load activity data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="h-80 animate-pulse bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="h-80 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-2">{error}</p>
            <button 
              onClick={fetchActivity}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Rental Activity
          </h3>
          <p className="text-sm text-gray-500 mt-1">Monthly loans vs returns</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Loans</span>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Returns</span>
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="loans" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="returns" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}