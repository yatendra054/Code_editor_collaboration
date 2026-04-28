import React from 'react';
import { ShimmerBlock } from './ShimmerBlock';

const EditorShimmer = () => {
  return (
    <div className="h-screen bg-[#0f1419] flex overflow-hidden">
      {/* Sidebar Skeleton */}
      <div className="w-16 md:w-64 bg-[#1f2937]/50 border-r border-gray-800 flex flex-col p-4 animate-pulse">
        <ShimmerBlock className="h-10 w-full rounded-lg mb-8" />
        
        <div className="space-y-4 flex-1">
          <ShimmerBlock className="h-8 w-full rounded" />
          <ShimmerBlock className="h-8 w-full rounded" />
          <ShimmerBlock className="h-8 w-full rounded" />
          <ShimmerBlock className="h-8 w-full rounded" />
        </div>

        <ShimmerBlock className="h-10 w-full rounded-lg mt-auto" />
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar Area */}
        <div className="h-14 bg-[#1f2937]/30 border-b border-gray-800 flex items-center px-6 justify-between animate-pulse">
          <div className="flex space-x-4">
            <ShimmerBlock className="h-6 w-24 rounded" />
            <ShimmerBlock className="h-6 w-32 rounded" />
          </div>
          <ShimmerBlock className="h-8 w-24 rounded-lg" />
        </div>

        {/* Editor & Output Split */}
        <div className="flex-1 flex flex-col md:flex-row p-4 gap-4 animate-pulse">
          {/* Editor Area */}
          <div className="flex-1 bg-[#1e1e1e] rounded-xl border border-gray-800 p-4 flex flex-col">
            <div className="flex space-x-2 mb-4 border-b border-gray-800 pb-2">
               <ShimmerBlock className="h-4 w-16 rounded" />
               <ShimmerBlock className="h-4 w-16 rounded" />
            </div>
            <div className="space-y-3 mt-4">
              <ShimmerBlock className="h-4 w-3/4 rounded" />
              <ShimmerBlock className="h-4 w-1/2 rounded ml-8" />
              <ShimmerBlock className="h-4 w-2/3 rounded ml-8" />
              <ShimmerBlock className="h-4 w-1/4 rounded" />
              <ShimmerBlock className="h-4 w-full rounded mt-8" />
              <ShimmerBlock className="h-4 w-5/6 rounded" />
            </div>
          </div>

          {/* Output/Input Terminal Area */}
          <div className="w-full md:w-1/3 bg-[#1e1e1e] rounded-xl border border-gray-800 p-4 flex flex-col">
            <div className="flex space-x-4 mb-4 border-b border-gray-800 pb-2">
               <ShimmerBlock className="h-6 w-20 rounded" />
               <ShimmerBlock className="h-6 w-20 rounded" />
            </div>
            <div className="flex-1 bg-black/40 rounded-lg p-4 mt-2">
              <ShimmerBlock className="h-4 w-1/3 rounded mb-2" />
              <ShimmerBlock className="h-4 w-1/4 rounded" />
            </div>
            <ShimmerBlock className="h-12 w-full rounded-xl mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorShimmer;
