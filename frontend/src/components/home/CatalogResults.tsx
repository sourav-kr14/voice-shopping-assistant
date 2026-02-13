import { Search } from "lucide-react";
import { Product } from "@/src/utils/mockProduct";

export default function CatalogResults({ results }: { results: Product[] }) {
  if (results.length === 0) return null;

  return (
    <section className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl overflow-hidden">
      <h2 className="text-xl font-black mb-8 flex items-center gap-3">
        <Search className="w-6 h-6 text-indigo-400" /> Catalog Matches
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {results.map((product) => (
          <div key={product.id} className="bg-white/5 p-5 rounded-2xl border border-white/10 flex justify-between items-center group hover:bg-white/10 transition-colors">
            <div>
              <p className="font-bold">{product.name}</p>
              <p className="text-xs text-slate-400">In Stock</p>
            </div>
            <span className="bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-black">
              ${product.price}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}