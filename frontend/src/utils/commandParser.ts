export type CommandAction = "add" | "remove" | "search" | "clear" | "unknown";

export interface ParsedItem {
  item: string;
  quantity: number;
}

export interface ParsedCommand {
  action: CommandAction;
  items: ParsedItem[];
  minPrice: number | null;
  maxPrice: number | null;
}

export function parseCommand(input: string): ParsedCommand {
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


  const betweenMatch = text.match(
    /between\s+\$?(\d+)\s+(and|to)\s+\$?(\d+)/
  );
  if (betweenMatch) {
    minPrice = parseInt(betweenMatch[1], 10);
    maxPrice = parseInt(betweenMatch[3], 10);
  }


  const underMatch = text.match(
    /(under|below|less than)\s+\$?(\d+)/
  );
  if (underMatch) {
    maxPrice = parseInt(underMatch[2], 10);
  }


  const aboveMatch = text.match(
    /(above|more than|over)\s+\$?(\d+)/
  );
  if (aboveMatch) {
    minPrice = parseInt(aboveMatch[2], 10);
  }

  
  let cleanedText = text
    .replace(/(add|buy|need|want|put|get)/gi, "")
    .replace(/(remove|delete|take out)/gi, "")
    .replace(/(find|search|show|look for)/gi, "")
    .replace(/(clear|empty cart)/gi, "")
    .replace(/between\s+\$?\d+\s+(and|to)\s+\$?\d+/gi, "")
    .replace(/(under|below|less than|above|more than|over)\s+\$?\d+/gi, "")
    .replace(/please|me|my|to|the|a|an|cart|list|some/gi, "")
    .trim();

 
  const parts = cleanedText.split(/\s+and\s+/);

  const items: ParsedItem[] = [];

  for (const part of parts) {
    const quantityMatch = part.match(/\b\d+\b/);
    const quantity = quantityMatch ? parseInt(quantityMatch[0], 10) : 1;

    const itemName = part
      .replace(/\b\d+\b/g, "")
      .replace(/kg|kilo|litre|liter|packet|packets|bottle|bottles|pieces?|of/gi, "")
      .trim();

    if (itemName) {
      items.push({
        item: itemName,
        quantity,
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
