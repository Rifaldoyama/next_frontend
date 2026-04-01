"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Calendar, TrendingUp } from "lucide-react";

const activityData = [
  { name: "Jan", loans: 12, returns: 8 },
  { name: "Feb", loans: 19, returns: 14 },
  { name: "Mar", loans: 15, returns: 16 },
  { name: "Apr", loans: 22, returns: 18 },
  { name: "May", loans: 28, returns: 24 },
  { name: "Jun", loans: 32, returns: 28 },
  { name: "Jul", loans: 35, returns: 32 },
  { name: "Aug", loans: 38, returns: 35 },
  { name: "Sep", loans: 42, returns: 38 },
  { name: "Oct", loans: 45, returns: 42 },
  { name: "Nov", loans: 48, returns: 44 },
  { name: "Dec", loans: 52, returns: 48 },
];

export function ActivityChart() {
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
            data={activityData}
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
