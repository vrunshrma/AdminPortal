import React, { useState } from 'react';
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
  // AlertCircle, // Add this one
  // Clock,
} from 'lucide-react';

const AdminUserManagement = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [copiedLink, setCopiedLink] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    startDate: '',
    role: 'employee',
  });

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
  ]);

  const handleCreateUser = () => {
    // Validate required fields
    if (
      !newUser.firstName ||
      !newUser.lastName ||
      !newUser.email ||
      !newUser.department ||
      !newUser.position
    ) {
      alert('Please fill in all required fields');
      return;
    }

    const userId = Date.now();
    const user = {
      ...newUser,
      id: userId,
      status: 'pending',
      passwordSet: false,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setUsers([...users, user]);
    setNewUser({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: '',
      position: '',
      startDate: '',
      role: 'employee',
    });
    setShowCreateModal(false);

    alert('User created successfully! Password setup link generated.');
  };

  const generatePasswordLink = (userId) => {
    return `${window.location.origin}/setup-password?token=${btoa(userId.toString())}&expires=${Date.now() + 7 * 24 * 60 * 60 * 1000}`;
  };

  const copyToClipboard = (text, userId) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(userId.toString());
    setTimeout(() => setCopiedLink(''), 2000);
  };

  const sendPasswordLink = (user) => {
    const link = generatePasswordLink(user.id);
    alert(`Password setup email sent to ${user.email}\n\nSetup Link: ${link}`);
  };

  const deleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter((user) => user.id !== userId));
    }
  };

  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
  const roles = ['employee', 'manager', 'admin'];

  const [pendingLeaveRequests, setPendingLeaveRequests] = useState([
    {
      id: 101,
      employee: 'Rohit Verma',
      type: 'Sick Leave',
      dates: '2025-09-04 to 2025-09-05',
      status: 'Pending',
    },
    {
      id: 102,
      employee: 'Anjali Singh',
      type: 'Casual Leave',
      dates: '2025-09-06',
      status: 'Pending',
    },
  ]);

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600">Employee Account Management System</p>
              </div>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus size={20} />
              <span>Create New Employee</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Employees</p>
                <p className="text-3xl font-bold text-gray-900">{users.length}</p>
                <p className="text-sm text-gray-500 mt-1">All registered users</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Users</p>
                <p className="text-3xl font-bold text-green-600">
                  {users.filter((u) => u.status === 'active').length}
                </p>
                <p className="text-sm text-gray-500 mt-1">Password set & active</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Check className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending Setup</p>
                <p className="text-3xl font-bold text-orange-600">
                  {users.filter((u) => u.status === 'pending').length}
                </p>
                <p className="text-sm text-gray-500 mt-1">Awaiting password setup</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <Mail className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Departments</p>
                <p className="text-3xl font-bold text-purple-600">
                  {[...new Set(users.map((u) => u.department))].length}
                </p>
                <p className="text-sm text-gray-500 mt-1">Active departments</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Briefcase className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Employee Directory</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Employee
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Contact Info
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-sm">
                            {user.firstName.charAt(0)}
                            {user.lastName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-base">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-600">{user.position}</div>
                          {user.startDate && (
                            <div className="text-xs text-gray-500">
                              Joined: {new Date(user.startDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-gray-900 font-medium">{user.email}</div>
                        {user.phone && <div className="text-gray-600">{user.phone}</div>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {user.department}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                          user.role === 'admin'
                            ? 'bg-red-100 text-red-800'
                            : user.role === 'manager'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                            user.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {user.status === 'active' ? 'Active' : 'Pending Setup'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        {!user.passwordSet && (
                          <>
                            <button
                              onClick={() => sendPasswordLink(user)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200 tooltip"
                              title="Send password setup email"
                            >
                              <Send size={16} />
                            </button>
                            <button
                              onClick={() =>
                                copyToClipboard(generatePasswordLink(user.id), user.id)
                              }
                              className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-200"
                              title="Copy password setup link"
                            >
                              {copiedLink === user.id.toString() ? (
                                <Check size={16} />
                              ) : (
                                <Copy size={16} />
                              )}
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors duration-200"
                          title="Edit employee"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                          title="Delete employee"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No employees found</p>
                <p className="text-gray-400">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
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
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="employee@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="+91 98765 43210"
                  />
                </div>
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
                >
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

export default AdminUserManagement;
