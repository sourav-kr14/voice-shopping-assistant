"use client";

import { useState } from "react";

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
    <div className="min-h-screen pt-28 px-6 md:px-20">
      <h1 className="text-3xl font-bold mb-8">Search Products</h1>

      <input
        type="text"
        placeholder="Search..."
        className="w-full p-4 rounded-xl border dark:bg-slate-900"
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="mt-6 space-y-4">
        {filtered.map((product, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 shadow flex justify-between"
          >
            <span>{product.name}</span>
            <span>₹{product.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
