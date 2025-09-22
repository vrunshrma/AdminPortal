import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EmployeeListPage from '../components/EmployeeListPage';
import DashboardComponent from '../components/DashboardComponent';
import RegisterComponent from '../components/RegisterComponent';
import ResetPasswordComponent from '../components/ResetPasswordComponent';
import CalendarComponent from '../components/CalendarComponent';
import SlidePanel from '../components/SlidePanelComponent';
import EmployeeRegisterComponent from '../components/EmployeeRegisterComponent';
import EmployeeDashboard from '../components/EmployeeDashboard';
import AbsenceRequest from '../components/AbsenceRequest';
import withAuth from '../authService/WithAuth';
import LogoutComponent from '../components/LogoutComponent';
import UserDashboard from '../components/userDashboard';
import DesiredDashboard from '../components/DesiredDash';
import AdminUserManagement from '../components/AdminUserManagement';
import AdminDashboard from '../components/AdminDashboard';
import Layout from './Layout';
import ReportsAnalytics from '../components/ReportsAnalytics';
import ProfileComponent from '../components/ProfileComponent';
import ResetPasswordPage from '../components/NewResetPasswordComponent';
import LeaveManagement from '../components/LeaveManagement';
import AttendanceSettingsMenu from '../components/AttendanceSettingsMenu';
import BranchList from '../components/BranchList';
import UpdatedAdminDashboard from '../components/UpdatedDashboard';
import LeavePolicy from '../components/LeavePolicy';

const routes = [
  { path: '/employeeList', element: <EmployeeListPage />, roles: ['ADMIN'] },
  // { path: "/dashboard", element: <DashboardComponent />, roles: ["ADMIN"] },
  { path: '/register', element: <RegisterComponent />, roles: ['ADMIN'] },
  //  { path: '/resetPassword', element: <ResetPasswordComponent />, roles: ['ADMIN', 'EMPLOYEE'] },
  { path: '/resetPassword', element: <ResetPasswordPage />, roles: ['ADMIN', 'EMPLOYEE'] },
  { path: '/calendar', element: <CalendarComponent />, roles: ['ADMIN', 'EMPLOYEE'] },
  { path: '/slide', element: <SlidePanel />, roles: ['ADMIN', 'EMPLOYEE'] },
  { path: '/employeeRegistration', element: <EmployeeRegisterComponent />, roles: ['ADMIN'] },
  { path: '/employeeDashboard', element: <EmployeeDashboard />, roles: ['ADMIN', 'EMPLOYEE'] },
  { path: '/employeeAbsentRequests', element: <AbsenceRequest />, roles: ['ADMIN'] },
  { path: '/logout', element: <LogoutComponent />, roles: ['ADMIN', 'EMPLOYEE'] },
  { path: '/userDashboard', element: <UserDashboard />, roles: ['EMPLOYEE'] },
  { path: '/desiredDashboard', element: <DesiredDashboard />, roles: ['ADMIN', 'EMPLOYEE'] },
  { path: '/adminUserManagement', element: <AdminUserManagement />, roles: ['ADMIN', 'EMPLOYEE'] },
  { path: '/adminDashboard', element: <AdminDashboard />, roles: ['ADMIN'] },
  { path: '/reports', element: <ReportsAnalytics />, roles: ['ADMIN'] },
  { path: '/profile', element: <ProfileComponent />, roles: ['ADMIN'] },
  { path: '/leaveManagement', element: <LeaveManagement />, roles: ['EMPLOYEE'] },
  { path: '/adminSettings', element: <AttendanceSettingsMenu />, roles: ['ADMIN'] },
  { path: '/branchList', element: <BranchList />, roles: ['ADMIN'] },
  { path: '/admin', element: <UpdatedAdminDashboard />, roles: ['ADMIN'] },
  { path: '/leavePolicy', element: <LeavePolicy />, roles: ['ADMIN'] },
  // { path: '/userSettings', element: <UserSettings />, roles: ['EMPLOYEE'] },
];

const PrivateRoutes = ({ userRole }) => {
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

export default withAuth(PrivateRoutes);
