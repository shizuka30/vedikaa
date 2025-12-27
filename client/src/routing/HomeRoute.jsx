// client/src/routing/HomeRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';

const HomeRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  // If the user is logged in, redirect them from the landing page to the search page.
  // If they are not logged in, show them the landing page.
  return userInfo ? <Navigate to="/search" replace /> : <HomePage />;
};

export default HomeRoute;