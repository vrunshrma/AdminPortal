import React, { useState } from 'react';
import { Mail, ArrowLeft, Shield, CheckCircle, Briefcase, Clock, Key } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError('Please enter your email address');
      setIsLoading(false);
      return;
    }
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    // Mock API call
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
    }, 2000);
  };

  const handleBackToLogin = () => {
    // In real app, this would navigate back to login
    alert('Navigating back to login page...');
  };

  const handleResendEmail = () => {
    setIsSubmitted(false);
    setEmail('');
    setError('');
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
              <p className="text-gray-600">We've sent password reset instructions to</p>
              <p className="text-blue-600 font-semibold mt-1">{email}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-blue-900 mb-2">What's next?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Check your email inbox</li>
                <li>• Click the reset link in the email</li>
                <li>• Create your new password</li>
                <li>• Sign in with your new password</li>
              </ul>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleBackToLogin}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
              >
                <ArrowLeft size={20} />
                <span>Back to Login</span>
              </button>
              
              <button
                onClick={handleResendEmail}
                className="w-full text-blue-600 hover:text-blue-700 py-2 text-sm font-medium"
              >
                Didn't receive email? Send again
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-gray-500 text-sm">
                Still having trouble?{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  Contact IT Support
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="text-center lg:text-left space-y-6">
          <div className="flex items-center justify-center lg:justify-start space-x-3">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
              <Briefcase className="h-8 w-8 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AttendanceHub
            </span>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Reset Your
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Password
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Don't worry! It happens to the best of us. Enter your email and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Security Features */}
          <div className="space-y-4 pt-8">
            <h3 className="text-lg font-semibold text-gray-900">Secure Process</h3>
            {[
              { icon: Shield, title: 'Secure Link', desc: 'Password reset link expires in 1 hour' },
              { icon: Mail, title: 'Email Verification', desc: 'Link sent only to registered email' },
              { icon: Key, title: 'Strong Password', desc: 'Create a new secure password' }
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg backdrop-blur-sm">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <feature.icon size={20} className="text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{feature.title}</div>
                  <div className="text-sm text-gray-600">{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Reset Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 border border-gray-100">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Key className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
            <p className="text-gray-600">Enter your email to receive reset instructions</p>
          </div>

          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your registered email"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Info Box */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> Password reset link will be sent to your registered email address and will expire in 1 hour for security reasons.
              </p>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Mail size={20} />
                  <span>Send Reset Link</span>
                </>
              )}
            </button>

            {/* Back to Login */}
            <button
              onClick={handleBackToLogin}
              className="w-full text-gray-600 hover:text-gray-800 py-3 text-sm font-medium flex items-center justify-center space-x-2 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back to Login</span>
            </button>
          </div>

          {/* Footer Links */}
          <div className="mt-8 pt-8 border-t border-gray-200 text-center space-y-2">
            <p className="text-gray-500 text-sm">
              Remember your password?{' '}
              <button 
                onClick={handleBackToLogin}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign In
              </button>
            </p>
            <p className="text-gray-500 text-sm">
              Need help? Contact{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                IT Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;