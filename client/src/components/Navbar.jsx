// client/src/components/Navbar.jsx
import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isHomePage = location.pathname === '/';
  
  const navClasses = isHomePage && !userInfo
    ? "absolute top-0 left-0 w-full bg-black/20 backdrop-blur-sm text-white z-20 py-4 px-8"
    : "bg-white shadow-md text-gray-800 z-20 py-4 px-8 sticky top-0";
    
  const textColor = isHomePage && !userInfo ? 'text-white' : 'text-gray-900';

  return (
    <nav className={navClasses}>
      <div className="container mx-auto flex justify-between items-center">
        <Link to={userInfo && userInfo.user ? (userInfo.user.role === 'manager' ? '/manager/dashboard' : (userInfo.user.role === 'admin' ? '/admin/dashboard' : '/search')) : '/'} className="flex items-center gap-2">
          <span className="bg-primary text-white text-2xl font-bold p-2 rounded-lg">V</span>
          <span className={`text-2xl font-bold ${textColor}`}>Vedika</span>
        </Link>
        
        {userInfo && userInfo.user ? (
          <div className="flex items-center gap-6">
            {/* --- ADMIN LINKS --- */}
            {userInfo.user.role === 'admin' && (
              <div className="hidden md:flex items-center gap-8 text-lg font-semibold">
                <Link to="/admin/dashboard" className="hover:text-primary transition-colors">Admin Panel</Link>
              </div>
            )}
            {userInfo.user.role === 'manager' && (
              <div className="hidden md:flex items-center gap-8 text-lg font-semibold">
                <Link to="/manager/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
                <Link to="/manager/showcase" className="hover:text-primary transition-colors">My Showcase</Link>
              </div>
            )}
            {userInfo.user.role === 'host' && (
              <div className="hidden md:flex items-center gap-8 text-lg font-semibold">
                <Link to="/search" className="hover:text-primary">Find Managers</Link>
                <Link to="/dashboard" className="hover:text-primary">My Bookings</Link>
              </div>
            )}
            <div className="flex items-center gap-4">
                <span className="font-semibold text-base hidden sm:block">Welcome, {userInfo.user.name.split(' ')[0]}!</span>
                <button 
                    onClick={logoutHandler} 
                    className="font-bold py-2 px-6 rounded-lg text-white transition-all duration-300
                    bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500
                    hover:from-pink-600 hover:to-yellow-600"
                >
                    Logout
                </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <Link to="/login" className={`flex items-center gap-2 hover:text-primary transition-colors font-semibold ${textColor}`}>
              <FaUserCircle />
              <span>Sign In</span>
            </Link>
            <Link to="/join/terms" className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-md transition-colors">
              Join as Manager
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
export default Navbar;