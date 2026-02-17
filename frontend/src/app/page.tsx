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
  category: string;
  addedCount?: number;
}

export default function Home() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

 
  useEffect(() => {
    const saved = localStorage.getItem("shopping-items");
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

 
  useEffect(() => {
    localStorage.setItem("shopping-items", JSON.stringify(items));
  }, [items]);

 
  const groupedItems = useMemo(() => {
    return items.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, ShoppingItem[]>);
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
          : item
      )
    );
  };

  const handleRemoveItem = (name: string) => {
    setItems((prev) =>
      prev.filter((i) => i.name.toLowerCase() !== name.toLowerCase())
    );
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

          for (const entry of parsedItems) {
            let { name, quantity } = entry;

            
            const correctionResponse = intelligentSearch(
              {
                action: "search",
                items: [{ name, brand: null, category: null }],
                minPrice: null,
                maxPrice: null,
              },
              mockProducts
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
                (i) => i.name.toLowerCase() === name.toLowerCase()
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
                    : i
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
          }

          setMessage("Items added successfully.");
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
              mockProducts
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
          onAdd={handleVoiceCommand}
        />

        {message && (
          <div className="text-center text-sm text-gray-600">
            {message}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
