"use client";

import { useState, useEffect, useMemo } from "react";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import VoiceButton from "@/src/components/home/VoiceButton";
import ShoppingList from "@/src/components/home/ShoppingList";
import CatalogResults from "@/src/components/home/CatalogResults";
import SmartInsights from "@/src/components/home/SmartInsights";

import { parseCommand } from "@/src/utils/commandParser";
import { mockProducts, Product } from "@/src/utils/mockProduct";

import { getSmartSuggestions } from "@/src/utils/smartSuggestions";
import { getSubstitutes } from "@/src/utils/substitutes";
import { recordPurchase } from "@/src/utils/purchaseHistory";
import {
  recordBasket,
  getPeopleAlsoBought,
} from "@/src/utils/basketIntelligence";

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Local Storage

  useEffect(() => {
    const saved = localStorage.getItem("shopping-items");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("shopping-items", JSON.stringify(items));
  }, [items]);

  // Group by Category

  const groupedItems = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
      },
      {} as Record<string, any[]>,
    );
  }, [items]);

  // Smart Suggestions

  const smartSuggestions = useMemo(() => {
    return getSmartSuggestions();
  }, [items]);

  const alsoBought = useMemo(() => {
    if (items.length === 0) return [];
    const lastItem = items[items.length - 1]?.name;
    return lastItem ? getPeopleAlsoBought(lastItem) : [];
  }, [items]);

  // Quantity Update

  const handleUpdateQuantity = (name: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.name.toLowerCase() === name.toLowerCase()
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + delta),
            }
          : item,
      ),
    );
  };

  // Remove Item

  const handleRemoveItem = (name: string) => {
    setItems((prev) =>
      prev.filter((i) => i.name.toLowerCase() !== name.toLowerCase()),
    );
    setMessage(`Removed ${name}`);
  };

  // Voice Command Handler

  const handleVoiceCommand = async (text: string) => {
    try {
      const parsed = parseCommand(text);

      if (!parsed) {
        setMessage("I didn't understand that.");
        return;
      }

      const { action, items: parsedItems, maxPrice } = parsed;

      switch (action) {
        case "add":
          if (!parsedItems || parsedItems.length === 0) return;

          setIsLoading(true);

          for (const entry of parsedItems) {
            const { item, quantity } = entry;

            let aiCategory = "Others";

            try {
              const response = await fetch("/api/categorize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ item }),
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
                (i) => i.name.toLowerCase() === item.toLowerCase(),
              );

              let updated;

              if (existing) {
                updated = prev.map((i) =>
                  i.name.toLowerCase() === item.toLowerCase()
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
                    name: item,
                    quantity,
                    category: aiCategory,
                    addedCount: 1,
                  },
                ];
              }

              recordBasket(updated.map((i) => i.name));

              return updated;
            });

            recordPurchase(item);
          }

          setMessage("Items added successfully.");
          setIsLoading(false);
          break;

        case "remove":
          if (!parsedItems || parsedItems.length === 0) return;

          setItems((prev) =>
            prev.filter(
              (i) =>
                !parsedItems.some(
                  (entry) => entry.item.toLowerCase() === i.name.toLowerCase(),
                ),
            ),
          );

          setMessage("Items removed.");
          break;

        // SEARCH

        case "search":
          if (!parsedItems || parsedItems.length === 0) return;

          const searchTerm = parsedItems[0].item;

          let results = mockProducts.filter((p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()),
          );

          if (maxPrice) {
            results = results.filter((p) => p.price <= maxPrice);
          }

          if (results.length === 0) {
            const alternatives = getSubstitutes(searchTerm);

            if (alternatives.length > 0) {
              setMessage(
                `No exact match. You may try: ${alternatives.join(", ")}`,
              );
            } else {
              setMessage(`No products found for ${searchTerm}`);
            }
          } else {
            setMessage(`Found ${results.length} matches`);
          }

          setSearchResults(results);
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

  const handleAddSuggestion = (text: string) => {
    handleVoiceCommand(text);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Header />

      <main className="flex-grow max-w-4xl mx-auto w-full px-6 py-10 space-y-10">
        <div className="flex justify-center py-12">
          <VoiceButton onTranscript={handleVoiceCommand} />
        </div>

        <ShoppingList
          groupedItems={groupedItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemove={handleRemoveItem}
        />

        <CatalogResults results={searchResults} />

        <SmartInsights
          frequent={items
            .filter((i) => (i.addedCount || 0) >= 2)
            .map((i) => i.name)}
          reorder={smartSuggestions.reorder}
          seasonal={smartSuggestions.seasonal}
          alsoBought={alsoBought}
          onAdd={handleAddSuggestion}
        />

        {message && (
          <div className="text-center text-sm text-gray-600">{message}</div>
        )}
      </main>

      <Footer />
    </div>
  );
}
