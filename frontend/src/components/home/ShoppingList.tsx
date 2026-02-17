"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Package, Plus, Minus, Trash2 } from "lucide-react";

interface Item {
  id: string;
  name: string;
  quantity: number;
  unit: "kg" | "litre" | "piece" | "packet" | "dozen";
  price: number;
  category: string;
  addedCount?: number;
}

interface ShoppingListProps {
  groupedItems: Record<string, Item[]>;
  onUpdateQuantity: (name: string, delta: number) => void;
  onRemove: (name: string) => void;
}

export default function ShoppingList({
  groupedItems,
  onUpdateQuantity,
  onRemove,
}: ShoppingListProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-8"
    >
      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <motion.div
          key={category}
          layout
          className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 transition-colors duration-300"
        >
          {/* Category Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl">
              <Package className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-800 dark:text-gray-200">
              {category}
            </h3>
          </div>

          <ul className="space-y-4">
            <AnimatePresence mode="popLayout">
              {categoryItems.map((item) => {
                const subtotal = item.price * item.quantity;

                return (
                  <motion.li
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, x: -20 }}
                    key={item.id}
                    className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl group hover:bg-white dark:hover:bg-gray-700 hover:ring-2 hover:ring-indigo-100 dark:hover:ring-indigo-500/20 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      {/* Left Section */}
                      <div>
                        <p className="text-gray-900 dark:text-gray-100 font-semibold capitalize">
                          {item.name}
                        </p>

                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          ₹{item.price} per {item.unit}
                        </p>

                        <motion.p
                          key={subtotal}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-1"
                        >
                          ₹{subtotal}
                        </motion.p>
                      </div>

                      {/* Right Section */}
                      <div className="flex items-center gap-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-1 shadow-sm">
                          <button
                            onClick={() => onUpdateQuantity(item.name, -1)}
                            className="p-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          >
                            <Minus size={14} />
                          </button>

                          <span className="px-3 text-xs font-bold text-gray-700 dark:text-gray-200 min-w-[24px] text-center">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => onUpdateQuantity(item.name, 1)}
                            className="p-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => onRemove(item.name)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        </motion.div>
      ))}
    </motion.div>
  );
}
