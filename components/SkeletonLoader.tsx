'use client';

import React from 'react';

interface SkeletonLoaderProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  rows = 5, 
  columns = 4,
  showHeader = true 
}) => {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Toolbar skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div className="h-10 bg-gray-200 rounded w-64"></div>
        <div className="h-10 bg-gray-800 rounded w-40"></div>
      </div>

      {/* Table skeleton */}
      <div className="border border-gray-200 rounded overflow-hidden">
        {/* Table header skeleton */}
        {showHeader && (
          <div className="bg-gray-50 border-b border-gray-200">
            <div className="grid gap-4 p-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        )}

        {/* Table rows skeleton */}
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div 
            key={rowIdx} 
            className="border-b border-gray-200 last:border-b-0 bg-white"
          >
            <div className="grid gap-4 p-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIdx) => (
                <div key={colIdx} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;
