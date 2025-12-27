// client/src/pages/EmailVerificationPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import backgroundImage from '../assets/auth-background.jpg';

const EmailVerificationPage = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('Verifying...');
  const [error, setError] = useState(false);

  useEffect(() => {
    const verifyEmailToken = async () => {
      try {
        // We use the same backend URL, but call it from our frontend
        await axios.get(`http://localhost:5000/api/auth/verifyemail/${token}`);
        setStatus('Email Verified Successfully!');
        setError(false);
      } catch (err) {
        setStatus('Verification Failed');
        setError(err.response?.data?.message || 'Invalid or expired token.');
      }
    };
    if (token) {
      verifyEmailToken();
    }
  }, [token]);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-8 text-center text-white">
        <h2 className="text-3xl font-extrabold mb-4">{status}</h2>
        {error ? (
          <p className="text-red-300">{error}</p>
        ) : (
          <p>You can now proceed to log in to your account.</p>
        )}
        <Link to="/login">
          <button className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-dark">
            Go to Login
          </button>
        </Link>
      </div>
    </div>
  );
};

export default EmailVerificationPage;