import React, { useState } from 'react';
import { User } from 'lucide-react';
import moment from 'moment';
import { addLeaveDataAPI } from '../authService/PrivateAuthService';
import { useAuth } from '../authService/AuthContext';
import ReactDOM from 'react-dom';

const initialLeaveForm = {
  type: '',
  startDate: '',
  endDate: '',
  reason: '',
};

const leaveTypes = [
  { value: 'annual', label: 'Annual Leave' },
  { value: 'sick', label: 'Sick Leave' },
  { value: 'personal', label: 'Personal Leave' },
  { value: 'emergency', label: 'Emergency Leave' },
];

const mockLeaveBalance = {
  annual: 10,
  sick: 5,
  personal: 3,
  emergency: 2,
};

const mockRecentLeaves = [
  {
    id: 1,
    type: 'Annual Leave',
    startDate: '2025-08-10',
    endDate: '2025-08-12',
    status: 'Approved',
  },
  {
    id: 2,
    type: 'Sick Leave',
    startDate: '2025-07-22',
    endDate: '2025-07-23',
    status: 'Pending',
  },
];

const LeaveManagement = () => {
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveForm, setLeaveForm] = useState(initialLeaveForm);
  const [recentLeaves, setRecentLeaves] = useState(mockRecentLeaves);
  const { user } = useAuth();

  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    // const currentDate = (moment().format('YYYY-MM-DD'));
    // Add new leave to recentLeaves (mock)
    const newLeave = {
      // You should use a unique ID for the new leave,
      // for example, based on the current timestamp.
      id: Date.now(),
      employeeId: user?.id,
      leaveType: leaveTypes.find((t) => t.value === leaveForm.type)?.label || leaveForm.type,
      fromDate: leaveForm.startDate,
      toDate: leaveForm.endDate,
      leaveDate: moment().format('YYYY-MM-DD'),
      leaveStatus: 'Pending',
      leaveReason: leaveForm.reason,
    };

    setRecentLeaves((prevLeaves) => [newLeave, ...prevLeaves]);
    addLeaveDataAPI(newLeave)
      .then((response) => {
        console.log('Attendance successfully marked:', response.data);
        // Close the modal
      })
      .catch((error) => {
        console.error('Error marking attendance:', error);
      });
    setShowLeaveModal(false);
    setLeaveForm(initialLeaveForm);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <User className="text-blue-600" size={40} />
          <h2 className="text-2xl font-bold flex items-center ml-2">Leave Management</h2>
        </div>
        <button
          onClick={() => setShowLeaveModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
        >
          Apply Leave
        </button>
      </div>

      {/* Leave Balance */}
      <div className="bg-white rounded-xl p-6 shadow border border-gray-100">
        <h3 className="font-semibold text-gray-700 mb-4">Leave Balance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {leaveTypes.map((type) => (
            <div key={type.value} className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-blue-700">{mockLeaveBalance[type.value]}</div>
              <div className="text-gray-600">{type.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Leave Applications */}
      <div className="bg-white rounded-xl p-6 shadow border border-gray-100">
        <h3 className="font-semibold text-gray-700 mb-4">Recent Leave Applications</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500 text-sm">
              <th className="py-2">Type</th>
              <th className="py-2">Start Date</th>
              <th className="py-2">End Date</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentLeaves.map((leave) => (
              <tr key={leave.id} className="border-t">
                <td className="py-2">{leave.type}</td>
                <td className="py-2">{leave.startDate}</td>
                <td className="py-2">{leave.endDate}</td>
                <td
                  className={`py-2 font-semibold ${leave.status === 'Approved' ? 'text-green-600' : 'text-yellow-600'}`}
                >
                  {leave.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Leave Modal */}
      {showLeaveModal &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-bold mb-4">Apply for Leave</h3>
              <form onSubmit={handleLeaveSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type</label>
                  <select
                    value={leaveForm.type}
                    onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select leave type</option>
                    {leaveTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={leaveForm.startDate}
                      onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={leaveForm.endDate}
                      onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                  <textarea
                    value={leaveForm.reason}
                    onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                    placeholder="Enter reason..."
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLeaveModal(false)}
                    className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default LeaveManagement;
