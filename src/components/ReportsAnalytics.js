import React from 'react';
import { Users, Check, Mail, Briefcase } from 'lucide-react';

const dummyUsers = [
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
];

const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];

const ReportsAnalytics = () => {
  const users = dummyUsers;
  return (
    <div>
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
      {/* User List Table */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Department Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {departments.map((dept) => {
            const count = users.filter((u) => u.department === dept).length;
            return (
              <div key={dept} className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{count}</div>
                <div className="text-sm text-gray-600">{dept}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
