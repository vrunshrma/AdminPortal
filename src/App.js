import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import PublicRoutes from './routesComponent/PublicRoutes';
import HeaderComponent from './components/HeaderComponent';
import FooterComponent from './components/FooterComponent';
import PrivateRoutes from './routesComponent/PrivateRoutes';
import { AuthProvider, useAuth } from './authService/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
// import SlidePanelComponent from './routesComponent/SlidePanelComponent';
import { useState } from 'react';
import { history } from './components/NavigationService';

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
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) {
    return <PublicRoutes />; // Show a loader until auth status is determined
  }

  if (isAuthenticated) {
    // Retrieve role from localStorage
    const userRole = localStorage.getItem('role'); // Default role if not found
    return <PrivateRoutes userRole={userRole} />;
  }

  return <PublicRoutes />;
};

export default App;
