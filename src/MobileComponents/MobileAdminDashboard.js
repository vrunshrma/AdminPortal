import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Mail,
  Calendar,
  Shield,
  FileText,
  UserCheck,
  UserX,
  Building,
  X,
} from 'lucide-react';
import { findAllLeaveRequest, leaveStatusUpdate } from '../authService/PrivateAuthService';
import { registerAPICall } from '../authService/PrivateAuthService';
import { passwordCreationEmail } from '../authService/PublicAuthService';

const MobileAdminDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedLeaveRequest, setSelectedLeaveRequest] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    username: '',
    department: '',
    position: '',
    role: 'employee',
    startDate: '',
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const response = await findAllLeaveRequest();
      setLeaveRequests(response?.data || []);
    } catch (err) {
      console.error('Failed to fetch leave requests', err);
    }
  };

  const handleLeaveAction = async (id, status) => {
    setIsLoading(true);
    try {
      await leaveStatusUpdate(id, status);
      loadRequests();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.firstName || !newUser.lastName || !newUser.username) return;
    setIsLoading(true);
    try {
      const response = await registerAPICall(newUser);
      if (response?.data) {
        await passwordCreationEmail(newUser.username);
        setShowCreateModal(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : '—');

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Welcome / Clock */}
      <div className="bg-blue-600 text-white p-4 rounded-xl mb-4">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <p className="text-sm">
          {currentTime.toLocaleDateString()} • {currentTime.getFullYear()}
        </p>
        <p className="text-lg">{currentTime.toLocaleTimeString()}</p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col space-y-3 mb-4">
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-cesnter justify-center space-x-2 bg-green-500 text-white py-3 rounded-xl"
        >
          <Plus size={20} />
          <span>Create Employee</span>
        </button>

        <button className="flex items-center justify-center space-x-2 bg-blue-500 text-white py-3 rounded-xl">
          <Mail size={20} />
          <span>Send Notifications</span>
        </button>

        <button className="flex items-center justify-center space-x-2 bg-purple-500 text-white py-3 rounded-xl">
          <FileText size={20} />
          <span>Reports</span>
        </button>
      </div>

      {/* Leave Requests */}
      <div className="space-y-4">
        {leaveRequests.map((req) => (
          <div key={req.id} className="bg-white p-4 rounded-xl shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{req.employeeName}</p>
                <p className="text-xs text-gray-500">
                  {req.department} • {req.leaveType}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedLeaveRequest(req);
                  setShowDetailsModal(true);
                }}
                className="text-blue-600 text-sm"
              >
                View
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {formatDate(req.startDate)} – {formatDate(req.endDate)}
            </p>
          </div>
        ))}
      </div>

      {/* Leave Details Modal */}
      {showDetailsModal && selectedLeaveRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-4 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Leave Details</h3>
              <button onClick={() => setShowDetailsModal(false)}>
                <X size={20} />
              </button>
            </div>
            <p>
              <span className="font-medium">Employee:</span> {selectedLeaveRequest.employeeName}
            </p>
            <p>
              <span className="font-medium">Leave Type:</span> {selectedLeaveRequest.leaveType}
            </p>
            <p>
              <span className="font-medium">Duration:</span>{' '}
              {formatDate(selectedLeaveRequest.startDate)} –{' '}
              {formatDate(selectedLeaveRequest.endDate)}
            </p>
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => {
                  handleLeaveAction(selectedLeaveRequest.id, 'approved');
                  setShowDetailsModal(false);
                }}
                className="flex-1 bg-green-600 text-white py-2 rounded-xl"
              >
                Approve
              </button>
              <button
                onClick={() => {
                  handleLeaveAction(selectedLeaveRequest.id, 'rejected');
                  setShowDetailsModal(false);
                }}
                className="flex-1 bg-red-600 text-white py-2 rounded-xl"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Employee Modal */}
      {/* Create Employee Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-4 w-full max-w-md overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Create Employee</h3>
              <button onClick={() => setShowCreateModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="First Name"
                value={newUser.firstName}
                onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                className="w-full border p-2 rounded-xl"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={newUser.lastName}
                onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                className="w-full border p-2 rounded-xl"
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                className="w-full border p-2 rounded-xl"
              />
              <input
                type="text"
                placeholder="Mobile Number"
                value={newUser.mobile || ''}
                onChange={(e) => setNewUser({ ...newUser, mobile: e.target.value })}
                className="w-full border p-2 rounded-xl"
              />
              <input
                type="text"
                placeholder="Department"
                value={newUser.department}
                onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                className="w-full border p-2 rounded-xl"
              />
              <input
                type="text"
                placeholder="Position"
                value={newUser.position}
                onChange={(e) => setNewUser({ ...newUser, position: e.target.value })}
                className="w-full border p-2 rounded-xl"
              />
              <input
                type="date"
                placeholder="Start Date"
                value={newUser.startDate}
                onChange={(e) => setNewUser({ ...newUser, startDate: e.target.value })}
                className="w-full border p-2 rounded-xl"
              />
              <button
                onClick={handleCreateUser}
                className="w-full bg-blue-600 text-white py-2 rounded-xl"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Employee'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileAdminDashboard;
