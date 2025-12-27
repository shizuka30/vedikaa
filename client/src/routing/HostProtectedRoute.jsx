// client/src/routing/HostProtectedRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const HostProtectedRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  // --- THIS IS THE CORRECTED LOGIC ---

  // 1. First, check if a user is logged in at all.
  if (userInfo && userInfo.user) {
    // 2. If they are logged in, check their role.
    if (userInfo.user.role === 'host') {
      // If they are a host, let them see the page.
      return <Outlet />;
    } else {
      // If they are logged in but are a manager, send them to their own dashboard.
      return <Navigate to="/manager/dashboard" replace />;
    }
  } else {
    // 3. If they are not logged in at all, send them to the login page.
    return <Navigate to="/login" replace />;
  }
};

export default HostProtectedRoute;