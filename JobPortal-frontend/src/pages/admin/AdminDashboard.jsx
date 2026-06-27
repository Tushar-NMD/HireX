import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaPlus, FaBriefcase, FaList, FaChartLine } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';
import authService from '../../services/authService';

const AdminDashboard = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const user = authService.getUserData();
    setUserData(user);
  }, []);

  const dashboardCards = [
    {
  title: 'Train AI',
  description: 'Train chatbot with new knowledge',
  icon: HiSparkles,
  link: '/admin/train',
  color: 'from-indigo-500 to-indigo-600',
  bgColor: 'bg-indigo-50'
},
    {
      title: 'Profile Management',
      description: 'View and update your admin profile',
      icon: FaUser,
      link: '/admin/profile',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Post New Job',
      description: 'Create and publish new job openings',
      icon: FaPlus,
      link: '/admin/post-job',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'My Posted Jobs',
      description: 'Manage all your posted job listings',
      icon: FaBriefcase,
      link: '/admin/my-jobs',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Job Applications',
      description: 'Review and manage job applications',
      icon: FaList,
      link: '/admin/applications',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Update Status',
      description: 'Update application statuses',
      icon: FaChartLine,
      link: '/admin/update-status',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <HiSparkles className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Welcome back, {userData?.name || 'Admin'}!</h1>
        </div>
        <p className="text-blue-100 text-lg">
          Manage your job portal efficiently with our comprehensive admin dashboard.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Jobs Posted</p>
              <p className="text-2xl font-bold text-gray-900">--</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaBriefcase className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">--</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FaList className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Jobs</p>
              <p className="text-2xl font-bold text-gray-900">--</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FaChartLine className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardCards.map((card, index) => (
            <Link
              key={index}
              to={card.link}
              className={`${card.bgColor} rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{card.title}</h3>
                  <p className="text-gray-600 text-sm">{card.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="text-center py-8">
          <p className="text-gray-500">No recent activity to display</p>
          <p className="text-gray-400 text-sm mt-2">Start by posting your first job or managing applications</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;