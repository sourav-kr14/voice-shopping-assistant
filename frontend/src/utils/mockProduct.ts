export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: string;
}

export const mockProducts: Product[] = [
  { id: "1", name: "Organic Apples", brand: "FreshFarm", price: 120, category: "Produce" },
  { id: "2", name: "Milk", brand: "Amul", price: 60, category: "Dairy" },
  { id: "3", name: "Almond Milk", brand: "Alpro", price: 180, category: "Beverages" },
  { id: "4", name: "Toothpaste", brand: "Colgate", price: 90, category: "Household" },
  { id: "5", name: "Whole Wheat Bread", brand: "Britannia", price: 45, category: "Bakery" },
  { id: "6", name: "Bananas", brand: "LocalFarm", price: 40, category: "Produce" },
];
