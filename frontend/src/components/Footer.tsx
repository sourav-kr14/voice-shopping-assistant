"use client";

import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Heart, ExternalLink } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-slate-100 pt-12 pb-8 mt-auto">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-800">
                Vocal<span className="text-indigo-600">Shop</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              The next generation of hands-free shopping. Manage your household 
              needs using the power of voice and AI.
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Platform</h4>
              <ul className="text-sm text-slate-600 space-y-2 font-medium">
                <li className="hover:text-indigo-600 cursor-pointer transition-colors">Dashboard</li>
                <li className="hover:text-indigo-600 cursor-pointer transition-colors">AI Settings</li>
                <li className="hover:text-indigo-600 cursor-pointer transition-colors">Integrations</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Legal</h4>
              <ul className="text-sm text-slate-600 space-y-2 font-medium">
                <li className="hover:text-indigo-600 cursor-pointer transition-colors">Privacy</li>
                <li className="hover:text-indigo-600 cursor-pointer transition-colors">Terms</li>
              </ul>
            </div>
          </div>

          {/* Social & Status */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Connect</h4>
            <div className="flex gap-4">
              {[
                { icon: <Github size={18} />, href: "#" },
                { icon: <Twitter size={18} />, href: "#" },
                { icon: <Linkedin size={18} />, href: "#" },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  whileHover={{ y: -3, scale: 1.1 }}
                  className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-slate-100"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
            <div className="pt-2">
               <div className="inline-flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-tighter">System Normal</span>
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-medium text-slate-400 flex items-center gap-1">
            © {currentYear} VocalShop. Created with 
            <Heart size={12} className="text-red-400 fill-red-400 mx-0.5" /> 
            for the future of Web.
          </p>
          
          <div className="flex items-center gap-6">
            <button className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1">
              v1.2.4 <ExternalLink size={10} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}