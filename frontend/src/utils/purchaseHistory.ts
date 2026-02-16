export interface PurchaseEntry {
  item: string;
  lastPurchased: number; 
  purchaseCount: number;
  averageInterval: number;
}

const STORAGE_KEY = "voice_cart_history";

export function getPurchaseHistory(): PurchaseEntry[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function savePurchaseHistory(history: PurchaseEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function recordPurchase(item: string) {
  const history = getPurchaseHistory();
  const today = Date.now();

  const existing = history.find(
    (entry) => entry.item.toLowerCase() === item.toLowerCase()
  );

  if (existing) {
    const daysSinceLast =
      (today - existing.lastPurchased) / (1000 * 60 * 60 * 24);

    const newAverage =
      (existing.averageInterval * existing.purchaseCount +
        daysSinceLast) /
      (existing.purchaseCount + 1);

    existing.purchaseCount += 1;
    existing.lastPurchased = today;
    existing.averageInterval = newAverage;
  } else {
    history.push({
      item,
      lastPurchased: today,
      purchaseCount: 1,
      averageInterval: 7, 
    });
  }

  savePurchaseHistory(history);
}
