import React, { useState, useEffect } from 'react';
import { loginAPICall } from '../authService/PublicAuthService';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../authService/AuthContext';
import LoadingSpinner from '../DesktopComponents/LoadingSpinner';

const MobileLogin = () => {
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
      setError('Invalid username or password. Try again!');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-lg">
        {/* 🔹 Brand Title */}
        <h1 className="text-2xl font-extrabold text-center text-indigo-600 mb-2">Attendance Hub</h1>

        <h2 className="text-lg font-semibold text-center mb-4 text-gray-800">Welcome Back 👋</h2>
        <p className="text-center text-gray-500 text-sm mb-6">Sign in to continue</p>

        {error && <div className="bg-red-100 text-red-700 p-2 rounded text-sm mb-4">{error}</div>}

        <form onSubmit={handleLoginForm} className="space-y-3">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold text-sm hover:bg-indigo-700 active:scale-95 transition"
          >
            Login
          </button>

          <div className="text-center mt-2">
            <Link to="/emailSubmit" className="text-indigo-600 hover:underline text-xs">
              Forgot Password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MobileLogin;
