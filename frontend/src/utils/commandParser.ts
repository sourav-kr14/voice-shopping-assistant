export type CommandAction = "add" | "remove" | "search" | "unknown";

export interface ParsedCommand {
  action: CommandAction;
  item: string | null;
  quantity: number;
  maxPrice: number | null;
}

export function parseCommand(input: string): ParsedCommand {
  const text = input.toLowerCase().trim();

  let action: CommandAction = "unknown";

  if (text.includes("add") || text.includes("buy") || text.includes("need")) {
    action = "add";
  } else if (text.includes("remove") || text.includes("delete")) {
    action = "remove";
  } else if (text.includes("find") || text.includes("search")) {
    action = "search";
  }

  const quantityMatch = text.match(/\d+/);
  const quantity = quantityMatch ? parseInt(quantityMatch[0], 10) : 1;

  const priceMatch = text.match(/under\s+(\d+)/);
  const maxPrice = priceMatch ? parseInt(priceMatch[1], 10) : null;

  let cleaned = text
    .replace(/add|buy|need|remove|delete|find|search/g, "")
    .replace(/under\s+\d+/g, "")
    .replace(/\d+/g, "")
    .replace(/bottles?|packets?|pieces?|of/g, "")
    .trim();

  const item = cleaned.length > 0 ? cleaned : null;

  return {
    action,
    item,
    quantity,
    maxPrice,
  };
}
