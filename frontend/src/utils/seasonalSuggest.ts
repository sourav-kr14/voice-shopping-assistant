const seasonalProducts: Record<string, string[]> = {
  winter: ["carrot", "spinach", "orange"],
  summer: ["watermelon", "mango", "cucumber"],
  monsoon: ["corn", "ginger"],
};

function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1;

  if (month >= 3 && month <= 6) return "summer";
  if (month >= 7 && month <= 9) return "monsoon";
  return "winter";
}

export function getSeasonalSuggestions(): string[] {
  const season = getCurrentSeason();
  return seasonalProducts[season] || [];
}
