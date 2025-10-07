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
  Save,
} from 'lucide-react';
import { passwordResetEmail } from '../authService/PublicAuthService';

const UpdatedAdminDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
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

  // Leave Policy Management State
  const [leavePolicies, setLeavePolicies] = useState([
    {
      id: 1,
      leaveType: 'Annual Leave',
      annualAllocation: 20,
      monthlyAllocation: 2,
      carryForward: true,
      description: 'Vacation and personal time off',
      isActive: true,
    },
    {
      id: 2,
      leaveType: 'Sick Leave',
      annualAllocation: 10,
      monthlyAllocation: 1,
      carryForward: false,
      description: 'Medical leave for illness',
      isActive: true,
    },
    {
      id: 3,
      leaveType: 'Work From Home',
      annualAllocation: 24,
      monthlyAllocation: 2,
      carryForward: false,
      description: 'Remote work days',
      isActive: true,
    },
  ]);

  const [newPolicy, setNewPolicy] = useState({
    leaveType: '',
    annualAllocation: '',
    monthlyAllocation: '',
    carryForward: false,
    description: '',
    isActive: true,
  });

  const [editingPolicy, setEditingPolicy] = useState(null);

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

      if (!response.data) {
        alert(`Leave ${status} successfully!`);
        setError(response.data?.message || 'Action failed');
      }
      console.log('response data ', response.data);
    } catch (err) {
      console.error('Error updating leave status:', err);
      setError('Unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  // Leave Policy Management Functions
  const handleCreatePolicy = () => {
    if (!newPolicy.leaveType || !newPolicy.annualAllocation || !newPolicy.monthlyAllocation) {
      alert('Please fill in all required fields');
      return;
    }

    const policy = {
      id: Date.now(),
      ...newPolicy,
      annualAllocation: parseInt(newPolicy.annualAllocation),
      monthlyAllocation: parseInt(newPolicy.monthlyAllocation),
    };

    setLeavePolicies([...leavePolicies, policy]);
    setNewPolicy({
      leaveType: '',
      annualAllocation: '',
      monthlyAllocation: '',
      carryForward: false,
      description: '',
      isActive: true,
    });
    setShowPolicyModal(false);
    alert('Leave policy created successfully!');
  };

  const handleUpdatePolicy = () => {
    if (
      !editingPolicy.leaveType ||
      !editingPolicy.annualAllocation ||
      !editingPolicy.monthlyAllocation
    ) {
      alert('Please fill in all required fields');
      return;
    }

    const updatedPolicies = leavePolicies.map((policy) =>
      policy.id === editingPolicy.id
        ? {
            ...editingPolicy,
            annualAllocation: parseInt(editingPolicy.annualAllocation),
            monthlyAllocation: parseInt(editingPolicy.monthlyAllocation),
          }
        : policy
    );

    setLeavePolicies(updatedPolicies);
    setEditingPolicy(null);
    alert('Leave policy updated successfully!');
  };

  const handleDeletePolicy = (policyId) => {
    if (window.confirm('Are you sure you want to delete this leave policy?')) {
      setLeavePolicies(leavePolicies.filter((policy) => policy.id !== policyId));
      alert('Leave policy deleted successfully!');
    }
  };

  const togglePolicyStatus = (policyId) => {
    const updatedPolicies = leavePolicies.map((policy) =>
      policy.id === policyId ? { ...policy, isActive: !policy.isActive } : policy
    );
    setLeavePolicies(updatedPolicies);
  };

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
      case 'Sick Leave':
        return '🤒';
      case 'Vacation':
      case 'Annual Leave':
        return '🏖️';
      case 'Work From Home':
        return '🏠';
      default:
        return '❓';
    }
  }

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

  // Render Leave Policies Tab
  const renderLeavePolicies = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Leave Policy Management</h1>
            <p className="text-purple-100">
              Configure leave types and allocations for your organization
            </p>
          </div>
          <button
            onClick={() => setShowPolicyModal(true)}
            className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-200 flex items-center space-x-2 shadow-lg"
          >
            <Plus size={20} />
            <span>Add Policy</span>
          </button>
        </div>
      </div>

      {/* Leave Policy Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Policies"
          value={leavePolicies.length}
          icon={FileText}
          color="text-blue-600"
          subtitle="Active leave types"
        />
        <StatCard
          title="Active Policies"
          value={leavePolicies.filter((p) => p.isActive).length}
          icon={Check}
          color="text-green-600"
          subtitle="Currently enabled"
        />
        <StatCard
          title="Total Annual Days"
          value={leavePolicies
            .filter((p) => p.isActive)
            .reduce((sum, p) => sum + p.annualAllocation, 0)}
          icon={Calendar}
          color="text-purple-600"
          subtitle="Across all policies"
        />
      </div>

      {/* Leave Policies Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Leave Policies</h2>
          <p className="text-gray-600 mt-1">Manage leave types and their allocations</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Leave Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Annual Allocation
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Monthly Allocation
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Carry Forward
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {leavePolicies.map((policy) => (
                <tr key={policy.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="mr-3 text-2xl">{getLeaveTypeIcon(policy.leaveType)}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{policy.leaveType}</div>
                        <div className="text-xs text-gray-500">{policy.description}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {policy.annualAllocation} days
                    </div>
                    <div className="text-xs text-gray-500">per year</div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {policy.monthlyAllocation} days
                    </div>
                    <div className="text-xs text-gray-500">per month</div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        policy.carryForward
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {policy.carryForward ? 'Yes' : 'No'}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => togglePolicyStatus(policy.id)}
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${
                        policy.isActive
                          ? 'border-green-600 text-green-600 bg-green-50'
                          : 'border-gray-600 text-gray-600 bg-gray-50'
                      }`}
                    >
                      {policy.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => setEditingPolicy({ ...policy })}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                        title="Edit Policy"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeletePolicy(policy.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                        title="Delete Policy"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
        <div className="grid md:grid-cols-4 gap-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
          >
            <Plus size={20} />
            <span>Create Employee</span>
          </button>

          <button
            onClick={() => setActiveTab('leave-policies')}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
          >
            <FileText size={20} />
            <span>Manage Policies</span>
          </button>

          <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg">
            <Mail size={20} />
            <span>Send Notifications</span>
          </button>

          <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg">
            <BarChart3 size={20} />
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
          title="Leave Policies"
          value={leavePolicies.filter((p) => p.isActive).length}
          icon={FileText}
          color="text-purple-600"
          subtitle="Active policies"
        />
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Recent Leave Requests</h2>
          <p className="text-gray-600 mt-1">Review and approve employee leave applications</p>
        </div>

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
                  Period
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Days
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeaveRequests.length > 0 ? (
                filteredLeaveRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50 transition-colors duration-200">
                    {/* Employee */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{req.employeeName}</div>
                      <div className="text-xs text-gray-500">{req.department}</div>
                    </td>

                    {/* Leave Type */}
                    <td className="px-6 py-4">
                      <span className="flex items-center">
                        <span className="mr-2 text-lg">{getLeaveTypeIcon(req.leaveType)}</span>
                        {req.leaveType}
                      </span>
                    </td>

                    {/* Period */}
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatDate(req.startDate)} → {formatDate(req.endDate)}
                    </td>

                    {/* Days */}
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{req.days} days</td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusClass(
                          req.status
                        )}`}
                      >
                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleLeaveAction(req.id, 'approved')}
                          disabled={isLoading}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-200"
                          title="Approve"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => handleLeaveAction(req.id, 'rejected')}
                          disabled={isLoading}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                          title="Reject"
                        >
                          <X size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedLeaveRequest(req);
                            setShowDetailsModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                          title="View Details"
                        >
                          <FileText size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-6 text-center text-gray-500">
                    No leave requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default UpdatedAdminDashboard;
