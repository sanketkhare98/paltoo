import React from 'react';

export function PawIcon({ className = "w-full h-full text-white fill-current" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      {/* Central paw pad */}
      <path d="M12 11.2c-2.3 0-4.2 1.8-4.2 4.1 0 1.9 1.4 3.5 3.2 3.5.9 0 1.5-.5 2-.5.5 0 1.1.5 2 .5 1.8 0 3.2-1.6 3.2-3.5 0-2.3-1.9-4.1-4.2-4.1z" />
      {/* 4 toe pads */}
      <ellipse cx="6.5" cy="9.8" rx="1.6" ry="2.2" />
      <ellipse cx="10" cy="6.8" rx="1.6" ry="2.2" />
      <ellipse cx="14" cy="6.8" rx="1.6" ry="2.2" />
      <ellipse cx="17.5" cy="9.8" rx="1.6" ry="2.2" />
    </svg>
  );
}

export default function PaltooLogo({ 
  size = "md",
  className = "",
  showText = false,
  textClassName = "" 
}) {
  const sizeClasses = {
    sm: "w-8 h-8 rounded-xl p-1.5",
    md: "w-10 h-10 rounded-2xl p-2",
    lg: "w-16 h-16 rounded-2xl p-3.5",
    xl: "w-20 h-20 rounded-3xl p-4",
    "2xl": "w-24 h-24 rounded-3xl p-5"
  };

  const boxClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`${boxClass} bg-gradient-to-br from-amber-400 via-brand-500 to-orange-500 flex items-center justify-center shadow-md shadow-brand-500/25 shrink-0 transition-transform duration-300`}>
        <PawIcon />
      </div>
      {showText && (
        <span className={`font-display font-black tracking-tight bg-gradient-to-r from-amber-600 via-brand-500 to-orange-600 bg-clip-text text-transparent ${textClassName || 'text-2xl'}`}>
          Paltoo
        </span>
      )}
    </div>
  );
}
