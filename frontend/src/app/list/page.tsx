"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ListPage() {
  const [items] = useState([
    { name: "Milk", price: 60 },
    { name: "Apples", price: 120 },
  ]);

  const total = items.reduce((sum, item) => sum + item.price, 0);
  //basic page with few items
  return (
    <div className="min-h-screen pt-28 px-4 sm:px-6 md:px-20 bg-gray-50 dark:bg-black transition-colors duration-300">
      {/* Back Button to navigate back to the main page */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-500 transition"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        Your Shopping List
      </h1>

      {/* Items */}
      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="p-4 sm:p-5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex justify-between items-center transition"
          >
            <span className="font-medium text-gray-800 dark:text-gray-200">
              {item.name}
            </span>
            <span className="font-semibold text-emerald-600">
              ₹{item.price}
            </span>
          </div>
        ))}
      </div>

      {/* Total Price*/}
      <div className="mt-10 text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
        Total: <span className="text-emerald-600">₹{total}</span>
      </div>
    </div>
  );
}
