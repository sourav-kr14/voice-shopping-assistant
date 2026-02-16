export type CommandAction = 
  | "add" 
  | "remove" 
  | "search" 
  | "clear" 
  | "unknown";

export interface ParsedCommand {
  action: CommandAction;
  item: string | null;
  quantity: number;
  maxPrice: number | null;
}

export function parseCommand(input: string): ParsedCommand {
  const text = input.toLowerCase().trim();

  let action: CommandAction = "unknown";

  
  if (/add|buy|need|want|put|get/i.test(text)) {
    action = "add";
  } else if (/remove|delete|take out/i.test(text)) {
    action = "remove";
  } else if (/find|search|show|look for/i.test(text)) {
    action = "search";
  } else if (/clear|empty cart/i.test(text)) {
    action = "clear";
  }

 
  const quantityMatch = text.match(/\b\d+\b/);
  const quantity = quantityMatch ? parseInt(quantityMatch[0], 10) : 1;

 
  const priceMatch = text.match(/under\s+(\d+)/);
  const maxPrice = priceMatch ? parseInt(priceMatch[1], 10) : null;

  
  const cleaned = text
    .replace(/add|buy|need|want|put|get|remove|delete|take out|find|search|show|look for|clear|empty cart/gi, "")
    .replace(/under\s+\d+/gi, "")
    .replace(/\b\d+\b/g, "")
    .replace(/please|me|my|to|the|a|an|cart|list|some/gi, "")
    .replace(/kg|kilo|litre|liter|packet|packets|bottle|bottles|pieces?|dozen/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  const item = cleaned.length > 0 ? cleaned : null;

  return {
    action,
    item,
    quantity,
    maxPrice,
  };
}
