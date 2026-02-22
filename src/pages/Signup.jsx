import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, Calendar, GraduationCap } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useToast } from "../components/Toast";

export default function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { isDark } = useTheme();
  const toast = useToast();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    branch: "",
    year: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const branches = [
    "Computer Science",
    "Electrical",
    "Mechanical",
    "Civil",
    "Electronics",
    "Information Technology",
    "Other",
  ];

  const years = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate", "PhD"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Enter a valid email";
    if (!formData.branch) newErrors.branch = "Please select your branch";
    if (!formData.year) newErrors.year = "Please select your academic year";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    const { confirmPassword, ...registrationData } = formData;
    const result = await register(registrationData);

    setIsLoading(false);

    if (result.success) {
      toast.success("Account created successfully! Welcome to College Events.");
      navigate("/");
    } else {
      toast.error(result.message || "Registration failed. Please try again.");
      setErrors({ email: result.message || "Registration failed. Please try again." });
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'} flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200`}>
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
              <Calendar className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
            Create Account
          </h2>
          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
            Sign up to start exploring and organizing events
          </p>
        </div>

        {/* SignUp Form */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl p-8 transition-colors duration-200`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name */}
            <div className="relative">
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                First Name
              </label>
              <User className={`absolute left-3 top-11 h-5 w-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter your first name"
                className={`mt-1 block w-full rounded-md border px-10 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.firstName 
                    ? "border-red-300" 
                    : isDark
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : "border-gray-300"
                }`}
              />
              {errors.firstName && <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>}
            </div>

            {/* Last Name */}
            <div className="relative">
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                Last Name
              </label>
              <User className={`absolute left-3 top-11 h-5 w-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Enter your last name"
                className={`mt-1 block w-full rounded-md border px-10 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.lastName 
                    ? "border-red-300" 
                    : isDark
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : "border-gray-300"
                }`}
              />
              {errors.lastName && <p className="mt-2 text-sm text-red-600">{errors.lastName}</p>}
            </div>

            {/* Email */}
            <div className="relative">
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                Email
              </label>
              <Mail className={`absolute left-3 top-11 h-5 w-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className={`mt-1 block w-full rounded-md border px-10 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.email 
                    ? "border-red-300" 
                    : isDark
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : "border-gray-300"
                }`}
              />
              {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Branch */}
            <div className="relative">
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                Branch
              </label>
              <GraduationCap className={`absolute left-3 top-11 h-5 w-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <select
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border px-10 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.branch 
                    ? "border-red-300" 
                    : isDark
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : "border-gray-300"
                }`}
              >
                <option value="">Select your branch</option>
                {branches.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              {errors.branch && <p className="mt-2 text-sm text-red-600">{errors.branch}</p>}
            </div>

            {/* Year */}
            <div className="relative">
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                Academic Year
              </label>
              <Calendar className={`absolute left-3 top-11 h-5 w-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <select
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border px-10 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.year 
                    ? "border-red-300" 
                    : isDark
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : "border-gray-300"
                }`}
              >
                <option value="">Select year</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              {errors.year && <p className="mt-2 text-sm text-red-600">{errors.year}</p>}
            </div>

            {/* Password */}
            <div className="relative">
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                Password
              </label>
              <Lock className={`absolute left-3 top-11 h-5 w-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a password"
                className={`mt-1 block w-full rounded-md border px-10 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.password 
                    ? "border-red-300" 
                    : isDark
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-11 ${isDark ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
              {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                Confirm Password
              </label>
              <Lock className={`absolute left-3 top-11 h-5 w-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                className={`mt-1 block w-full rounded-md border px-10 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.confirmPassword 
                    ? "border-red-300" 
                    : isDark
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`absolute right-3 top-11 ${isDark ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
              {errors.confirmPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}