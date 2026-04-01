// src/components/organisms/admin/PopularItems.tsx
"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Star, Calendar, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

interface PopularItem {
  id: number;
  name: string;
  category: string;
  rentals: number;
  rating: number;
  image: string;
  available: number;
}

export function PopularItems() {
  const [items, setItems] = useState<PopularItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPopularItems();
  }, []);

  const fetchPopularItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiFetch('/admin/dashboard/popular-items');
      setItems(data);
    } catch (err) {
      console.error('Failed to fetch popular items:', err);
      setError(err instanceof Error ? err.message : 'Failed to load popular items');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-48 bg-gray-200 rounded mt-1 animate-pulse"></div>
        </div>
        <div className="p-6 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Popular Items</h3>
        </div>
        <div className="p-6 text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <button
            onClick={fetchPopularItems}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Popular Items</h3>
        </div>
        <div className="p-6 text-center text-gray-500">
          No rental data available yet
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Popular Items</h3>
        <p className="text-sm text-gray-500 mt-1">
          Most rented equipment this month
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              {/* Rank */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>

              {/* Item Image/Icon */}
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                {item.image}
              </div>

              {/* Item Details */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-blue-600">
                      {item.rentals} rentals
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.available} available
                    </p>
                  </div>
                </div>

                {/* Rating and Stats */}
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-600">{item.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-gray-600">
                      +{Math.floor(item.rentals * 0.15)}% this month
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">High demand</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <Link
          href="/admin/kelolabarang"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
        >
          Manage all items
          <LinkIcon className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}