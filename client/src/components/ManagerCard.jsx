// client/src/components/ManagerCard.jsx
import React from 'react';
import numbro from 'numbro';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ManagerCard = ({ pkg, manager }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 transform hover:-translate-y-2 flex flex-col">
      <div className="relative">
        <img src={pkg.imageUrl || 'https://via.placeholder.com/400x250'} alt={pkg.name} className="w-full h-56 object-cover" />
        <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent w-full p-4">
          <h3 className="text-white text-xl font-bold">{pkg.name}</h3>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-4">
            <p className="font-bold text-lg text-gray-800">{manager.companyName}</p>
            <p className="text-gray-500 text-sm flex items-center gap-2">
              <FaMapMarkerAlt /> {manager.location.area}, {manager.location.city}
            </p>
        </div>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{pkg.description}</p>
        <div className="flex justify-between items-center mt-auto border-t pt-4">
            <div>
                <p className="text-gray-500 text-xs">PRICE</p>
                <p className="text-2xl font-bold text-primary">
                    ₹{numbro(pkg.price).format({ thousandSeparated: true })}
                </p>
            </div>
            <Link to={`/manager/${manager._id}`}>
              {/* --- THIS IS THE CORRECTED BUTTON --- */}
              <button className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-3 rounded-md transition-colors text-xs whitespace-nowrap">
                View Manager
              </button>
            </Link>
        </div>
      </div>
    </div>
  );
};
export default ManagerCard;