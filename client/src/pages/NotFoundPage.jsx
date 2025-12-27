// client/src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
      <FaExclamationTriangle className="text-yellow-400 text-6xl mb-4" />
      <h1 className="text-5xl font-extrabold text-gray-800 mb-2">404</h1>
      <h2 className="text-3xl font-bold text-gray-700 mb-4">Page Not Found</h2>
      <p className="text-lg text-gray-500 max-w-md mb-8">
        Oops! The page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <Link to="/">
        <button className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg">
          Go Back Home
        </button>
      </Link>
    </div>
  );
};

export default NotFoundPage;