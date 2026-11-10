import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Calendar } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useToast } from "../components/Toast";

export default function Login({ adminOnly = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, adminLogin } = useAuth();
  const { isDark } = useTheme();
  const toast = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    const result = await (adminOnly ? adminLogin : login)({
      email: formData.email,
      password: formData.password,
      rememberMe: formData.rememberMe,
    });

    setIsLoading(false);

    if (result.success) {
      toast.success("Login successful! Welcome back.");
      navigate(location.state?.from || "/", { replace: true });
    } else {
      toast.error(result.message || "Login failed. Please try again.");
      setErrors({ email: result.message || "Login failed. Please try again." });
    }
  };

  return (
    <div className={`auth-page min-h-screen ${isDark ? 'auth-page-dark' : ''} flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200`}>
      <div className="auth-panel max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="auth-brand-mark p-3 rounded-xl">
              <Calendar className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
            {adminOnly ? 'Admin Login' : 'Welcome Back'}
          </h2>
          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
            {adminOnly ? 'Sign in with your administrator account' : 'Sign in to your account to continue'}
          </p>
        </div>

        {/* Login Form */}
        <div className={`auth-card ${isDark ? 'auth-card-dark' : ''} rounded-xl shadow-xl p-8 transition-colors duration-200`}>
          {!adminOnly && <div className={`auth-switch ${isDark ? 'auth-switch-dark' : ''}`}><Link to="/login" className="active">SIGN IN</Link><Link to="/signup">SIGN UP</Link></div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`auth-field w-full pl-10 pr-4 py-3 border rounded-lg focus:border-transparent transition-colors ${
                    errors.email 
                      ? "border-red-300" 
                      : isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : "border-gray-300"
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}
              >
                Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`auth-field w-full pl-10 pr-12 py-3 border rounded-lg focus:border-transparent transition-colors ${
                    errors.password 
                      ? "border-red-300" 
                      : isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : "border-gray-300"
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="auth-checkbox h-4 w-4 border-gray-300 rounded"
                />
                <label
                  htmlFor="rememberMe"
                  className={`ml-2 block text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Remember me
                </label>
              </div>

              <a
                href="#"
                className="auth-accent-link text-sm transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="auth-submit w-full text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {!adminOnly && <div className="mt-6 text-center">
            <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="auth-accent-link font-medium transition-colors"
              >
                Sign up here
              </Link>
            </p>
          </div>}
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            By signing in, you agree to our{" "}
              <Link to="/terms" className="auth-accent-link">
                Terms of Service
              </Link>{" "}
            and{" "}
              <Link to="/privacy" className="auth-accent-link">
                Privacy Policy
              </Link>
          </p>
          <Link to="/" className={`auth-home-link ${isDark ? 'auth-home-link-dark' : ''}`}>← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
