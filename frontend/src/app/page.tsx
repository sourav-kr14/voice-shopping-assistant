"use client";

import VoiceButton from "@/src/components/VoiceButton";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { useState, useEffect, useMemo } from "react";
import { parseCommand } from "@/src/utils/commandParser";
import { mockProducts, Product } from "@/src/utils/mockProduct";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Package, 
  Mic, 
  Search, 
  Calendar,
  Clock,
  Zap,
  ShoppingBag,
  Plus
} from "lucide-react";

interface Item {
  id: string;
  name: string;
  quantity: number;
  category: string;
  addedCount: number;
}


const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [transcript, setTranscript] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  
  useEffect(() => {
    const saved = localStorage.getItem("shopping-items");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("shopping-items", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const getFrequentSuggestions = () => {
    return items.filter((item) => item.addedCount >= 2).map((item) => item.name);
  };

  const getSeasonalSuggestions = () => {
    const month = new Date().getMonth();
    if (month >= 3 && month <= 6) return ["Mango", "Watermelon"];
    if (month >= 10 || month <= 1) return ["Oranges", "Carrots"];
    return [];
  };

  const groupedItems = useMemo(() => {
    return items.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, Item[]>);
  }, [items]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Header />

      <main className="flex-grow max-w-4xl mx-auto w-full px-6 py-10 space-y-10">
        
     
        <motion.section 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100/40 p-10 border border-white relative overflow-hidden"
        >
          
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-50" />
          
          <div className="flex flex-col items-center gap-8 relative z-10">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-700"></div>
              <VoiceButton
                onTranscript={async (text) => {
                  setTranscript(text);
                  const parsed = parseCommand(text);
                  const { action, item, quantity, maxPrice } = parsed;

                  if (action === "add" && item) {
                    setIsLoading(true);
                    const response = await fetch("/api/categorize", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ item }),
                    });
                    const data = await response.json();
                    const aiCategory = data.category || "Others";
                    setIsLoading(false);

                    setItems((prev) => {
                      const existingItem = prev.find((i) => i.name.toLowerCase() === item.toLowerCase());
                      if (existingItem) {
                        return prev.map((i) =>
                          i.name.toLowerCase() === item.toLowerCase()
                            ? { ...i, quantity: i.quantity + quantity, addedCount: i.addedCount + 1 }
                            : i
                        );
                      }
                      return [...prev, { id: crypto.randomUUID(), name: item, quantity, category: aiCategory, addedCount: 1 }];
                    });
                    setMessage(`Added ${quantity} ${item}`);
                    setSearchResults([]);
                  }

                  if (action === "remove" && item) {
                    setItems((prev) => prev.filter((i) => i.name.toLowerCase() !== item.toLowerCase()));
                    setMessage(`Removed ${item}`);
                    setSearchResults([]);
                  }

                  if (action === "search" && item) {
                    let results = mockProducts.filter((product) =>
                      product.name.toLowerCase().includes(item.toLowerCase())
                    );
                    if (maxPrice) results = results.filter((p) => p.price <= maxPrice);
                    setMessage(`Found ${results.length} results`);
                    setSearchResults(results);
                  }
                }}
              />
            </div>

            <div className="w-full max-w-lg space-y-4">
              <AnimatePresence mode="wait">
                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center text-amber-500 text-xs font-black uppercase tracking-tighter gap-2">
                    <Zap className="w-4 h-4 animate-bounce" /> Categorizing Item...
                  </motion.div>
                )}
                {message && !isLoading && (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="text-center text-indigo-600 font-bold bg-indigo-50 py-1 px-4 rounded-full w-fit mx-auto text-sm">
                    {message}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl py-6 px-8 text-center transition-all group-hover:border-indigo-200">
                <p className={`text-lg font-medium tracking-tight ${transcript ? 'text-slate-800' : 'text-slate-400 italic'}`}>
                  {transcript || "Speak: 'Add 1kg flour' or 'Search milk under $10'"}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

      
        <AnimatePresence mode="popLayout">
          {Object.keys(groupedItems).length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {Object.entries(groupedItems).map(([category, categoryItems]) => (
                <motion.div 
                  key={category} 
                  variants={itemVariants}
                  layout
                  className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 rounded-xl">
                        <Package className="w-5 h-5 text-indigo-600" />
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">{category}</h3>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {categoryItems.map((item) => (
                      <motion.li 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        key={item.id} 
                        className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl group hover:bg-white hover:ring-2 hover:ring-indigo-100 transition-all"
                      >
                        <span className="text-slate-700 font-bold">{item.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Qty</span>
                          <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-black shadow-md shadow-indigo-100">
                            {item.quantity}
                          </span>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dotted border-slate-200">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-slate-300 stroke-[1.5]" />
              <p className="font-bold text-slate-400">No items found. Your assistant is ready.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. Search Results (if any) */}
        <AnimatePresence>
          {searchResults.length > 0 && (
            <motion.section 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-slate-900 rounded-[3rem] p-10 text-white overflow-hidden shadow-2xl"
            >
              <h2 className="text-xl font-black mb-8 flex items-center gap-3">
                <Search className="w-6 h-6 text-indigo-400" /> Catalog Matches
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {searchResults.map((product) => (
                  <div key={product.id} className="bg-white/5 p-5 rounded-2xl border border-white/10 flex justify-between items-center group hover:bg-white/10 transition-colors">
                    <div>
                      <p className="font-bold">{product.name}</p>
                      <p className="text-xs text-slate-400">In Stock</p>
                    </div>
                    <span className="bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-black">
                      ${product.price}
                    </span>
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* 4. Insights Section */}
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 pt-10"
        >
          <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <Clock className="absolute -right-4 -bottom-4 w-24 h-24 text-slate-50 transition-transform group-hover:scale-110" />
            <h4 className="flex items-center gap-2 text-slate-800 font-black mb-6 text-xs uppercase tracking-widest relative z-10">
              <Clock className="w-4 h-4 text-indigo-500" /> Often Purchased
            </h4>
            <div className="flex flex-wrap gap-2 relative z-10">
              {getFrequentSuggestions().length > 0 ? (
                getFrequentSuggestions().map((item, i) => (
                  <span key={i} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold border border-slate-100 hover:border-indigo-200 transition-colors cursor-default">
                    {item}
                  </span>
                ))
              ) : <p className="text-slate-400 text-xs italic">Shopping data will appear here...</p>}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group text-white bg-gradient-to-br from-emerald-500 to-teal-600">
             <Calendar className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 transition-transform group-hover:scale-110" />
             <h4 className="flex items-center gap-2 font-black mb-6 text-xs uppercase tracking-widest relative z-10">
              <Calendar className="w-4 h-4 text-white" /> Seasonal Picks
            </h4>
            <div className="flex flex-wrap gap-2 relative z-10">
              {getSeasonalSuggestions().map((item, i) => (
                <span key={i} className="px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-xl text-xs font-black border border-white/10">
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}