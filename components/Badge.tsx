import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'success' | 'warning' | 'error' | 'blue' | 'filledSuccess' | 'filledWarning' | 'filledError';
  className?: string;
  onClick?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '', onClick }) => {
  const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-150 border";
  
  const variants = {
    default: "bg-zinc-800 border-zinc-700 text-zinc-300",
    outline: "bg-transparent border-zinc-700 text-zinc-400",
    success: "bg-emerald-950/30 border-emerald-900/50 text-emerald-400",
    warning: "bg-amber-950/30 border-amber-900/50 text-amber-400",
    error: "bg-red-950/30 border-red-900/50 text-red-400",
    blue: "bg-blue-950/30 border-blue-900/50 text-blue-400",
    // Filled variants for high emphasis
    filledSuccess: "bg-emerald-600 border-emerald-600 text-black font-bold",
    filledWarning: "bg-amber-500 border-amber-500 text-black font-bold",
    filledError: "bg-red-600 border-red-600 text-white font-bold",
  };

  const clickableStyles = onClick ? "cursor-pointer hover:border-amber-500/50 hover:text-amber-400 active:scale-95" : "";

  return (
    <span 
      className={`${baseStyles} ${variants[variant]} ${clickableStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </span>
  );
};