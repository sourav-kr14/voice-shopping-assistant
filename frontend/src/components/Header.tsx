"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Menu,
  X,
  ArrowRight,
  Moon,
  Sun,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);

  const lastScroll = useRef(0);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "List", href: "/list" },
    { name: "Search", href: "/search" },
    { name: "Pricing", href: "/pricing" },
  ];

  /* Hide / Show Navbar on Scroll */
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 20);

      if (current > lastScroll.current && current > 80) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastScroll.current = current;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Persistent Dark Mode */
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <>
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/20 blur-[120px] rounded-full -z-10 animate-pulse" />

      <motion.nav
        animate={{ y: visible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "backdrop-blur-xl bg-white/70 dark:bg-black/60 border-b border-white/20 shadow-lg shadow-black/5"
            : "bg-transparent"
        }`}
      >
        <div className="h-[80px] px-6 md:px-16 lg:px-32 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-40 group-hover:opacity-70 transition duration-300 rounded-xl" />
              <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-xl shadow-lg">
                <ShoppingBag className="text-white w-5 h-5" />
              </div>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              SAY<span className="text-indigo-600">SHOP</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-10 relative">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <li key={link.name} className="relative">
                  <Link
                    href={link.href}
                    className={`text-sm font-semibold transition ${
                      isActive
                        ? "text-indigo-600"
                        : "text-slate-600 dark:text-slate-300 hover:text-indigo-500"
                    }`}
                  >
                    {link.name}
                  </Link>

                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                    />
                  )}
                </li>
              );
            })}
          </ul>

          {/* Right Controls */}
          <div className="hidden md:flex items-center gap-4">

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDark(!dark)}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* CTA */}
            <Link
              href="/pricing"
              className="relative px-6 h-11 rounded-full text-sm font-semibold text-white overflow-hidden group flex items-center"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%] animate-[shimmer_3s_linear_infinite]" />
              <span className="relative flex items-center gap-2">
                Get Started
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </span>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-slate-900 dark:text-white"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 120 }}
              className="fixed top-0 right-0 w-3/4 max-w-sm h-full bg-white dark:bg-black z-50 shadow-2xl p-8 flex flex-col"
            >
              <div className="flex justify-between items-center mb-12">
                <span className="text-lg font-bold dark:text-white">Menu</span>
                <button onClick={() => setIsOpen(false)}>
                  <X size={24} />
                </button>
              </div>

              <ul className="flex flex-col gap-8 text-lg font-semibold">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} onClick={() => setIsOpen(false)}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
