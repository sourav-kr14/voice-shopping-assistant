"use client";

import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen pt-28 px-4 sm:px-6 md:px-20 bg-gray-50 dark:bg-black transition-colors duration-300">

      {/* Back Button */}
      <div className="mb-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-500 transition"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
        Pricing Plans
      </h1>

      <div className="grid gap-8 md:grid-cols-3">

        {/* FREE PLAN */}
        <div className="p-8 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm flex flex-col justify-between">

          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Free
            </h2>

            <p className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
              ₹0
            </p>

            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <Check size={16} className="text-emerald-500" />
                Basic shopping list
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-emerald-500" />
                Manual item tracking
              </li>
            </ul>
          </div>

          <button className="mt-8 w-full py-3 rounded-xl bg-gray-200 dark:bg-gray-800 text-sm font-semibold cursor-not-allowed">
            Current Plan
          </button>
        </div>

        {/* PRO PLAN (Highlighted) */}
        <div className="p-8 rounded-2xl border border-indigo-500 bg-indigo-600 text-white shadow-xl scale-100 md:scale-105 flex flex-col justify-between relative">

          <div className="absolute top-4 right-4 bg-white text-indigo-600 text-xs font-bold px-3 py-1 rounded-full">
            Most Popular
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">
              Pro
            </h2>

            <p className="text-3xl font-bold mb-6">
              ₹199
              <span className="text-sm font-medium opacity-80"> / month</span>
            </p>

            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Check size={16} />
                Voice AI commands
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} />
                Smart insights
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} />
                Purchase analytics
              </li>
            </ul>
          </div>

          <Link
            href="/checkout"
            className="mt-8 w-full py-3 rounded-xl bg-white text-indigo-600 text-sm font-semibold text-center hover:bg-gray-100 transition"
          >
            Upgrade Now
          </Link>
        </div>

        {/* ENTERPRISE PLAN */}
        <div className="p-8 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm flex flex-col justify-between">

          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Enterprise
            </h2>

            <p className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
              Custom
            </p>

            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <Check size={16} className="text-emerald-500" />
                Advanced analytics
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-emerald-500" />
                API access
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-emerald-500" />
                Dedicated support
              </li>
            </ul>
          </div>

          <Link
            href="/contact"
            className="mt-8 w-full py-3 rounded-xl bg-emerald-500 text-white text-sm font-semibold text-center hover:bg-emerald-600 transition"
          >
            Contact Sales
          </Link>
        </div>

      </div>
    </div>
  );
}
