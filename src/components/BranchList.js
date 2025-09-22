import React, { useState, useEffect } from 'react';
import { Settings, Plus, HomeIcon, Trash2 } from 'lucide-react';
import {
  addBranchaddBranchData,
  getAllBranches,
  deleteBranch,
} from '../authService/PrivateAuthService';

const BranchList = () => {
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState([]);
  const [branchData, setBranchData] = useState({
    branchName: '',
    branchLocation: '',
    radius: '',
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await getAllBranches();
      if (response.data) {
        setBranches(response.data.response); // assuming API returns array of branches
      }
    } catch (err) {
      console.error('Error fetching branches', err);
      setError('Failed to load branches');
    }
  };

  const handleBranchSave = async () => {
    try {
      const response = await addBranchaddBranchData(branchData);
      if (response.data) {
        // refresh list after adding
        fetchBranches();
      }
      setShowBranchModal(false);
      setBranchData({ branchName: '', branchLocation: '', radius: '' });
    } catch (error) {
      console.error('Error saving branch', error);
    }
  };

  const handleDelete = async (branch) => {
    if (!window.confirm('Are you sure you want to delete this branch?')) return;

    try {
      const response = await deleteBranch(branch.branchId);
      if (response.data) {
        // UI se branch remove kar do
        await fetchBranches();
      }
    } catch (err) {
      console.error('Error deleting branch', err);
      setError('Failed to delete branch');
    }
  };

  return (
    <div className="p-6">
      {/* 🔹 Header with Settings Icon + My Branches */}
      <div className="flex items-center gap-3 mb-4">
        <HomeIcon className="h-8 w-8 text-blue-600" />
        <h2 className="text-2xl font-bold">My Branches</h2>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md">
        {/* Existing Branch List */}
        {branches.length > 0 ? (
          <div className="space-y-4 mb-6">
            {branches.map((branch) => (
              <div
                key={branch.id}
                className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm flex justify-between items-center hover:shadow-md transition-all"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{branch.branchName}</h3>
                  <p className="text-sm text-gray-600">📍 {branch.branchLocation}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Radius: <span className="font-medium">{branch.radius}m</span>
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(branch)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mb-6">No branches available.</p>
        )}

        <button
          onClick={() => setShowBranchModal(true)}
          className="flex items-center space-x-2 text-blue-600 font-medium hover:text-blue-800"
        >
          <Plus size={20} /> <span>Add Branch</span>
        </button>

        {/* Branch Modal */}
        {showBranchModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
              {/* Modal Header */}
              <div className="flex items-center gap-3 mb-6">
                <Settings className="h-7 w-7 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Add Branch</h2>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Branch Name"
                  value={branchData.branchName}
                  onChange={(e) => setBranchData({ ...branchData, branchName: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
                <input
                  type="text"
                  placeholder="Branch Location (Address)"
                  value={branchData.branchLocation}
                  onChange={(e) => setBranchData({ ...branchData, branchLocation: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
                <input
                  type="number"
                  placeholder="Radius (meters)"
                  value={branchData.radius}
                  onChange={(e) => setBranchData({ ...branchData, radius: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowBranchModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBranchSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BranchList;
