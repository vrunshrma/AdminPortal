import React, { useState, useEffect } from 'react';
import HeaderComponent from '../DesktopComponents/HeaderComponent';
import SlidePanelComponent from '../DesktopComponents/SlidePanelComponent';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../authService/AuthContext';
import UserSlidePanelComponent from '../DesktopComponents/UserSlidePanelComponent';

const Layout = () => {
  // For sidebar tab state
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const role = localStorage.getItem('role'); // Get role from localStorage

  if (location.pathname === '/resetPassword') {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderComponent />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {role === 'ADMIN' ? (
            <SlidePanelComponent activeTab={activeTab} setActiveTab={setActiveTab} />
          ) : (
            <UserSlidePanelComponent activeTab={activeTab} setActiveTab={setActiveTab} />
          )}
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
