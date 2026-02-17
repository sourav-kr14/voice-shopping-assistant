"use client";

import { useState } from "react";

export default function ListPage() {
  const [items, setItems] = useState([
    { name: "Milk", price: 60 },
    { name: "Apples", price: 120 },
  ]);

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen pt-28 px-6 md:px-20">
      <h1 className="text-3xl font-bold mb-8">Your Shopping List</h1>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 shadow flex justify-between"
          >
            <span>{item.name}</span>
            <span>₹{item.price}</span>
          </div>
        ))}
      </div>

      <div className="mt-10 text-xl font-semibold">
        Total: ₹{total}
      </div>
    </div>
  );
}
