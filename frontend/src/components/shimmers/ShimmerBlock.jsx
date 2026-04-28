import React from 'react';

// A reusable block of shimmering light
export const ShimmerBlock = ({ className = "" }) => (
  <div 
    className={`bg-[#2a3441] relative overflow-hidden ${className}`}
    style={{
      backgroundImage: "linear-gradient(90deg, #2a3441 0%, #374454 20%, #2a3441 40%, #2a3441 100%)",
      backgroundSize: "200% 100%",
    }}
  >
    <div className="absolute inset-0 animate-shimmer" 
         style={{
           backgroundImage: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
           backgroundSize: "200% 100%",
         }}
    />
  </div>
);
