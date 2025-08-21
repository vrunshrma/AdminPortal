import axios from "axios";

const AUTH_REST_API_BASE_URL = "http://192.168.1.12:9090/api/v1/auth";

export const loginAPICall = (login) => axios.post(`${AUTH_REST_API_BASE_URL}/login`, login);

export const passwordResetEmail = async (email) => {
  try {
      const response = await axios.get(`${AUTH_REST_API_BASE_URL}/resetPassword?email=${email}`);
      return response.data;
  } catch (error) {
      if (error.response) {
          return error.response.data;
      } else {
          return { status: 'FAILED', message: 'Network Error' };
      }
  }
};

export const validateToken = (userId,passwordResetToken) => axios.get(`${AUTH_REST_API_BASE_URL}/validateToken`, {
    params: {
      id: userId,
      token:passwordResetToken
    }
  });

