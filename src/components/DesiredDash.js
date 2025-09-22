import React, { useState, useEffect } from 'react';
import { Clock, Calendar, User, LogIn, LogOut, Plus, Settings, Bell, ChevronRight, MapPin, Coffee, Briefcase, TrendingUp } from 'lucide-react';

const DesiredDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    type: '',
    startDate: '',
    endDate: '',
    reason: ''
  });

  // Mock user data
  const userData = {
    name: 'Rahul Sharma',
    employeeId: 'EMP001',
    department: 'Development',
    position: 'Software Developer'
  };

  const todayStats = {
    checkIn: '09:15 AM',
    breakTime: '45 min',
    hoursWorked: '7h 30m',
    status: 'Active'
  };

  const weeklyStats = {
    totalHours: '38h 45m',
    overtimeHours: '2h 15m',
    leaveDays: 1,
    presentDays: 4
  };

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    setCheckInTime(new Date());
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    setCheckInTime(null);
  };

  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    console.log('Leave request:', leaveForm);
    setShowLeaveModal(false);
    setLeaveForm({ type: '', startDate: '', endDate: '', reason: '' });
  };

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
            <h1 className="text-3xl font-bold mb-2">Welcome back, {userData.name}!</h1>
            <p className="text-blue-100 mb-4">{formatDate(currentTime)}</p>
            <div className="flex items-center space-x-2 text-blue-100">
              <MapPin size={16} />
              <span>{userData.department} • {userData.position}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-mono font-bold mb-2">{formatTime(currentTime)}</div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
              isCheckedIn ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                isCheckedIn ? 'bg-green-200' : 'bg-yellow-200'
              }`}></div>
              {isCheckedIn ? 'Checked In' : 'Not Checked In'}
            </div>
          </div>
        </div>
      </div>

      {/* Check In/Out Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold mb-6 flex items-center">
          <Clock className="mr-3 text-blue-600" size={24} />
          Time Tracking
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {!isCheckedIn ? (
              <button
                onClick={handleCheckIn}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
              >
                <LogIn size={20} />
                <span>Check In</span>
              </button>
            ) : (
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center text-green-800">
                    <LogIn size={16} className="mr-2" />
                    <span className="font-medium">Checked in at {formatTime(checkInTime)}</span>
                  </div>
                </div>
                <button
                  onClick={handleCheckOut}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
                >
                  <LogOut size={20} />
                  <span>Check Out</span>
                </button>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-3">Today's Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Check In:</span>
                  <span className="font-medium">{todayStats.checkIn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Break Time:</span>
                  <span className="font-medium">{todayStats.breakTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hours Worked:</span>
                  <span className="font-medium">{todayStats.hoursWorked}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600">{todayStats.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Hours"
          value={weeklyStats.totalHours}
          icon={Clock}
          color="text-blue-600"
          subtitle="This week"
        />
        <StatCard
          title="Overtime"
          value={weeklyStats.overtimeHours}
          icon={TrendingUp}
          color="text-purple-600"
          subtitle="Extra hours"
        />
        <StatCard
          title="Present Days"
          value={weeklyStats.presentDays}
          icon={Calendar}
          color="text-green-600"
          subtitle="Out of 5 days"
        />
        <StatCard
          title="Leave Days"
          value={weeklyStats.leaveDays}
          icon={Coffee}
          color="text-orange-600"
          subtitle="This week"
        />
      </div> 
    </div>
  );

  const renderLeaveManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center">
          <Calendar className="mr-3 text-blue-600" size={28} />
          Leave Management
        </h2>
        <button
          onClick={() => setShowLeaveModal(true)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
        >
          <Plus size={20} />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Leave Balance */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Leave Balance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">12</div>
            <div className="text-sm text-gray-600">Annual Leave</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">8</div>
            <div className="text-sm text-gray-600">Sick Leave</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">3</div>
            <div className="text-sm text-gray-600">Personal</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">5</div>
            <div className="text-sm text-gray-600">Comp Off</div>
          </div>
        </div>
      </div>

      {/* Recent Leave Applications */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Recent Applications</h3>
        <div className="space-y-4">
          {[
            { type: 'Annual Leave', dates: 'Dec 20-22, 2024', status: 'Approved', color: 'green' },
            { type: 'Sick Leave', dates: 'Dec 15, 2024', status: 'Pending', color: 'yellow' },
            { type: 'Personal', dates: 'Dec 10, 2024', status: 'Rejected', color: 'red' }
          ].map((leave, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">{leave.type}</div>
                <div className="text-sm text-gray-600">{leave.dates}</div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                leave.color === 'green' ? 'bg-green-100 text-green-800' :
                leave.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {leave.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center">
        <User className="mr-3 text-blue-600" size={28} />
        Profile Settings
      </h2>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {userData.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="text-xl font-bold">{userData.name}</h3>
            <p className="text-gray-600">{userData.position}</p>
            <p className="text-gray-500">Employee ID: {userData.employeeId}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={userData.name}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <input
                type="text"
                value={userData.department}
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
                value={userData.employeeId}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
              <input
                type="text"
                value={userData.position}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">AttendanceHub</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                <Bell size={20} />
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {userData.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 space-y-2">
            <nav className="space-y-2">
              <TabButton
                id="dashboard"
                label="Dashboard"
                icon={Briefcase}
                isActive={activeTab === 'dashboard'}
                onClick={setActiveTab}
              />
              <TabButton
                id="leave"
                label="Leave Management"
                icon={Calendar}
                isActive={activeTab === 'leave'}
                onClick={setActiveTab}
              />
              <TabButton
                id="profile"
                label="Profile"
                icon={User}
                isActive={activeTab === 'profile'}
                onClick={setActiveTab}
              />
              <TabButton
                id="settings"
                label="Settings"
                icon={Settings}
                isActive={activeTab === 'settings'}
                onClick={setActiveTab}
              />
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'leave' && renderLeaveManagement()}
            {activeTab === 'profile' && renderProfile()}
            {activeTab === 'settings' && (
              <div className="text-center py-12">
                <Settings size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Settings panel coming soon...</p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Leave Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4">Apply for Leave</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type</label>
                <select
                  value={leaveForm.type}
                  onChange={(e) => setLeaveForm({...leaveForm, type: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select leave type</option>
                  <option value="annual">Annual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="personal">Personal Leave</option>
                  <option value="emergency">Emergency Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={leaveForm.startDate}
                    onChange={(e) => setLeaveForm({...leaveForm, startDate: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={leaveForm.endDate}
                    onChange={(e) => setLeaveForm({...leaveForm, endDate: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <textarea
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({...leaveForm, reason: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                  placeholder="Enter reason for leave..."
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleLeaveSubmit}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                >
                  Submit Application
                </button>
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesiredDashboard;