import { useState } from 'react';
import { X } from 'lucide-react';
import { FaUserShield, FaUserTie, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';

const AuthModal = ({ isOpen, onClose, mode = 'signin' }) => {
  const [authMode, setAuthMode] = useState(mode); // 'signin' or 'register'
  const [userType, setUserType] = useState(null); // 'admin' or 'employee'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', { authMode, userType, formData });
    // Add your authentication logic here
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetModal = () => {
    setUserType(null);
    setFormData({ name: '', email: '', password: '' });
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const switchMode = () => {
    setAuthMode(authMode === 'signin' ? 'register' : 'signin');
    resetModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center rounded-t-3xl">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <HiSparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">
              {authMode === 'signin' ? 'Welcome Back' : 'Join Us Today'}
            </span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {authMode === 'signin' ? 'Sign In' : 'Create Account'}
          </h2>
          <p className="text-blue-100">
            {authMode === 'signin'
              ? 'Sign in to access your account'
              : 'Start your journey with us'}
          </p>
        </div>

        <div className="p-8">
          {/* User Type Selection */}
          {!userType ? (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 text-center mb-6">
                {authMode === 'signin' ? 'Sign in as' : 'Register as'}
              </h3>

              {/* Admin Option */}
              <button
                onClick={() => setUserType('admin')}
                className="w-full group relative bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 p-6 rounded-2xl border-2 border-transparent hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FaUserShield className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="text-lg font-bold text-gray-900 mb-1">Admin / Employer</h4>
                    <p className="text-sm text-gray-600">Post jobs and manage applications</p>
                  </div>
                </div>
              </button>

              {/* Employee Option */}
              <button
                onClick={() => setUserType('employee')}
                className="w-full group relative bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 p-6 rounded-2xl border-2 border-transparent hover:border-green-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FaUserTie className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="text-lg font-bold text-gray-900 mb-1">Employee / Job Seeker</h4>
                    <p className="text-sm text-gray-600">Find and apply for jobs</p>
                  </div>
                </div>
              </button>
            </div>
          ) : (
            /* Login/Register Form */
            <div className="animate-slide-up">
              {/* Selected User Type Badge */}
              <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${userType === 'admin'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600'
                      }`}
                  >
                    {userType === 'admin' ? (
                      <FaUserShield className="w-5 h-5 text-white" />
                    ) : (
                      <FaUserTie className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      {authMode === 'signin' ? 'Signing in as' : 'Registering as'}
                    </p>
                    <p className="font-semibold text-gray-900">
                      {userType === 'admin' ? 'Admin / Employer' : 'Employee / Job Seeker'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetModal}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Change
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Field (Register only) */}
                {authMode === 'register' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaUser className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaEnvelope className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaLock className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Forgot Password (Sign In only) */}
                {authMode === 'signin' && (
                  <div className="text-right">
                    <button
                      type="button"
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  {authMode === 'signin' ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">or</span>
                </div>
              </div>

              {/* Switch Mode */}
              <div className="text-center">
                <p className="text-gray-600">
                  {authMode === 'signin'
                    ? "Don't have an account? "
                    : 'Already have an account? '}
                  <button
                    onClick={switchMode}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    {authMode === 'signin' ? 'Register' : 'Sign In'}
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
