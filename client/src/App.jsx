// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import all pages and components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SearchPage from './pages/SearchPage';
import ManagerDetailsPage from './pages/ManagerDetailsPage';
import HostDashboardPage from './pages/HostDashboardPage';
import ManagerDashboardPage from './pages/ManagerDashboardPage';
import ManagerShowcasePage from './pages/ManagerShowcasePage';
import NotFoundPage from './pages/NotFoundPage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
import ManagerRegisterPage from './pages/ManagerRegisterPage';
import AdminDashboardPage from './pages/AdminDashboardPage'; // New import

// Import Protected Routes
import HomeRoute from './routing/HomeRoute';
import HostProtectedRoute from './routing/HostProtectedRoute';
import ManagerProtectedRoute from './routing/ManagerProtectedRoute';
import AdminProtectedRoute from './routing/AdminProtectedRoute'; // New import

const App = () => {
  return (
    <Router>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
      <main>
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={<HomeRoute />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/join/terms" element={<TermsAndConditionsPage />} />
          <Route path="/register/manager" element={<ManagerRegisterPage />} />

          {/* --- HOST-ONLY ROUTES (Protected) --- */}
          <Route path="" element={<HostProtectedRoute />}>
            <Route path="/search" element={<SearchPage />} />
            <Route path="/dashboard" element={<HostDashboardPage />} />
            <Route path="/manager/:id" element={<ManagerDetailsPage />} />
          </Route>
          
          {/* --- MANAGER-ONLY ROUTES (Protected) --- */}
          <Route path="/manager/dashboard" element={<ManagerProtectedRoute />}>
            <Route path="" element={<ManagerDashboardPage />} />
          </Route>
          <Route path="/manager/showcase" element={<ManagerProtectedRoute />}>
            <Route path="" element={<ManagerShowcasePage />} />
          </Route>

          {/* --- ADMIN-ONLY ROUTE (Protected) --- */}
          <Route path="/admin/dashboard" element={<AdminProtectedRoute />}>
            <Route path="" element={<AdminDashboardPage />} />
          </Route>

          {/* 404 Not Found Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;