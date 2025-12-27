// client/src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="bg-primary text-white text-2xl font-bold p-2 rounded-lg">V</span>
          <span className="text-2xl font-bold">Vedika</span>
        </div>
        <p className="text-gray-400 mb-6">
          Where Moments Meet Masters
        </p>
        <div className="text-gray-500">
          © {new Date().getFullYear()} Vedika. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};
export default Footer;