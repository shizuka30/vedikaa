// client/src/components/AddPackageModal.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const AddPackageModal = ({ onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '', eventType: '', price: '', description: '', servicesIncluded: '', imageUrl: ''
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
        servicesIncluded: formData.servicesIncluded.split(',').map(s => s.trim())
      };
      const { data } = await axios.post(`http://localhost:5000/api/managers/packages`, body, config);
      onUpdate(data.data);
      onClose();
    } catch (err) {
      setError('Failed to add package.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Add New Event Package</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          {error && <p className="text-red-500">{error}</p>}
          <input type="text" name="name" value={formData.name} onChange={onChange} placeholder="Package Name (e.g., Grand Birthday Bash)" required className="mt-1 w-full border-gray-300 rounded-md shadow-sm"/>
          <input type="text" name="eventType" value={formData.eventType} onChange={onChange} placeholder="Event Type (e.g., Birthday Party)" required className="mt-1 w-full border-gray-300 rounded-md shadow-sm"/>
          <input type="number" name="price" value={formData.price} onChange={onChange} placeholder="Price (₹)" required className="mt-1 w-full border-gray-300 rounded-md shadow-sm"/>
          <textarea name="description" rows="3" value={formData.description} onChange={onChange} placeholder="Description" className="mt-1 w-full border-gray-300 rounded-md shadow-sm"></textarea>
          <input type="text" name="servicesIncluded" value={formData.servicesIncluded} onChange={onChange} placeholder="Services Included (comma separated)" className="mt-1 w-full border-gray-300 rounded-md shadow-sm"/>
          <input type="text" name="imageUrl" value={formData.imageUrl} onChange={onChange} placeholder="Image URL" className="mt-1 w-full border-gray-300 rounded-md shadow-sm"/>
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-white rounded-md">{loading ? 'Adding...' : 'Add Package'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddPackageModal;