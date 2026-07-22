import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUserShield, FaUserTie, FaEnvelope, FaLock, FaUser, FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Briefcase } from 'lucide-react';
import authService from '../services/authService';
import PageBackground from '../components/PageBackground';

const Auth = () => {
    const navigate = useNavigate();
    const [authMode, setAuthMode] = useState('signin');
    const [userType, setUserType] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    useEffect(() => {
        const token = authService.getToken();
        const userData = authService.getUserData();
        
        if (token && userData) {
            if (userData.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/employee/jobs');
            }
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
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

            if (authMode === 'register') {
                if (userType === 'admin') {
                    response = await authService.registerAdmin(formData);
                } else {
                    response = await authService.registerEmployee(formData);
                }
                
                toast.success(`Registration Successful! Please sign in to continue.`);
                setFormData({ name: '', email: formData.email, password: '' });
                setAuthMode('signin');
                
            } else {
                if (userType === 'admin') {
                    response = await authService.loginAdmin(formData);
                } else {
                    response = await authService.loginEmployee(formData);
                }
                
                if (response.success && response.data) {
                    const token = response.data.token;
                    if (token) {
                        authService.setToken(token);
                    }
                    
                    authService.setUserData({
                        id: response.data._id,
                        name: response.data.name,
                        email: response.data.email,
                        role: response.data.role
                    });
                    
                    toast.success(`Login Successful! Welcome back, ${userTypeLabel}!`);

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

    const inputClass =
        'w-full pl-10 pr-3 py-2.5 text-sm bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all text-zinc-200 placeholder-zinc-600';

    return (
        <PageBackground>
            <div className="min-h-screen flex items-center justify-center p-4 pt-8">
                {/* Back to home */}
                <Link
                    to="/"
                    className="fixed top-6 left-6 z-50 flex items-center gap-2 text-sm text-zinc-400 hover:text-amber-300 transition-colors home-glass px-4 py-2 rounded-xl"
                >
                    <FaArrowLeft className="w-3.5 h-3.5" />
                    Back to Home
                </Link>

                <div className="relative w-full max-w-lg">
                    <div className="home-glass-strong rounded-2xl overflow-hidden p-6 md:p-8 home-shimmer-border">
                        {/* Logo */}
                        <div className="flex items-center justify-center space-x-2 mb-6">
                            <div className="bg-gradient-to-br from-amber-400/90 to-amber-700/90 p-2 rounded-lg border border-amber-400/20">
                                <Briefcase className="w-5 h-5 text-black" />
                            </div>
                            <span className="text-2xl font-bold home-gold-text tracking-wide">
                                HireX
                            </span>
                        </div>

                        {/* Header */}
                        <div className="mb-6 text-center">
                            <h2 className="text-2xl font-bold text-white mb-1">
                                {authMode === 'signin' ? 'Sign In' : 'Create Account'}
                            </h2>
                            <p className="text-sm text-zinc-400">
                                {authMode === 'signin'
                                    ? 'Access your account'
                                    : 'Fill in details to register'}
                            </p>
                        </div>

                        {/* User Type Selection */}
                        {!userType ? (
                            <div className="space-y-3 animate-fade-in">
                                <h3 className="text-base font-semibold text-zinc-200 mb-3 text-center">
                                    {authMode === 'signin' ? 'Sign in as' : 'Register as'}
                                </h3>

                                <button
                                    onClick={() => setUserType('admin')}
                                    className="w-full group home-glass p-4 rounded-xl border border-white/10 hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-0.5"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="shrink-0 w-10 h-10 bg-gradient-to-r from-amber-500/80 to-amber-700/80 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-amber-400/20">
                                            <FaUserShield className="w-5 h-5 text-black" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <h4 className="text-sm font-bold text-white">Admin / Employer</h4>
                                            <p className="text-xs text-zinc-500">Post jobs & manage</p>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setUserType('employee')}
                                    className="w-full group home-glass p-4 rounded-xl border border-white/10 hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-0.5"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="shrink-0 w-10 h-10 bg-gradient-to-r from-amber-500/80 to-amber-700/80 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-amber-400/20">
                                            <FaUserTie className="w-5 h-5 text-black" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <h4 className="text-sm font-bold text-white">Employee / Job Seeker</h4>
                                            <p className="text-xs text-zinc-500">Find & apply for jobs</p>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        ) : (
                            <div className="animate-slide-up">
                                <div className="flex items-center justify-between mb-4 p-3 home-glass rounded-lg border border-white/10">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-r from-amber-500/80 to-amber-700/80 border border-amber-400/20">
                                            {userType === 'admin' ? (
                                                <FaUserShield className="w-4 h-4 text-black" />
                                            ) : (
                                                <FaUserTie className="w-4 h-4 text-black" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500">
                                                {authMode === 'signin' ? 'Signing in as' : 'Registering as'}
                                            </p>
                                            <p className="font-semibold text-zinc-200 text-xs">
                                                {userType === 'admin' ? 'Admin / Employer' : 'Employee / Job Seeker'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={resetSelection}
                                        className="text-xs text-amber-400 hover:text-amber-300 font-medium"
                                    >
                                        Change
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-3">
                                    {authMode === 'register' && (
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-zinc-400">Full Name</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FaUser className="w-4 h-4 text-amber-500/60" />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter your full name"
                                                    required
                                                    className={inputClass}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-zinc-400">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaEnvelope className="w-4 h-4 text-amber-500/60" />
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="Enter your email"
                                                required
                                                className={inputClass}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-zinc-400">Password</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaLock className="w-4 h-4 text-amber-500/60" />
                                            </div>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                placeholder="Enter your password"
                                                required
                                                className="w-full pl-10 pr-10 py-2.5 text-sm bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all text-zinc-200 placeholder-zinc-600"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
                                            >
                                                {showPassword ? (
                                                    <FaEyeSlash className="w-4 h-4" />
                                                ) : (
                                                    <FaEye className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-full py-3 rounded-lg text-sm font-semibold transition-all duration-300 mt-4 ${
                                            isSubmitting
                                                ? 'bg-zinc-700 cursor-not-allowed text-zinc-400'
                                                : 'bg-gradient-to-r from-amber-500 to-amber-700 text-black hover:shadow-[0_0_24px_rgba(212,175,55,0.35)] hover:scale-[1.02] active:scale-[0.98] border border-amber-400/30'
                                        }`}
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center justify-center space-x-2">
                                                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                                <span>{authMode === 'signin' ? 'Signing In...' : 'Creating Account...'}</span>
                                            </div>
                                        ) : (
                                            authMode === 'signin' ? 'Sign In' : 'Create Account'
                                        )}
                                    </button>
                                </form>
                            </div>
                        )}

                        <div className="mt-6 text-center">
                            <p className="text-sm text-zinc-500">
                                {authMode === 'signin'
                                    ? "Don't have an account? "
                                    : 'Already have an account? '}
                                <button
                                    onClick={switchMode}
                                    className="text-amber-400 hover:text-amber-300 font-semibold"
                                >
                                    {authMode === 'signin' ? 'Register' : 'Sign In'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PageBackground>
    );
};

export default Auth;
