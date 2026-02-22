import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle, X, AlertCircle } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Contact() {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState('success');
  const [toastMessage, setToastMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (formData.name.length > 100) {
      newErrors.name = "Name cannot exceed 100 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (formData.subject && formData.subject.length > 200) {
      newErrors.subject = "Subject cannot exceed 200 characters";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    } else if (formData.message.length > 1000) {
      newErrors.message = "Message cannot exceed 1000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const showNotification = (type, message) => {
    setToastType(type);
    setToastMessage(message);
    setShowToast(true);
    
    setTimeout(() => {
      setShowToast(false);
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showNotification('error', 'Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API_URL}/contact`, formData);

      if (response.data.success) {
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        
        showNotification('success', response.data.message);
      }
    } catch (error) {
      console.error("Contact submission error:", error);
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        showNotification('error', error.response.data.message || 'Please fix the errors in the form');
      } else {
        showNotification('error', error.response?.data?.message || 'Failed to send message. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gradient-to-b from-gray-50 to-white'} py-16 px-6 transition-colors duration-200`}>
      <div className="max-w-6xl mx-auto">
        {/* Toast Notification */}
        {showToast && (
          <div className="fixed top-4 right-4 z-50 animate-slide-in">
            <div className={`${
              toastType === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 min-w-80`}>
              {toastType === 'success' ? (
                <CheckCircle className="h-6 w-6" />
              ) : (
                <AlertCircle className="h-6 w-6" />
              )}
              <div className="flex-1">
                <p className="font-semibold">{toastType === 'success' ? 'Success!' : 'Error!'}</p>
                <p className="text-sm">{toastMessage}</p>
              </div>
              <button
                onClick={() => setShowToast(false)}
                className={`ml-4 ${
                  toastType === 'success' ? 'hover:bg-green-600' : 'hover:bg-red-600'
                } rounded-full p-1`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className={`text-4xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Contact <span className="text-blue-600">Us</span>
          </h2>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Have any questions? We'd love to hear from you. Get in touch with us!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-8 rounded-2xl shadow-md`}>
            <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
              Get in Touch
            </h3>
            <ul className="space-y-6">
              <li className="flex items-start">
                <Mail className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                <div>
                  <h4 className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Email</h4>
                  <a 
                    href="mailto:support@collegeevent.com" 
                    className={`${isDark ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}
                  >
                    support@collegeevent.com
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <Phone className="h-6 w-6 text-green-600 mr-4 mt-1" />
                <div>
                  <h4 className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Phone</h4>
                  <a 
                    href="tel:+919876543210" 
                    className={`${isDark ? 'text-gray-400 hover:text-green-400' : 'text-gray-600 hover:text-green-600'} transition-colors`}
                  >
                    +91 98765 43210
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <MapPin className="h-6 w-6 text-red-600 mr-4 mt-1" />
                <div>
                  <h4 className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Address</h4>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    123 Event Street, Lucknow, Uttar Pradesh, India
                  </p>
                </div>
              </li>
            </ul>

            <div className={`mt-8 pt-8 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <h4 className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-3`}>Office Hours</h4>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Saturday: 10:00 AM - 4:00 PM</p>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Sunday: Closed</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-8 rounded-2xl shadow-md`}>
            <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
              Send us a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className={`block ${isDark ? 'text-gray-200' : 'text-gray-700'} font-medium mb-2`}>
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${
                    errors.name 
                      ? 'border-red-500' 
                      : isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'border-gray-300'
                  }`}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className={`block ${isDark ? 'text-gray-200' : 'text-gray-700'} font-medium mb-2`}>
                  Your Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${
                    errors.email 
                      ? 'border-red-500' 
                      : isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className={`block ${isDark ? 'text-gray-200' : 'text-gray-700'} font-medium mb-2`}>
                  Phone Number <span className="text-gray-400 text-sm">(Optional)</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${
                    errors.phone 
                      ? 'border-red-500' 
                      : isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'border-gray-300'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className={`block ${isDark ? 'text-gray-200' : 'text-gray-700'} font-medium mb-2`}>
                  Subject <span className="text-gray-400 text-sm">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this about?"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${
                    errors.subject 
                      ? 'border-red-500' 
                      : isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'border-gray-300'
                  }`}
                />
                {errors.subject && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.subject}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className={`block ${isDark ? 'text-gray-200' : 'text-gray-700'} font-medium mb-2`}>
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message... (min 10 characters)"
                  rows="4"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${
                    errors.message 
                      ? 'border-red-500' 
                      : isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'border-gray-300'
                  }`}
                ></textarea>
                <div className="flex justify-between items-start mt-2">
                  {errors.message ? (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.message}
                    </p>
                  ) : (
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formData.message.length}/1000 characters
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold transition ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

       
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </section>
  );
}