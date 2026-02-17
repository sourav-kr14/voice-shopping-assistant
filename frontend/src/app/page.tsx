"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import VoiceButton from "@/src/components/home/VoiceButton";
import ShoppingList from "@/src/components/home/ShoppingList";
import CatalogResults from "@/src/components/home/CatalogResults";
import SmartInsights from "@/src/components/home/SmartInsightsSection";
import { ToastPremium } from "../components/ui/ToastPremium";
import { parseCommand } from "@/src/utils/commandParser";
import { mockProducts, Product } from "@/src/utils/mockProduct";
import { intelligentSearch } from "@/src/utils/intelligentSearch";
import { getSmartSuggestions } from "@/src/utils/smartSuggestions";
import { recordPurchase } from "@/src/utils/purchaseHistory";
import {
  recordBasket,
  getPeopleAlsoBought,
} from "@/src/utils/basketIntelligence";

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: "kg" | "litre" | "piece" | "packet" | "dozen";
  price: number;
  category: string;
  addedCount?: number;
}

/* Animations */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export default function Home() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("shopping-items");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("shopping-items", JSON.stringify(items));
  }, [items]);

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const groupedItems = useMemo(
    () =>
      items.reduce(
        (acc, item) => {
          if (!acc[item.category]) acc[item.category] = [];
          acc[item.category].push(item);
          return acc;
        },
        {} as Record<string, ShoppingItem[]>,
      ),
    [items],
  );

  const smartSuggestions = useMemo(() => getSmartSuggestions(), [items]);

  const alsoBought = useMemo(() => {
    if (!items.length) return [];
    const lastItem = items[items.length - 1]?.name;
    return lastItem ? getPeopleAlsoBought(lastItem) : [];
  }, [items]);

  const handleUpdateQuantity = (name: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.name.toLowerCase() === name.toLowerCase()
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  };

  const handleRemoveItem = (name: string) => {
    setItems((prev) =>
      prev.filter((i) => i.name.toLowerCase() !== name.toLowerCase()),
    );
    ToastPremium({ type: "success", message: "Item removed" });
  };

  const handleVoiceCommand = async (text: string) => {
    try {
      const parsed = parseCommand(text, mockProducts);
      if (!parsed) {
        ToastPremium({ type: "error", message: "I didn't understand that." });
        return;
      }

      const { action, items: parsedItems } = parsed;

      if (action === "add" && parsedItems?.length) {
        setIsLoading(true);
        const updatedItems = [...items];

        for (const entry of parsedItems) {
          let { name, quantity } = entry;

          const searchResult = intelligentSearch(
            {
              action: "search",
              items: [{ name, brand: null, category: null }],
              minPrice: null,
              maxPrice: null,
            },
            mockProducts,
          );

          const matchedProduct = searchResult.results[0];
          const price = matchedProduct?.price ?? 0;
          const category = matchedProduct?.category ?? "Others";

          const existingIndex = updatedItems.findIndex(
            (i) => i.name.toLowerCase() === name.toLowerCase(),
          );

          if (existingIndex !== -1) {
            updatedItems[existingIndex].quantity += quantity;
          } else {
            updatedItems.push({
              id: crypto.randomUUID(),
              name,
              quantity,
              unit: matchedProduct?.unit ?? "piece",
              price,
              category,
              addedCount: 1,
            });
          }

          recordPurchase(name);
        }

        recordBasket(updatedItems.map((i) => i.name));
        setItems(updatedItems);
        ToastPremium({ type: "success", message: "Items added successfully" });
        setIsLoading(false);
        return;
      }

      if (action === "search" && parsedItems?.length) {
        const response = intelligentSearch(parsed, mockProducts);
        setSearchResults(response.results);
        ToastPremium({
          type: "info",
          message:
            response.results.length === 0
              ? "No products found"
              : `Found ${response.results.length} matches`,
        });
      }
    } catch (error) {
      ToastPremium({ type: "error", message: "Something went wrong." });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 pb-28">
        {/* HERO */}
        <motion.section
          className="text-center py-14 sm:py-20"
          initial="hidden"
          animate="visible"
        >
          <motion.span
            variants={fadeUp}
            custom={0}
            className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 mb-6"
          >
            AI Voice Assistant
          </motion.span>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="text-3xl sm:text-5xl font-bold leading-tight mb-4"
          >
            Shop smarter, <br />
            <span className="text-emerald-500">just speak.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-10 text-sm sm:text-base"
          >
            Add items, search products, and organise your list — hands-free.
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={3}
          >
            <VoiceButton
              onTranscript={handleVoiceCommand}
              isLoading={isLoading}
            />
          </motion.div>
        </motion.section>

        {/* Shopping List */}
        <motion.div
          variants={fadeUp}
          custom={4}
          initial="hidden"
          animate="visible"
        >
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm mb-6">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <span className="text-xs font-semibold tracking-widest uppercase text-gray-500 dark:text-gray-400">
                Your List
              </span>
              {items.length > 0 && (
                <span className="text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full">
                  {items.length} item{items.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            <div className="p-6">
              {items.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <p className="font-medium mb-2">Nothing here yet</p>
                  <p className="text-sm">
                    Try saying{" "}
                    <span className="text-emerald-500">"Add 2 kg mangoes"</span>
                  </p>
                </div>
              ) : (
                <ShoppingList
                  groupedItems={groupedItems}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                />
              )}
            </div>
          </div>
        </motion.div>

        {/* Grand Total (Mobile Sticky) */}
        <AnimatePresence>
          {items.length > 0 && (
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed bottom-0 left-0 right-0 sm:relative sm:mt-4 bg-white dark:bg-gray-900 border-t sm:border border-gray-200 dark:border-gray-800 px-6 py-4 flex justify-between items-center shadow-lg sm:rounded-2xl"
            >
              <span className="text-xs uppercase tracking-widest text-gray-500">
                Grand Total
              </span>
              <span className="text-2xl font-bold text-emerald-500">
                ₹{totalPrice.toFixed(2)}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm mt-8">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <span className="text-xs uppercase tracking-widest text-gray-500">
                Search Results
              </span>
              <span className="text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 px-3 py-1 rounded-full">
                {searchResults.length} found
              </span>
            </div>

            <div className="p-6">
              <CatalogResults results={searchResults} />
            </div>
          </div>
        )}

        {/* Smart Suggestions */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm mt-10">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <span className="text-xs uppercase tracking-widest text-gray-500">
              Smart Suggestions
            </span>
            <span className="text-xs bg-purple-100 dark:bg-purple-900/40 text-purple-600 px-3 py-1 rounded-full">
              Personalised
            </span>
          </div>

          <div className="p-6">
            <SmartInsights
              frequent={items
                .filter((i) => (i.addedCount || 0) >= 2)
                .map((i) => i.name)}
              reorder={smartSuggestions.reorder}
              seasonal={smartSuggestions.seasonal}
              alsoBought={alsoBought}
              onAdd={handleVoiceCommand}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
