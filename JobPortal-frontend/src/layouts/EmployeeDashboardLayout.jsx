import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaUser, FaEdit, FaBriefcase, FaEye, FaPaperPlane, FaClipboardList, 
  FaSignOutAlt, FaBars, FaTimes, FaUserTie 
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';
import { Briefcase } from 'lucide-react';
import authService from '../services/authService';

const EmployeeDashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userProfilePic, setUserProfilePic] = useState(authService.getUserData()?.profilePic);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for profile picture updates
    const handleProfilePicUpdate = (event) => {
      setUserProfilePic(event.detail.profilePic);
    };

    window.addEventListener('profilePicUpdated', handleProfilePicUpdate);
    
    return () => {
      window.removeEventListener('profilePicUpdated', handleProfilePicUpdate);
    };
  }, []);

  const sidebarItems = [
    {
      name: 'Get Profile',
      path: '/employee/profile',
      icon: FaUser,
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Update Profile',
      path: '/employee/update-profile',
      icon: FaEdit,
      color: 'from-green-500 to-green-600'
    },
    {
      name: 'Browse Jobs',
      path: '/employee/jobs',
      icon: FaBriefcase,
      color: 'from-purple-500 to-purple-600'
    },
    {
      name: 'Job Details',
      path: '/employee/job-details',
      icon: FaEye,
      color: 'from-orange-500 to-orange-600'
    },
    {
      name: 'Apply for Job',
      path: '/employee/apply',
      icon: FaPaperPlane,
      color: 'from-pink-500 to-pink-600'
    },
    {
      name: 'Applied Jobs',
      path: '/employee/applied-jobs',
      icon: FaClipboardList,
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      name: 'Logout',
      path: '/auth',
      icon: FaSignOutAlt,
      color: 'from-red-500 to-red-600',
      isLogout: true
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-80 bg-white/95 backdrop-blur-md shadow-2xl transform transition-transform duration-300 z-50 flex flex-col ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                JobPortal
              </span>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FaTimes className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          {/* Employee Badge */}
         
          
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {sidebarItems.map((item, index) => {
            if (item.isLogout) {
              return (
                <button
                  key={index}
                  onClick={() => {
                    setIsSidebarOpen(false);
                    navigate(item.path);
                  }}
                  className="w-full group flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-red-600 hover:bg-red-50"
                >
                  <div className={`p-2 rounded-lg transition-all duration-300 bg-gradient-to-r ${item.color} text-white group-hover:scale-110`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            }

            return (
              <Link
                key={index}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`group flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                    : 'hover:bg-white/80 text-gray-700'
                }`}
              >
                <div className={`p-2 rounded-lg transition-all duration-300 ${
                  isActive(item.path)
                    ? 'bg-white/20'
                    : `bg-gradient-to-r ${item.color} text-white group-hover:scale-110`
                }`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:ml-80">
        {/* Top Bar */}
        <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FaBars className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="flex items-center space-x-2">
              {/* <HiSparkles className="w-5 h-5 text-green-600" /> */}
              <h1 className="text-xl font-bold text-gray-900">Employee Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Link 
                to="/employee/profile"
                className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 p-0.5 hover:shadow-lg hover:scale-105 transition-all duration-300">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                    {userProfilePic ? (
                      <img
                        src={userProfilePic}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUserTie className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-green-600 transition-colors">Welcome back!</p>
                  <p className="text-xs text-gray-600">{authService.getUserData()?.name || 'Job Seeker'}</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboardLayout;