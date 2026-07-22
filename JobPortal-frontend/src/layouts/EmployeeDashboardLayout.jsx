import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaUser, FaBriefcase, FaClipboardList, 
  FaSignOutAlt, FaBars, FaTimes, FaUserTie 
} from 'react-icons/fa';
import { Briefcase } from 'lucide-react';
import authService from '../services/authService';

const EmployeeDashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userProfilePic, setUserProfilePic] = useState(null);
  const [userName, setUserName] = useState(authService.getUserData()?.name || 'Job Seeker');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user profile on mount
    const fetchProfile = async () => {
      try {
        const response = await authService.getEmployeeProfile();
        if (response.success && response.data) {
          setUserProfilePic(response.data.profilePic);
          setUserName(response.data.name);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();

    // Listen for profile picture updates
    const handleProfilePicUpdate = (event) => {
      if (event.detail.profilePic) {
        setUserProfilePic(event.detail.profilePic);
      }
      if (event.detail.name) {
        setUserName(event.detail.name);
      }
    };

    window.addEventListener('profilePicUpdated', handleProfilePicUpdate);
    
    return () => {
      window.removeEventListener('profilePicUpdated', handleProfilePicUpdate);
    };
  }, []);

  const sidebarItems = [
    {
      name: 'Profile',
      path: '/employee/profile',
      icon: FaUser,
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Browse Jobs',
      path: '/employee/jobs',
      icon: FaBriefcase,
      color: 'from-purple-500 to-purple-600'
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
    <div className="home-page min-h-screen relative overflow-x-hidden">
      {/* Home page background gradient elements */}
      <div className="home-page-bg" aria-hidden="true">
        <div className="home-glow-orb w-[520px] h-[520px] bg-amber-600/15 -top-32 -right-32" />
        <div className="home-glow-orb w-[400px] h-[400px] bg-amber-800/10 -bottom-20 -left-20 animation-delay-2000" />
        <div className="home-glow-orb w-[300px] h-[300px] bg-yellow-600/5 top-1/2 left-1/2 -translate-x-1/2 animation-delay-4000" />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-80 bg-black/40 backdrop-blur-md border-r border-white/10 shadow-2xl transform transition-transform duration-300 z-50 flex flex-col ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center space-x-3 group"
              onClick={(e) => {
                // Don't prevent default - just navigate to home
                setIsSidebarOpen(false);
              }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-700 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-gradient-to-r from-amber-500 to-amber-700 p-2 rounded-lg">
                  <Briefcase className="w-6 h-6 text-black" />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                HireX
              </span>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <FaTimes className="w-5 h-5 text-zinc-300" />
            </button>
          </div>
          
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
                    authService.logout();
                    navigate('/');
                  }}
                  className="w-full group flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-red-400 hover:bg-red-500/10"
                >
                  <div className={`p-2 rounded-lg transition-all duration-300 bg-gradient-to-r ${item.color} text-white group-hover:scale-110`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            }

            const active = isActive(item.path);
            return (
              <Link
                key={index}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`group flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  active
                    ? 'bg-gradient-to-r from-amber-500 to-amber-700 text-black shadow-lg font-semibold border border-amber-400/30'
                    : 'hover:bg-white/5 text-zinc-300'
                }`}
              >
                <div className={`p-2 rounded-lg transition-all duration-300 ${
                  active
                    ? 'bg-black/15 text-black'
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
      <div className="lg:ml-80 relative z-10">
        {/* Top Bar */}
        <div className="bg-black/30 backdrop-blur-md shadow-sm border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <FaBars className="w-5 h-5 text-zinc-300" />
            </button>
            
            <div className="flex items-center space-x-2">
              {/* <HiSparkles className="w-5 h-5 text-green-600" /> */}
              <h1 className="text-xl font-bold text-white">Employee Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Link 
                to="/employee/profile"
                className="flex items-center space-x-3 hover:bg-white/5 p-2 rounded-lg transition-colors cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-amber-500 to-amber-700 p-0.5 hover:shadow-lg hover:scale-105 transition-all duration-300">
                  <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center">
                    {userProfilePic ? (
                      <img
                        src={userProfilePic}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUserTie className="w-5 h-5 text-amber-500" />
                    )}
                  </div>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-white group-hover:text-amber-400 transition-colors">Welcome back!</p>
                  <p className="text-xs text-zinc-400">{userName}</p>
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