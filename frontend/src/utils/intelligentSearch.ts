import { Product } from "./mockProduct";
export interface ParsedCommand {
  action: string;
  items: Array<{
    name: string;
    brand: string | null;
    category: string | null;
    quantity?: number;
  }>;
  minPrice: number | null;
  maxPrice: number | null;
}

interface SearchResult {
  product: Product;
  score: number;
}

export interface IntelligentSearchResponse {
  results: Product[];
  intentConfidence: number;
  topScore: number;
  suggestion: string | null;
}


function stem(word: string): string {
  const w = word.toLowerCase().trim();
  if (w.endsWith('ies')) return w.slice(0, -3) + 'y';
  if (w.endsWith('es')) return w.slice(0, -2);
  if (w.endsWith('s') && !w.endsWith('ss')) return w.slice(0, -1);
  return w;
}

function levenshtein(a: string, b: string): number {
  const matrix: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array(b.length + 1).fill(0)
  );
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
}

function similarity(a: string, b: string): number {
  const sA = a.toLowerCase().trim();
  const sB = b.toLowerCase().trim();
  
 
  if (sA === sB || sB.includes(sA) || sA.includes(sB)) return 1.0;
  
 
  if (stem(sA) === stem(sB)) return 0.95;

 
  const distance = levenshtein(sA, sB);
  const maxLen = Math.max(sA.length, sB.length);
  return maxLen === 0 ? 1 : 1 - distance / maxLen;
}

export function intelligentSearch(
  parsedCommand: ParsedCommand,
  products: Product[]
): IntelligentSearchResponse {
  const scored: SearchResult[] = [];

  for (const product of products) {
    let score = 0;
    const productName = product.name.toLowerCase();

    for (const item of parsedCommand.items) {
      const sim = similarity(item.name, productName);

      if (sim === 1.0) score += 10;    
      else if (sim >= 0.9) score += 8; 
      else if (sim > 0.4) score += sim * 5;

      if (item.brand && product.brand.toLowerCase().includes(item.brand.toLowerCase())) {
        score += 3;
      }
    }

    if (score > 0) scored.push({ product, score });
  }

  scored.sort((a, b) => b.score - a.score);
  const results = scored.map((s) => s.product);
  const topScore = scored.length > 0 ? scored[0].score : 0;

  let suggestion: string | null = null;
  if (results.length === 0 && parsedCommand.items.length > 0) {
    let bestMatchName = null;
    let highestSim = 0;
    for (const p of products) {
      const s = similarity(parsedCommand.items[0].name, p.name);
      if (s > highestSim) { highestSim = s; bestMatchName = p.name; }
    }
    if (highestSim > 0.4) suggestion = bestMatchName;
  }

  return {
    results,
    intentConfidence: parsedCommand.action === "search" ? 0.95 : 0.9,
    topScore,
    suggestion,
  };
}