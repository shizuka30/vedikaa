// client/src/components/CardSkeleton.jsx
import React from 'react';

const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Image Placeholder */}
      <div className="w-full h-56 bg-gray-200 animate-pulse"></div>
      
      <div className="p-5">
        {/* Text Placeholders */}
        <div className="w-3/4 h-4 bg-gray-200 rounded-md animate-pulse mb-3"></div>
        <div className="w-1/2 h-6 bg-gray-300 rounded-md animate-pulse mb-4"></div>
        
        <div className="bg-gray-100 p-3 rounded-lg mb-4">
          <div className="w-1/3 h-3 bg-gray-200 rounded-md animate-pulse mb-2"></div>
          <div className="w-3/4 h-4 bg-gray-300 rounded-md animate-pulse"></div>
        </div>
        
        {/* Spacer to push content to the bottom */}
        <div className="flex-grow"></div>
        
        <div className="flex justify-between items-center mt-4 border-t pt-4">
          <div>
            <div className="w-16 h-3 bg-gray-200 rounded-md animate-pulse mb-2"></div>
            <div className="w-24 h-8 bg-gray-300 rounded-md animate-pulse"></div>
          </div>
          <div className="w-28 h-10 bg-gray-300 rounded-md animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default CardSkeleton;