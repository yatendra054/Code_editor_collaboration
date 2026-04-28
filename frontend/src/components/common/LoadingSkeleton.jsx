import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="h-full w-full bg-gray-900/50 flex flex-col p-4 animate-pulse">
      {/* Header-like bar */}
      <div className="flex gap-2 mb-4">
        <div className="h-8 w-24 bg-gray-800 rounded-lg"></div>
        <div className="h-8 w-32 bg-gray-800 rounded-lg"></div>
      </div>
      
      {/* Code lines */}
      <div className="space-y-3">
        <div className="flex gap-4">
          <div className="h-4 w-8 bg-gray-800 rounded"></div>
          <div className="h-4 w-48 bg-gray-800 rounded"></div>
        </div>
        <div className="flex gap-4 pl-4">
          <div className="h-4 w-8 bg-gray-800 rounded"></div>
          <div className="h-4 w-64 bg-gray-800 rounded"></div>
        </div>
        <div className="flex gap-4 pl-8">
          <div className="h-4 w-8 bg-gray-800 rounded"></div>
          <div className="h-4 w-40 bg-gray-800 rounded"></div>
        </div>
        <div className="flex gap-4 pl-8">
          <div className="h-4 w-8 bg-gray-800 rounded"></div>
          <div className="h-4 w-56 bg-gray-800 rounded"></div>
        </div>
        <div className="flex gap-4 pl-4">
          <div className="h-4 w-8 bg-gray-800 rounded"></div>
          <div className="h-4 w-32 bg-gray-800 rounded"></div>
        </div>
        <div className="flex gap-4">
          <div className="h-4 w-8 bg-gray-800 rounded"></div>
          <div className="h-4 w-24 bg-gray-800 rounded"></div>
        </div>
        
        {/* Random lines mimicking code */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex gap-4 pl-4">
            <div className="h-4 w-8 bg-gray-800 rounded"></div>
            <div className="h-4 bg-gray-800 rounded" style={{ width: `${Math.random() * 40 + 20}%` }}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
