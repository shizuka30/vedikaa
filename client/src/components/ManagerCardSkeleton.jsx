// client/src/components/ManagerCardSkeleton.jsx
import React from 'react';

const ManagerCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
      <div className="bg-gray-300 h-56 w-full"></div>
      <div className="p-5">
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
        <div className="h-16 bg-gray-200 rounded w-full mb-4"></div>
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="h-4 bg-gray-300 rounded-full w-24"></div>
          <div className="h-4 bg-gray-300 rounded-full w-20"></div>
        </div>
        <div className="flex justify-between items-center mt-4 border-t pt-4">
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 rounded w-16"></div>
            <div className="h-8 bg-gray-300 rounded w-28"></div>
          </div>
          <div className="h-10 bg-gray-300 rounded-md w-24"></div>
        </div>
      </div>
    </div>
  );
};

export default ManagerCardSkeleton;