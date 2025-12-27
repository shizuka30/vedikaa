// client/src/components/PackageCard.jsx

import React from 'react';
import numbro from 'numbro';
import { FaClipboardList } from 'react-icons/fa';

const PackageCard = ({ pkg }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 transform hover:-translate-y-2 flex flex-col">
      <div className="relative">
        {/* The image now comes directly from the package data */}
        <img 
            src={pkg.imageUrl || 'https://via.placeholder.com/400x250'} 
            alt={pkg.name} 
            className="w-full h-56 object-cover" 
        />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{pkg.name}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{pkg.description}</p>
        
        <div className="mb-4">
          <h4 className="font-semibold text-gray-700 text-sm flex items-center gap-2 mb-2">
            <FaClipboardList /> Services Included:
          </h4>
          <div className="flex flex-wrap gap-2">
            {pkg.servicesIncluded.map((service, i) => (
              <span key={i} className="bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">
                {service}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-auto border-t pt-4">
          <div>
            <p className="text-gray-500 text-xs">PRICE</p>
            <p className="text-2xl font-bold text-primary">
              ₹{numbro(pkg.price).format({ thousandSeparated: true })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;