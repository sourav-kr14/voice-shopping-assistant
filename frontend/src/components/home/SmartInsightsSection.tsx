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
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group min-h-[160px]"
      >
        <h4 className="flex items-center gap-2 text-slate-800 font-black mb-6 text-[10px] uppercase tracking-[0.2em]">
          <Clock className="w-4 h-4 text-indigo-500" /> Often Purchased
        </h4>

        <div className="flex flex-wrap gap-2">
          {frequent.length > 0 ? (
            frequent.map((item, i) => (
              <motion.span
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border border-slate-200/50 cursor-default capitalize"
              >
                {item}
              </motion.span>
            ))
          ) : (
            <p className="text-slate-400 text-xs italic">
              Data will appear as you shop.
            </p>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="p-8 rounded-[2.5rem] text-white bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 shadow-xl shadow-indigo-100 relative overflow-hidden"
      >
        <h4 className="flex items-center gap-2 font-black mb-6 text-[10px] uppercase tracking-[0.2em]">
          <Sparkles className="w-4 h-4 text-indigo-200" /> Seasonal Picks
        </h4>

        <div className="flex flex-wrap gap-2">
          {seasonalPicks.map((item, i) => (
            <motion.button
              key={i}
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255,255,255,0.25)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onAdd(`Add ${item}`)}
              className="px-4 py-2 bg-white/15 backdrop-blur-md text-white rounded-xl text-xs font-black border border-white/10 flex items-center gap-1 transition-colors"
            >
              <Plus size={12} /> {item}
            </motion.button>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-indigo-100/80 tracking-tighter uppercase">
          <Calendar size={12} />
          <span>
            Refreshed for{" "}
            {new Intl.DateTimeFormat("en-US", { month: "long" }).format(
              new Date(),
            )}
          </span>
        </div>
      </motion.div>
    </section>
  );
}
