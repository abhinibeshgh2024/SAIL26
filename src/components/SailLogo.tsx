import React from 'react';

interface SailLogoProps {
  className?: string;
  size?: number;
  textColor?: string;
}

export const SailLogo: React.FC<SailLogoProps> = ({ 
  className = '', 
  size = 48, 
  textColor = 'text-slate-900' 
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`} id="sail-logo-container">
      {/* Official SAIL Symbol rendered in high-precision SVG */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm"
        id="sail-logo-svg"
      >
        {/* Outer deep blue frame with flat-tip downward stems & triangular base indentation */}
        <path 
          d="M50 5 L95 50 L71 74 L71 88 L50 67 L29 88 L29 74 L5 50 Z" 
          fill="#002d62" 
        />
        {/* Inner white nested chevron framing */}
        <path 
          d="M50 21 L79 50 L59 70 L59 78 L50 69 L41 78 L41 70 L21 50 Z" 
          fill="#ffffff" 
        />
        {/* Core solid blue industrial diamond / steel ingot */}
        <path 
          d="M50 37 L63 50 L50 63 L37 50 Z" 
          fill="#002d62" 
        />
      </svg>
      <div className="flex flex-col select-none" id="sail-logo-text-group">
        <div className="flex items-baseline gap-1.5" id="sail-logo-hindi-eng">
          <span className="font-serif font-extrabold text-lg leading-none tracking-wide text-[#002d62]" id="sail-logo-hindi">सेल</span>
          <span className="font-sans font-black text-xl leading-none tracking-wider text-[#002d62]" id="sail-logo-english">SAIL</span>
        </div>
        <span className="text-[9px] font-bold tracking-[0.16em] uppercase text-slate-500 leading-none mt-1" id="sail-logo-tagline">
          Steel Authority of India Ltd.
        </span>
      </div>
    </div>
  );
};
