import React, { useState } from 'react';
import { resetPasswordAPI } from '../authService/PrivateAuthService';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Briefcase,
  Shield,
  Key,
  ArrowLeft,
} from 'lucide-react';

const ResetPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username;

  // Password validation rules
  const validatePassword = (password) => {
    const rules = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    return rules;
  };

  const getPasswordStrength = (password) => {
    const rules = validatePassword(password);
    const score = Object.values(rules).filter(Boolean).length;

    if (score <= 2) return { strength: 'Weak', color: 'text-red-600', bgColor: 'bg-red-500' };
    if (score <= 3) return { strength: 'Fair', color: 'text-yellow-600', bgColor: 'bg-yellow-500' };
    if (score <= 4) return { strength: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-500' };
    return { strength: 'Strong', color: 'text-green-600', bgColor: 'bg-green-500' };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const newErrors = {};

    // Validation
    if (!passwords.newPassword) {
      newErrors.newPassword = 'Password is required';
    } else {
      const rules = validatePassword(passwords.newPassword);
      if (!Object.values(rules).every(Boolean)) {
        newErrors.newPassword = 'Password must meet all requirements';
      }
    }

    if (!passwords.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (passwords.newPassword !== passwords.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Mock API call
    const resetRequest = {
      username,
      password: passwords.newPassword,
      confirmPassword: passwords.confirmPassword,
    };

    resetPasswordAPI(resetRequest)
      .then((response) => {
        if (!response.data) {
          throw new Error('Password or Username not valid');
        }
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('resetPasswordEmail');
        window.dispatchEvent(new Event('authChange'));
        navigate('/loginPage');
      })
      .catch((error) => {
        console.error('Password reset failed:', error);
      });
  };

  const handleBackToLogin = () => {
    alert('Redirecting to login page...');
  };

  const handlePasswordChange = (field, value) => {
    setPasswords({ ...passwords, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful!</h2>
              <p className="text-gray-600">Your password has been successfully updated.</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 text-sm">
                <strong>Great!</strong> You can now sign in to AttendanceHub with your new password.
                Make sure to keep it safe and secure.
              </p>
            </div>

            <button
              onClick={handleBackToLogin}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
            >
              <ArrowLeft size={20} />
              <span>Continue to Login</span>
            </button>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-gray-500 text-sm">
                Having issues?{' '}
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

  const passwordStrength = getPasswordStrength(passwords.newPassword);
  const passwordRules = validatePassword(passwords.newPassword);

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
              Create New
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Password
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Your new password must be different from previously used passwords and meet our
              security requirements.
            </p>
          </div>

          {/* Security Tips */}
          <div className="space-y-4 pt-8">
            <h3 className="text-lg font-semibold text-gray-900">Password Security Tips</h3>
            {[
              {
                icon: Shield,
                title: 'Use Strong Password',
                desc: 'At least 8 characters with mixed case',
              },
              {
                icon: Key,
                title: 'Include Numbers & Symbols',
                desc: 'Add numbers and special characters',
              },
              {
                icon: Lock,
                title: 'Keep it Private',
                desc: 'Never share your password with others',
              },
            ].map((tip, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg backdrop-blur-sm"
              >
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <tip.icon size={20} className="text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{tip.title}</div>
                  <div className="text-sm text-gray-600">{tip.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Reset Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 border border-gray-100">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome, Back!</h2>
            <p className="text-gray-600">Enter your new password below</p>
          </div>

          <div className="space-y-6">
            {/* New Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwords.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.newPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertCircle size={16} className="mr-1" />
                  {errors.newPassword}
                </p>
              )}
            </div>

            {/* Password Strength Indicator */}
            {passwords.newPassword && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Password Strength:</span>
                  <span className={`text-sm font-medium ${passwordStrength.color}`}>
                    {passwordStrength.strength}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${passwordStrength.bgColor} transition-all duration-300`}
                    style={{
                      width: `${(Object.values(passwordRules).filter(Boolean).length / 5) * 100}%`,
                    }}
                  ></div>
                </div>

                {/* Password Requirements */}
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { key: 'length', text: 'At least 8 characters' },
                    { key: 'uppercase', text: 'One uppercase letter' },
                    { key: 'lowercase', text: 'One lowercase letter' },
                    { key: 'number', text: 'One number' },
                    { key: 'special', text: 'One special character' },
                  ].map((rule) => (
                    <div
                      key={rule.key}
                      className={`flex items-center text-sm ${
                        passwordRules[rule.key] ? 'text-green-600' : 'text-gray-500'
                      }`}
                    >
                      <CheckCircle
                        size={16}
                        className={`mr-2 ${
                          passwordRules[rule.key] ? 'text-green-600' : 'text-gray-300'
                        }`}
                      />
                      {rule.text}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwords.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertCircle size={16} className="mr-1" />
                  {errors.confirmPassword}
                </p>
              )}
              {passwords.confirmPassword && passwords.newPassword === passwords.confirmPassword && (
                <p className="text-green-600 text-sm mt-1 flex items-center">
                  <CheckCircle size={16} className="mr-1" />
                  Passwords match
                </p>
              )}
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
                  <Lock size={20} />
                  <span>Update Password</span>
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

          {/* Footer */}
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
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

export default ResetPasswordPage;
