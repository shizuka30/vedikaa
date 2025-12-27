// client/src/components/HeroSection.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import backgroundImage from '../assets/hero-background.jpg';
import { FaSearch } from 'react-icons/fa';

const HeroSection = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div
      className="relative h-screen bg-cover bg-center flex items-center justify-center text-white"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black opacity-0"></div>
      <div className="relative z-10 text-center px-4 flex flex-col items-center pt-20">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
          Find Perfect <span className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-transparent bg-clip-text">Event</span>
        </h1>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4">
          <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-transparent bg-clip-text">Managers</span>
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl">
          Connect with professional event planners in your area for any occasion
        </p>
        
        {/* --- THIS ENTIRE BLOCK IS NOW CONDITIONAL --- */}
        {!userInfo && (
          <div className="mt-8">
            <p className="text-xl text-gray-200"></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSection;