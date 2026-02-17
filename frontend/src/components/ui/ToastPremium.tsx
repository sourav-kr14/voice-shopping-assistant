"use client";

import toast from "react-hot-toast";
import { CheckCircle, XCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface PremiumToastProps {
  type: ToastType;
  message: string;
}

export const ToastPremium = ({ type, message }: PremiumToastProps) => {
  return toast.custom((t) => (
    <div
      className={`
        flex items-center gap-4 px-6 py-4 rounded-2xl
        backdrop-blur-xl border border-white/10
        shadow-[0_20px_60px_rgba(0,0,0,0.35)]
        transition-all duration-300
        ${t.visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}
        ${
          type === "success"
            ? "bg-gradient-to-r from-emerald-500/20 to-green-600/20"
            : type === "error"
            ? "bg-gradient-to-r from-red-500/20 to-rose-600/20"
            : "bg-gradient-to-r from-blue-500/20 to-indigo-600/20"
        }
      `}
    >
      {type === "success" && (
        <CheckCircle className="text-emerald-400" size={22} />
      )}
      {type === "error" && (
        <XCircle className="text-red-400" size={22} />
      )}
      {type === "info" && <Info className="text-blue-400" size={22} />}

      <p className="text-white text-sm font-medium">{message}</p>
    </div>
  ));
};
