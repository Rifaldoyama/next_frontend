"use client";

import { TrendingUp, Star, Calendar, Link } from "lucide-react";

const popularItems = [
  {
    id: 1,
    name: "Canon EOS R6",
    category: "Camera",
    rentals: 45,
    rating: 4.8,
    image: "📷",
    available: 3,
  },
  {
    id: 2,
    name: "Sony A7 III",
    category: "Camera",
    rentals: 38,
    rating: 4.7,
    image: "📸",
    available: 2,
  },
  {
    id: 3,
    name: "DJI Mini 3 Pro",
    category: "Drone",
    rentals: 32,
    rating: 4.9,
    image: "🚁",
    available: 4,
  },
  {
    id: 4,
    name: "Rode NT1-A",
    category: "Audio",
    rentals: 28,
    rating: 4.6,
    image: "🎤",
    available: 5,
  },
  {
    id: 5,
    name: "GoPro Hero 11",
    category: "Action Camera",
    rentals: 25,
    rating: 4.5,
    image: "🎥",
    available: 6,
  },
];

export function PopularItems() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Popular Items</h3>
        <p className="text-sm text-gray-500 mt-1">
          Most rented equipment this month
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {popularItems.map((item, index) => (
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
                    <span className="text-xs text-gray-600">{item.rating}</span>
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
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Manage all items →
        </Link>
      </div>
    </div>
  );
}

// Helper function
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}
