interface BasketMap {
  [item: string]: {
    [relatedItem: string]: number;
  };
}

const STORAGE_KEY = "voice_cart_basket_map";

function getBasketMap(): BasketMap {
  if (typeof window === "undefined") return {};
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
}

function saveBasketMap(map: BasketMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function recordBasket(items: string[]) {
  const map = getBasketMap();

  for (let i = 0; i < items.length; i++) {
    for (let j = 0; j < items.length; j++) {
      if (i === j) continue;

      const itemA = items[i].toLowerCase();
      const itemB = items[j].toLowerCase();

      if (!map[itemA]) map[itemA] = {};
      if (!map[itemA][itemB]) map[itemA][itemB] = 0;

      map[itemA][itemB] += 1;
    }
  }

  saveBasketMap(map);
}

//logic to get similar items people bought
export function getPeopleAlsoBought(item: string): string[] {
  const map = getBasketMap();
  const related = map[item.toLowerCase()] || {};

  return Object.entries(related)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => name);
}
