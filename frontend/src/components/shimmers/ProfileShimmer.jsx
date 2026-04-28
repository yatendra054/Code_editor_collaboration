import React from 'react';
import { ShimmerBlock } from './ShimmerBlock';

// The full-page loading placeholder that acts as a generic layout or profile layout
const ProfileShimmer = () => {
  return (
    <div className="min-h-screen bg-[#1a2332] flex flex-col items-center pt-32 px-6">
      <div className="w-full max-w-7xl animate-pulse">
        {/* Title area skeleton */}
        <div className="flex flex-col items-center mb-16 space-y-4">
          <ShimmerBlock className="h-10 w-64 rounded-lg" />
          <ShimmerBlock className="h-6 w-96 rounded-lg" />
        </div>

        {/* Top button group skeleton */}
        <div className="flex justify-center gap-4 mb-16">
          <ShimmerBlock className="h-12 w-40 rounded-xl" />
          <ShimmerBlock className="h-12 w-48 rounded-xl" />
        </div>

        {/* Content Section Skeleton */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-8">
            <ShimmerBlock className="h-8 w-8 rounded-full" />
            <ShimmerBlock className="h-8 w-48 rounded-lg" />
          </div>
          
          {/* Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#1f2937] rounded-xl p-5 border border-gray-700/50 h-48 flex flex-col">
                <div className="flex justify-between mb-4">
                  <ShimmerBlock className="h-5 w-24 rounded" />
                  <ShimmerBlock className="h-5 w-5 rounded" />
                </div>
                <ShimmerBlock className="h-3 w-32 rounded mb-6" />
                
                <div className="flex-1 bg-[#0f1419] rounded-lg p-3 border border-gray-800 space-y-2 flex flex-col justify-center">
                  <ShimmerBlock className="h-2 w-3/4 rounded" />
                  <ShimmerBlock className="h-2 w-1/2 rounded" />
                  <ShimmerBlock className="h-2 w-5/6 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileShimmer;