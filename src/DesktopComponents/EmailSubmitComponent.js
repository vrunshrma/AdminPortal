import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Send, Briefcase, Clock, Calendar, TrendingUp, Bell } from 'lucide-react';
import { passwordResetEmail } from '../authService/PublicAuthService';

const EmailSubmitComponent = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/resetPassword');
    }
  }, [navigate]);

  const features = [
    { icon: Clock, title: 'Time Tracking', desc: 'Easy check-in/out' },
    { icon: Calendar, title: 'Leave Management', desc: 'Apply & track leaves' },
    { icon: TrendingUp, title: 'Analytics', desc: 'Work insights' },
    { icon: Bell, title: 'Notifications', desc: 'Stay updated' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const response = await passwordResetEmail(email);
      if (response.status === 'SUCCESS') {
        setMessage(response.message);
      } else {
        setError(response.message || 'Something went wrong');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Network Error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-10 items-center">
        {/* Left Section - Branding */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start space-x-3">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
              <Briefcase className="h-8 w-8 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AttendanceHub
            </span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Welcome to Your{' '}
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Digital Workplace
            </span>
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed max-w-md mx-auto lg:mx-0">
            Track your time, manage leaves, and stay connected with your team — all in one beautiful
            platform.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg backdrop-blur-sm"
              >
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <f.icon size={20} className="text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{f.title}</div>
                  <div className="text-sm text-gray-600">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Find Your Account</h2>
            <p className="text-gray-600 mt-2">Enter your email to receive a password reset link</p>
          </div>

          {/* Feedback Messages */}
          {(error || message) && (
            <div
              className={`p-4 mb-4 rounded-lg text-sm ${
                error
                  ? 'bg-red-50 border border-red-200 text-red-800'
                  : 'bg-green-50 border border-green-200 text-green-800'
              }`}
            >
              {error || message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Send size={20} />
                  <span>Send Reset Link</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <Link
              to="/loginPage"
              className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
            >
              <ArrowLeft size={16} className="mr-1" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailSubmitComponent;
