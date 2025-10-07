import React, { useState, useEffect } from 'react';
import { registerAPICall } from '../authService/PrivateAuthService';
import { passwordCreationEmail } from '../authService/PublicAuthService';
import { findAllLeaveRequest } from '../authService/PrivateAuthService';
import { leaveStatusUpdate } from '../authService/PrivateAuthService';
import {
  Users,
  Plus,
  Mail,
  User,
  Phone,
  Calendar,
  Briefcase,
  Shield,
  Edit,
  Trash2,
  Copy,
  Check,
  Search,
  Send,
  X,
  Clock,
  TrendingUp,
  UserCheck,
  UserX,
  Settings,
  Bell,
  ChevronRight,
  MapPin,
  Building,
  AlertCircle,
  FileText,
  BarChart3,
} from 'lucide-react';
import { passwordResetEmail } from '../authService/PublicAuthService';

// 2. Define the TabButton component here, right after your imports

const AdminDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [copiedLink, setCopiedLink] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [apiError, setApiError] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLeaveRequest, setSelectedLeaveRequest] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filteredLeaveRequests, setFilteredLeaveRequests] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    username: '',
    mobile: '',
    department: '',
    position: '',
    startDate: '',
    role: 'employee',
  });

  // Admin user data
  const adminData = {
    name: 'Admin User',
    employeeId: 'ADM001',
    department: 'Administration',
    position: 'System Administrator',
  };

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    try {
      const response = await findAllLeaveRequest();

      if (response?.data) {
        const transformed = mapLeaveRequests(response.data);
        setFilteredLeaveRequests(transformed);
        setShowCreateModal(false);
      } else {
        setError(response?.message || 'Failed to fetch leave requests');
      }
    } catch (err) {
      setError('Server error while fetching leave requests');
    }
  }

  async function handleLeaveAction(requestId, status, reason = '') {
    setIsLoading(true);
    try {
      const response = await leaveStatusUpdate(requestId, status, reason);

      if (response?.data) {
        // ✅ API success
        alert(`Leave ${status} successfully!`);

        // ✅ Reload leave requests so component re-renders
        await loadRequests();
      } else {
        // ✅ API failure
        setError(response?.message || 'Action failed');
      }
      console.log('response data ', response.data);
    } catch (err) {
      console.error('Error updating leave status:', err);
      setError('Unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  // utils/leaveAdapter.js
  function mapLeaveRequests(apiData) {
    if (!Array.isArray(apiData)) return [];

    return apiData.map((req) => {
      const user = req.user || {};
      return {
        id: req.id,
        employeeId: req.employeeId,
        employeeName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        department: user.department || req.departmentId || 'N/A',
        leaveType: req.leaveType,
        startDate: req.fromDate,
        endDate: req.toDate,
        appliedDate: req.leaveDate,
        status: req.leaveStatus?.toLowerCase() || 'pending',
        days: calculateDays(req.fromDate, req.toDate),
      };
    });
  }

  // Helper fn
  function calculateDays(from, to) {
    if (!from || !to) return 0;
    const start = new Date(from);
    const end = new Date(to);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive days
  }

  // Define locally
  function getLeaveTypeIcon(type) {
    switch (type) {
      case 'Sick':
        return '🤒';
      case 'Vacation':
        return '🏖️';
      case 'Work From Home':
        return '🏠';
      default:
        return '❓';
    }
  }

  // OR import it
  // import { getLeaveTypeIcon } from './utils';

  // ✅ Tailwind status classes
  function getStatusClass(status) {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'border-green-600 text-green-600';
      case 'pending':
        return 'border-orange-600 text-orange-600';
      case 'rejected':
        return 'border-red-600 text-red-600';
      default:
        return 'border-gray-400 text-gray-400';
    }
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Mock users data
  const [users, setUsers] = useState([
    {
      id: 1,
      firstName: 'Rahul',
      lastName: 'Sharma',
      email: 'rahul@company.com',
      phone: '+91 98765 43210',
      department: 'Engineering',
      position: 'Software Developer',
      startDate: '2024-01-15',
      role: 'employee',
      status: 'active',
      passwordSet: true,
      createdAt: '2024-01-10',
    },
    {
      id: 2,
      firstName: 'Priya',
      lastName: 'Patel',
      email: 'priya@company.com',
      phone: '+91 98765 43211',
      department: 'Marketing',
      position: 'Marketing Manager',
      startDate: '2024-02-01',
      role: 'employee',
      status: 'pending',
      passwordSet: false,
      createdAt: '2024-01-28',
    },
    {
      id: 3,
      firstName: 'Amit',
      lastName: 'Kumar',
      email: 'amit@company.com',
      phone: '+91 98765 43212',
      department: 'Sales',
      position: 'Sales Executive',
      startDate: '2024-03-01',
      role: 'employee',
      status: 'pending',
      passwordSet: false,
      createdAt: '2024-02-25',
    },
    {
      id: 4,
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah@company.com',
      phone: '+91 98765 43213',
      department: 'HR',
      position: 'HR Manager',
      startDate: '2024-01-20',
      role: 'manager',
      status: 'active',
      passwordSet: true,
      createdAt: '2024-01-15',
    },
  ]);

  // ...existing code...
  const handleCreateUser = async () => {
    if (
      !newUser.firstName ||
      !newUser.lastName ||
      !newUser.username ||
      !newUser.department ||
      !newUser.position
    ) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    const userId = Date.now();
    const user = {
      ...newUser,
      empId: userId,
      status: 'pending',
      passwordSet: false,
      createDate: new Date().toISOString().split('T')[0],
    };
    // setShowCreateModal(false);
    setApiError([]);
    try {
      const response = await registerAPICall(user);
      if (!response.data) {
        throw new Error('Registration not done');
      }

      // Wait for password link API response
      await generateSendPasswordLink(user.username);
      setShowCreateModal(false);
      alert('User created successfully! Password setup link generated & Sent.');
    } catch (error) {
      const errorList = error.response?.data?.errors;
      console.log('errorList : ', errorList);
      if (Array.isArray(errorList)) {
        setApiError(errorList);
      } else {
        setApiError(['An error occurred during registration.']);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const generateSendPasswordLink = async (userId) => {
    // e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);
    try {
      const response = await passwordCreationEmail(userId);
      if (response.status === 'SUCCESS') {
        setIsLoading(false);
        setMessage(response.message);
      } else if (response.status === 'FAILED') {
        setIsLoading(false);
        setError(response.message);
      } else {
        setIsLoading(false);
        throw new Error('Unexpected error occurred');
      }
    } catch (error) {
      if (error.response) {
        setIsLoading(false);
        setError(error.response.data.message || 'Network Error');
      } else {
        setIsLoading(false);
        setError('Network Error');
      }
    }
  };

  // ✅ Copy link helper
  function handleCopyLink(userId) {
    const link = `${window.location.origin}/reset-password/${userId}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(userId);
    setTimeout(() => setCopiedLink(null), 2000);
  }

  const copyToClipboard = (text, userId) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(userId.toString());
    setTimeout(() => setCopiedLink(''), 2000);
  };

  const sendPasswordLink = (user) => {
    // const link = generatePasswordLink(user.id);
    //alert(`Password setup email sent to ${user.email}\n\nSetup Link: ${link}`);
  };

  const deleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter((user) => user.id !== userId));
    }
  };

  const getFieldError = (field) => {
    const err = apiError.find((e) => e.field === field);
    if (err) {
      //console.log('err : ', err.errorMessage);
      return err.errorMessage;
    }
    return '';
  };

  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
  const roles = ['employee', 'manager', 'admin'];

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Admin stats
  const adminStats = {
    totalEmployees: users.length,
    activeUsers: users.filter((u) => u.status === 'active').length,
    pendingUsers: users.filter((u) => u.status === 'pending').length,
    departments: [...new Set(users.map((u) => u.department))].length,
    todayJoined: users.filter((u) => u.createdAt === new Date().toISOString().split('T')[0]).length,
    thisWeekJoined: 3,
    totalManagers: users.filter((u) => u.role === 'manager').length,
    totalAdmins: users.filter((u) => u.role === 'admin').length + 1,
  };

  function pendingRequestsCount() {
    // Replace this with your actual logic to retrieve the count
    const count = 'someValue';
    return count;
  }

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
      {isActive && <ChevronRight size={16} className="ml-auto" />}
    </button>
  );

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className={`text-2xl font-bold ${color} mt-1`}>{value}</p>
          {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('600', '100')}`}>
          <Icon size={24} className={color} />
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {adminData.name}!</h1>
            <p className="text-blue-100 mb-4">{formatDate(currentTime)}</p>
            <div className="flex items-center space-x-2 text-blue-100">
              <MapPin size={16} />
              <span>
                {adminData.department} • {adminData.position}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-mono font-bold mb-2">{formatTime(currentTime)}</div>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-500 text-white">
              <div className="w-2 h-2 rounded-full mr-2 bg-green-200"></div>
              Admin Panel Active
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold mb-6 flex items-center">
          <Shield className="mr-3 text-blue-600" size={24} />
          Quick Actions
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
          >
            <Plus size={20} />
            <span>Create New Employee</span>
          </button>

          <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg">
            <Mail size={20} />
            <span>Send Bulk Notifications</span>
          </button>

          <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg">
            <FileText size={20} />
            <span>Generate Reports</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={adminStats.totalEmployees}
          icon={Users}
          color="text-blue-600"
          subtitle="All registered users"
        />
        <StatCard
          title="Active Users"
          value={adminStats.activeUsers}
          icon={UserCheck}
          color="text-green-600"
          subtitle="Currently active"
        />
        <StatCard
          title="Pending Setup"
          value={adminStats.pendingUsers}
          icon={UserX}
          color="text-orange-600"
          subtitle="Awaiting password"
        />
        <StatCard
          title="Departments"
          value={adminStats.departments}
          icon={Building}
          color="text-purple-600"
          subtitle="Active departments"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Leave Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Applied Date
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(filteredLeaveRequests) &&
                filteredLeaveRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 transition-colors duration-200">
                    {/* Employee */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold shadow-md">
                          {request.employeeName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {request.employeeName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {request.department} • {request.employeeId}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Leave Type */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="mr-2 text-gray-500">
                          {getLeaveTypeIcon(request.leaveType)}
                        </span>
                        <span className="text-sm font-medium text-gray-800">
                          {request.leaveType}
                        </span>
                      </div>
                    </td>

                    {/* Duration */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-800">
                        {formatDate(request.startDate)} <br /> {formatDate(request.endDate)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {request.days} day{request.days !== 1 ? 's' : ''}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border shadow-sm ${getStatusClass(
                          request.status
                        )}`}
                      >
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>

                    {/* Applied Date */}
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {formatDate(request.appliedDate)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedLeaveRequest(request);
                          setShowDetailsModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 font-medium transition-colors duration-200"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500 rounded-full">
                <UserCheck size={16} className="text-white" />
              </div>
              <div>
                <div className="font-medium">Rahul Sharma completed password setup</div>
                <div className="text-sm text-gray-600">2 hours ago</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-full">
                <Plus size={16} className="text-white" />
              </div>
              <div>
                <div className="font-medium">New employee Priya Patel added to Marketing</div>
                <div className="text-sm text-gray-600">5 hours ago</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500 rounded-full">
                <Mail size={16} className="text-white" />
              </div>
              <div>
                <div className="font-medium">Password setup link sent to 3 employees</div>
                <div className="text-sm text-gray-600">1 day ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}

          {/* Main Content */}
          <main className="flex-1">
            {activeTab === 'dashboard' && renderDashboard()}
            {/* {activeTab === 'users' && renderUserManagement()} */}
            {/* {activeTab === 'reports' && renderReports()} */}
            {/* {activeTab === 'profile' && renderProfile()} */}
            {activeTab === 'settings' && (
              <div className="text-center py-12">
                <Settings size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-xl font-semibold">Settings</p>
                <p className="text-gray-400 mt-2">
                  Settings panel is under construction. Please check back later for new features!
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      {showDetailsModal && selectedLeaveRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">Leave Request Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Employee Name</p>
                  <p className="font-medium">{selectedLeaveRequest.employeeName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Employee ID</p>
                  <p className="font-medium">{selectedLeaveRequest.employeeId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">{selectedLeaveRequest.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Leave Type</p>
                  <p className="font-medium">{selectedLeaveRequest.leaveType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">
                    {formatDate(selectedLeaveRequest.startDate)} –{' '}
                    {formatDate(selectedLeaveRequest.endDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Applied Date</p>
                  <p className="font-medium">{formatDate(selectedLeaveRequest.appliedDate)}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Reason</p>
                  <p className="font-medium">{selectedLeaveRequest.leaveReason || '—'}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200">
              <button
                onClick={async () => {
                  const reason = prompt('Enter rejection reason (optional):');
                  handleLeaveAction(selectedLeaveRequest.id, 'rejected', reason);
                  setShowDetailsModal(false);
                  loadRequests();
                }}
                className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all duration-200"
              >
                Reject
              </button>
              <button
                onClick={async () => {
                  handleLeaveAction(selectedLeaveRequest.id, 'approved');
                  setShowDetailsModal(false);
                  loadRequests();
                }}
                className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all duration-200"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Employee Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Create New Employee</h3>
                  <p className="text-gray-600 mt-1">Add a new team member to the system</p>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={newUser.firstName}
                      onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter first name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={newUser.lastName}
                      onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="employee@company.com"
                  />
                </div>
                {getFieldError('email') && (
                  <p className="text-red-600 text-xs mt-1">{getFieldError('email')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    value={newUser.mobile}
                    onChange={(e) => setNewUser({ ...newUser, mobile: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="+91 98765 43210"
                  />
                </div>
                {getFieldError('mobile') && (
                  <p className="text-red-600 text-xs mt-1">{getFieldError('mobile')}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      value={newUser.department}
                      onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Position *</label>
                  <input
                    type="text"
                    value={newUser.position}
                    onChange={(e) => setNewUser({ ...newUser, position: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Software Developer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={newUser.startDate}
                      onChange={(e) => setNewUser({ ...newUser, startDate: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-blue-800 text-sm font-medium mb-2">📧 Next Steps:</p>
                <p className="text-blue-700 text-sm">
                  After creating the employee, a password setup link will be generated. You can then
                  send it via email or copy the link to share manually.
                </p>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateUser}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <svg className="animate-spin rounded-full h-5 w-5 border-b-2 border-white">
                      // ) : ( //{' '}
                      <>
                        // <span>Sign In</span>
                        //{' '}
                      </>
                    </svg>
                  )}
                  Create Employee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
