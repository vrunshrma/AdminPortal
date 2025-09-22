import React from 'react';
import { Briefcase, Users, BarChart3, User, Settings, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const tabRoutes = {
  dashboard: '/userDashboard',
  leave: '/leaveManagement', // Change to your Employee Management route
  //  reports: '/reports', // Change to your Reports route
  profile: '/profile', // Change to your Profile route
  settings: '/settings', // Add this route if you have a settings page
};

const SlidePanelComponent = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const handleTabClick = (id) => {
    setActiveTab(id);
    if (tabRoutes[id]) {
      navigate(tabRoutes[id]);
    }
  };

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
      {isActive && <ChevronRight size={16} className="ml-auto" />}
    </button>
  );

  return (
    <aside className="lg:w-64 space-y-2">
      <nav className="space-y-2">
        <TabButton
          id="dashboard"
          label="Dashboard"
          icon={Briefcase}
          isActive={activeTab === 'dashboard'}
          onClick={handleTabClick}
        />
        <TabButton
          id="leave"
          label="Leave Management"
          icon={Users}
          isActive={activeTab === 'users'}
          onClick={handleTabClick}
        />
        {/* <TabButton
          id="profile"
          label="Profile"
          icon={User}
          isActive={activeTab === 'profile'}
          onClick={handleTabClick}
        />
        <TabButton
          id="settings"
          label="Settings"
          icon={Settings}
          isActive={activeTab === 'settings'}
          onClick={handleTabClick}
        /> */}
      </nav>
    </aside>
  );
};

export default SlidePanelComponent;
