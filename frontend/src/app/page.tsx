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

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  const [transcript, setTranscript] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleAddSuggestion = (suggestionText: string) => {
    handleVoiceCommand(suggestionText);
  };
  const handleUpdateQuantity = (name: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.name.toLowerCase() === name.toLowerCase()) {
          const newQty = item.quantity + delta;

          return { ...item, quantity: Math.max(1, newQty) };
        }
        return item;
      }),
    );
  };
  const handleRemoveItem = (name: string) => {
    setItems((prev) =>
      prev.filter((i) => i.name.toLowerCase() !== name.toLowerCase()),
    );
    setMessage(`Removed ${name}`);
  };

  // Logic (LocalStorage, Memoized functions) stays here or in custom hooks
  useEffect(() => {
    const saved = localStorage.getItem("shopping-items");
    if (saved) setItems(JSON.parse(saved));
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
      {} as Record<string, any[]>,
    );
  }, [items]);

  const handleVoiceCommand = async (text: string) => {
    try {
      setTranscript(text);
      const parsed = parseCommand(text);

      if (!parsed || (!parsed.item && parsed.action !== "clear")) {
        setMessage("I didn't quite catch that. Try 'Add milk'.");
        return;
      }

      const { action, item, quantity, maxPrice } = parsed;
      const safeQuantity = quantity && quantity > 0 ? quantity : 1;

      switch (action) {
        case "add":
          if (!item) return;
          setIsLoading(true);

          // 1. Get AI-powered category
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
          } catch (err) {
            console.error("AI Categorization failed, defaulting to Others");
          }

          setItems((prev) => {
            const existing = prev.find(
              (i) => i.name.toLowerCase() === item.toLowerCase(),
            );

            if (existing) {
              return prev.map((i) =>
                i.name.toLowerCase() === item.toLowerCase()
                  ? {
                      ...i,
                      quantity: i.quantity + safeQuantity,
                      addedCount: i.addedCount + 1,
                    }
                  : i,
              );
            }

            return [
              ...prev,
              {
                id: crypto.randomUUID(),
                name: item,
                quantity: safeQuantity,
                category: aiCategory,
                addedCount: 1,
              },
            ];
          });

          setMessage(`Added ${safeQuantity} ${item} to ${aiCategory}`);
          setSearchResults([]);
          setIsLoading(false);
          break;

        case "remove":
          if (!item) return;
          setItems((prev) =>
            prev.filter((i) => i.name.toLowerCase() !== item.toLowerCase()),
          );
          setMessage(`Removed ${item} from your list`);
          setSearchResults([]);
          break;

        case "search":
          if (!item) return;
          let results = mockProducts.filter((p) =>
            p.name.toLowerCase().includes(item.toLowerCase()),
          );

          if (maxPrice) {
            results = results.filter((p) => p.price <= maxPrice);
          }

          setSearchResults(results);
          setMessage(
            results.length > 0
              ? `Found ${results.length} matches`
              : `No products found for ${item}`,
          );
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
          frequent={items.filter((i) => i.addedCount >= 2).map((i) => i.name)}
          onAdd={handleAddSuggestion} // Pass the function here
        />
      </main>
      <Footer />
    </div>
  );
}
