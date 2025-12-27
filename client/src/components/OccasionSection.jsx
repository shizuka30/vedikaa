// client/src/components/OccasionSection.jsx

import React from 'react';
import OccasionCard from './OccasionCard';
// Import icons from the library we installed
import { FaHeart, FaBriefcase, FaGift, FaGlassCheers, FaMusic, FaBirthdayCake } from 'react-icons/fa';

const occasionsData = [
  { id: 1, icon: FaHeart, title: 'Wedding', description: 'Complete wedding planning and coordination services for your special day.', price: '2,50,000' },
  { id: 2, icon: FaBriefcase, title: 'Corporate Events', description: 'Professional business events, conferences, and product launches.', price: '1,50,000' },
  { id: 3, icon: FaBirthdayCake, title: 'Birthday Party', description: 'Memorable and fun birthday celebrations for all ages.', price: '50,000' },
  { id: 4, icon: FaGift, title: 'Anniversary', description: 'Celebrate romantic anniversary milestones with elegance.', price: '75,000' },
  { id: 5, icon: FaMusic, title: 'Concert & Shows', description: 'Live music and entertainment event management.', price: '3,00,000' },
  { id: 6, icon: FaGlassCheers, title: 'Social Events', description: 'Parties, reunions, and social gatherings.', price: '80,000' },
];

const OccasionSection = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">What's Your Occasion?</h2>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            Choose from our wide range of event categories to find the perfect manager for your special day.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {occasionsData.map((occasion) => (
            <OccasionCard
              key={occasion.id}
              icon={occasion.icon}
              title={occasion.title}
              description={occasion.description}
              price={occasion.price}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OccasionSection;