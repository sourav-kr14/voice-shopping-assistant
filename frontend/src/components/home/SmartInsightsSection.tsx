"use client";

import { useMemo } from "react";
import { Clock, Calendar, Sparkles, Plus } from "lucide-react";
import { motion } from "framer-motion";

interface SmartInsightsProps {
  frequent: string[];
  reorder: string[];
  seasonal: string[];
  alsoBought: string[];
  onAdd: (item: string) => void;
}

export default function SmartInsights({ frequent, onAdd }: SmartInsightsProps) {
  const seasonalPicks = useMemo(() => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4)
      return ["Strawberries", "Asparagus", "Spinach"];
    if (month >= 5 && month <= 7) return ["Mangoes", "Watermelon", "Corn"];
    if (month >= 8 && month <= 10)
      return ["Apples", "Pumpkins", "Sweet Potato"];
    return ["Oranges", "Brussels Sprouts", "Carrots"];
  }, []);

  return (
    <section className="grid md:grid-cols-2 gap-8 pt-10">

      {/* Often Purchased */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm min-h-[160px] transition-colors duration-300"
      >
        <h4 className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-bold mb-6 text-[10px] uppercase tracking-[0.2em]">
          <Clock className="w-4 h-4 text-indigo-500" />
          Often Purchased
        </h4>

        <div className="flex flex-wrap gap-2">
          {frequent.length > 0 ? (
            frequent.map((item, i) => (
              <motion.span
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-700 capitalize"
              >
                {item}
              </motion.span>
            ))
          ) : (
            <p className="text-gray-400 dark:text-gray-500 text-xs italic">
              Data will appear as you shop.
            </p>
          )}
        </div>
      </motion.div>

      {/* Seasonal Picks */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="p-8 rounded-3xl text-white bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 shadow-xl relative overflow-hidden"
      >
        <h4 className="flex items-center gap-2 font-bold mb-6 text-[10px] uppercase tracking-[0.2em]">
          <Sparkles className="w-4 h-4 text-indigo-200" />
          Seasonal Picks
        </h4>

        <div className="flex flex-wrap gap-2">
          {seasonalPicks.map((item, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onAdd(`Add ${item}`)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-xl text-xs font-semibold border border-white/20 flex items-center gap-1 transition"
            >
              <Plus size={12} />
              {item}
            </motion.button>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-2 text-[10px] font-semibold text-indigo-100/80 uppercase tracking-tight">
          <Calendar size={12} />
          <span>
            Refreshed for{" "}
            {new Intl.DateTimeFormat("en-US", { month: "long" }).format(
              new Date()
            )}
          </span>
        </div>
      </motion.div>

    </section>
  );
}
