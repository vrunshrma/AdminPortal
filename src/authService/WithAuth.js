import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { jwtDecode } from 'jwt-decode';
import useWindowWidth from '../hooks/useWindowWidth';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated } = useAuth();
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    const width = useWindowWidth();
    const isMobile = width < 768;
    useEffect(() => {
      if (!token && isMobile) {
        navigate('/mobileLogin');
        return;
      } else if (!token) {
        navigate('/loginPage');
        return;
      }
      try {
        const decodedToken = jwtDecode(token); // Decode the token
        console.log('decodedToken from header component : ', decodedToken);
        const tokenType = decodedToken.token_type; // Get token type
        // Set isLoggedIn only if token is valid and token_type is NOT "reset_password"
        if (tokenType === 'password_reset' && location.pathname !== '/resetPassword') {
          navigate('/resetPassword');
          return;
        }

        if (tokenType === 'general_access' && location.pathname === '/resetPassword') {
          navigate('/adminDashboard');
          return;
        }
      } catch (error) {
        console.error('Invalid token:', error);
        // Invalidate login state if token is invalid
      }
    }, [isAuthenticated, user, navigate, location]);

    if (isAuthenticated === null) {
      return <div>Loading...</div>; // Wait for auth check
    }

    return <WrappedComponent {...props} userRole={role} />;
  };
};

export default withAuth;
