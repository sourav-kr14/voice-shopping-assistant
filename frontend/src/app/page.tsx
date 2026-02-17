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
  price: number;
  category: string;
  addedCount?: number;
}

/* ─── Framer Motion variants ──────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const scaleIn = {
  hidden:   { opacity: 0, scale: 0.95 },
  visible:  { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit:     { opacity: 0, scale: 0.95, transition: { duration: 0.22, ease: "easeIn" } },
};

/* ─── Component ───────────────────────────────────────────────── */
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
      items.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
      }, {} as Record<string, ShoppingItem[]>),
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
    ToastPremium({ type: "success", message: "Items added successfully" });
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

          const correction = intelligentSearch(
            { action: "search", items: [{ name, brand: null, category: null }], minPrice: null, maxPrice: null },
            mockProducts,
          );
          if (correction.suggestion && correction.topScore < 3) name = correction.suggestion;

          const searchResult = intelligentSearch(
            { action: "search", items: [{ name, brand: null, category: null }], minPrice: null, maxPrice: null },
            mockProducts,
          );
          const matchedProduct = searchResult.results[0];
          const price = matchedProduct?.price ?? 0;
          let aiCategory = matchedProduct?.category ?? "Others";

          try {
            const response = await fetch("/api/categorize", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ item: name }),
            });
            if (response.ok) {
              const data = await response.json();
              aiCategory = data?.category || aiCategory;
            }
          } catch (err) {
            console.error("Categorization failed:", err);
          }

          const existingIndex = updatedItems.findIndex(
            (i) => i.name.toLowerCase() === name.toLowerCase(),
          );

          if (existingIndex !== -1) {
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: updatedItems[existingIndex].quantity + quantity,
              addedCount: (updatedItems[existingIndex].addedCount || 0) + 1,
            };
          } else {
            updatedItems.push({
              id: crypto.randomUUID(),
              name,
              quantity,
              price,
              category: aiCategory,
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
        const searchResponse = intelligentSearch(parsed, mockProducts);
        let finalResults = searchResponse.results;
        let finalMessage = "";

        if (
          (searchResponse.results.length === 0 || searchResponse.topScore < 3) &&
          searchResponse.suggestion
        ) {
          const correctedResponse = intelligentSearch(
            { ...parsed, items: [{ ...parsed.items[0], name: searchResponse.suggestion }] },
            mockProducts,
          );
          if (correctedResponse.results.length > 0) {
            finalResults = correctedResponse.results;
            finalMessage = `Showing results for "${searchResponse.suggestion}"`;
          }
        }

        if (!finalMessage) {
          finalMessage =
            finalResults.length === 0
              ? "No products found."
              : `Found ${finalResults.length} matches`;
        }

        setSearchResults(finalResults);
        ToastPremium({ type: "info", message: finalMessage });
        return;
      }
    } catch (error) {
      console.error("Voice handler error:", error);
      ToastPremium({ type: "error", message: "I didn't understand that." });
      setIsLoading(false);
    }
  };

  /* ── Render ─────────────────────────────────────────────────── */
  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Instrument+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        :root {
          --bg:         #07090E;
          --s1:         #0D1017;
          --s2:         #131923;
          --s3:         #1B2333;
          --border:     rgba(255,255,255,0.06);
          --border-hi:  rgba(255,255,255,0.12);
          --em:         #1EE8A0;
          --em-dim:     rgba(30,232,160,0.08);
          --em-glow:    rgba(30,232,160,0.22);
          --em-border:  rgba(30,232,160,0.2);
          --text:       #E2E8F4;
          --text-2:     rgba(226,232,244,0.5);
          --text-3:     rgba(226,232,244,0.25);
          --r:          16px;
          --r-lg:       22px;
        }

        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }

        body {
          font-family: 'Instrument Sans', sans-serif;
          background: var(--bg);
          color: var(--text);
          -webkit-font-smoothing: antialiased;
        }

        ::-webkit-scrollbar            { width: 5px; }
        ::-webkit-scrollbar-track      { background: var(--bg); }
        ::-webkit-scrollbar-thumb      { background: var(--s3); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover{ background: rgba(30,232,160,0.15); }

        /* Page */
        .ps {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background: var(--bg);
          background-image:
            radial-gradient(ellipse 75% 45% at 50% -8%, rgba(30,232,160,0.09) 0%, transparent 60%),
            radial-gradient(ellipse 45% 30% at 90% 95%, rgba(30,232,160,0.05) 0%, transparent 55%);
        }

        .mc {
          flex-grow: 1;
          max-width: 880px;
          margin: 0 auto;
          width: 100%;
          padding: 0 24px 96px;
        }

        /* Hero */
        .hero { display:flex; flex-direction:column; align-items:center; text-align:center; padding:76px 0 60px; }

        .hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Syne', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--em);
          border: 1px solid var(--em-border);
          border-radius: 100px;
          padding: 5px 15px;
          margin-bottom: 30px;
          background: var(--em-dim);
        }
        .hero-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--em);
          animation: blink 1.8s ease-in-out infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.25} }

        .hero-h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(36px, 5.8vw, 54px);
          font-weight: 800;
          line-height: 1.07;
          letter-spacing: -0.03em;
          color: var(--text);
          margin-bottom: 16px;
          max-width: 540px;
        }
        .hero-h1 em { font-style:normal; color: var(--em); }

        .hero-sub {
          font-size: 15px;
          font-weight: 300;
          color: var(--text-2);
          margin-bottom: 52px;
          max-width: 340px;
          line-height: 1.65;
        }

        /* Voice glow */
        .vring {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .vring::before {
          content: '';
          position: absolute;
          inset: -32px;
          border-radius: 50%;
          background: radial-gradient(circle, var(--em-glow) 0%, transparent 68%);
          animation: rpulse 2.8s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes rpulse { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.1)} }

        /* Loading bar */
        .ltrack { width:90px; height:2px; background:var(--s3); border-radius:2px; margin-top:26px; overflow:hidden; }
        .lbar   { height:100%; width:38%; background:var(--em); border-radius:2px; animation:lslide 1s ease-in-out infinite alternate; box-shadow:0 0 8px var(--em); }
        @keyframes lslide { from{transform:translateX(-100%)} to{transform:translateX(350%)} }

        /* Section cards */
        .sc {
          background: var(--s1);
          border: 1px solid var(--border);
          border-radius: var(--r-lg);
          overflow: hidden;
          margin-bottom: 14px;
          transition: border-color .25s, box-shadow .25s;
        }
        .sc:hover {
          border-color: var(--border-hi);
          box-shadow: 0 0 0 1px rgba(30,232,160,0.05), 0 20px 50px rgba(0,0,0,.4);
        }
        .sc-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 26px;
          border-bottom: 1px solid var(--border);
        }
        .sc-title {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--text-2);
        }
        .sc-pill {
          font-family: 'Syne', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--em);
          background: var(--em-dim);
          border: 1px solid var(--em-border);
          border-radius: 100px;
          padding: 3px 11px;
        }
        .sc-body { padding: 24px 26px; }

        /* Grand total */
        .total {
          background: linear-gradient(135deg, var(--s2) 0%, var(--s1) 100%);
          border: 1px solid var(--em-border);
          border-radius: var(--r-lg);
          padding: 26px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
          position: relative;
          overflow: hidden;
        }
        .total::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--em), transparent);
          opacity: 0.7;
        }
        .total-label {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--text-2);
        }
        .total-val {
          font-family: 'Syne', sans-serif;
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--em);
          text-shadow: 0 0 28px var(--em-glow);
        }

        /* Divider */
        .hrule {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 30px 0;
        }
        .hrule-line { flex:1; height:1px; background: var(--border); }
        .hrule-gem {
          width: 7px; height: 7px;
          border: 1px solid rgba(30,232,160,0.35);
          border-radius: 1px;
          transform: rotate(45deg);
          flex-shrink: 0;
        }

        /* Empty state */
        .empty { text-align:center; padding:48px 16px; }
        .empty-ico   { font-size:30px; margin-bottom:14px; opacity:.25; }
        .empty-title {
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: var(--text-3);
          margin-bottom: 6px;
        }
        .empty-hint  { font-size:13px; font-weight:300; color:var(--text-3); }
        .empty-hint code {
          background: var(--s3);
          color: var(--em);
          padding: 1px 7px;
          border-radius: 5px;
          font-size: 12px;
          font-family: 'SF Mono', 'Fira Code', monospace;
        }
      `}</style>

      <div className="ps">
        <Header />

        <main className="mc">

          {/* Hero */}
          <motion.section
            className="hero"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.div variants={fadeUp} custom={0}>
              <span className="hero-tag">
                <span className="hero-dot" />
                AI Voice Assistant
              </span>
            </motion.div>

            <motion.h1 className="hero-h1" variants={fadeUp} custom={1}>
              Shop smarter,<br /><em>just speak.</em>
            </motion.h1>

            <motion.p className="hero-sub" variants={fadeUp} custom={2}>
              Add items, search products, and organise your list — hands‑free, instantly.
            </motion.p>

            <motion.div className="vring" variants={fadeUp} custom={3}>
              <VoiceButton onTranscript={handleVoiceCommand} isLoading={isLoading} />
            </motion.div>

            <AnimatePresence>
              {isLoading && (
                <motion.div
                  className="ltrack"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="lbar" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>

          {/* Shopping List */}
          <motion.div variants={fadeUp} custom={4} initial="hidden" animate="visible">
            <div className="sc">
              <div className="sc-head">
                <span className="sc-title">Your List</span>
                {items.length > 0 && (
                  <span className="sc-pill">{items.length}&nbsp;item{items.length !== 1 ? "s" : ""}</span>
                )}
              </div>
              <div className="sc-body">
                {items.length === 0 ? (
                  <div className="empty">
                    <div className="empty-ico">🛒</div>
                    <div className="empty-title">Nothing here yet</div>
                    <p className="empty-hint">Try saying <code>"Add 2 kg mangoes"</code></p>
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

          {/* Grand Total */}
          <AnimatePresence>
            {items.length > 0 && (
              <motion.div
                className="total"
                variants={scaleIn}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <span className="total-label">Grand Total</span>
                <span className="total-val">₹{totalPrice.toFixed(2)}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search Results */}
          <AnimatePresence>
            {searchResults.length > 0 && (
              <motion.div variants={scaleIn} initial="hidden" animate="visible" exit="exit">
                <div className="sc">
                  <div className="sc-head">
                    <span className="sc-title">Search Results</span>
                    <span className="sc-pill">{searchResults.length}&nbsp;found</span>
                  </div>
                  <div className="sc-body">
                    <CatalogResults results={searchResults} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ornamental rule */}
          <div className="hrule" aria-hidden="true">
            <div className="hrule-line" />
            <div className="hrule-gem" />
            <div className="hrule-line" />
            <div className="hrule-gem" />
            <div className="hrule-line" />
          </div>

          {/* Smart Insights */}
          <motion.div variants={fadeUp} custom={5} initial="hidden" animate="visible">
            <div className="sc">
              <div className="sc-head">
                <span className="sc-title">Smart Suggestions</span>
                <span className="sc-pill">Personalised</span>
              </div>
              <div className="sc-body">
                <SmartInsights
                  frequent={items.filter((i) => (i.addedCount || 0) >= 2).map((i) => i.name)}
                  reorder={smartSuggestions.reorder}
                  seasonal={smartSuggestions.seasonal}
                  alsoBought={alsoBought}
                  onAdd={handleVoiceCommand}
                />
              </div>
            </div>
          </motion.div>

        </main>

        <Footer />
      </div>
    </>
  );
}