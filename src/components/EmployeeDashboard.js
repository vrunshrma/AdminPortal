import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authService/AuthContext';  // Import AuthContext
import '../styles/employeeDashboard.css';

const EmployeeDashboard = () => {
    const { user } = useAuth();  // Get user details from AuthContext
    const navigate = useNavigate();
    

    const [dateTime, setDateTime] = useState(new Date().toLocaleString());
    const [attendance, setAttendance] = useState({
        timeIn: "09:00 AM",
        timeOut: "05:00 PM",
        totalHours: "8 hours",
        daysPresent: 20,
        daysAbsent: 2,
        leaveTaken: 3
    });

    const [leaveData, setLeaveData] = useState({
        leaveBalance: 5,
        holidays: ["Independence Day - 4th July", "Labor Day - 2nd September"],
        leaveRequests: {
            pending: ["Vacation - 5th June", "Medical - 12th June"],
            approved: ["Sick Leave - 1st June"],
            rejected: ["Vacation - 3rd June"]
        }
    });

    const [taskData, setTaskData] = useState({
        tasks: [
            { name: "Make Homepage UI", assignedDate: "2024-05-28", dueDate: "2024-06-02", status: "In Progress" },
            { name: "Connect it with backend", assignedDate: "2024-05-29", dueDate: "2024-06-03", status: "Pending" },
            { name: "Apply AI functionality", assignedDate: "2024-05-30", dueDate: "2024-06-04", status: "Completed" }
        ],
        plannedTime: "40 hours",
        actualTime: "38 hours"
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setDateTime(new Date().toLocaleString());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkAttendance = () => {
        navigate('/calendar', { state: { user } });
    };

    return (
        <div className="dashboard-container">
            {/* Welcome Section */}
            <div className="section welcome-section">
                <h2>Welcome, {user?.firstName} {user?.lastName}!</h2>
                <p>Current Date and Time: <span>{dateTime}</span></p>
            </div>

            {/* Attendance Section */}
            <div className="section attendance-section">
                <h2>Attendance</h2>
                <button className="attendance-button" onClick={handleMarkAttendance}>Mark Attendance</button>
                <div className="attendance-status">
                    <div>
                        <h3>Today's Status</h3>
                        <p>Time In: <span>{attendance.timeIn}</span></p>
                        <p>Time Out: <span>{attendance.timeOut}</span></p>
                        <p>Total Hours Worked: <span>{attendance.totalHours}</span></p>
                    </div>
                    <div>
                        <h3>Monthly Summary</h3>
                        <p>Days Present: <span>{attendance.daysPresent}</span></p>
                        <p>Days Absent: <span>{attendance.daysAbsent}</span></p>
                        <p>Leave Taken: <span>{attendance.leaveTaken}</span></p>
                    </div>
                </div>
            </div>

            {/* Leave and Holidays */}
            <div className="section leave-section">
                <h2>Leave and Holidays</h2>
                <p>Leave Balance: <span>{leaveData.leaveBalance}</span> days</p>
                <h3>Upcoming Holidays</h3>
                <ul>{leaveData.holidays.map((holiday, index) => <li key={index}>{holiday}</li>)}</ul>
                <h3>Leave Requests</h3>
                <ul>{Object.entries(leaveData.leaveRequests).map(([status, requests]) => (
                    <li key={status}>{status.charAt(0).toUpperCase() + status.slice(1)}: {requests.join(", ")}</li>
                ))}</ul>
            </div>

            {/* Task Section */}
            <div className="section tasks-section">
                <h2>Tasks Overview</h2>
                <div className="task-list">
                    {taskData.tasks.map((task, index) => (
                        <div className="task" key={index}>
                            <p><strong>{task.name}</strong></p>
                            <p>Assigned: {task.assignedDate}</p>
                            <p>Due: {task.dueDate}</p>
                            <p>Status: <span className={`status-${task.status.toLowerCase()}`}>{task.status}</span></p>
                        </div>
                    ))}
                </div>
                <h3>Plan vs. Actual Time</h3>
                <p>Planned Time: <span>{taskData.plannedTime}</span></p>
                <p>Actual Time: <span>{taskData.actualTime}</span></p>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
