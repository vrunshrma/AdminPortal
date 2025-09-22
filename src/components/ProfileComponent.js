import React from 'react';
import { User } from 'lucide-react';

const adminData = {
  name: 'Admin User',
  employeeId: 'ADM001',
  department: 'Administration',
  position: 'System Administrator',
};

const ProfileComponent = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold flex items-center">
      <User className="mr-3 text-blue-600" size={28} />
      Admin Profile
    </h2>

    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center space-x-6 mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {adminData.name
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </div>
        <div>
          <h3 className="text-xl font-bold">{adminData.name}</h3>
          <p className="text-gray-600">{adminData.position}</p>
          <p className="text-gray-500">Employee ID: {adminData.employeeId}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={adminData.name}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <input
              type="text"
              value={adminData.department}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              readOnly
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
            <input
              type="text"
              value={adminData.employeeId}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
            <input
              type="text"
              value={adminData.position}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProfileComponent;
