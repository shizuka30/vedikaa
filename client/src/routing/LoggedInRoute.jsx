// client/src/routing/LoggedInRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const LoggedInRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  // If user is logged in, show the page. Otherwise, redirect to the landing page.
  return userInfo ? <Outlet /> : <Navigate to="/" replace />;
};

export default LoggedInRoute;