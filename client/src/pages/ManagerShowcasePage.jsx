// client/src/pages/ManagerShowcasePage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import PackageCard from '../components/PackageCard';

const ManagerShowcasePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userInfo) return;
      try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/managers/profile/me', config);
        setProfile(data.data);
      } catch (err) {
        setError('Failed to fetch your profile data.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userInfo]);

  if (loading) return <div className="pt-32 text-center">Loading Your Showcase...</div>;
  if (error) return <div className="pt-32 text-center text-red-500">{error}</div>;

  return (
    <div className="bg-gray-100 min-h-screen pt-24">
      <header className="bg-white shadow">
        <div className="container mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">Your Public Event Showcase</h1>
          <p className="text-gray-600 mt-1">This is how users see your event packages on your public profile.</p>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4">
        {profile?.packages && profile.packages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {profile.packages.map(pkg => (
              <PackageCard key={pkg._id} pkg={pkg} />
            ))}
          </div>
        ) : (
          <p>You haven't added any packages yet. Go to your dashboard to add one.</p>
        )}
      </main>
    </div>
  );
};

export default ManagerShowcasePage;