// routes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginComponent from '../components/LoginComponent';
import EmailSubmitComponent from '../components/EmailSubmitComponent';
import TokenVerificationComponent from '../authService/TokenVerification';
import LoginPage from '../components/NewLoginPage';
import AdminUserManagement from '../components/AdminUserManagement';
import ResetPasswordPage from '../components/NewResetPasswordComponent';

const routes = [
  { path: '/', element: <LoginPage /> },
  { path: '/emailSubmit', element: <EmailSubmitComponent /> },
  { path: '/login', element: <LoginComponent /> },
  { path: '/createPassword', element: <TokenVerificationComponent /> },
  { path: '/loginPage', element: <LoginPage /> },
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
