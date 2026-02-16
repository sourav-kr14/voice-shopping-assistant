import { getSuggestions } from "./Suggestions";
import { getSeasonalSuggestions } from "./seasonalSuggest";

export interface SmartSuggestions {
  reorder: string[];
  seasonal: string[];
}

export function getSmartSuggestions(): SmartSuggestions {
  return {
    reorder: getSuggestions(),
    seasonal: getSeasonalSuggestions(),
  };
}
