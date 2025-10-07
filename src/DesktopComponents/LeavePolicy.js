import React, { useState, useEffect } from 'react';
import {
  addLeavePolicy,
  updateLeavePolicy,
  getLeavePolicies,
} from '../authService/PrivateAuthService';

const LeavePolicy = () => {
  const [leavePolicies, setLeavePolicies] = useState([]);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  useEffect(() => {
    fetchLeavePolicies();
  }, []);

  const fetchLeavePolicies = async () => {
    try {
      const response = await getLeavePolicies();
      if (response.data) {
        setLeavePolicies(response.data);
      }
    } catch (error) {
      console.error('Error fetching leave policies:', error);
    }
  };
  // Save Policy (Add or Update)
  const handleSavePolicy = async (policy) => {
    if (!policy?.name || !policy?.leaveType || !policy?.allowedDays) {
      alert('Please fill all fields');
      return;
    }

    try {
      if (policy.id) {
        // 🔹 Edit case
        const response = await updateLeavePolicy(policy.id, policy); // <-- Make sure this API exists
        if (response.data) {
          setLeavePolicies((prev) => prev.map((p) => (p.id === policy.id ? response.data : p)));
        }
      } else {
        // 🔹 Add case
        const response = await addLeavePolicy(policy);
        if (response.data) {
          setLeavePolicies((prev) => [...prev, response.data]);
        }
      }
      await fetchLeavePolicies();
      // Close modal after success
      setShowPolicyModal(false);
      setSelectedPolicy(null);
    } catch (error) {
      console.error('Error saving policy:', error);
      alert('Something went wrong while saving the policy.');
    }
  };

  // Delete Policy
  const handleDeletePolicy = (id) => {
    setLeavePolicies((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="mt-8 bg-white rounded-2xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Leave Policies</h2>
        <button
          onClick={() => {
            setSelectedPolicy(null);
            setShowPolicyModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          + Add Policy
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Policy Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Period</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Allowed Days
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">Status</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leavePolicies.length > 0 ? (
              leavePolicies.map((policy) => (
                <tr key={policy.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{policy.name}</td>
                  <td className="px-6 py-4">{policy.leaveType}</td>
                  <td className="px-6 py-4">{policy.period}</td>
                  <td className="px-6 py-4">{policy.allowedDays}</td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        policy.active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {policy.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedPolicy(policy);
                        setShowPolicyModal(true);
                      }}
                      className="px-3 py-1 text-blue-600 hover:bg-blue-100 rounded-lg"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePolicy(policy.id)}
                      className="px-3 py-1 text-red-600 hover:bg-red-100 rounded-lg"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No leave policies defined yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showPolicyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-96 p-6">
            <h2 className="text-lg font-bold mb-4">
              {selectedPolicy?.id ? 'Edit Leave Policy' : 'Add Leave Policy'}
            </h2>

            {/* Form Fields */}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Policy Name"
                value={selectedPolicy?.name || ''}
                onChange={(e) =>
                  setSelectedPolicy((prev) => ({
                    ...(prev || {}),
                    name: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border rounded-lg"
              />

              <select
                value={selectedPolicy?.leaveType || ''}
                onChange={(e) =>
                  setSelectedPolicy((prev) => ({
                    ...(prev || {}),
                    leaveType: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select Leave Type</option>
                <option value="Sick">Sick</option>
                <option value="Casual">Casual</option>
                <option value="Earned">Earned</option>
                <option value="Maternity">Maternity</option>
              </select>

              <select
                value={selectedPolicy?.period || 'Yearly'}
                onChange={(e) =>
                  setSelectedPolicy((prev) => ({
                    ...(prev || {}),
                    period: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="Yearly">Yearly</option>
                <option value="Monthly">Monthly</option>
              </select>

              <input
                type="number"
                placeholder="Allowed Days"
                value={selectedPolicy?.allowedDays || ''}
                onChange={(e) =>
                  setSelectedPolicy((prev) => ({
                    ...(prev || {}),
                    allowedDays: parseInt(e.target.value, 10),
                  }))
                }
                className="w-full px-3 py-2 border rounded-lg"
              />

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedPolicy?.active ?? true}
                  onChange={(e) =>
                    setSelectedPolicy((prev) => ({
                      ...(prev || {}),
                      active: e.target.checked,
                    }))
                  }
                />
                <span>Active</span>
              </label>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowPolicyModal(false);
                  setSelectedPolicy(null);
                }}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSavePolicy(selectedPolicy)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeavePolicy;
