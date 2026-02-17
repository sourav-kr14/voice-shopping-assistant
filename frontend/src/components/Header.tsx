"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag, Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add shadow and blur on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#" },
    { name: "List", href: "#" },
    { name: "Search", href: "#" },
    { name: "Pricing", href: "#" },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full h-[72px] px-6 md:px-16 lg:px-32 flex items-center justify-between z-[100] transition-all duration-300 ${
        scrolled 
          ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-100" 
          : "bg-transparent"
      }`}
    >
      {/* Brand Identity */}
      <a href="#" className="flex items-center gap-2 group relative z-50">
        <div className="bg-indigo-600 p-2 rounded-xl shadow-indigo-200 shadow-lg group-hover:scale-110 transition-transform">
          <ShoppingBag className="text-white w-5 h-5" />
        </div>
        <span className="text-xl font-black tracking-tighter text-slate-900">
          SAY<span className="text-indigo-600">SHOP</span>
        </span>
      </a>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <li key={link.name}>
            <a 
              href={link.href} 
              className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full" />
            </a>
          </li>
        ))}
      </ul>

      {/* Desktop CTA */}
      <div className="hidden md:flex items-center gap-4">
        <button className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
          Sign In
        </button>
        <button className="bg-indigo-600 text-white px-6 h-11 rounded-full text-sm font-black hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-100 active:scale-95 transition-all flex items-center gap-2 group">
          Get Started
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50 p-2 md:hidden text-slate-900 active:scale-90 transition-transform"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 w-full bg-white shadow-2xl border-b border-slate-100 p-8 pt-24 flex flex-col gap-8 md:hidden z-40"
          >
            <ul className="flex flex-col gap-6">
              {navLinks.map((link, i) => (
                <motion.li 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={link.name}
                >
                  <a href={link.href} className="text-2xl font-black text-slate-900">{link.name}</a>
                </motion.li>
              ))}
            </ul>
            
            <div className="flex flex-col gap-4 border-t border-slate-100 pt-8">
              <button className="w-full h-14 rounded-2xl bg-slate-50 font-bold text-slate-900">Sign In</button>
              <button className="w-full h-14 rounded-2xl bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-100">Get Started</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Header;