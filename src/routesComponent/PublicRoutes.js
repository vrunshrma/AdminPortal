// routes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginComponent from '../DesktopComponents/LoginComponent';
import EmailSubmitComponent from '../DesktopComponents/EmailSubmitComponent';
import TokenVerificationComponent from '../authService/TokenVerification';
import LoginPage from '../DesktopComponents/NewLoginPage';
import AdminUserManagement from '../DesktopComponents/AdminUserManagement';
import ResetPasswordPage from '../DesktopComponents/NewResetPasswordComponent';
import MobileLogin from '../MobileComponents/MobileLogin';

const routes = [
  { path: '/', element: <LoginPage /> },
  { path: '/emailSubmit', element: <EmailSubmitComponent /> },
  { path: '/login', element: <LoginComponent /> },
  { path: '/createPassword', element: <TokenVerificationComponent /> },
  { path: '/loginPage', element: <LoginPage /> },
  { path: '/mobileLogin', element: <MobileLogin /> },
];

const PublicRoutes = () => (
  console.log('PublicRoutes'),
  (
    <Routes>
      {routes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  )
);

export default PublicRoutes;
