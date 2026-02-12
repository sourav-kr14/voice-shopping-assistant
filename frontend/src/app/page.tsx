"use client";

import VoiceButton from "@/src/components/VoiceButton";
import { useState } from "react";
import { parseCommand } from "../utils/commandParser";

interface Item {
  id: string;
  name: string;
  quantity: number;
  category: string;
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [transcript, setTranscript] = useState<string>("");

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🎙 Voice Command Shopping Assistant
        </h1>
        <p className="text-gray-500 mb-6">
          Add items to your shopping list using voice commands.
        </p>

        <div className="bg-white rounded-xl shadow p-6 mb-6 flex flex-col items-center gap-4">
          <VoiceButton
            onTranscript={(text) => {
              setTranscript(text);

              const parsed = parseCommand(text); 
              const { action, item, quantity } = parsed;

              if (action === "add" && item) {
                setItems((prev) => [
                  ...prev,
                  {
                    id: crypto.randomUUID(), 
                    name: item,
                    quantity,
                    category: "Uncategorized",
                  },
                ]);
              }

              if (action === "remove" && item) {
                setItems((prev) =>
                  prev.filter((existingItem) => existingItem.name !== item),
                );
              }
            }}
          />

          <div className="w-full bg-gray-50 border rounded-md p-3 text-sm text-gray-600">
            {transcript ? transcript : "Your voice command will appear here..."}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">🛒 Shopping List</h2>

          {items.length === 0 ? (
            <p className="text-gray-500 text-sm">No items added yet.</p>
          ) : (
            <ul className="space-y-2">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-md"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.category}</p>
                  </div>
                  <span className="text-sm font-semibold">
                    x{item.quantity}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">✨ Smart Suggestions</h2>
          <p className="text-gray-500 text-sm">
            Suggestions will appear based on your shopping history.
          </p>
        </div>
      </div>
    </main>
  );
}
