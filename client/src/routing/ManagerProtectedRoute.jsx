// client/src/routing/ManagerProtectedRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ManagerProtectedRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  // Check if user is logged in AND their role is 'manager'
  if (userInfo && userInfo.user.role === 'manager') {
    return <Outlet />; // If yes, render the child component (the dashboard)
  } else {
    // If not, redirect them to the login page
    return <Navigate to="/login" replace />;
  }
};

export default ManagerProtectedRoute;