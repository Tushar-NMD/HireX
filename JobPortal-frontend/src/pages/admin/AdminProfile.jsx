import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaCamera, FaEdit } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';
import authService from '../../services/authService';

const AdminProfile = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    password: '',
    profilePic: null,
    role: '',
    isActive: false,
    createdAt: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, GIF)');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    try {
      setIsUploadingImage(true);
      
      // Upload to server
      const response = await authService.uploadAdminProfilePic(file);
      
      if (response.success && response.data.profilePic) {
        // Update profile data with new image URL
        setProfileData({ 
          ...profileData, 
          profilePic: response.data.profilePic 
        });
        
        toast.success('Profile picture updated successfully!');
        
        // Update stored user data
        const userData = authService.getUserData();
        if (userData) {
          authService.setUserData({
            ...userData,
            profilePic: response.data.profilePic
          });
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error.message || 'Failed to upload profile picture');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await authService.getAdminProfile();
      
      if (response.success && response.data) {
        setProfileData({
          name: response.data.name || '',
          email: response.data.email || '',
          password: '••••••••', // Don't show actual password
          profilePic: response.data.profilePic || null,
          role: response.data.role || '',
          isActive: response.data.isActive || false,
          createdAt: response.data.createdAt || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Prepare data for update (exclude password if not changed)
      const updateData = {
        name: profileData.name,
        email: profileData.email,
      };

      // Only include password if it's been changed
      if (profileData.password && profileData.password !== '••••••••') {
        updateData.password = profileData.password;
      }

      const response = await authService.updateAdminProfile(updateData);
      
      if (response.success) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        
        // Update stored user data
        const userData = authService.getUserData();
        if (userData) {
          authService.setUserData({
            ...userData,
            name: profileData.name,
            email: profileData.email
          });
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="">
          {/* <HiSparkles className="w-4 h-4" /> */}
          {/* <span className="text-sm font-medium">Profile Information</span> */}
        </div>
        {/* <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1> */}
        {/* <p className="text-gray-600">View and manage your profile information</p> */}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Picture Section */}
        <div className="lg:col-span-1">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 text-center animate-fade-in">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 p-1">
                <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center relative">
                  {profileData.profilePic ? (
                    <img
                      src={profileData.profilePic}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUser className="w-16 h-16 text-gray-400" />
                  )}
                  
                  {/* Upload Loading Overlay */}
                  {isUploadingImage && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Upload Button */}
              <label className={`absolute bottom-0 right-0 text-white p-3 rounded-full cursor-pointer transition-all duration-300 ${
                isUploadingImage 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:scale-110'
              }`}>
                <FaCamera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif"
                  onChange={handleImageUpload}
                  disabled={isUploadingImage}
                  className="hidden"
                />
              </label>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">{profileData.name}</h3>
            <p className="text-gray-600 mb-4">{profileData.email}</p>
            
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-3 py-1 rounded-full text-sm">
              <FaUser className="w-3 h-3" />
              <span className="font-medium">Administrator</span>
            </div>
          </div>
        </div>

        {/* Profile Details Section */}
        <div className="lg:col-span-2">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 animate-fade-in animation-delay-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Profile Details</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <FaEdit className="w-4 h-4" />
                <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
              </button>
            </div>

            <div className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaUser className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all ${
                      isEditing
                        ? 'bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all ${
                      isEditing
                        ? 'bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={profileData.password}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all ${
                      isEditing
                        ? 'bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  />
                </div>
              </div>

              {/* Save Button */}
              {isEditing && (
                <div className="pt-4">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
                      isSaving
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-xl hover:scale-105'
                    }`}
                  >
                    {isSaving ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </div>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Additional Info Card */}
          <div className="mt-6 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-6 animate-fade-in animation-delay-400">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Account Type:</span>
                <span className="ml-2 font-medium text-gray-900 capitalize">{profileData.role || 'Administrator'}</span>
              </div>
              <div>
                <span className="text-gray-600">Member Since:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {profileData.createdAt ? new Date(profileData.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Last Login:</span>
                <span className="ml-2 font-medium text-gray-900">Today, {new Date().toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <span className="ml-2 inline-flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${profileData.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`font-medium ${profileData.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {profileData.isActive ? 'Active' : 'Inactive'}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;