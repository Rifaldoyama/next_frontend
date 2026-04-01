"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  color: "blue" | "green" | "purple" | "emerald" | "yellow" | "orange";
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const colorConfig = {
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    icon: "text-blue-500",
  },
  green: {
    bg: "bg-green-50",
    text: "text-green-600",
    icon: "text-green-500",
  },
  purple: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    icon: "text-purple-500",
  },
  emerald: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    icon: "text-emerald-500",
  },
  yellow: {
    bg: "bg-yellow-50",
    text: "text-yellow-600",
    icon: "text-yellow-500",
  },
  orange: {
    bg: "bg-orange-50",
    text: "text-orange-600",
    icon: "text-orange-500",
  },
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  trend,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className={cn("text-2xl font-bold", colorConfig[color].text)}>
            {value}
          </p>
          <p className="text-xs text-gray-400 mt-1">{subtitle}</p>

          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-green-600" : "text-red-600",
                )}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-400">vs last month</span>
            </div>
          )}
        </div>

        <div className={cn("p-3 rounded-xl", colorConfig[color].bg)}>
          <Icon className={cn("w-6 h-6", colorConfig[color].icon)} />
        </div>
      </div>
    </div>
  );
}
