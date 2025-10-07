import React, { useState, useEffect } from 'react';
import { loginAPICall } from '../authService/PublicAuthService';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../authService/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const LoginComponent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUserDetails } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/employeeList');
    }
  }, [navigate]);

  const handleLoginForm = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const login = { username, password };
      const response = await loginAPICall(login);
      if (!response.data) throw new Error('No data received');

      const { accessToken, authenticateUser } = response.data;

      localStorage.setItem('token', accessToken);
      localStorage.setItem('role', authenticateUser.role);
      setUserDetails(authenticateUser);

      window.dispatchEvent(new Event('authChange'));

      if (authenticateUser.role === 'ADMIN') navigate('/adminDashboard');
      else if (authenticateUser.role === 'EMPLOYEE') navigate('/userDashboard');
      else navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
      setError('Username or password is incorrect. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleLoginForm} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>

          <div className="text-center mt-2">
            <Link to="/emailSubmit" className="text-blue-600 hover:underline text-sm">
              Forgot Password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginComponent;
