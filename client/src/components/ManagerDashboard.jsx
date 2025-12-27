// client/src/components/ManagerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaInbox, FaBoxOpen, FaTrash } from 'react-icons/fa';
import EditPackageModal from './EditPackageModal';
import AddPackageModal from './AddPackageModal';
import EditProfileModal from './EditProfileModal';
import AddPortfolioModal from './AddPortfolioModal';
import ChatModal from './ChatModal';

const ManagerDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditPackageModalOpen, setIsEditPackageModalOpen] = useState(false);
  const [isAddPackageModalOpen, setIsAddPackageModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isAddPortfolioModalOpen, setIsAddPortfolioModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { userInfo } = useSelector((state) => state.auth);

  const fetchData = async () => {
    if (!userInfo) return;
    
    setLoading(true);
    setError('');
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      const profilePromise = axios.get('http://localhost:5000/api/managers/profile/me', config);
      const bookingsPromise = axios.get('http://localhost:5000/api/bookings/my-requests', config);
      
      const [profileRes, bookingsRes] = await Promise.all([profilePromise, bookingsPromise]);
      
      setProfile(profileRes.data.data);
      setBookings(bookingsRes.data.data);
      
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError('Failed to fetch dashboard data. Please refresh the page.');
    } finally {
      // This block guarantees the loading state is turned off, fixing the bug.
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchData(); 
  }, [userInfo]);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.put(`http://localhost:5000/api/bookings/${bookingId}`, { status: newStatus }, config);
      setBookings(bookings.map(b => (b._id === bookingId ? data.data : b)));
      toast.success(`Booking status updated to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const StatusBadge = ({ status }) => {
    const colorClasses = {
      Pending: 'bg-yellow-100 text-yellow-800', Confirmed: 'bg-green-100 text-green-800',
      Cancelled: 'bg-red-100 text-red-800', Completed: 'bg-blue-100 text-blue-800',
    };
    return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClasses[status]}`}>{status}</span>;
  };

  const handleEditPackage = (pkg) => {
    setSelectedPackage(pkg);
    setIsEditPackageModalOpen(true);
  };

  const handleDeletePackage = async (packageId) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.delete(`http://localhost:5000/api/managers/packages/${packageId}`, config);
            handleProfileUpdate(data.data);
            toast.success('Package deleted successfully!');
        } catch (err) {
            toast.error('Failed to delete package.');
        }
    }
  };

  const handleDeletePortfolio = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this portfolio item?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.delete(`http://localhost:5000/api/managers/portfolio/${itemId}`, config);
        handleProfileUpdate(data.data);
        toast.success('Portfolio item deleted!');
      } catch (err) {
        toast.error('Failed to delete item.');
      }
    }
  };
  
  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  const handleOpenChatModal = (booking) => {
    setSelectedBooking(booking);
    setIsChatModalOpen(true);
  };

  if (loading) return <div className="pt-32 text-center">Loading Dashboard...</div>;
  if (error) return <div className="pt-32 text-center text-red-500">{error}</div>;

  return (
    <>
      {isEditPackageModalOpen && <EditPackageModal pkg={selectedPackage} onClose={() => setIsEditPackageModalOpen(false)} onUpdate={handleProfileUpdate} />}
      {isAddPackageModalOpen && <AddPackageModal onClose={() => setIsAddPackageModalOpen(false)} onUpdate={handleProfileUpdate} />}
      {isEditProfileModalOpen && <EditProfileModal profile={profile} onClose={() => setIsEditProfileModalOpen(false)} onUpdate={handleProfileUpdate} />}
      {isAddPortfolioModalOpen && <AddPortfolioModal onClose={() => setIsAddPortfolioModalOpen(false)} onUpdate={handleProfileUpdate} />}
      {isChatModalOpen && selectedBooking && <ChatModal managerName={selectedBooking.hostId.name} bookingId={selectedBooking._id} onClose={() => setIsChatModalOpen(false)} />}

      <div className="bg-gray-100 min-h-screen pt-24">
        <header className="bg-white shadow"><div className="container mx-auto py-6 px-4"><h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1></div></header>
        <main className="container mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">New Booking Requests</h2>
                {bookings.length > 0 ? (
                  <div className="overflow-x-auto"><table className="min-w-full bg-white">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Host Name</th>
                          <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Event Type</th>
                          <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {bookings.map(booking => ( <tr key={booking._id}>
                            <td className="py-4 px-6 whitespace-nowrap">{booking.hostId?.name || 'N/A'}</td>
                            <td className="py-4 px-6 whitespace-nowrap">{booking.eventType}</td>
                            <td className="py-4 px-6 whitespace-nowrap">{new Date(booking.eventDate).toLocaleDateString()}</td>
                            <td className="py-4 px-6 whitespace-nowrap"><StatusBadge status={booking.status} /></td>
                            <td className="py-4 px-6 whitespace-nowrap">
                              <div className="flex items-center gap-4 text-sm font-medium">
                                <button onClick={() => handleOpenChatModal(booking)} className="text-purple-600 hover:underline">Chat</button>
                                {booking.status === 'Pending' && (
                                  <>
                                    <button onClick={() => handleStatusUpdate(booking._id, 'Confirmed')} className="text-green-600 hover:underline">Accept</button>
                                    <button onClick={() => handleStatusUpdate(booking._id, 'Cancelled')} className="text-red-600 hover:underline">Decline</button>
                                  </>
                                )}
                                {booking.status === 'Confirmed' && ( <button onClick={() => handleStatusUpdate(booking._id, 'Completed')} className="text-blue-600 hover:underline">Mark as Complete</button> )}
                              </div>
                            </td>
                          </tr> ))}
                      </tbody>
                  </table></div>
                ) : ( <div className="text-center py-8"><FaInbox className="mx-auto text-4xl text-gray-300 mb-3"/><p className="text-gray-500">Your booking request inbox is currently empty.</p></div> )}
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Manage Your Event Packages</h2>
                    <button onClick={() => setIsAddPackageModalOpen(true)} className="bg-primary text-white font-bold py-2 px-4 rounded-lg transition hover:bg-primary-dark">+ Add New Package</button>
                </div>
                <div>
                  {profile?.packages && profile.packages.length > 0 ? (
                    <div className="space-y-4">
                      {profile.packages.map(pkg => (
                          <div key={pkg._id} className="p-4 border rounded-lg flex justify-between items-center flex-wrap gap-4">
                              <div><h3 className="font-bold text-lg">{pkg.name}</h3><p className="text-gray-600">Current Price: ₹{pkg.price.toLocaleString()}</p></div>
                              <div className="flex items-center gap-4"><button onClick={() => handleEditPackage(pkg)} className="text-blue-600 hover:underline font-semibold">Edit</button><button onClick={() => handleDeletePackage(pkg._id)} className="text-red-600 hover:underline font-semibold">Delete</button></div>
                          </div>
                      ))}
                    </div>
                  ) : ( <div className="text-center py-8"><FaBoxOpen className="mx-auto text-4xl text-gray-300 mb-3" /><p className="text-gray-500">You haven't added any packages yet.</p><p className="text-gray-400 text-sm mt-1">Click "+ Add New Package" to get started.</p></div> )}
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Manage Your Portfolio</h2>
                <button onClick={() => setIsAddPortfolioModalOpen(true)} className="bg-primary text-white font-bold py-2 px-4 rounded-lg">+ Add Portfolio Item</button>
              </div>
              {profile?.portfolio.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {profile.portfolio.map(item => (
                    <div key={item._id} className="relative group"><img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover rounded-lg"/>
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"><button onClick={() => handleDeletePortfolio(item._id)} className="text-white bg-red-600 p-3 rounded-full hover:bg-red-700"><FaTrash /></button></div>
                    </div>
                  ))}
                </div>
              ) : ( <p className="text-center py-8 text-gray-500">Your portfolio is empty. Add an item to showcase your work!</p> )}
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-lg sticky top-28">
              <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
              <div className="space-y-3 text-gray-700">
                <p><strong>Company:</strong> {profile?.companyName}</p><p><strong>Location:</strong> {profile?.location.area}, {profile?.location.city}</p>
                <p><strong>Experience:</strong> {profile?.yearsOfExperience}+ years</p>
                <div className="pt-2"><p><strong>Specialties:</strong></p><div className="flex flex-wrap gap-2 mt-2">{profile?.specialties.map((spec, i) => (<span key={i} className="bg-gray-200 text-gray-800 text-xs font-semibold px-2 py-1 rounded-full">{spec}</span>))}</div></div>
              </div>
              <button onClick={() => setIsEditProfileModalOpen(true)} className="w-full mt-6 bg-secondary hover:bg-yellow-500 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors">Edit Company Profile</button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};
export default ManagerDashboard;