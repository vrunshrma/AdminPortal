import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MobileLogin from '../MobileComponents/MobileLogin';
import MobileAdminDashboard from '../MobileComponents/MobileAdminDashboard';

const mobileRoutes = [
  { path: '/mobileLogin', element: <MobileLogin /> },
  // { path: '/mobileDashboard', element: <MobileDashboard /> },
  // aur yaha mobile ke aur routes add kar sakte ho
];

const MobileRoutes = () => (
  console.log('MobilePublicRoutes'),
  (
    <Routes>
      {mobileRoutes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  )
);

export default MobileRoutes;
