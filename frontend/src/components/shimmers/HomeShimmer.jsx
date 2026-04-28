import React from 'react';
import { ShimmerBlock } from './ShimmerBlock';

const HomeShimmer = () => {
  return (
    <div className="min-h-screen bg-[#0f1419] flex pt-24 px-6 justify-center">
      <div className="w-full max-w-6xl animate-pulse flex flex-col items-center">
        {/* Hero Section */}
        <ShimmerBlock className="h-12 w-3/4 max-w-2xl rounded-xl mb-6" />
        <ShimmerBlock className="h-6 w-1/2 max-w-lg rounded-lg mb-12" />
        
        {/* Buttons */}
        <div className="flex gap-4 justify-center mb-24">
          <ShimmerBlock className="h-12 w-40 rounded-full" />
          <ShimmerBlock className="h-12 w-48 rounded-full" />
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#1f2937]/50 rounded-2xl p-6 border border-gray-800">
              <ShimmerBlock className="h-12 w-12 rounded-xl mb-6" />
              <ShimmerBlock className="h-6 w-3/4 rounded-lg mb-4" />
              <ShimmerBlock className="h-4 w-full rounded mb-2" />
              <ShimmerBlock className="h-4 w-5/6 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeShimmer;
