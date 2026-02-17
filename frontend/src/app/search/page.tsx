"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const products = [
  { name: "Milk", price: 60 },
  { name: "Apple Juice", price: 80 },
  { name: "Bread", price: 40 },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-28 px-4 sm:px-6 md:px-20 bg-gray-50 dark:bg-black transition-colors duration-300">

      {/* Back Button */}
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
        Search Products
      </h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search products..."
        className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Results */}
      <div className="mt-6 space-y-4">
        {filtered.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No products found.
          </p>
        ) : (
          filtered.map((product, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex justify-between items-center transition"
            >
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {product.name}
              </span>
              <span className="font-semibold text-emerald-600">
                ₹{product.price}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
