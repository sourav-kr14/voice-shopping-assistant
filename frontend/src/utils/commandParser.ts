export type CommandAction = "add" | "remove" | "unknown";

export interface ParsedCommand {
  action: CommandAction;
  item: string | null;
  quantity: number;
}

export function parseCommand(input: string): ParsedCommand {
  const text = input.toLowerCase().trim();

  
  let action: CommandAction = "unknown";

  if (text.includes("add") || text.includes("buy") || text.includes("need")) {
    action = "add";
  } else if (text.includes("remove") || text.includes("delete")) {
    action = "remove";
  }

  
  const quantityMatch = text.match(/\d+/);
  const quantity = quantityMatch ? parseInt(quantityMatch[0], 10) : 1;

 
  let cleaned = text
    .replace(/add|buy|need|remove|delete/g, "")
    .replace(/\d+/g, "")
    .replace(/bottles?|packets?|pieces?|of/g, "")
    .trim();

  const item = cleaned.length > 0 ? cleaned : null;

  return {
    action,
    item,
    quantity,
  };
}
