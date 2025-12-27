// client/src/routing/AdminProtectedRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AdminProtectedRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  if (userInfo && userInfo.user.role === 'admin') {
    return <Outlet />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default AdminProtectedRoute;