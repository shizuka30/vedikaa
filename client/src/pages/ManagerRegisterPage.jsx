// client/src/pages/ManagerRegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import backgroundImage from '../assets/auth-background.jpg';

const ManagerRegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', companyName: '', city: '', area: '', 
    yearsOfExperience: '', specialties: '', phoneNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

// Replace the onSubmit function in ManagerRegisterPage.jsx

  const onSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
      // The form data is already collected by the onChange handler
        const newManagerData = {
          name: formData.name, email: formData.email, password: formData.password, role: 'manager',
          companyName: formData.companyName,
          location: { city: formData.city, area: formData.area },
          yearsOfExperience: formData.yearsOfExperience,
          specialties: formData.specialties.split(',').map(s => s.trim()),
          phoneNumber: formData.phoneNumber
        };
      
      // Just send the registration request
        const res = await axios.post('http://localhost:5000/api/auth/register', newManagerData);
      
        toast.success(res.data.message);
        navigate('/login'); // Redirect to login on success

      } catch (err) {
        toast.error(err.response?.data?.message || 'Registration failed.');
        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative w-full max-w-lg bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-extrabold text-white text-center">Manager Registration</h2>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <input type="text" name="name" value={formData.name} onChange={onChange} placeholder="Your Full Name" required className="... w-full p-3 ..."/>
          <input type="email" name="email" value={formData.email} onChange={onChange} placeholder="Login Email" required className="... w-full p-3 ..."/>
          <input type="password" name="password" value={formData.password} onChange={onChange} placeholder="Password" required className="... w-full p-3 ..."/>
          <input type="text" name="companyName" value={formData.companyName} onChange={onChange} placeholder="Company Name" required className="... w-full p-3 ..."/>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="city" value={formData.city} onChange={onChange} placeholder="City" required className="... w-full p-3 ..."/>
            <input type="text" name="area" value={formData.area} onChange={onChange} placeholder="Area / Suburb" required className="... w-full p-3 ..."/>
          </div>
          <input type="number" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={onChange} placeholder="Years of Experience" required className="... w-full p-3 ..."/>
          <input type="text" name="specialties" value={formData.specialties} onChange={onChange} placeholder="Specialties (e.g., Weddings, Corporate)" required className="... w-full p-3 ..."/>
          <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={onChange} placeholder="Phone Number" required className="... w-full p-3 ..."/>
          <button type="submit" disabled={loading} className="w-full ... py-3 ...">{loading ? 'Registering...' : 'Register as Manager'}</button>
        </form>
      </div>
    </div>
  );
};
export default ManagerRegisterPage;