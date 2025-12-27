// client/src/components/ManagerList.jsx
import React from 'react';
import ManagerCard from './ManagerCard';
import CardSkeleton from './CardSkeleton'; // Import the new skeleton component
import { FaSearchMinus } from 'react-icons/fa';

const ManagerList = ({ managers, loading, error }) => {

  // --- NEW: SKELETON LOADER LOGIC ---
  if (loading) {
    return (
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Create an array of 6 items to map over and show 6 skeletons */}
            {[...Array(6)].map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 py-12">{error}</p>;
  }

  // Flatten the packages from all managers into a single list
  const allPackages = managers.flatMap(manager => 
    manager.packages.map(pkg => ({
      ...pkg,
      manager: { 
        _id: manager._id, 
        companyName: manager.companyName, 
        location: manager.location 
      }
    }))
  );

  if (allPackages.length === 0) {
    return (
      <div className="text-center py-20">
        <FaSearchMinus className="mx-auto text-5xl text-gray-300 mb-4" />
        <h3 className="text-xl font-bold text-gray-800">No Events Found</h3>
        <p className="text-gray-500 mt-2">Try adjusting your search terms or filters.</p>
      </div>
    );
  }

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allPackages.map((pkg) => (
            <ManagerCard 
              key={pkg._id ? `${pkg.manager._id}-${pkg._id}` : `${pkg.manager._id}-${pkg.name}`} 
              pkg={pkg} 
              manager={pkg.manager} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ManagerList;