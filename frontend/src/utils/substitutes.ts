const substituteMap: Record<string, string[]> = {
  milk: ["almond milk", "soy milk", "oat milk"],
  sugar: ["brown sugar", "jaggery", "stevia"],
  rice: ["brown rice", "quinoa"],
  butter: ["ghee", "margarine"],
};

export function getSubstitutes(item: string): string[] {
  return substituteMap[item.toLowerCase()] || [];
}
