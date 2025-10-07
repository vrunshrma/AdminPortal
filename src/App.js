import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import PublicRoutes from './routesComponent/PublicRoutes';
import HeaderComponent from './DesktopComponents/HeaderComponent';
import FooterComponent from './DesktopComponents/FooterComponent';
import PrivateRoutes from './routesComponent/PrivateRoutes';
import { AuthProvider, useAuth } from './authService/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
// import SlidePanelComponent from './routesComponent/SlidePanelComponent';
import { useState } from 'react';
import useWindowWidth from './hooks/useWindowWidth';
import { history } from './DesktopComponents/NavigationService';
import MobileRoutes from './routesComponent/MobilePublicRoutes';
import MobilePrivateRoutes from './routesComponent/MobilePrivateRoutes';

function App() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  return (
    <Router>
      <AuthProvider>
        {/* Global Slide Panel (Rendered outside HeaderComponent) */}
        {/* <SlidePanelComponent isOpen={isPanelOpen} togglePanel={togglePanel} /> */}
        {/* <HeaderComponent togglePanel={togglePanel} /> */}
        <RoutesHandler />
        <FooterComponent />
      </AuthProvider>
    </Router>
  );
}

// Component to conditionally render public or private routes
const RoutesHandler = () => {
  const width = useWindowWidth();
  const isMobile = width < 768;
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null && isMobile) {
    return <MobileRoutes />;
    // Show a loader until auth status is determined
  } else if (isAuthenticated === null) {
    return <PublicRoutes />;
  }

  if (isAuthenticated && isMobile) {
    // Retrieve role from localStorage
    const userRole = localStorage.getItem('role');
    return <MobilePrivateRoutes userRole={userRole} />;
  } else if (isAuthenticated) {
    const userRole = localStorage.getItem('role'); // Default role if not found
    return <PrivateRoutes userRole={userRole} />;
  }

  return <PublicRoutes />;
};

export default App;
