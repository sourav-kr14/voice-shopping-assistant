interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
}

interface ParsedItem {
  name: string;
  brand: string | null;
  category: string | null;
}

interface ParsedCommand {
  action: string;
  items: ParsedItem[];
  minPrice: number | null;
  maxPrice: number | null;
}

interface SearchResult {
  product: Product;
  score: number;
}

interface IntelligentSearchResponse {
  results: Product[];
  intentConfidence: number;
  topScore: number;
  suggestion: string | null;
}

// LEVENSHTEIN + SIMILARITY

function levenshtein(a: string, b: string): number {
  const matrix: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array(b.length + 1).fill(0),
  );

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;

      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }

  return matrix[a.length][b.length];
}

function similarity(a: string, b: string): number {
  if (!a || !b) return 0;

  const distance = levenshtein(a, b);
  const maxLen = Math.max(a.length, b.length);

  if (maxLen === 0) return 1;

  return 1 - distance / maxLen;
}

//SUGGESTION ENGINE
function getBestSuggestion(query: string, products: Product[]): string | null {
  let bestMatch: string | null = null;
  let bestScore = 0;

  for (const product of products) {
    const score = similarity(query.toLowerCase(), product.name.toLowerCase());

    if (score > bestScore) {
      bestScore = score;
      bestMatch = product.name;
    }
  }

  return bestScore > 0.5 ? bestMatch : null;
}

//MAIN SEARCH ENGINE

export function intelligentSearch(
  parsedCommand: ParsedCommand,
  products: Product[],
): IntelligentSearchResponse {
  const scored: SearchResult[] = [];

  for (const product of products) {
    let score = 0;

    const productName = product.name.toLowerCase();
    const productBrand = product.brand.toLowerCase();
    const productCategory = product.category.toLowerCase();

    for (const item of parsedCommand.items) {
      const queryName = item.name.toLowerCase();

      const nameScore = similarity(queryName, productName);
      score += nameScore * 5;

      if (item.brand && productBrand === item.brand.toLowerCase()) {
        score += 3;
      }

      if (item.category && productCategory === item.category.toLowerCase()) {
        score += 2;
      }
    }

    if (parsedCommand.minPrice !== null) {
      score += product.price >= parsedCommand.minPrice ? 1 : -2;
    }

    if (parsedCommand.maxPrice !== null) {
      score += product.price <= parsedCommand.maxPrice ? 1 : -2;
    }

    if (score > 0) {
      scored.push({ product, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);

  const results = scored.map((s) => s.product);
  const topScore = scored.length > 0 ? scored[0].score : 0;

  const intentConfidence =
    parsedCommand.action === "search"
      ? 0.95
      : parsedCommand.action === "add"
        ? 0.9
        : 0.6;

  let suggestion: string | null = null;

  if (
    (results.length === 0 || topScore < 3) &&
    parsedCommand.items.length > 0
  ) {
    suggestion = getBestSuggestion(parsedCommand.items[0].name, products);
  }

  return {
    results,
    intentConfidence,
    topScore,
    suggestion,
  };
}
