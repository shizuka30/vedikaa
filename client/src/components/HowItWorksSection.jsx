// client/src/components/HowItWorksSection.jsx

import React from 'react';
// Import the icons we need for the steps
import { FaSearch, FaUsers, FaCalendarCheck } from 'react-icons/fa';

const HowItWorksSection = () => {
  return (
    <section className="bg-primary text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4">How EventConnect Works</h2>
        <p className="text-lg text-pink-100 mb-12 max-w-2xl mx-auto">
          Simple steps to find and book your perfect event manager
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Step 1: Search & Discover */}
          <div className="flex flex-col items-center">
            <div className="bg-white/20 p-6 rounded-full mb-6">
              <FaSearch className="text-4xl" />
            </div>
            <h3 className="text-2xl font-bold mb-2">1. Search & Discover</h3>
            <p className="text-pink-200">
              Browse through verified event managers in your area based on your event type and budget.
            </p>
          </div>

          {/* Step 2: Compare & Connect */}
          <div className="flex flex-col items-center">
            <div className="bg-white/20 p-6 rounded-full mb-6">
              <FaUsers className="text-4xl" />
            </div>
            <h3 className="text-2xl font-bold mb-2">2. Compare & Connect</h3>
            <p className="text-pink-200">
              View portfolios, read reviews, and directly connect with managers to discuss your requirements.
            </p>
          </div>

          {/* Step 3: Book & Relax */}
          <div className="flex flex-col items-center">
            <div className="bg-white/20 p-6 rounded-full mb-6">
              <FaCalendarCheck className="text-4xl" />
            </div>
            <h3 className="text-2xl font-bold mb-2">3. Book & Relax</h3>
            <p className="text-pink-200">
              Secure your booking with transparent pricing and let professionals handle your special event.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;