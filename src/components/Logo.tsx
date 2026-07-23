import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "dark" | "light" | "color";
  showText?: boolean;
}

export default function Logo({ size = "md", variant = "color", showText = true }: LogoProps) {
  const sizes = {
    sm: { icon: 28, text: "text-sm", sub: "text-[9px]" },
    md: { icon: 36, text: "text-base", sub: "text-[10px]" },
    lg: { icon: 48, text: "text-xl", sub: "text-xs" }
  };

  const s = sizes[size];
  const iconColor = variant === "light" ? "white" : "#4F46E5";
  const textColor = variant === "light" ? "text-white" : "text-slate-900";
  const subColor = variant === "light" ? "text-white/70" : "text-slate-500";

  return (
    <div className="flex items-center space-x-2.5">
      {/* Icon */}
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="gbr-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
        {/* Background */}
        <rect width="64" height="64" rx="14" fill={variant === "light" ? "rgba(255,255,255,0.15)" : "url(#gbr-grad)"} />
        {/* Board/table */}
        <rect x="12" y="28" width="40" height="22" rx="3" fill="none" stroke="white" strokeWidth="2.5" />
        {/* Legs */}
        <line x1="20" y1="50" x2="20" y2="56" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="44" y1="50" x2="44" y2="56" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        {/* Checkmark */}
        <polyline points="22,39 28,45 42,32" fill="none" stroke="#FCD34D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {/* Crown/star */}
        <polygon points="32,8 34.5,15 42,15 36,19.5 38.5,27 32,22.5 25.5,27 28,19.5 22,15 29.5,15" fill="#FCD34D" />
      </svg>

      {/* Text */}
      {showText && (
        <div className="leading-tight">
          <div className={`font-extrabold ${s.text} ${textColor} tracking-tight`}>
            Get Board Ready
          </div>
          <div className={`font-mono uppercase tracking-widest ${s.sub} ${subColor}`}>
            IICA Exam Prep · AI Powered
          </div>
        </div>
      )}
    </div>
  );
}
