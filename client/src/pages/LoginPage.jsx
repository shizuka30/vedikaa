// client/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import backgroundImage from '../assets/auth-background.jpg';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      dispatch(setCredentials(res.data));
      setLoading(false);
      toast.success('Login Successful!');

      if (res.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (res.data.user.role === 'manager') {
        navigate('/manager/dashboard');
      } else {
        navigate('/search');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'An error occurred.';
      setError(message);
      toast.error(message);
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
          <h2 className="text-3xl font-extrabold">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-200">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-secondary hover:underline">
              Register here
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          {error && <div className="bg-red-500/50 text-white text-center p-3 rounded-lg">{error}</div>}
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
            {/* --- THIS IS THE CORRECTED BUTTON --- */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark disabled:bg-primary/50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;