import { Search } from "lucide-react";
import { Product } from "@/src/utils/mockProduct";

export default function CatalogResults({ results }: { results: Product[] }) {
  if (results.length === 0) return null;

  return (
    <section className="bg-white dark:bg-gray-900 rounded-3xl p-8 sm:p-10 border border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">

      <h2 className="text-lg sm:text-xl font-bold mb-8 flex items-center gap-3 text-gray-900 dark:text-white">
        <Search className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        Catalog Matches
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {results.map((product) => (
          <div
            key={product.id}
            className="bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 flex justify-between items-center hover:bg-white dark:hover:bg-gray-700 hover:ring-2 hover:ring-indigo-100 dark:hover:ring-indigo-500/20 transition-all"
          >
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {product.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                In Stock
              </p>
            </div>

            <span className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold">
              ₹{product.price}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
