"use client";

import { useState, useEffect, useMemo } from "react";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import VoiceButton from "@/src/components/home/VoiceButton";
import ShoppingList from "@/src/components/home/ShoppingList";
import CatalogResults from "@/src/components/home/CatalogResults";

import { parseCommand } from "@/src/utils/commandParser";
import { mockProducts, Product } from "@/src/utils/mockProduct";
import { intelligentSearch } from "@/src/utils/intelligentSearch";
import { getSmartSuggestions } from "@/src/utils/smartSuggestions";
import { recordPurchase } from "@/src/utils/purchaseHistory";
import {
  recordBasket,
  getPeopleAlsoBought,
} from "@/src/utils/basketIntelligence";
import SmartInsights from "../components/home/SmartInsightsSection";
interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  addedCount?: number;
}
import { ToastPremium } from "../components/ui/ToastPremium";

export default function Home() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("shopping-items");
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("shopping-items", JSON.stringify(items));
  }, [items]);

  const groupedItems = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
      },
      {} as Record<string, ShoppingItem[]>,
    );
  }, [items]);

  const smartSuggestions = useMemo(() => {
    return getSmartSuggestions();
  }, [items]);

  const alsoBought = useMemo(() => {
    if (items.length === 0) return [];
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

    ToastPremium({
      type: "error",
      message: `${name} removed from cart`,
    });

    setMessage(`Removed ${name}`);
  };

  const handleVoiceCommand = async (text: string) => {
    try {
      const parsed = parseCommand(text, mockProducts);
      if (!parsed) {
        setMessage("I didn't understand that.");
        return;
      }

      const { action, items: parsedItems } = parsed;

      switch (action) {
        case "add":
          if (!parsedItems?.length) return;
          setIsLoading(true);

          const addedNames: string[] = [];

          for (const entry of parsedItems) {
            let { name, quantity } = entry;

            const correctionResponse = intelligentSearch(
              {
                action: "search",
                items: [{ name, brand: null, category: null }],
                minPrice: null,
                maxPrice: null,
              },
              mockProducts,
            );

            if (
              correctionResponse.suggestion &&
              correctionResponse.topScore < 3
            ) {
              name = correctionResponse.suggestion;
            }

            let aiCategory = "Others";

            try {
              const response = await fetch("/api/categorize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ item: name }),
              });

              if (response.ok) {
                const data = await response.json();
                aiCategory = data?.category || "Others";
              }
            } catch {
              console.error("AI Categorization failed");
            }

            setItems((prev) => {
              const existing = prev.find(
                (i) => i.name.toLowerCase() === name.toLowerCase(),
              );

              let updated: ShoppingItem[];

              if (existing) {
                updated = prev.map((i) =>
                  i.name.toLowerCase() === name.toLowerCase()
                    ? {
                        ...i,
                        quantity: i.quantity + quantity,
                        addedCount: (i.addedCount || 0) + 1,
                      }
                    : i,
                );
              } else {
                updated = [
                  ...prev,
                  {
                    id: crypto.randomUUID(),
                    name,
                    quantity,
                    category: aiCategory,
                    addedCount: 1,
                  },
                ];
              }

              recordBasket(updated.map((i) => i.name));
              return updated;
            });

            recordPurchase(name);
            addedNames.push(name);
          }

          ToastPremium({
            type: "success",
            message:
              addedNames.length === 1
                ? `${addedNames[0]} added to cart`
                : `${addedNames.length} items added to cart`,
          });

          // setMessage("Items added successfully.");
          setIsLoading(false);
          break;

        case "search":
          if (!parsedItems?.length) return;

          const searchResponse = intelligentSearch(parsed, mockProducts);

          let finalResults = searchResponse.results;
          let finalMessage = "";

          if (
            (searchResponse.results.length === 0 ||
              searchResponse.topScore < 3) &&
            searchResponse.suggestion
          ) {
            const correctedParsed = {
              ...parsed,
              items: [
                {
                  ...parsed.items[0],
                  name: searchResponse.suggestion!,
                },
              ],
            };

            const correctedResponse = intelligentSearch(
              correctedParsed,
              mockProducts,
            );

            if (correctedResponse.results.length > 0) {
              finalResults = correctedResponse.results;
              finalMessage = `Showing results for "${searchResponse.suggestion}" (auto-corrected)`;
            }
          }

          if (!finalMessage) {
            finalMessage =
              finalResults.length === 0
                ? "No products found."
                : `Found ${finalResults.length} matches`;
          }

          setSearchResults(finalResults);
          setMessage(finalMessage);
          break;

        default:
          setMessage("Command recognized, but no action taken.");
      }
    } catch (error) {
      console.error("Voice handler error:", error);
      setMessage("Assistant encountered an error.");
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Global premium styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --ink: #0D0D12;
          --paper: #F7F5F0;
          --cream: #EDE9E1;
          --warm-white: #FAFAF7;
          --gold: #C9A84C;
          --gold-light: #E8CA7A;
          --gold-dim: rgba(201, 168, 76, 0.15);
          --sage: #7A8C7B;
          --charcoal: #2A2A35;
          --mist: rgba(13, 13, 18, 0.06);
          --border: rgba(13, 13, 18, 0.09);
          --shadow-sm: 0 2px 12px rgba(13,13,18,0.06);
          --shadow-md: 0 8px 32px rgba(13,13,18,0.10);
          --shadow-lg: 0 24px 64px rgba(13,13,18,0.13);
          --radius: 18px;
          --radius-sm: 10px;
        }

        *, *::before, *::after { box-sizing: border-box; }

        html { scroll-behavior: smooth; }

        body {
          font-family: 'DM Sans', sans-serif;
          background-color: var(--warm-white);
          color: var(--ink);
          -webkit-font-smoothing: antialiased;
        }

        /* Stagger-in animation for sections */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up {
          animation: fadeUp 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .fade-up-1 { animation-delay: 0.05s; }
        .fade-up-2 { animation-delay: 0.18s; }
        .fade-up-3 { animation-delay: 0.30s; }
        .fade-up-4 { animation-delay: 0.42s; }
        .fade-up-5 { animation-delay: 0.54s; }

        /* Shimmer for loading state */
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }

        /* Pulse dot */
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.75); }
        }

        /* Gold shimmer line */
        @keyframes goldSlide {
          from { transform: translateX(-100%); }
          to   { transform: translateX(100%); }
        }

        .page-wrapper {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background: var(--warm-white);
          /* Subtle linen texture via repeating gradient */
          background-image:
            radial-gradient(ellipse 80% 60% at 50% -10%, rgba(201,168,76,0.07) 0%, transparent 70%),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='4' height='4' fill='%23f7f5f0'/%3E%3Crect x='0' y='0' width='1' height='1' fill='rgba(0,0,0,0.015)'/%3E%3C/svg%3E");
        }

        .main-content {
          flex-grow: 1;
          max-width: 860px;
          margin: 0 auto;
          width: 100%;
          padding: 0 24px 80px;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        /* ── Hero / Voice section ───────────────────────────── */
        .hero-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 72px 0 56px;
          position: relative;
        }

        .hero-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .hero-eyebrow::before,
        .hero-eyebrow::after {
          content: '';
          display: block;
          width: 28px;
          height: 1px;
          background: var(--gold);
          opacity: 0.5;
        }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(32px, 5vw, 46px);
          font-weight: 500;
          color: var(--ink);
          text-align: center;
          line-height: 1.18;
          margin: 0 0 10px;
          letter-spacing: -0.01em;
        }

        .hero-subtitle {
          font-size: 15px;
          color: rgba(13,13,18,0.45);
          font-weight: 300;
          margin-bottom: 44px;
          letter-spacing: 0.01em;
        }

        /* ── Section card wrapper ───────────────────────────── */
        .section-card {
          background: #FFFFFF;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          box-shadow: var(--shadow-sm);
          overflow: hidden;
          margin-bottom: 20px;
          transition: box-shadow 0.3s ease;
        }
        .section-card:hover {
          box-shadow: var(--shadow-md);
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 22px 28px 18px;
          border-bottom: 1px solid var(--border);
        }

        .section-label {
          font-family: 'Playfair Display', serif;
          font-size: 17px;
          font-weight: 500;
          color: var(--ink);
          letter-spacing: -0.01em;
        }

        .section-badge {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--gold);
          background: var(--gold-dim);
          border: 1px solid rgba(201,168,76,0.2);
          border-radius: 100px;
          padding: 3px 10px;
        }

        .section-body {
          padding: 24px 28px;
        }

        /* ── Divider ────────────────────────────────────────── */
        .ornamental-divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 36px 0;
          opacity: 0.35;
        }
        .ornamental-divider span {
          flex: 1;
          height: 1px;
          background: var(--ink);
        }
        .ornamental-divider svg {
          width: 14px;
          height: 14px;
          color: var(--gold);
          flex-shrink: 0;
        }

        /* ── Status message ─────────────────────────────────── */
        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 13px;
          font-weight: 400;
          color: rgba(13,13,18,0.55);
          background: rgba(13,13,18,0.04);
          border: 1px solid var(--border);
          border-radius: 100px;
          padding: 6px 16px;
          margin: 8px auto 0;
        }
        .status-pill::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--sage);
          animation: pulseDot 1.8s ease-in-out infinite;
        }

        /* ── Loading overlay for voice ──────────────────────── */
        .voice-loading-bar {
          width: 120px;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, var(--gold) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: goldSlide 1.4s linear infinite;
          border-radius: 2px;
          margin-top: 20px;
          opacity: ${isLoading ? 1 : 0};
          transition: opacity 0.3s;
        }

        /* ── Empty state ────────────────────────────────────── */
        .empty-hint {
          text-align: center;
          padding: 36px 20px;
          color: rgba(13,13,18,0.35);
          font-size: 14px;
          font-weight: 300;
          letter-spacing: 0.01em;
        }
        .empty-hint strong {
          display: block;
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 500;
          color: rgba(13,13,18,0.2);
          margin-bottom: 6px;
        }

        /* ── Scrollbar ──────────────────────────────────────── */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(13,13,18,0.12); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(13,13,18,0.22); }
      `}</style>

      <div className="page-wrapper">
        <Header />

        <main className="main-content">

          {/* ── Hero / Voice ─────────────────────────────────── */}
          <section className="hero-section fade-up fade-up-1">
            <p className="hero-eyebrow">Voice-Powered Shopping</p>
            <h1 className="hero-title">What shall we pick up today?</h1>
            <p className="hero-subtitle">Speak naturally — add, search, and organize your list.</p>

            <VoiceButton onTranscript={handleVoiceCommand} />

            <div className="voice-loading-bar" />

            {message && (
              <div className="status-pill" role="status" aria-live="polite">
                {message}
              </div>
            )}
          </section>

          {/* ── Shopping List ─────────────────────────────────── */}
          <div className="fade-up fade-up-2">
            <div className="section-card">
              <div className="section-header">
                <span className="section-label">Your List</span>
                {items.length > 0 && (
                  <span className="section-badge">{items.length} item{items.length !== 1 ? 's' : ''}</span>
                )}
              </div>
              <div className="section-body">
                {items.length === 0 ? (
                  <div className="empty-hint">
                    <strong>Nothing here yet</strong>
                    Try saying "Add milk and eggs"
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
          </div>

          {/* ── Catalog Results ───────────────────────────────── */}
          {searchResults.length > 0 && (
            <div className="fade-up fade-up-3">
              <div className="section-card">
                <div className="section-header">
                  <span className="section-label">Search Results</span>
                  <span className="section-badge">{searchResults.length} found</span>
                </div>
                <div className="section-body">
                  <CatalogResults results={searchResults} />
                </div>
              </div>
            </div>
          )}

          {/* ── Ornamental divider ───────────────────────────── */}
          <div className="ornamental-divider fade-up fade-up-4" aria-hidden="true">
            <span />
            <svg viewBox="0 0 14 14" fill="currentColor">
              <polygon points="7,1 9,5.5 14,6.3 10.5,9.7 11.4,14 7,11.7 2.6,14 3.5,9.7 0,6.3 5,5.5" />
            </svg>
            <span />
            <svg viewBox="0 0 14 14" fill="currentColor">
              <circle cx="7" cy="7" r="3" />
            </svg>
            <span />
            <svg viewBox="0 0 14 14" fill="currentColor">
              <polygon points="7,1 9,5.5 14,6.3 10.5,9.7 11.4,14 7,11.7 2.6,14 3.5,9.7 0,6.3 5,5.5" />
            </svg>
            <span />
          </div>

          {/* ── Smart Insights ────────────────────────────────── */}
          <div className="fade-up fade-up-5">
            <div className="section-card">
              <div className="section-header">
                <span className="section-label">Smart Suggestions</span>
                <span className="section-badge">Personalised</span>
              </div>
              <div className="section-body">
                <SmartInsights
                  frequent={smartSuggestions.frequent}
                  reorder={smartSuggestions.reorder}
                  seasonal={smartSuggestions.seasonal}
                  alsoBought={alsoBought}
                  onAdd={handleVoiceCommand}
                />
              </div>
            </div>
          </div>

        </main>

        <Footer />
      </div>
    </>
  );
}