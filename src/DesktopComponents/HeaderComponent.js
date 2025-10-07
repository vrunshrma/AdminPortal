import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/header.css';
import { useAuth } from '../authService/AuthContext';
import { jwtDecode } from 'jwt-decode';

import { Briefcase, Bell } from 'lucide-react';

const HeaderComponent = ({ togglePanel }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isAuthenticated } = useAuth();
  const role = localStorage.getItem('role');
  const { user } = useAuth();
  const userData = user
    ? { name: `${user.firstName || ''} ${user.lastName || ''}`.trim() }
    : { name: 'User' }; // Fallback to a default user object

  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      // Ensure token is a valid string before decoding
      if (!token || typeof token !== 'string') {
        setIsLoggedIn(false);
        return;
      }
      try {
        const decodedToken = jwtDecode(token); // Decode the token
        console.log('decodedToken from header component : ', decodedToken);
        const tokenType = decodedToken.token_type; // Get token type
        // Set isLoggedIn only if token is valid and token_type is NOT "reset_password"
        setIsLoggedIn(!!token && tokenType !== 'password_reset');
      } catch (error) {
        console.error('Invalid token:', error);
        setIsLoggedIn(false); // Invalidate login state if token is invalid
      }

      // Set isLoggedIn only if token exists and token_type is NOT "reset_password
    };

    checkToken();
    window.addEventListener('authChange', checkToken);
    return () => window.removeEventListener('authChange', checkToken);
  }, []);

  const handleRedirect = () => {
    navigate('/employeeList');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);

    window.dispatchEvent(new Event('authChange'));
    window.dispatchEvent(new Event('storage'));
    navigate('/loginPage');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Briefcase className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">AttendanceHub</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <Bell size={20} />
            </button>
            {/* <div className="flex justify-end items-center mb-6 relative"> */}
            <div className="relative" ref={userMenuRef}>
              <button
                className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold"
                onClick={() => setShowUserMenu((prev) => !prev)}
              >
                {userData.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
                  <button
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-xl text-gray-700 font-medium"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
    // <header className="header">
    //   <nav className="navbar">
    //     {/* Hamburger Button */}
    //     {isAuthenticated && role !== "EMPLOYEE" && (
    //       <button className="hamburger-button" onClick={togglePanel}>
    //         &#9776;
    //       </button>
    //     )}

    //     {/* App Brand */}
    //     <span
    //       onClick={isAuthenticated ? handleRedirect : undefined}
    //       className="navbar-brand"
    //     >
    //       Attendance Management Application
    //     </span>

    //     {/* Navbar Menu */}
    //   </nav>
    //   <div className="navbar-collapse">
    //       <ul className="navbar-nav">
    //         {isAuthenticated && (
    //           <li className="nav-item">
    //             <span onClick={handleLogout} className="nav-link">
    //               Logout
    //             </span>
    //           </li>
    //         )}
    //       </ul>
    //     </div>
    // </header>
  );
};

export default HeaderComponent;
