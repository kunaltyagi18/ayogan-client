import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { userAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { User, Mail, Phone, GraduationCap, Calendar, Edit2, Save, X, Camera } from 'lucide-react';

export default function Profile() {
  const { user: authUser, updateUser } = useAuth();
  const { isDark } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    studentId: '',
    department: '',
    branch: '',
    year: '',
  });

  const years = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate', 'PhD'];
  const branches = [
    'Computer Science',
    'Electrical',
    'Mechanical',
    'Civil',
    'Electronics',
    'Information Technology',
    'Other',
  ];

  useEffect(() => {
    if (authUser) {
      setFormData({
        firstName: authUser.firstName || '',
        lastName: authUser.lastName || '',
        email: authUser.email || '',
        phone: authUser.phone || '',
        studentId: authUser.studentId || '',
        department: authUser.department || '',
        branch: authUser.branch || '',
        year: authUser.year || '',
      });
      if (authUser.profilePicture) {
        setProfilePicturePreview(authUser.profilePicture);
      }
    }
  }, [authUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setProfilePicture(file);
      setProfilePicturePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const loadingToast = toast.loading('Updating profile...');
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key !== 'email' && formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (profilePicture) {
        formDataToSend.append('profilePicture', profilePicture);
      }

      const response = await userAPI.updateProfile(formDataToSend);
      
      if (response.data.success) {
        updateUser(response.data.user);
        toast.dismiss(loadingToast);
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        setProfilePicture(null);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Update profile error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: authUser.firstName || '',
      lastName: authUser.lastName || '',
      email: authUser.email || '',
      phone: authUser.phone || '',
      studentId: authUser.studentId || '',
      department: authUser.department || '',
      branch: authUser.branch || '',
      year: authUser.year || '',
    });
    setProfilePicture(null);
    setProfilePicturePreview(authUser.profilePicture || null);
    setIsEditing(false);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-12 transition-colors duration-200`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
            My Profile
          </h1>
          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
            Manage your personal information
          </p>
        </div>

        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12">
            <div className="flex items-center space-x-6">
              {/* Profile Picture */}
              <div className="relative">
                <div className="bg-white rounded-full p-1">
                  {profilePicturePreview ? (
                    <img
                      src={profilePicturePreview}
                      alt="Profile"
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-12 w-12 text-blue-600" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-100 transition-colors">
                    <Camera className="h-5 w-5 text-blue-600" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              
              <div className="text-white">
                <h2 className="text-2xl font-bold">
                  {authUser?.firstName} {authUser?.lastName}
                </h2>
                <p className="text-blue-100">{authUser?.email}</p>
                <div className="mt-2 flex items-center space-x-4 text-sm">
                  <span className="bg-white/20 px-3 py-1 rounded-full">
                    {authUser?.role || 'Student'}
                  </span>
                  {authUser?.year && (
                    <span className="bg-white/20 px-3 py-1 rounded-full">
                      {authUser.year}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Personal Information
              </h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancel}
                    className={`flex items-center space-x-2 border ${
                      isDark 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    } px-4 py-2 rounded-lg transition-colors`}
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{loading ? 'Saving...' : 'Save'}</span>
                  </button>
                </div>
              )}
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2 flex items-center`}>
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 border rounded-lg ${
                      isEditing 
                        ? isDark 
                          ? 'bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500' 
                          : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                        : isDark 
                          ? 'bg-gray-700 border-gray-600 text-gray-400' 
                          : 'bg-gray-50 border-gray-200'
                    }`}
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2 flex items-center`}>
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 border rounded-lg ${
                      isEditing 
                        ? isDark 
                          ? 'bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500' 
                          : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                        : isDark 
                          ? 'bg-gray-700 border-gray-600 text-gray-400' 
                          : 'bg-gray-50 border-gray-200'
                    }`}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2 flex items-center`}>
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className={`w-full px-4 py-2 border rounded-lg cursor-not-allowed ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-400' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  />
                  <p className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Email cannot be changed
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2 flex items-center`}>
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 border rounded-lg ${
                      isEditing 
                        ? isDark 
                          ? 'bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500' 
                          : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                        : isDark 
                          ? 'bg-gray-700 border-gray-600 text-gray-400' 
                          : 'bg-gray-50 border-gray-200'
                    }`}
                  />
                </div>

                {/* Student ID */}
                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                    Student ID
                  </label>
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 border rounded-lg ${
                      isEditing 
                        ? isDark 
                          ? 'bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500' 
                          : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                        : isDark 
                          ? 'bg-gray-700 border-gray-600 text-gray-400' 
                          : 'bg-gray-50 border-gray-200'
                    }`}
                  />
                </div>

                {/* Department */}
                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 border rounded-lg ${
                      isEditing 
                        ? isDark 
                          ? 'bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500' 
                          : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                        : isDark 
                          ? 'bg-gray-700 border-gray-600 text-gray-400' 
                          : 'bg-gray-50 border-gray-200'
                    }`}
                  />
                </div>

                {/* Branch */}
                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2 flex items-center`}>
                    <GraduationCap className="h-4 w-4 mr-2 text-gray-500" />
                    Branch
                  </label>
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 border rounded-lg ${
                      isEditing 
                        ? isDark 
                          ? 'bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500' 
                          : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                        : isDark 
                          ? 'bg-gray-700 border-gray-600 text-gray-400' 
                          : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <option value="">Select Branch</option>
                    {branches.map(branch => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                </div>

                {/* Year */}
                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2 flex items-center`}>
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    Academic Year
                  </label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 border rounded-lg ${
                      isEditing 
                        ? isDark 
                          ? 'bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500' 
                          : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                        : isDark 
                          ? 'bg-gray-700 border-gray-600 text-gray-400' 
                          : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <option value="">Select Year</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            </form>
          </div>

          {/* Stats */}
          <div className={`border-t ${isDark ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'} px-8 py-6`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
              Account Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg p-4 border`}>
                <div className="text-2xl font-bold text-blue-600">
                  {authUser?.eventsRegistered?.length || 0}
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Events Registered
                </div>
              </div>
              <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg p-4 border`}>
                <div className="text-2xl font-bold text-green-600">
                  {authUser?.eventsAttended?.length || 0}
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Events Attended
                </div>
              </div>
              <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg p-4 border`}>
                <div className="text-2xl font-bold text-purple-600">
                  {authUser?.favoriteEvents?.length || 0}
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Favorite Events
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}