import React from 'react';
import { ShimmerBlock } from './ShimmerBlock';

const AuthShimmer = () => {
  return (
    <div className="min-h-screen bg-[#0f1419] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1f2937]/80 rounded-2xl p-8 border border-gray-700/50 shadow-xl animate-pulse">
        {/* Title */}
        <div className="flex flex-col items-center mb-8">
          <ShimmerBlock className="h-10 w-48 rounded-lg mb-2" />
          <ShimmerBlock className="h-4 w-64 rounded" />
        </div>

        {/* Inputs */}
        <div className="space-y-5 mb-8">
          <div>
            <ShimmerBlock className="h-4 w-20 rounded mb-2" />
            <ShimmerBlock className="h-12 w-full rounded-lg" />
          </div>
          <div>
             <ShimmerBlock className="h-4 w-24 rounded mb-2" />
             <ShimmerBlock className="h-12 w-full rounded-lg" />
          </div>
        </div>

        {/* Button */}
        <ShimmerBlock className="h-12 w-full rounded-xl mb-6" />

        {/* Footer */}
        <div className="flex justify-center">
          <ShimmerBlock className="h-4 w-48 rounded" />
        </div>
      </div>
    </div>
  );
};

export default AuthShimmer;
