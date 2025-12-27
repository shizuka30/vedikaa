// client/src/components/FilterSidebar.jsx
import React from 'react';
import numbro from 'numbro'; // Import numbro

const eventTypes = [
    'Full Wedding Package', 'Modular Wedding', 'Engagement Ceremony', 'Bachelor Party',
    'Birthday Party', 'Anniversary', 'Music Concert', 'Corporate Event',
    'Educational Function', 'Memorial Service', 'Devotional Event', 'Baby Shower'
];

const FilterSidebar = ({ filters, handleFilterChange }) => {
  return (
    <aside className="w-full lg:w-1/4 xl:w-1/5 p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 border-b pb-2">Filter Results</h3>
      <div className="space-y-6">
        {/* Event Type Filter */}
        <div>
          <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">
            Event Type
          </label>
          <select
            id="eventType"
            name="eventType"
            value={filters.eventType}
            onChange={handleFilterChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
          >
            <option value="">All Events</option>
            {eventTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Budget Filter */}
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
            Max Budget (₹{numbro(filters.budget || 0).format({ thousandSeparated: true })})
          </label>
          <input
            type="range"
            id="budget"
            name="budget"
            min="0"
            max="1000000"
            step="50000"
            value={filters.budget}
            onChange={handleFilterChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;