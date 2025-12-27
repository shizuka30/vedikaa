// client/src/components/AddPortfolioModal.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const AddPortfolioModal = ({ onClose, onUpdate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error('Please select an image to upload.');
      return;
    }
    setLoading(true);

    try {
      // 1. Upload image to Cloudinary
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

      const cloudinaryRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      const imageUrl = cloudinaryRes.data.secure_url;

      // 2. Send the image URL to your backend
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
      const body = { title, description, imageUrl };
      
      const { data } = await axios.post('http://localhost:5000/api/managers/portfolio', body, config);
      
      onUpdate(data.data);
      toast.success('Portfolio item added!');
      onClose();

    } catch (err) {
      toast.error('Failed to add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Add New Portfolio Item</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event Title" required className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2"/>
          
          <div>
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">Event Image</label>
            <input id="file-upload" name="file-upload" type="file" onChange={handleFileChange} required className="mt-1 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-primary hover:file:bg-pink-100"/>
          </div>

          <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A short description..." required className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2"></textarea>
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-white rounded-md disabled:bg-primary/50">{loading ? 'Uploading...' : 'Add Item'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddPortfolioModal;