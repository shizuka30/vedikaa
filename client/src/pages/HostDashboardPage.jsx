// client/src/pages/HostDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaClipboardList } from 'react-icons/fa';
import ReviewModal from '../components/ReviewModal';
import EditHostProfileModal from '../components/EditHostProfileModal';
import ChatModal from '../components/ChatModal';
import { toast } from 'react-toastify';

const HostDashboardPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { userInfo } = useSelector((state) => state.auth);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/bookings/my-bookings', config);
      setBookings(data.data);
    } catch (err) {
      console.error("Error fetching host bookings:", err);
      setError('Failed to fetch your bookings. Please try again later.');
    } finally {
      // This block guarantees the loading state is turned off, fixing the bug.
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [userInfo]);
  
  const handleCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.put(`http://localhost:5000/api/bookings/${bookingId}/cancel`, {}, config);
            fetchBookings();
            toast.success('Booking cancelled successfully.');
        } catch (err) {
            toast.error('Failed to cancel booking.');
        }
    }
  };
  
  const handleOpenReviewModal = (booking) => {
    setSelectedBooking(booking);
    setIsReviewModalOpen(true);
  };

  const handleOpenChatModal = (booking) => {
    setSelectedBooking(booking);
    setIsChatModalOpen(true);
  };
  
  if (loading) return <div className="pt-32 text-center">Loading your dashboard...</div>;

  return (
    <>
      {isReviewModalOpen && selectedBooking && <ReviewModal bookingId={selectedBooking._id} managerName={selectedBooking.managerId.companyName} onClose={() => setIsReviewModalOpen(false)} onReviewSubmitted={fetchBookings} />}
      {isEditProfileModalOpen && <EditHostProfileModal onClose={() => setIsEditProfileModalOpen(false)} />}
      {isChatModalOpen && selectedBooking && <ChatModal managerName={selectedBooking.managerId.companyName} bookingId={selectedBooking._id} onClose={() => setIsChatModalOpen(false)} />}

      <div className="bg-gray-100 min-h-screen pt-24">
        <header className="bg-white shadow">
            <div className="container mx-auto py-6 px-4 flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Host Dashboard</h1>
              <button 
                onClick={() => setIsEditProfileModalOpen(true)} 
                className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-md transition-colors text-sm">
                Edit Profile
              </button>
            </div>
        </header>
        <main className="container mx-auto py-8 px-4 space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Your Bookings</h2>
            {error && <p className="text-center text-red-500">{error}</p>}
            
            {!error && bookings.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {bookings.map(booking => (
                  <li key={booking._id} className="py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                      <p className="text-lg font-semibold text-primary">{booking.eventType}</p>
                      <p className="text-gray-600">with {booking.managerId?.companyName || 'Manager Deleted'}</p>
                      <p className="text-sm text-gray-500">Date: {new Date(booking.eventDate).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                      <button onClick={() => handleOpenChatModal(booking)} className="text-purple-600 hover:underline font-semibold text-sm">Chat with Manager</button>
                      
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full 
                        ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          booking.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'}`}>
                        {booking.status}
                      </span>
                      
                      {booking.status === 'Completed' && !booking.isReviewed && (
                        <div className="bg-blue-100 text-blue-800 p-2 rounded-md text-center">
                          <p className="font-semibold text-sm">Event Complete!</p>
                          <button onClick={() => handleOpenReviewModal(booking)} className="text-blue-600 hover:underline font-bold text-sm">Leave a Review</button>
                        </div>
                      )}
                      {booking.status === 'Completed' && booking.isReviewed && ( <p className="text-sm text-green-600 font-semibold">Review Submitted!</p> )}
                      {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                         <button onClick={() => handleCancel(booking._id)} className="text-red-600 hover:underline font-semibold">Cancel</button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : ( 
              !error && (
                <div className="text-center py-16">
                  <FaClipboardList className="mx-auto text-5xl text-gray-300 mb-4" />
                  <h3 className="text-xl font-bold text-gray-800">You Haven't Booked Any Events Yet</h3>
                  <p className="text-gray-500 mt-2 mb-6">Ready to plan your next memorable occasion?</p>
                  <Link to="/search">
                    <button className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-md transition-colors">
                      Find Your Perfect Manager
                    </button>
                  </Link>
                </div>
              )
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default HostDashboardPage;