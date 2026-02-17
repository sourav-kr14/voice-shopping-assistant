export type CommandAction = "add" | "remove" | "search" | "clear" | "unknown";

export interface ParsedItem {
  name: string;
  quantity: number;
  unit: string | null;
  brand: string | null;
  category: string | null;
}

export interface ParsedCommand {
  action: CommandAction;
  items: ParsedItem[];
  minPrice: number | null;
  maxPrice: number | null;
}

interface Product {
  name: string;
  brand: string;
  category: string;
}
//filtartion logic to clearly get the voice from user
export function parseCommand(
  input: string,
  products: Product[],
): ParsedCommand {
  const text = input.toLowerCase().trim();

  let action: CommandAction = "unknown";

  if (/(add|buy|need|want|put|get)/i.test(text)) {
    action = "add";
  } else if (/(remove|delete|take out)/i.test(text)) {
    action = "remove";
  } else if (/(find|search|show|look for)/i.test(text)) {
    action = "search";
  } else if (/(clear|empty cart)/i.test(text)) {
    action = "clear";
  }

  let minPrice: number | null = null;
  let maxPrice: number | null = null;

  const betweenMatch = text.match(/between\s+\$?(\d+)\s+(and|to)\s+\$?(\d+)/);
  if (betweenMatch) {
    minPrice = parseInt(betweenMatch[1], 10);
    maxPrice = parseInt(betweenMatch[3], 10);
  }

  const underMatch = text.match(/(under|below|less than)\s+\$?(\d+)/);
  if (underMatch) {
    maxPrice = parseInt(underMatch[2], 10);
  }

  const aboveMatch = text.match(/(above|more than|over)\s+\$?(\d+)/);
  if (aboveMatch) {
    minPrice = parseInt(aboveMatch[2], 10);
  }
  //clean and remove unnecessary words
  let cleanedText = text
    .replace(/(add|buy|need|want|put|get)/gi, "")
    .replace(/(remove|delete|take out)/gi, "")
    .replace(/(find|search|show|look for)/gi, "")
    .replace(/(clear|empty cart)/gi, "")
    .replace(/between\s+\$?\d+\s+(and|to)\s+\$?\d+/gi, "")
    .replace(/(under|below|less than|above|more than|over)\s+\$?\d+/gi, "")
    .replace(/\b(please|me|my|to|the|a|an|cart|list|some|for)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  const parts = cleanedText.split(/\s+and\s+/);

  const items: ParsedItem[] = [];

  const brands = new Set(products.map((p) => p.brand.toLowerCase()));
  const categories = new Set(products.map((p) => p.category.toLowerCase()));

  for (const part of parts) {
    let quantity = 1;
    let unit: string | null = null;
    let brand: string | null = null;
    let category: string | null = null;

    const quantityMatch = part.match(/\b\d+\b/);
    if (quantityMatch) {
      quantity = parseInt(quantityMatch[0], 10);
    }

    const unitMatch = part.match(
      /\b(kg|kilo|litre|liter|ml|gram|g|packet|pack|bottle|pieces?)\b/,
    );
    if (unitMatch) {
      unit = unitMatch[1];
    }

    let itemName = part
      .replace(/\b\d+\b/g, "")
      .replace(
        /\b(kg|kilo|litre|liter|ml|gram|g|packet|pack|bottle|pieces?)\b/gi,
        "",
      )
      .trim();

    for (const b of brands) {
      if (itemName.includes(b)) {
        brand = b;
        itemName = itemName.replace(b, "").trim();
        break;
      }
    }

    for (const c of categories) {
      if (itemName.includes(c)) {
        category = c;
        itemName = itemName.replace(c, "").trim();
        break;
      }
    }

    if (itemName) {
      items.push({
        name: itemName,
        quantity,
        unit,
        brand,
        category,
      });
    }
  }

  return {
    action,
    items,
    minPrice,
    maxPrice,
  };
}
