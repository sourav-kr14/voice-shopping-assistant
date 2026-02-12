import { ShoppingBag, Mic } from "lucide-react";
import { motion } from "framer-motion";
export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="bg-indigo-600 p-1.5 rounded-lg shadow-lg shadow-indigo-200">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">
            Vocal<span className="text-indigo-600">Shop</span>
          </span>
        </motion.div>
        
        <div className="flex items-center gap-4">
          <span className="hidden md:block text-xs font-bold text-slate-400 uppercase tracking-widest">
            AI Assistant Active
          </span>
          <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
        </div>
      </div>
    </header>
  );
}