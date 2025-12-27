// client/src/pages/ManagerDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaMapMarkerAlt, FaStar, FaBriefcase } from 'react-icons/fa';
import BookingWidget from '../components/BookingWidget';
import PackageCard from '../components/PackageCard';

const ManagerDetailsPage = () => {
  const { id } = useParams();
  const [manager, setManager] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchManager = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`http://localhost:5000/api/managers/${id}`);
        setManager(data.data);
      } catch (err) { setError('Could not fetch manager details.'); } 
      finally { setLoading(false); }
    };
    fetchManager();
  }, [id]);

  if (loading) return <div className="text-center py-40">Loading Manager Profile...</div>;
  if (error) return <div className="text-center py-40 text-red-500">{error}</div>;
  if (!manager) return <div className="text-center py-40">Manager not found.</div>;

  const featuredEventImage = manager.portfolio?.find(p => p.isFeatured)?.imageUrl || manager.profileImage;

  return (
    <div className="bg-gray-100 min-h-screen pt-20">
      <div className="relative h-96 bg-gray-800">
        <img src={featuredEventImage} alt={manager.companyName} className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4 bg-gradient-to-t from-black/60 to-transparent">
          <h1 className="text-5xl font-extrabold tracking-tight">{manager.companyName}</h1>
          <p className="text-xl text-gray-200 mt-2 flex items-center gap-2"><FaMapMarkerAlt /> {manager.location.area}, {manager.location.city}</p>
          <div className="mt-4 flex items-center gap-6 text-lg">
            <span><FaStar className="text-yellow-400 inline-block mr-1" /> {manager.averageRating.toFixed(1)} ({manager.reviews.length} reviews)</span>
            <span><FaBriefcase className="inline-block mr-1" /> {manager.yearsOfExperience}+ years experience</span>
          </div>
        </div>
      </div>
      <div className="container mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-12">
          
          <div id="portfolio">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Portfolio Gallery</h2>
            {manager.portfolio && manager.portfolio.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {manager.portfolio.map(item => (
                  <div key={item._id} className="rounded-lg overflow-hidden shadow-lg group">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-56 object-cover"/>
                    <div className="p-4 bg-white">
                      <h3 className="font-bold">{item.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : ( <p>This manager has not added any portfolio items yet.</p> )}
          </div>

          <div id="packages">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">All Offered Events & Packages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {manager.packages.map(pkg => ( <PackageCard key={pkg._id} pkg={pkg} /> ))}
            </div>
          </div>
          
          <div id="reviews">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Client Reviews</h2>
              <div className="bg-white p-6 rounded-lg shadow-md">
                {manager.reviews && manager.reviews.length > 0 ? (
                  <div className="space-y-6">
                    <div className="text-center border-b pb-6 mb-6">
                      <p className="text-5xl font-bold text-yellow-500">{manager.averageRating.toFixed(1)} <span className="text-2xl text-gray-500">/ 5</span></p>
                      <p className="text-gray-600">Based on {manager.reviews.length} reviews</p>
                    </div>
                    {manager.reviews.slice(0, 5).map(review => (
                      <div key={review._id} className="border-t pt-4 first:border-t-0 first:pt-0">
                        <div className="flex items-center mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => <FaStar key={i} color={i < review.rating ? '#ffc107' : '#e4e5e9'} />)}
                          </div>
                          <p className="ml-4 font-bold text-gray-800">{review.hostId.name}</p>
                        </div>
                        <p className="text-gray-700 italic">"{review.comment}"</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>This manager has no reviews yet.</p>
                )}
              </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <BookingWidget managerId={manager._id} managerName={manager.companyName} packages={manager.packages} />
        </div>
      </div>
    </div>
  );
};
export default ManagerDetailsPage;