"use client";

import React from "react";
import { ShoppingBag, Github, Twitter, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 px-6 pt-12 md:px-16 lg:px-36 w-full text-slate-600">
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 pb-12">
        
        {/* Brand Section */}
        <div className="md:max-w-96 space-y-6">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <ShoppingBag className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900">
              VOICE<span className="text-indigo-600">CART</span>
            </span>
          </div>
          
          <p className="text-sm leading-relaxed">
            Your intelligent voice-powered shopping assistant. Organize your groceries, 
            search catalog prices, and track your frequent purchases seamlessly.
          </p>
          
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-indigo-600 transition-colors"><Twitter size={20} /></a>
            <a href="#" className="hover:text-indigo-600 transition-colors"><Github size={20} /></a>
            <a href="#" className="hover:text-indigo-600 transition-colors"><Mail size={20} /></a>
          </div>
        </div>

        {/* Links Section */}
        <div className="flex-1 flex items-start md:justify-end gap-16 md:gap-24">
          <div>
            <h2 className="font-bold text-slate-900 mb-5 uppercase text-xs tracking-widest">Platform</h2>
            <ul className="text-sm space-y-3 font-medium">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Shopping List</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Voice Commands</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Smart Insights</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a></li>
            </ul>
          </div>
          
          <div>
            <h2 className="font-bold text-slate-900 mb-5 uppercase text-xs tracking-widest">Support</h2>
            <div className="text-sm space-y-3 font-medium">
              <p className="flex items-center gap-2"><Phone size={14} /> +1-800-VOICE-CART</p>
              <p className="flex items-center gap-2"><Mail size={14} /> support@voicecart.ai</p>
              <a href="#" className="block hover:text-indigo-600 transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 py-8 text-center">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          © {new Date().getFullYear()} VoiceCart AI Assistant. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;