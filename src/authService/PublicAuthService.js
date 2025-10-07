import axios from 'axios';

//const AUTH_API_BASE_URL = 'http://192.168.1.12:9090/api/v1/auth';
const AUTH_API_BASE_URL = window._env_.AUTH_API_BASE_URL;
//const AUTH_API_BASE_URL = 'http://localhost:9090/api/v1/auth';
// const AUTH_API_BASE_URL = 'http://172.20.10.2:9090/api/v1/auth';
//const AUTH_API_BASE_URL = 'http://192.168.1.14:9090/api/v1/auth';
// "https://attendancebackend-production-6068.up.railway.app/api/v1/auth"
//

export const loginAPICall = (login) => axios.post(`${AUTH_API_BASE_URL}/login`, login);

export const passwordResetEmail = async (email) => {
  try {
    const response = await axios.get(`${AUTH_API_BASE_URL}/resetPassword?email=${email}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    } else {
      return { status: 'FAILED', message: 'Network Error' };
    }
  }
};

export const passwordCreationEmail = async (email) => {
  try {
    const response = await axios.get(`${AUTH_API_BASE_URL}/createPassword?email=${email}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    } else {
      return { status: 'FAILED', message: 'Network Error' };
    }
  }
};

export const validateToken = (userId, passwordResetToken) =>
  axios.get(`${AUTH_API_BASE_URL}/validateToken`, {
    params: {
      id: userId,
      token: passwordResetToken,
    },
  });
