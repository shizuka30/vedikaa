// client/src/components/EditPackageModal.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const EditPackageModal = ({ pkg, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    price: pkg.price || '',
    description: pkg.description || '',
    servicesIncluded: pkg.servicesIncluded?.join(', ') || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { userInfo } = useSelector((state) => state.auth);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
      const body = {
        ...formData,
        servicesIncluded: formData.servicesIncluded.split(',').map(s => s.trim()) // Convert string back to array
      };
      const { data } = await axios.put(`http://localhost:5000/api/managers/packages/${pkg._id}`, body, config);
      onUpdate(data.data); // Send updated profile back to parent
      onClose(); // Close the modal
    } catch (err) {
      setError('Failed to update package.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Edit: {pkg.name}</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          {error && <p className="text-red-500">{error}</p>}
          <div>
            <label htmlFor="price" className="block text-sm font-medium">Price (₹)</label>
            <input type="number" name="price" value={formData.price} onChange={onChange} className="mt-1 w-full border-gray-300 rounded-md shadow-sm"/>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium">Description</label>
            <textarea name="description" rows="3" value={formData.description} onChange={onChange} className="mt-1 w-full border-gray-300 rounded-md shadow-sm"></textarea>
          </div>
          <div>
            <label htmlFor="servicesIncluded" className="block text-sm font-medium">Services Included (comma separated)</label>
            <input type="text" name="servicesIncluded" value={formData.servicesIncluded} onChange={onChange} className="mt-1 w-full border-gray-300 rounded-md shadow-sm"/>
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

export default EditPackageModal;