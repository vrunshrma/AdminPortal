import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EmployeeListPage from '../components/EmployeeListPage';
import DashboardComponent from '../components/DashboardComponent';
import RegisterComponent from '../components/RegisterComponent';
import ResetPasswordComponent from '../components/ResetPasswordComponent';
import CalendarComponent from '../components/CalendarComponent';
import SlidePanel from '../routesComponent/SlidePanelComponent';
import EmployeeRegisterComponent from '../components/EmployeeRegisterComponent';
import EmployeeDashboard from '../components/EmployeeDashboard';
import AbsenceRequest from '../components/AbsenceRequest';
import withAuth from '../authService/WithAuth';
import LogoutComponent from '../components/LogoutComponent';

const routes = [
  { path: "/employeeList", element: <EmployeeListPage />, roles: ["ADMIN"] },
  { path: "/dashboard", element: <DashboardComponent />, roles: ["ADMIN"] },
  { path: "/register", element: <RegisterComponent />, roles: ["ADMIN"] },
  { path: "/resetPassword", element: <ResetPasswordComponent />, roles: ["ADMIN", "EMPLOYEE"] },
  { path: "/calendar", element: <CalendarComponent />, roles: ["ADMIN", "EMPLOYEE"] },
  { path: "/slide", element: <SlidePanel />, roles: ["ADMIN", "EMPLOYEE"] },
  { path: "/employeeRegistration", element: <EmployeeRegisterComponent />, roles: ["ADMIN"] },
  { path: "/employeeDashboard", element: <EmployeeDashboard />, roles: ["ADMIN", "EMPLOYEE"] },
  { path: "/employeeAbsentRequests", element: <AbsenceRequest />, roles: ["ADMIN"] },
  { path: "/logout", element: <LogoutComponent/>, roles: ["ADMIN","EMPLOYEE"] },
];

const PrivateRoutes = ({ userRole }) => {
    console.log(" user role from private route : ", userRole);
  const filteredRoutes = routes.filter(route => route.roles.includes(userRole));

  return (
    <Routes>
      {filteredRoutes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
};

export default withAuth(PrivateRoutes);
