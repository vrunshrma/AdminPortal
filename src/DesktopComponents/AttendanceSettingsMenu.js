import React, { useState } from 'react';
import {
  Settings,
  Clock,
  Users,
  Bell,
  Shield,
  Calendar,
  MapPin,
  FileText,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ---------------- Branch Component ----------------
// const BranchList = ({ onAddBranch }) => {
//   return (
//     <div className="p-6">
//       <h2 className="text-lg font-semibold text-gray-900 mb-4">My Branches</h2>
//       {/* Future: Show list of branches here */}
//       <button onClick={onAddBranch} className="px-4 py-2 bg-blue-600 text-white rounded-md">
//         Add Branch
//       </button>
//     </div>
//   );
// };

// ---------------- Main Settings Component ----------------
const AttendanceSettingsMenu = () => {
  const [expandedSections, setExpandedSections] = useState({});
  const [showBranchComponent, setShowBranchComponent] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [branchData, setBranchData] = useState({
    name: '',
    location: '',
    radius: '',
  });
  const navigate = useNavigate();

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const settingsOptions = [
    {
      id: 'general',
      title: 'General Settings',
      icon: <Settings className="h-5 w-5" />,
      options: ['Company Name', 'Timezone', 'Language'],
    },
    {
      id: 'schedule',
      title: 'Work Schedule',
      icon: <Clock className="h-5 w-5" />,
      options: ['Work Days Selection', 'Start Time', 'End Time'],
    },
    {
      id: 'rules',
      title: 'Attendance Rules',
      icon: <Users className="h-5 w-5" />,
      options: ['Auto Check-out at End Time', 'Grace Period for Late Arrival'],
    },
    {
      id: 'leavePolicy',
      title: 'Leave Policy',
      icon: <Users className="h-5 w-5" />,
      path: '/leavePolicy',
    },
    {
      id: 'location',
      title: 'Location & Geo-fencing',
      icon: <MapPin className="h-5 w-5" />,
      options: ['My Branch'], // 👈 Only one option
    },
  ];

  const handleBranchSave = () => {
    console.log('Branch Saved:', branchData);
    setShowBranchModal(false);
    // TODO: call backend API to save branchData
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3">
            <Settings className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Attendance Settings</h1>
              <p className="text-gray-600">Configure your attendance management system options</p>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-4">
          {settingsOptions.map((section) => (
            <div key={section.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Section Header */}
              <button
                onClick={() => {
                  if (section.options && section.options.length > 0) {
                    toggleSection(section.id); // agar options hain to expand/collapse
                  } else if (section.path) {
                    navigate(section.path); // agar path hai to direct navigate
                  }
                }}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="text-blue-600">{section.icon}</div>
                  <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
                </div>
                <div className="text-gray-400">
                  {section.options && section.options.length > 0 ? (
                    expandedSections[section.id] ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )
                  ) : null}
                </div>
              </button>

              {/* Section Content */}
              {expandedSections[section.id] &&
              Array.isArray(section.options) &&
              section.options.length > 0 ? (
                // ✅ Section has options → render sub-options
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="grid grid-cols-1 gap-3 mt-4">
                    {section.options.map((option, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
                        onClick={() => {
                          if (section.id === 'location' && option === 'My Branch') {
                            navigate('/branchList');
                          }
                          // 🔹 You can add more option-level navigations here if needed
                        }}
                      >
                        <span className="text-sm text-gray-700">{option}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // ❌ No options → make the whole card navigable
                <div
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer mt-4"
                  onClick={() => section.path && navigate(section.path)}
                >
                  <span className="text-sm text-gray-700">{section.title}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Render Branch Component */}
        {/* {showBranchComponent && <BranchList onAddBranch={() => setShowBranchModal(true)} />} */}
      </div>
    </div>
  );
};

export default AttendanceSettingsMenu;
