import axios from 'axios';

const AUTH_REST_API_BASE_URL = 'http://localhost:9090/api/v1/user';
// "https://attendancebackend-production-6068.up.railway.app/api/v1/user"
//
const Attendance_REST_API_BASE_URL = 'http://localhost:9090/attendancedetail';
//
// "https://attendancebackend-production-6068.up.railway.app/attendancedetail"

const LEAVE_REST_API_BASE_URL = 'http://localhost:9090/leavedetail';

export const registerAPICall = (registerData) => {
  const token = localStorage.getItem('token');
  return axios.post(`${AUTH_REST_API_BASE_URL}/create`, registerData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAllEmployee = () => {
  const token = localStorage.getItem('token');
  return axios.get(`${AUTH_REST_API_BASE_URL}/employees`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addBranchaddBranchData = (branchData) => {
  const token = localStorage.getItem('token');
  return axios.post(`${AUTH_REST_API_BASE_URL}/addBranch`, branchData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAllBranches = () => {
  const token = localStorage.getItem('token');
  return axios.get(`${AUTH_REST_API_BASE_URL}/getAllBranches`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteBranch = (branchId) => {
  const token = localStorage.getItem('token');
  return axios.delete(`${AUTH_REST_API_BASE_URL}/deleteBranch?branchId=${branchId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const resetPasswordAPI = (resetPasswordRequest) => {
  const token = localStorage.getItem('token');
  return axios.post(`${AUTH_REST_API_BASE_URL}/resetPassword`, resetPasswordRequest, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addAttendance = (attendanceData) => {
  const token = localStorage.getItem('token');
  return axios.post(`${Attendance_REST_API_BASE_URL}/addatten`, attendanceData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteAttendance = (employeeId, fullYear, month, fullDate) => {
  const token = localStorage.getItem('token');
  return axios.get(
    `${Attendance_REST_API_BASE_URL}/deletebyempidatten?employeeId=${employeeId}&year=${fullYear}&month=${month}&date=${fullDate}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const fetchEventDetailsForDate = (date, id) => {
  const token = localStorage.getItem('token');
  return axios.get(`${Attendance_REST_API_BASE_URL}/findbydate?employeeId=${id}&date=${date}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateAttendance = (attendanceData) => {
  const token = localStorage.getItem('token');
  return axios.post(`${Attendance_REST_API_BASE_URL}/updateAttendance`, attendanceData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchEventDetailsForMonth = (month, year, id) => {
  const token = localStorage.getItem('token');
  return axios.get(
    `${Attendance_REST_API_BASE_URL}/findByYearMonthEmpId?employeeId=${id}&month=${month}&year=${year}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const addLeaveDataAPI = (leaveData) => {
  const token = localStorage.getItem('token');

  // Use axios.post() and provide the data as the second argument
  return axios.post(`${LEAVE_REST_API_BASE_URL}/adduserleave`, leaveData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addLeavePolicy = (leavePolicyData) => {
  const token = localStorage.getItem('token');

  // Use axios.post() and provide the data as the second argument
  return axios.post(`${LEAVE_REST_API_BASE_URL}/addLeavePolicy`, leavePolicyData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getLeavePolicies = () => {
  const token = localStorage.getItem('token');

  // Use axios.post() and provide the data as the second argument
  return axios.post(`${LEAVE_REST_API_BASE_URL}/getLeavePolicies`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateLeavePolicy = (leavePolicyData) => {
  const token = localStorage.getItem('token');

  // Use axios.post() and provide the data as the second argument
  return axios.post(`${LEAVE_REST_API_BASE_URL}/updateLeavePolicy`, leavePolicyData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const findAllLeaveRequest = () => {
  const token = localStorage.getItem('token');

  // Use axios.post() and provide the data as the second argument
  return axios.get(`${LEAVE_REST_API_BASE_URL}/findAllUserPendingLeaves`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const leaveStatusUpdate = (leaveId, status, reason) => {
  const token = localStorage.getItem('token');

  // Use axios.post() and provide the data as the second argument
  return axios.get(
    `${LEAVE_REST_API_BASE_URL}/leaveStatusUpdate?leaveId=${leaveId}&status=${status}&reason=${reason}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getAbsenceRequests = (id, month) => {
  const token = localStorage.getItem('token');
  return axios.get(
    `${Attendance_REST_API_BASE_URL}/findbyAbsentRequest?employeeId=${id}&month=${month}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getEmployeeListByAbsentRequests = (month) => {
  const token = localStorage.getItem('token');
  return axios.get(
    `${Attendance_REST_API_BASE_URL}/findEmployeeListByAbsentRequest?month=${month}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const fetchListOfUsers = (employeeIds) => {
  const token = localStorage.getItem('token');
  return axios.get(`${AUTH_REST_API_BASE_URL}/findbyEmployeeIds?employeeIds=${employeeIds}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const UpdateStatusForAbsentRequest = (userID, date, status) => {
  const token = localStorage.getItem('token');
  return axios.get(
    `${Attendance_REST_API_BASE_URL}/updateAbsentStatus?employeeID=${userID}&date=${date}&status=${status}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const fetchUserDetails = (userID) => {
  const token = localStorage.getItem('token');
  return axios.get(`${AUTH_REST_API_BASE_URL}/findbyempid?employeeId=${userID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
