// client/src/components/OccasionCard.jsx

import React from 'react';

const OccasionCard = ({ icon, title, description, price }) => {
  const IconComponent = icon; // Assign the icon component to a variable

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="bg-pink-100 p-3 rounded-lg">
          <IconComponent className="text-primary text-2xl" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4 flex-grow">{description}</p>
      <div className="mt-auto border-t pt-4 flex justify-between items-center">
        <span className="text-gray-500 text-sm">Starting from</span>
        <span className="text-lg font-bold text-primary">₹{price}+</span>
      </div>
    </div>
  );
};

export default OccasionCard;