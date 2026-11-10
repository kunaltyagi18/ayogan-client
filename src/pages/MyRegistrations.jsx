import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { registrationAPI } from "../utils/api";
import { useTheme } from "../contexts/ThemeContext";
import toast from "react-hot-toast";
import { Calendar, MapPin, Users, Clock, Trash2 } from "lucide-react";

export default function MyRegistrations() {
  const { isDark } = useTheme();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await registrationAPI.getUserRegistrations();
      setRegistrations(response.data.registrations);
    } catch (err) {
      console.error("Error fetching registrations:", err);
      setError("Failed to load registrations. Please try again later.");
      toast.error("Failed to load your registrations");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async (registrationId, eventTitle) => {
    if (!window.confirm(`Are you sure you want to cancel registration for "${eventTitle}"?`)) {
      return;
    }

    const loadingToast = toast.loading('Cancelling registration...');

    try {
      await registrationAPI.cancelRegistration(registrationId);
      setRegistrations((prev) =>
        prev.filter((reg) => reg._id !== registrationId)
      );
      toast.dismiss(loadingToast);
      toast.success("Registration cancelled successfully");
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Error cancelling registration:", error);
      toast.error(error.response?.data?.message || "Failed to cancel registration");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: isDark 
        ? "bg-green-900 text-green-200 border-green-700" 
        : "bg-green-100 text-green-800 border-green-200",
      pending: isDark 
        ? "bg-yellow-900 text-yellow-200 border-yellow-700" 
        : "bg-yellow-100 text-yellow-800 border-yellow-200",
      cancelled: isDark 
        ? "bg-red-900 text-red-200 border-red-700" 
        : "bg-red-100 text-red-800 border-red-200",
      attended: isDark 
        ? "bg-blue-900 text-blue-200 border-blue-700" 
        : "bg-blue-100 text-blue-800 border-blue-200",
    };
    return colors[status] || (isDark ? "bg-gray-800 text-gray-200 border-gray-700" : "bg-gray-100 text-gray-800 border-gray-200");
  };

  const getCategoryColor = (category) => {
    const colors = {
      Academic: isDark ? "bg-blue-900 text-blue-200" : "bg-blue-100 text-blue-800",
      Sports: isDark ? "bg-green-900 text-green-200" : "bg-green-100 text-green-800",
      Cultural: isDark ? "bg-purple-900 text-purple-200" : "bg-purple-100 text-purple-800",
      Technical: isDark ? "bg-red-900 text-red-200" : "bg-red-100 text-red-800",
      Workshop: isDark ? "bg-yellow-900 text-yellow-200" : "bg-yellow-100 text-yellow-800",
      Social: isDark ? "bg-pink-900 text-pink-200" : "bg-pink-100 text-pink-800",
    };
    return colors[category] || (isDark ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-800");
  };

  const filteredRegistrations = registrations.filter((reg) => {
    if (filterStatus === "all") return true;
    return reg.registrationStatus === filterStatus;
  });

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Loading your registrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-12 transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
            My Event Registrations
          </h1>
          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
            View and manage your event registrations
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {["all", "confirmed", "pending", "attended", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                filterStatus === status
                  ? "bg-blue-600 text-white shadow-lg"
                  : isDark
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {status === "all" ? "All" : status}
              {status !== "all" && (
                <span className="ml-2 text-xs">
                  ({registrations.filter(r => r.registrationStatus === status).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className={`${isDark ? 'bg-red-900 border-red-700 text-red-200' : 'bg-red-50 border-red-200 text-red-700'} border px-4 py-3 rounded-lg mb-6`}>
            {error}
          </div>
        )}

        {/* Empty State */}
        {filteredRegistrations.length === 0 ? (
          <div className={`text-center py-20 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md`}>
            <svg
              className={`mx-auto h-24 w-24 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className={`mt-4 text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              No Registrations Found
            </h3>
            <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {filterStatus === "all" 
                ? "You haven't registered for any events yet."
                : `No ${filterStatus} registrations found.`
              }
            </p>
            <Link
              to="/events"
              className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredRegistrations.map((registration) => (
              <div
                key={registration._id}
                className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow`}
              >
                <div className="md:flex">
                  {/* Event Image */}
                  <div className="md:w-1/3">
                    <img
                      src={registration.event?.image || 'https://via.placeholder.com/400x300'}
                      alt={registration.event?.title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Event+Image';
                      }}
                    />
                  </div>

                  {/* Registration Details */}
                  <div className="p-6 md:w-2/3">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                          {registration.event?.title}
                        </h3>
                        <div className="flex gap-2">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                              registration.registrationStatus
                            )}`}
                          >
                            {registration.registrationStatus}
                          </span>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(
                              registration.event?.category
                            )}`}
                          >
                            {registration.event?.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className={`flex items-center text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                        {formatDate(registration.event?.date)} at {registration.event?.time}
                      </div>

                      <div className={`flex items-center text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                        {registration.event?.location}
                      </div>

                      <div className={`flex items-center text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        <Users className="w-4 h-4 mr-2 text-blue-600" />
                        Organizer: {registration.event?.organizer}
                      </div>

                      <div className={`flex items-center text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        <Clock className="w-4 h-4 mr-2 text-blue-600" />
                        Registered on: {formatDate(registration.registeredAt)}
                      </div>
                    </div>

                    {registration.specialRequirements && (
                      <div className={`mb-4 p-3 ${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          <span className="font-semibold">Special Requirements:</span>{" "}
                          {registration.specialRequirements}
                        </p>
                      </div>
                    )}

                    <div className={`flex items-center justify-between pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div>
                        <span className="text-lg font-bold text-blue-600">
                          {registration.paymentAmount === 0
                            ? "Free"
                            : `₹${registration.paymentAmount}`}
                        </span>
                        {registration.paymentStatus !== "not_required" && (
                          <span className={`ml-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} capitalize`}>
                            ({registration.paymentStatus})
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {registration.registrationStatus === "confirmed" && (
                          <button
                            onClick={() =>
                              handleCancelRegistration(registration._id, registration.event?.title)
                            }
                            className={`flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded-lg ${
                              isDark ? 'hover:bg-red-900/20' : 'hover:bg-red-50'
                            } transition-colors text-sm font-medium`}
                          >
                            <Trash2 className="w-4 h-4" />
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {registrations.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-6 text-center">Registration Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{registrations.length}</div>
                <div className="text-blue-100 text-sm">Total</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {registrations.filter(r => r.registrationStatus === 'confirmed').length}
                </div>
                <div className="text-blue-100 text-sm">Confirmed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {registrations.filter(r => r.registrationStatus === 'attended').length}
                </div>
                <div className="text-blue-100 text-sm">Attended</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {registrations.filter(r => r.registrationStatus === 'pending').length}
                </div>
                <div className="text-blue-100 text-sm">Pending</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
