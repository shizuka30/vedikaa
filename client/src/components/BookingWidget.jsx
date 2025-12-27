// client/src/components/BookingWidget.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BookingWidget = ({ managerId, managerName, packages }) => {
  const [selectedPackage, setSelectedPackage] = useState(packages[0]?._id || '');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const pkg = packages.find(p => p._id === selectedPackage);
      const bookingData = {
        managerId,
        eventDate,
        eventType: pkg.eventType,
        location,
        packageBooked: {
          name: pkg.name,
          price: pkg.price,
        },
      };

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post('http://localhost:5000/api/bookings', bookingData, config);
      setSuccess(`Booking request sent to ${managerName}!`);
      setLoading(false);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send booking request.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg sticky top-28">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Request a Quote</h3>
      
      {success && <div className="bg-green-100 text-green-800 p-3 rounded-md mb-4">{success}</div>}
      {error && <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4">{error}</div>}

      <form onSubmit={submitHandler} className="space-y-4">
        <div>
          <label htmlFor="package" className="block text-sm font-medium text-gray-700">Select a Package</label>
          <select id="package" value={selectedPackage} onChange={(e) => setSelectedPackage(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
            {packages.map(pkg => (
              <option key={pkg._id} value={pkg._id}>{pkg.name} - ₹{pkg.price.toLocaleString()}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Event Date</label>
          <input type="date" id="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Event Location (City)</label>
          <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} required placeholder="e.g., Mumbai" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-primary/50">
          {loading ? 'Sending...' : 'Send Request'}
        </button>
        {!userInfo && <p className="text-center text-xs text-gray-500 mt-2">You must be logged in to book.</p>}
      </form>
    </div>
  );
};

export default BookingWidget;