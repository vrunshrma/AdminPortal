import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EmployeeListPage from '../DesktopComponents/EmployeeListPage';
import DashboardComponent from '../DesktopComponents/DashboardComponent';
import RegisterComponent from '../DesktopComponents/RegisterComponent';
import ResetPasswordComponent from '../DesktopComponents/ResetPasswordComponent';
import CalendarComponent from '../DesktopComponents/CalendarComponent';
import SlidePanel from '../DesktopComponents/SlidePanelComponent';
import EmployeeRegisterComponent from '../DesktopComponents/EmployeeRegisterComponent';
import EmployeeDashboard from '../DesktopComponents/EmployeeDashboard';
import AbsenceRequest from '../DesktopComponents/AbsenceRequest';
import withAuth from '../authService/WithAuth';
import LogoutComponent from '../DesktopComponents/LogoutComponent';
import UserDashboard from '../DesktopComponents/userDashboard';
import DesiredDashboard from '../DesktopComponents/DesiredDash';
import AdminUserManagement from '../DesktopComponents/AdminUserManagement';
import AdminDashboard from '../DesktopComponents/AdminDashboard';
import Layout from './Layout';
import ReportsAnalytics from '../DesktopComponents/ReportsAnalytics';
import ProfileComponent from '../DesktopComponents/ProfileComponent';
import ResetPasswordPage from '../DesktopComponents/NewResetPasswordComponent';
import LeaveManagement from '../DesktopComponents/LeaveManagement';
import AttendanceSettingsMenu from '../DesktopComponents/AttendanceSettingsMenu';
import BranchList from '../DesktopComponents/BranchList';
import UpdatedAdminDashboard from '../DesktopComponents/UpdatedDashboard';
import LeavePolicy from '../DesktopComponents/LeavePolicy';
import MobileAdminDashboard from '../MobileComponents/MobileAdminDashboard';
import MobileLogin from '../MobileComponents/MobileLogin';

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
  { path: '/mobAdminDashboard', element: <MobileAdminDashboard />, roles: ['ADMIN'] },
  //{ path: '/mobileLogin', element: <MobileLogin /> },
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
