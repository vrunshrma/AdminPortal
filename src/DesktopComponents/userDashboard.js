import React, { useState, useEffect } from 'react';
import { useAuth } from '../authService/AuthContext';
import moment from 'moment';
import {
  addAttendance,
  updateAttendance,
  fetchEventDetailsForDate,
} from '../authService/PrivateAuthService';
import { Clock, Calendar, LogIn, LogOut, MapPin, Coffee, TrendingUp } from 'lucide-react';

// StatCard Component
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

const UserDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkInError, setCheckInError] = useState(null); // 🔹 New error state
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    fetchEventDetailsForDate(moment().format('YYYY-MM-DD'), user.id)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const latest = res.data[res.data.length - 1];

          if (latest.checkIn && !latest.checkOut) {
            setIsCheckedIn(true);
            const combinedDateTime = new Date(`${latest.attendanceDate}T${latest.checkIn}`);
            setCheckInTime(combinedDateTime);
          } else {
            setIsCheckedIn(false);
            setCheckInTime(null);
          }
        } else {
          setIsCheckedIn(false);
          setCheckInTime(null);
        }
      })
      .catch((err) => console.error('Error fetching attendance:', err));
  }, [user?.id]);

  // Clock update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) =>
    date?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

  const formatDateTime = (date) =>
    date?.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

  const formatDate = (date) =>
    date?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const handleCheckIn = async () => {
    console.log('inside handleCheckIn Function');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('User position : ', position);
        const attendanceData = {
          employeeId: user?.id,
          attendanceStatus: 'Present',
          attendanceDate: moment().format('YYYY-MM-DD'),
          checkIn: moment().format('HH:mm:ss'),
          year: moment().year(),
          month: moment().month() + 1,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        console.log('attendance data : ', attendanceData);
        addAttendance(attendanceData)
          .then((addResponse) => {
            if (addResponse.data.status === 'FAILED') {
              setCheckInError(addResponse.data.message); // 🔹 Save error separately
              setIsCheckedIn(false);
              setCheckInTime(null);
            } else {
              setCheckInError(null);
              setIsCheckedIn(true);
              setCheckInTime(new Date());
            }
          })
          .catch((error) => {
            console.error('❌ Error marking attendance:', error);
            setCheckInError('Something went wrong. Please try again.');
          });
      },
      (error) => {
        console.error('Error getting location:', error);
        setCheckInError('Location access denied.');
      }
    );
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    setCheckInTime(null);
    setCheckInError(null);

    const attendanceDate = moment().format('YYYY-MM-DD');

    fetchEventDetailsForDate(attendanceDate, user?.id)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          const checkedInRecord = response.data.find(
            (record) => record.checkIn && !record.checkOut
          );

          if (checkedInRecord) {
            const updatedAttendanceData = {
              employeeId: checkedInRecord.employeeId,
              checkOut: moment().format('HH:mm:ss'),
            };

            updateAttendance(updatedAttendanceData)
              .then((updateResponse) => {
                console.log('Attendance successfully updated:', updateResponse.data);
              })
              .catch((error) => {
                console.error('Error updating attendance:', error);
                setCheckInError('Error while checking out.');
              });
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching attendance details:', error);
        setCheckInError('Unable to fetch attendance data.');
      });
  };

  // Mock user and stats
  const userData = {
    department: 'IT',
    position: 'Java Full Stack Developer',
  };

  const todayStats = {
    checkIn: '09:15 AM',
    breakTime: '45 min',
    hoursWorked: '7h 30m',
    status: 'Active',
  };

  const weeklyStats = {
    totalHours: '38h 45m',
    overtimeHours: '2h 15m',
    leaveDays: 1,
    presentDays: 4,
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'User'}!</h1>
            <span>
              {user?.department || 'IT'} • {user?.position || 'Developer'}
            </span>
            <p className="text-blue-100 mb-4">{formatDate(currentTime)}</p>
            <div className="flex items-center space-x-2 text-blue-100">
              <MapPin size={16} />
              <span>
                {userData.department} • {userData.position}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-mono font-bold mb-2">{formatTime(currentTime)}</div>
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                isCheckedIn ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  isCheckedIn ? 'bg-green-200' : 'bg-yellow-200'
                }`}
              ></div>
              {isCheckedIn ? 'Checked In' : 'Not Checked In'}
            </div>
          </div>
        </div>
      </div>

      {/* Check In/Out */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold mb-6 flex items-center">
          <Clock className="mr-3 text-blue-600" size={24} />
          Time Tracking
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {checkInError && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg">
                {checkInError}
              </div>
            )}

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
                    <span className="font-medium">Checked in at {formatDateTime(checkInTime)}</span>
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

          {/* Today's Summary */}
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

      {/* Weekly Stats */}
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1">
        <main className="flex-1 p-6 overflow-y-auto">{renderDashboard()}</main>
      </div>
    </div>
  );
};

export default UserDashboard;
