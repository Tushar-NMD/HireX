import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('jobportal_token');
      const res = await fetch('http://localhost:5000/api/analytics/admin', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!analytics) return null;

  const { overview, applications, popularJobs } = analytics;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Analytics Dashboard</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Jobs</p>
              <p className="text-3xl font-bold mt-1">{overview.totalJobs}</p>
              <p className="text-xs text-blue-100 mt-2">{overview.activeJobs} active</p>
            </div>
            <svg className="w-12 h-12 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Applications</p>
              <p className="text-3xl font-bold mt-1">{overview.totalApplications}</p>
              <p className="text-xs text-green-100 mt-2">{overview.recentApplications} this month</p>
            </div>
            <svg className="w-12 h-12 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Pending Review</p>
              <p className="text-3xl font-bold mt-1">{applications.pending}</p>
              <p className="text-xs text-yellow-100 mt-2">Needs attention</p>
            </div>
            <svg className="w-12 h-12 text-yellow-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Accepted</p>
              <p className="text-3xl font-bold mt-1">{applications.accepted}</p>
              <p className="text-xs text-purple-100 mt-2">{applications.rejected} rejected</p>
            </div>
            <svg className="w-12 h-12 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Popular Jobs */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Most Popular Jobs</h2>
        {popularJobs.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No data available yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salary</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applications</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {popularJobs.map((job, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{job.jobTitle}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{job.location}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{job.salary}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {job.applications}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Application Status Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Application Status Distribution</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-3xl font-bold text-yellow-600">{applications.pending}</p>
            <p className="text-sm text-gray-600 mt-1">Pending</p>
            <div className="mt-2 bg-yellow-200 h-2 rounded-full">
              <div 
                className="bg-yellow-500 h-2 rounded-full" 
                style={{ width: `${(applications.pending / overview.totalApplications * 100) || 0}%` }}
              ></div>
            </div>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">{applications.accepted}</p>
            <p className="text-sm text-gray-600 mt-1">Accepted</p>
            <div className="mt-2 bg-green-200 h-2 rounded-full">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${(applications.accepted / overview.totalApplications * 100) || 0}%` }}
              ></div>
            </div>
          </div>

          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-3xl font-bold text-red-600">{applications.rejected}</p>
            <p className="text-sm text-gray-600 mt-1">Rejected</p>
            <div className="mt-2 bg-red-200 h-2 rounded-full">
              <div 
                className="bg-red-500 h-2 rounded-full" 
                style={{ width: `${(applications.rejected / overview.totalApplications * 100) || 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
