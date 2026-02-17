export default function PricingPage() {
  return (
    <div className="min-h-screen pt-28 px-6 md:px-20 text-center">
      <h1 className="text-4xl font-bold mb-12">Pricing Plans</h1>

      <div className="grid md:grid-cols-3 gap-8">

        <div className="p-8 rounded-2xl shadow bg-white dark:bg-slate-900">
          <h2 className="text-xl font-semibold">Free</h2>
          <p className="text-3xl font-bold mt-4">₹0</p>
          <p className="mt-4 text-slate-500">Basic shopping list</p>
        </div>

        <div className="p-8 rounded-2xl shadow-lg bg-indigo-600 text-white scale-105">
          <h2 className="text-xl font-semibold">Pro</h2>
          <p className="text-3xl font-bold mt-4">₹199</p>
          <p className="mt-4">Voice AI + Smart Insights</p>
        </div>

        <div className="p-8 rounded-2xl shadow bg-white dark:bg-slate-900">
          <h2 className="text-xl font-semibold">Enterprise</h2>
          <p className="text-3xl font-bold mt-4">Custom</p>
          <p className="mt-4 text-slate-500">Advanced analytics</p>
        </div>

      </div>
    </div>
  );
}
