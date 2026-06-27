import { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaEye, FaEdit } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';

const UpdateStatus = () => {
  const [applications, setApplications] = useState([
    {
      id: 1,
      jobTitle: 'Senior Software Engineer',
      applicantName: 'Alice Johnson',
      email: 'alice.johnson@email.com',
      phone: '+1 (555) 123-4567',
      appliedDate: '2024-01-15',
      status: 'pending',
      experience: '5 years',
      resume: 'alice_resume.pdf'
    },
    {
      id: 2,
      jobTitle: 'Frontend Developer',
      applicantName: 'Bob Smith',
      email: 'bob.smith@email.com',
      phone: '+1 (555) 987-6543',
      appliedDate: '2024-01-14',
      status: 'reviewed',
      experience: '3 years',
      resume: 'bob_resume.pdf'
    },
    {
      id: 3,
      jobTitle: 'UI/UX Designer',
      applicantName: 'Carol Davis',
      email: 'carol.davis@email.com',
      phone: '+1 (555) 456-7890',
      appliedDate: '2024-01-13',
      status: 'shortlisted',
      experience: '4 years',
      resume: 'carol_resume.pdf'
    }
  ]);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    reviewed: 'bg-blue-100 text-blue-800 border-blue-200',
    shortlisted: 'bg-purple-100 text-purple-800 border-purple-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
    accepted: 'bg-green-100 text-green-800 border-green-200'
  };

  const statusIcons = {
    pending: '',
    reviewed: '',
    shortlisted: '',
    rejected: '',
    accepted: ''
  };

  const handleStatusChange = (applicationId, newStatus) => {
    setApplications(applications.map(app => 
      app.id === applicationId ? { ...app, status: newStatus } : app
    ));
  };

  const handleBulkStatusUpdate = (newStatus) => {
    setApplications(applications.map(app => ({ ...app, status: newStatus })));
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        {/* <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full mb-4">
          <HiSparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Status Management</span>
        </div> */}
        {/* <h1 className="text-3xl font-bold text-gray-900 mb-2">Update Application Status</h1> */}
        {/* <p className="text-gray-600">Manage and update the status of job applications</p> */}
      </div>

      {/* Bulk Actions */}
     

      {/* Applications List */}
      <div className="space-y-4">
        {applications.map((application, index) => (
          <div
            key={application.id}
            className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Applicant Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{application.applicantName}</h3>
                    <p className="text-lg text-blue-600 font-medium mb-2">{application.jobTitle}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <FaEnvelope className="w-4 h-4" />
                        <span>{application.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaPhone className="w-4 h-4" />
                        <span>{application.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaCalendar className="w-4 h-4" />
                        <span>Applied: {new Date(application.appliedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[application.status]}`}>
                    {statusIcons[application.status]} {application.status.toUpperCase()}
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="bg-gray-100 px-3 py-1 rounded-full">
                    Experience: {application.experience}
                  </span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full">
                    Resume: {application.resume}
                  </span>
                </div>
              </div>

              {/* Status Update Section */}
              <div className="flex flex-col gap-3">
                <div className="text-sm font-medium text-gray-700">Update Status:</div>
                <select
                  value={application.status}
                  onChange={(e) => handleStatusChange(application.id, e.target.value)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="pending"> Pending</option>
                  <option value="reviewed"> Reviewed</option>
                  <option value="shortlisted"> Shortlisted</option>
                  <option value="rejected"> Rejected</option>
                  <option value="accepted"> Accepted</option>
                </select>

                {/* Quick Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusChange(application.id, 'shortlisted')}
                    className="flex items-center space-x-1 px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs"
                  >
                    <span></span>
                    <span>Shortlist</span>
                  </button>
                  <button
                    onClick={() => handleStatusChange(application.id, 'accepted')}
                    className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs"
                  >
                    <span></span>
                    <span>Accept</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {applications.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4"></div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Applications to Update</h3>
          <p className="text-gray-600">There are no applications available for status updates.</p>
        </div>
      )}
    </div>
  );
};

export default UpdateStatus;