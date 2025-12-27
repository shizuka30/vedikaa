// client/src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import backgroundImage from '../assets/auth-background.jpg'; // We'll reuse the same auth background
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { name, email, password } = formData;
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // The role is 'host' by default for this registration page
      const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role: 'host' });
      
      setLoading(false);
      toast.success(res.data.message); // Show a success notification
      navigate('/login'); // Redirect to login page after successful registration

    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed.';
      setError(message); // Set inline error for display
      toast.error(message); // Also show a toast notification for the error
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4" 
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-8">
        <div className="text-center text-white">
          <h2 className="text-3xl font-extrabold">Create a New Account</h2>
          <p className="mt-2 text-sm text-gray-200">
            Already have an account? <Link to="/login" className="font-medium text-secondary hover:underline">Sign in here</Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          {error && <div className="bg-red-500/50 text-white text-center p-3 rounded-lg">{error}</div>}
          
          <div>
            <input 
                name="name" 
                type="text" 
                value={name} 
                onChange={onChange} 
                required 
                className="appearance-none rounded-lg relative block w-full px-3 py-3 bg-white/20 border border-white/30 placeholder-gray-300 text-white focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm" 
                placeholder="Full Name" 
            />
          </div>
          <div>
            <input 
                name="email" 
                type="email" 
                value={email} 
                onChange={onChange} 
                required 
                className="appearance-none rounded-lg relative block w-full px-3 py-3 bg-white/20 border border-white/30 placeholder-gray-300 text-white focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm" 
                placeholder="Email address" 
            />
          </div>
          <div>
            <input 
                name="password" 
                type="password" 
                value={password} 
                onChange={onChange} 
                required 
                className="appearance-none rounded-lg relative block w-full px-3 py-3 bg-white/20 border border-white/30 placeholder-gray-300 text-white focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm" 
                placeholder="Password" 
            />
          </div>
          <div>
            <button 
                type="submit" 
                disabled={loading} 
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark disabled:bg-primary/50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-xs text-gray-200">
          <p className="font-bold mb-2">Password must contain:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>At least 8 characters</li>
            <li>One uppercase letter (A-Z) and one lowercase letter (a-z)</li>
            <li>One number (0-9) and one special character (@, $, !, etc.)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;