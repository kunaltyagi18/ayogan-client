import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, CreditCard, User, Mail, Phone, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { eventAPI, registrationAPI } from '../utils/api';
import toast from 'react-hot-toast';

export default function RegisterNow() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { isDark } = useTheme();
  
  const [event, setEvent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    studentId: '',
    department: '',
    year: '',
    specialRequirements: '',
  });
  
  const [errors, setErrors] = useState({});

  const years = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate', 'PhD'];
  const departments = [
    'Computer Science', 'Engineering', 'Business Administration', 'Liberal Arts',
    'Sciences', 'Medicine', 'Law', 'Education', 'Fine Arts', 'Other'
  ];

  const fetchEventAndCheckRegistration = useCallback(async () => {
    try {
      setLoading(true);
      
      const eventResponse = await eventAPI.getEventById(eventId);
      setEvent(eventResponse.data.event);

      try {
        const registrationResponse = await registrationAPI.checkRegistration(eventId);
        if (registrationResponse.data.isRegistered) {
          setAlreadyRegistered(true);
          toast.info('You are already registered for this event');
        }
      } catch {
        setAlreadyRegistered(false);
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error('Event not found');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  }, [eventId, navigate]);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to register for events');
      navigate('/login');
      return;
    }

    fetchEventAndCheckRegistration();
  }, [eventId, isAuthenticated, navigate, fetchEventAndCheckRegistration]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        studentId: user.studentId || '',
        department: user.department || user.branch || '',
        year: user.year || '',
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.studentId) newErrors.studentId = 'Student ID is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.year) newErrors.year = 'Academic year is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill all required fields');
      return;
    }

    if (alreadyRegistered) {
      toast.error('You are already registered for this event');
      return;
    }

    const loadingToast = toast.loading('Registering for event...');
    setIsSubmitting(true);

    try {
      const response = await registrationAPI.registerForEvent({
        eventId: event._id,
        ...formData
      });

      toast.dismiss(loadingToast);

      if (response.data.success) {
        toast.success('🎉 Successfully registered for the event!');
        setTimeout(() => {
          navigate('/my-registrations');
        }, 1500);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center transition-colors duration-200`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  if (alreadyRegistered) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center px-4 transition-colors duration-200`}>
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl p-8 max-w-md w-full text-center`}>
          <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Already Registered</h2>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
            You are already registered for <strong>{event.title}</strong>
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/my-registrations')}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              View My Registrations
            </button>
            <button
              onClick={() => navigate('/events')}
              className={`w-full border ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} px-6 py-3 rounded-lg transition-colors duration-200`}
            >
              Browse Other Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-8 transition-colors duration-200`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/events')}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </button>

        {/* Event Header */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden mb-8`}>
          <div className="relative h-64">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <div className="p-6 text-white">
                <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {event.time}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {event.location}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Registration Form */}
          <div className="lg:col-span-2">
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8`}>
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>Event Registration</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
                    <User className="h-5 w-5 mr-2 text-blue-600" />
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* First Name */}
                    <div>
                      <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.firstName 
                            ? 'border-red-300' 
                            : isDark
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                              : 'border-gray-300'
                        }`}
                        placeholder="Enter your first name"
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.lastName 
                            ? 'border-red-300' 
                            : isDark
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                              : 'border-gray-300'
                        }`}
                        placeholder="Enter your last name"
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            errors.email 
                              ? 'border-red-300' 
                              : isDark
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                : 'border-gray-300'
                          }`}
                          placeholder="Enter your email"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            errors.phone 
                              ? 'border-red-300' 
                              : isDark
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                : 'border-gray-300'
                          }`}
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                      )}
                    </div>

                    {/* Student ID */}
                    <div>
                      <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                        Student ID *
                      </label>
                      <input
                        type="text"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.studentId 
                            ? 'border-red-300' 
                            : isDark
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                              : 'border-gray-300'
                        }`}
                        placeholder="Your student ID"
                      />
                      {errors.studentId && (
                        <p className="mt-1 text-sm text-red-600">{errors.studentId}</p>
                      )}
                    </div>

                    {/* Department */}
                    <div>
                      <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                        Department *
                      </label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.department 
                            ? 'border-red-300' 
                            : isDark
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select department</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                      {errors.department && (
                        <p className="mt-1 text-sm text-red-600">{errors.department}</p>
                      )}
                    </div>

                    {/* Year */}
                    <div>
                      <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                        Academic Year *
                      </label>
                      <select
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.year 
                            ? 'border-red-300' 
                            : isDark
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select year</option>
                        {years.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                      {errors.year && (
                        <p className="mt-1 text-sm text-red-600">{errors.year}</p>
                      )}
                    </div>

                    {/* Special Requirements */}
                    <div className="md:col-span-2">
                      <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                        Special Requirements (Optional)
                      </label>
                      <textarea
                        name="specialRequirements"
                        value={formData.specialRequirements}
                        onChange={handleInputChange}
                        rows={3}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isDark
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'border-gray-300'
                        }`}
                        placeholder="Any dietary restrictions, accessibility needs, etc."
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || event.attendees >= event.maxAttendees}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing Registration...
                    </div>
                  ) : event.attendees >= event.maxAttendees ? (
                    'Event Full'
                  ) : (
                    'Complete Registration'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Event Sidebar */}
          <div className="space-y-6">
            {/* Event Summary */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Event Summary</h3>
              <div className="space-y-3">
                <div className={`flex items-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className={`flex items-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Clock className="h-5 w-5 mr-3 text-blue-600" />
                  <span>{event.time}</span>
                </div>
                <div className={`flex items-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <MapPin className="h-5 w-5 mr-3 text-blue-600" />
                  <span>{event.location}</span>
                </div>
                <div className={`flex items-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Users className="h-5 w-5 mr-3 text-blue-600" />
                  <span>{event.attendees}/{event.maxAttendees} registered</span>
                </div>
              </div>
              <div className={`mt-4 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                  <span className="font-semibold">Organized by:</span> {event.organizer}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{event.description}</p>
              </div>
            </div>

            {/* Pricing */}
            {event.price !== undefined && (
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
                  <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                  Pricing
                </h3>
                {event.price > 0 ? (
                  <div className={`${isDark ? 'bg-yellow-900/30 border-yellow-700' : 'bg-yellow-50 border-yellow-200'} border rounded-lg p-4`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={isDark ? 'text-gray-200' : 'text-gray-700'}>Registration Fee:</span>
                      <span className={`text-2xl font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>₹{event.price}</span>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-yellow-300' : 'text-yellow-700'}`}>
                      Payment can be made at the venue or through the payment link sent after registration.
                    </p>
                  </div>
                ) : (
                  <div className={`${isDark ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200'} border rounded-lg p-4`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={isDark ? 'text-gray-200' : 'text-gray-700'}>Registration Fee:</span>
                      <span className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>FREE</span>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                      This event is completely free to attend!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
