import { getFrequentPurchases, getPurchaseHistory } from "./purchaseHistory";
import { getSeasonalSuggestions } from "./seasonalSuggest";


export interface SmartSuggestions {
  frequent: string[];
  reorder: string[];
  seasonal: string[];
}

function getReorderReminders(): string[] {
  const history = getPurchaseHistory();
  const today = Date.now();

  return history
    .filter((entry) => {
      const daysSince =
        (today - entry.lastPurchased) / (1000 * 60 * 60 * 24);

      return daysSince > entry.averageInterval;
    })
    .map((entry) => entry.item);
}

export function getSmartSuggestions(): SmartSuggestions {
  return {
    frequent: getFrequentPurchases(),
    reorder: getReorderReminders(),
    seasonal: getSeasonalSuggestions(),
  };
}
