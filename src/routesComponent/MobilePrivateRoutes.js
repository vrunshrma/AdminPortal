import React from 'react';
import { Routes, Route } from 'react-router-dom';
import withAuth from '../authService/WithAuth';
import Layout from './Layout';
import MobileAdminDashboard from '../MobileComponents/MobileAdminDashboard';

const routes = [
  { path: '/mobAdminDashboard', element: <MobileAdminDashboard />, roles: ['ADMIN'] },
];

const MobilePrivateRoutes = ({ userRole }) => {
  console.log(' user role from private route : ', userRole);
  const filteredRoutes = routes.filter((route) => route.roles.includes(userRole));

  return (
    <Routes>
      <Route element={<Layout />}>
        {filteredRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Route>
    </Routes>
  );
};

export default withAuth(MobilePrivateRoutes);
