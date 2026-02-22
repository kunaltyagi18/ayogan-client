import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Filter, Calendar, MapPin, Users, Clock, Star, X } from 'lucide-react';
import { eventAPI } from '../utils/api';
import EventFeedback from '../components/EventFeedback';
import { useTheme } from '../contexts/ThemeContext';

export default function Events() {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const categories = ['All', 'Academic', 'Sports', 'Cultural', 'Technical', 'Workshop', 'Social'];

  // Demo events with BOTH image and galleryImage
  const galleryDemoEvents = [
    {
      _id: 'gallery-1',
      title: "Tech Symposium 2024",
      category: "Technical",
      description: "Students presenting innovative tech solutions and networking with industry experts.",
      date: "2024-03-15",
      time: "10:00 AM",
      location: "Main Auditorium",
      image: "https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=800",
      galleryImage: "https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=800",
      organizer: "Tech Club",
      attendees: 120,
      maxAttendees: 200,
      averageRating: 4.5,
      totalReviews: 23,
      featured: true,
      status: 'completed' // Add status for gallery filtering
    },
    {
      _id: 'gallery-2',
      title: "Cultural Festival",
      category: "Cultural",
      description: "Vibrant celebration of diverse cultures with music, dance, and traditional performances.",
      date: "2024-04-20",
      time: "6:00 PM",
      location: "Campus Lawn",
      image: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800",
      galleryImage: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800",
      organizer: "Cultural Committee",
      attendees: 250,
      maxAttendees: 300,
      averageRating: 4.8,
      totalReviews: 45,
      featured: true,
      status: 'completed' // Add status for gallery filtering
    },
    {
      _id: 'gallery-3',
      title: "Annual Sports Meet 2024",
      category: "Sports",
      description: "Inter-college sports competition featuring athletics, basketball, cricket and more.",
      date: "2024-05-10",
      time: "8:00 AM",
      location: "College Sports Complex",
      image: "https://images.pexels.com/photos/3076514/pexels-photo-3076514.jpeg?auto=compress&cs=tinysrgb&w=800",
      galleryImage: "https://images.pexels.com/photos/3076514/pexels-photo-3076514.jpeg?auto=compress&cs=tinysrgb&w=800",
      organizer: "Sports Committee",
      attendees: 300,
      maxAttendees: 350,
      averageRating: 4.6,
      totalReviews: 38,
      featured: true,
      status: 'completed'
    },
  ];

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }
  }, [location.search]);

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory, searchTerm]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        search: searchTerm || undefined,
      };
      
      const response = await eventAPI.getAllEvents(params);
      setEvents(response.data.events);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const allEvents = [...events, ...galleryDemoEvents];

  const filteredEvents = allEvents.filter(event => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredEvents = allEvents.filter(event => event.featured);

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= Math.round(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : isDark ? 'text-gray-600' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} pt-8 pb-16 transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Discover Events
          </h1>
          <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Find exciting events happening around campus and connect with your community
          </p>
        </div>

        {/* Search and Filter */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 mb-8`}>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-200 text-gray-900'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>
            <div className="relative">
              <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`pl-10 pr-8 py-3 border ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-200 text-gray-900'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none min-w-40`}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className={`${isDark ? 'bg-red-900 border-red-700 text-red-200' : 'bg-red-50 border-red-200 text-red-700'} border px-4 py-3 rounded-lg text-center mb-6`}>
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredEvents.length === 0 && (
          <div className="text-center py-20">
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className={`mt-4 text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              No events found
            </h3>
            <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Try adjusting your filters or search query
            </p>
          </div>
        )}

        {/* Featured Events */}
        {!loading && !error && featuredEvents.length > 0 && (
          <section className="mb-12">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
              Featured Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map(event => (
                <div
                  key={event._id}
                  onClick={() => setSelectedEvent(event)}
                  className={`${
                    isDark ? 'bg-gray-800' : 'bg-white'
                  } rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer`}
                >
                  <div className="relative">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-48 object-cover" 
                    />
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {event.category}
                    </div>
                    {event.featured && (
                      <div className="absolute top-4 left-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                        <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                      {event.title}
                    </h3>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-4 line-clamp-2`}>
                      {event.description}
                    </p>
                    
                    {/* Rating */}
                    {event.averageRating > 0 && (
                      <div className="flex items-center space-x-2 mb-3">
                        {renderStars(event.averageRating)}
                        <span className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {event.averageRating}
                        </span>
                        <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          ({event.totalReviews} reviews)
                        </span>
                      </div>
                    )}
                    
                    <div className={`space-y-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {event.location}
                      </div>
                      {event.attendees !== undefined && event.maxAttendees && (
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          {event.attendees}/{event.maxAttendees} attendees
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (event._id.startsWith('gallery-')) {
                            alert('This is a demo event from the gallery. Registration not available.');
                          } else {
                            navigate(`/register-now/${event._id}`);
                          }
                        }}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                      >
                        Register Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Events */}
        {!loading && !error && filteredEvents.length > 0 && (
          <section>
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
              All Events ({filteredEvents.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(event => (
                <div
                  key={event._id}
                  onClick={() => setSelectedEvent(event)}
                  className={`${
                    isDark ? 'bg-gray-800' : 'bg-white'
                  } rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer`}
                >
                  <div className="relative">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-48 object-cover" 
                    />
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {event.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                      {event.title}
                    </h3>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-4 line-clamp-2`}>
                      {event.description}
                    </p>
                    
                    {/* Rating */}
                    {event.averageRating > 0 && (
                      <div className="flex items-center space-x-2 mb-3">
                        {renderStars(event.averageRating)}
                        <span className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {event.averageRating}
                        </span>
                        <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          ({event.totalReviews} reviews)
                        </span>
                      </div>
                    )}
                    
                    <div className={`space-y-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Event Detail Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto`}>
              <div className="relative">
                <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-64 object-cover" />
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {selectedEvent.title}
                  </h2>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {selectedEvent.category}
                  </span>
                </div>
                
                {/* Rating */}
                {selectedEvent.averageRating > 0 && (
                  <div className="flex items-center space-x-2 mb-4">
                    {renderStars(selectedEvent.averageRating)}
                    <span className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {selectedEvent.averageRating}
                    </span>
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      ({selectedEvent.totalReviews} reviews)
                    </span>
                  </div>
                )}
                
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                  {selectedEvent.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-3">
                    <div className={`flex items-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                      <span>{new Date(selectedEvent.date).toLocaleDateString()}</span>
                    </div>
                    <div className={`flex items-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <Clock className="h-5 w-5 mr-3 text-blue-600" />
                      <span>{selectedEvent.time}</span>
                    </div>
                    <div className={`flex items-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <MapPin className="h-5 w-5 mr-3 text-blue-600" />
                      <span>{selectedEvent.location}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className={`flex items-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <Users className="h-5 w-5 mr-3 text-blue-600" />
                      <span>{selectedEvent.attendees}/{selectedEvent.maxAttendees} attendees</span>
                    </div>
                    <div className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      <span className="font-semibold">Organized by:</span> {selectedEvent.organizer}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mb-6">
                  <button
                    onClick={() => {
                      if (selectedEvent._id.startsWith('gallery-')) {
                        alert('This is a demo event from the gallery. Registration not available.');
                      } else {
                        navigate(`/register-now/${selectedEvent._id}`);
                      }
                    }}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
                  >
                    Register Now
                  </button>
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: selectedEvent.title,
                          text: selectedEvent.description,
                          url: window.location.href
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Event link copied to clipboard!');
                      }
                    }}
                    className={`px-6 py-3 border ${
                      isDark 
                        ? 'border-gray-600 hover:bg-gray-700 text-gray-300' 
                        : 'border-gray-300 hover:bg-gray-50'
                    } rounded-lg transition-colors duration-200`}
                  >
                    Share
                  </button>
                </div>
                
                {/* Feedback Section */}
                {!selectedEvent._id.startsWith('gallery-') && (
                  <EventFeedback eventId={selectedEvent._id} eventTitle={selectedEvent.title} />
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}