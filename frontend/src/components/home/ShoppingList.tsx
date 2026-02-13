"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Package, Plus, Minus, Trash2 } from "lucide-react";

interface Item {
  id: string;
  name: string;
  quantity: number;
}

interface ShoppingListProps {
  groupedItems: Record<string, Item[]>;
  onUpdateQuantity: (name: string, delta: number) => void;
  onRemove: (name: string) => void;
}

export default function ShoppingList({ groupedItems, onUpdateQuantity, onRemove }: ShoppingListProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <motion.div key={category} layout className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 rounded-xl">
              <Package className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">{category}</h3>
          </div>

          <ul className="space-y-3">
            <AnimatePresence mode="popLayout">
              {categoryItems.map((item) => (
                <motion.li 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, x: -20 }}
                  key={item.id} 
                  className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl group hover:bg-white hover:ring-2 hover:ring-indigo-100 transition-all"
                >
                  <span className="text-slate-800 font-bold capitalize">{item.name}</span>

                  <div className="flex items-center gap-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                      <button 
                        onClick={() => onUpdateQuantity(item.name, -1)}
                        className="p-1 hover:text-indigo-600 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      
                      <span className="px-3 text-xs font-black text-slate-700 min-w-[24px] text-center">
                        {item.quantity}
                      </span>

                      <button 
                        onClick={() => onUpdateQuantity(item.name, 1)}
                        className="p-1 hover:text-indigo-600 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Delete Button */}
                    <button 
                      onClick={() => onRemove(item.name)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </motion.div>
      ))}
    </motion.div>
  );
}