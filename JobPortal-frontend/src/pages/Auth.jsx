import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUserShield, FaUserTie, FaEnvelope, FaLock, FaUser, FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';
import { Briefcase } from 'lucide-react';
import authService from '../services/authService';

const Auth = () => {
    const navigate = useNavigate();
    const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'register'
    const [userType, setUserType] = useState(null); // 'admin' or 'employee'
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    // Check if user is already logged in and redirect to dashboard
    useEffect(() => {
        const token = authService.getToken();
        const userData = authService.getUserData();
        
        if (token && userData) {
            // Redirect based on role
            if (userData.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                // For employees/users (role: 'employee' or 'user')
                navigate('/employee/jobs');
            }
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Form validation
        if (authMode === 'register' && !formData.name.trim()) {
            toast.error("Please enter your full name");
            return;
        }
        
        if (!formData.email.trim()) {
            toast.error("Please enter your email address");
            return;
        }
        
        if (!formData.password.trim()) {
            toast.error("Please enter your password");
            return;
        }

        setIsSubmitting(true);

        try {
            let response;
            const userTypeLabel = userType === 'admin' ? 'Admin' : 'Employee';

            // Call appropriate API based on auth mode and user type
            if (authMode === 'register') {
                if (userType === 'admin') {
                    response = await authService.registerAdmin(formData);
                } else {
                    response = await authService.registerEmployee(formData);
                }
                
                // Show success message
                toast.success(`Registration Successful! Please sign in to continue.`);
                
                // Reset form and switch to signin mode
                setFormData({ name: '', email: formData.email, password: '' });
                setAuthMode('signin');
                
            } else {
                if (userType === 'admin') {
                    response = await authService.loginAdmin(formData);
                } else {
                    response = await authService.loginEmployee(formData);
                }
                
                // Store token and user data immediately after successful login
                if (response.success && response.data) {
                    // Store token
                    const token = response.data.token;
                    if (token) {
                        authService.setToken(token);
                    }
                    
                    // Store user data
                    authService.setUserData({
                        id: response.data._id,
                        name: response.data.name,
                        email: response.data.email,
                        role: response.data.role
                    });
                    
                    // Show success message
                    toast.success(`Login Successful! Welcome back, ${userTypeLabel}!`);

                    // Redirect after short delay
                    setTimeout(() => {
                        if (userType === 'admin') {
                            navigate('/admin/dashboard');
                        } else {
                            navigate('/employee/profile');
                        }
                    }, 1500);
                }
            }

        } catch (error) {
            console.error('Authentication error:', error);
            toast.error(error.message || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const resetSelection = () => {
        setUserType(null);
        setFormData({ name: '', email: '', password: '' });
    };

    const switchMode = () => {
        setAuthMode(authMode === 'signin' ? 'register' : 'signin');
        resetSelection();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            {/* Main Container */}
            <div className="relative w-full max-w-lg">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden p-6">
                    {/* Logo */}
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                            <Briefcase className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            JobPortal
                        </span>
                    </div>

                    {/* Header */}
                    <div className="mb-4 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">
                            {authMode === 'signin' ? 'Sign In' : 'Create Account'}
                        </h2>
                        <p className="text-sm text-gray-600">
                            {authMode === 'signin'
                                ? 'Access your account'
                                : 'Fill in details to register'}
                        </p>
                    </div>

                    {/* User Type Selection */}
                    {!userType ? (
                        <div className="space-y-3 animate-fade-in">
                            <h3 className="text-base font-semibold text-gray-900 mb-3 text-center">
                                {authMode === 'signin' ? 'Sign in as' : 'Register as'}
                            </h3>

                            {/* Admin Option */}
                            <button
                                onClick={() => setUserType('admin')}
                                className="w-full group bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 p-4 rounded-xl border-2 border-transparent hover:border-blue-500 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <FaUserShield className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <h4 className="text-sm font-bold text-gray-900">Admin / Employer</h4>
                                        <p className="text-xs text-gray-600">Post jobs & manage</p>
                                    </div>
                                </div>
                            </button>

                            {/* Employee Option */}
                            <button
                                onClick={() => setUserType('employee')}
                                className="w-full group bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 p-4 rounded-xl border-2 border-transparent hover:border-green-500 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <FaUserTie className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <h4 className="text-sm font-bold text-gray-900">Employee / Job Seeker</h4>
                                        <p className="text-xs text-gray-600">Find & apply for jobs</p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    ) : (
                        /* Login/Register Form */
                        <div className="animate-slide-left">
                            {/* Selected User Type Badge */}
                            <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <div
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${userType === 'admin'
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                                            : 'bg-gradient-to-r from-green-600 to-emerald-600'
                                        }`}
                                    >
                                        {userType === 'admin' ? (
                                            <FaUserShield className="w-4 h-4 text-white" />
                                        ) : (
                                            <FaUserTie className="w-4 h-4 text-white" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">
                                            {authMode === 'signin' ? 'Signing in as' : 'Registering as'}
                                        </p>
                                        <p className="font-semibold text-gray-900 text-xs">
                                            {userType === 'admin' ? 'Admin / Employer' : 'Employee / Job Seeker'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={resetSelection}
                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Change
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-3">
                                {/* Name Field (Register only) */}
                                {authMode === 'register' && (
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-700">Full Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaUser className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Enter your full name"
                                                required
                                                className="w-full pl-10 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Email Field */}
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-700">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaEnvelope className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="Enter your email"
                                            required
                                            className="w-full pl-10 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-700">Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaLock className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="Enter your password"
                                            required
                                            className="w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? (
                                                <FaEyeSlash className="w-4 h-4" />
                                            ) : (
                                                <FaEye className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full py-3 rounded-lg text-sm font-semibold transition-all duration-300 mt-4 ${
                                        isSubmitting
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>{authMode === 'signin' ? 'Signing In...' : 'Creating Account...'}</span>
                                        </div>
                                    ) : (
                                        authMode === 'signin' ? 'Sign In' : 'Create Account'
                                    )}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Switch Mode */}
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">
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
            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes slide-left {
                    from { opacity: 0; transform: translateX(20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
                .animate-slide-left {
                    animation: slide-left 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default Auth;
