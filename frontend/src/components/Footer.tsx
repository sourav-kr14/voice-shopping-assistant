"use client";

import React from "react";
import { ShoppingBag, Github, Twitter, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black px-6 sm:px-8 md:px-16 lg:px-32 pt-14 pb-10 text-gray-600 dark:text-gray-400 transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl">
                <ShoppingBag className="text-emerald-500 w-5 h-5" />
              </div>

              <span className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                SAY<span className="text-emerald-500">SHOP</span>
              </span>
            </div>

            <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400 max-w-md">
              An intelligent voice-powered grocery assistant designed for
              seamless shopping, price tracking, and smart insights.
            </p>

            <div className="flex items-center gap-5 pt-2">
              <a
                href="#"
                className="hover:text-emerald-500 transition-colors duration-200"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://github.com/sourav-kr14/voice-shopping-assistant"
                className="hover:text-emerald-500 transition-colors duration-200"
              >
                <Github size={18} />
              </a>
              <a
                href="#"
                className="hover:text-emerald-500 transition-colors duration-200"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-7 flex flex-col sm:flex-row gap-12 md:justify-end">
            {/* Platform */}
            <div>
              <h2 className="text-xs uppercase tracking-[0.25em] text-gray-500 dark:text-gray-500 mb-5">
                Platform
              </h2>

              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-gray-900 dark:hover:text-white transition"
                  >
                    Shopping List
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-gray-900 dark:hover:text-white transition"
                  >
                    Voice Commands
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-gray-900 dark:hover:text-white transition"
                  >
                    Smart Insights
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-gray-900 dark:hover:text-white transition"
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h2 className="text-xs uppercase tracking-[0.25em] text-gray-500 dark:text-gray-500 mb-5">
                Support
              </h2>

              <div className="space-y-3 text-sm">
                <p className="flex items-center gap-2">
                  <Phone
                    size={14}
                    className="text-emerald-500"
                  />
                  +1-800-VOICE-CART
                </p>

                <p className="flex items-center gap-2">
                  <Mail
                    size={14}
                    className="text-emerald-500"
                  />
                  support@sayshop.ai
                </p>

                <a
                  href="#"
                  className="block hover:text-gray-900 dark:hover:text-white transition"
                >
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-14 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            © {new Date().getFullYear()} SayShop AI. All rights reserved.
          </p>

          <div className="text-xs text-gray-400 dark:text-gray-600">
            Developed by Sourav Kumar
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
