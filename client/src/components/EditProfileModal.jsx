// client/src/components/EditProfileModal.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const EditProfileModal = ({ profile, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    city: '',
    area: '',
    yearsOfExperience: '',
    specialties: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (profile) {
      setFormData({
        companyName: profile.companyName || '',
        city: profile.location?.city || '',
        area: profile.location?.area || '',
        yearsOfExperience: profile.yearsOfExperience || '',
        specialties: profile.specialties?.join(', ') || ''
      });
    }
  }, [profile]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const config = {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` }
      };
      
      const body = {
        companyName: formData.companyName,
        location: {
            city: formData.city,
            area: formData.area
        },
        yearsOfExperience: formData.yearsOfExperience,
        specialties: formData.specialties.split(',').map(s => s.trim())
      };

      const { data } = await axios.put(`http://localhost:5000/api/managers/profile/me`, body, config);
      onUpdate(data.data);
      onClose();
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Edit Your Company Profile</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
            <input type="text" name="companyName" value={formData.companyName} onChange={onChange} required className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2"/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
              <input type="text" name="city" value={formData.city} onChange={onChange} required className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2"/>
            </div>
            <div>
              <label htmlFor="area" className="block text-sm font-medium text-gray-700">Area / Suburb</label>
              <input type="text" name="area" value={formData.area} onChange={onChange} required className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2"/>
            </div>
          </div>
          <div>
            <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700">Years of Experience</label>
            <input type="number" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={onChange} required className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2"/>
          </div>
          <div>
            <label htmlFor="specialties" className="block text-sm font-medium text-gray-700">Specialties (comma separated)</label>
            <input type="text" name="specialties" value={formData.specialties} onChange={onChange} required className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2"/>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-white rounded-md disabled:bg-primary/50">{loading ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;