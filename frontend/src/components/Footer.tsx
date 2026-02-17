"use client";

import React from "react";
import { ShoppingBag, Github, Twitter, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#05070C] border-t border-white/5 px-6 md:px-16 lg:px-32 pt-14 pb-10 text-gray-400">

      <div className="max-w-[1200px] mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* Brand Section */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-400/10 border border-emerald-400/20 p-2.5 rounded-xl">
                <ShoppingBag className="text-emerald-400 w-5 h-5" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-white">
                SAY<span className="text-emerald-400">SHOP</span>
              </span>
            </div>

            <p className="text-sm leading-relaxed text-gray-500 max-w-md">
              An intelligent voice-powered grocery assistant designed for
              seamless shopping, price tracking, and smart insights.
            </p>

            <div className="flex items-center gap-5 pt-2">
              <a
                href="#"
                className="hover:text-emerald-400 transition-colors"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="hover:text-emerald-400 transition-colors"
              >
                <Github size={18} />
              </a>
              <a
                href="#"
                className="hover:text-emerald-400 transition-colors"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-7 flex flex-col sm:flex-row gap-12 md:justify-end">

            <div>
              <h2 className="text-[11px] uppercase tracking-[0.25em] text-gray-500 mb-5">
                Platform
              </h2>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Shopping List
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Voice Commands
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Smart Insights
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-[11px] uppercase tracking-[0.25em] text-gray-500 mb-5">
                Support
              </h2>
              <div className="space-y-3 text-sm">
                <p className="flex items-center gap-2">
                  <Phone size={14} className="text-emerald-400" />
                  +1-800-VOICE-CART
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={14} className="text-emerald-400" />
                  support@sayshop.ai
                </p>
                <a
                  href="#"
                  className="block hover:text-white transition"
                >
                  Privacy Policy
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 mt-14 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} SayShop AI. All rights reserved.
          </p>

          <div className="text-xs text-gray-600">
            Built with intelligence ✦ Designed for clarity
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
