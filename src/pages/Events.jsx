import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, RotateCcw, Calendar, MapPin, Users, Clock, Star, X, BookOpen, HeartPulse, GraduationCap, Leaf, Trophy, UsersRound, Wrench } from 'lucide-react';
import { eventAPI } from '../utils/api';
import EventFeedback from '../components/EventFeedback';
import { useTheme } from '../contexts/ThemeContext';
import { defaultEvents } from '../data/defaultContent';

const eventCategories = ['All', 'Academic', 'Sports', 'Cultural', 'Technical', 'Workshop', 'Social'];
const eventCategoryIcons = { All: SlidersHorizontal, Academic: BookOpen, Sports: Trophy, Cultural: HeartPulse, Technical: Wrench, Workshop: GraduationCap, Social: UsersRound };

export default function Events() {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const currentPageRef = useRef(1);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!selectedEvent) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setSelectedEvent(null);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedEvent]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam && eventCategories.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }
  }, [location.search]);

  const fetchEvents = useCallback(async (append = false) => {
    const nextPage = append ? currentPageRef.current + 1 : 1;
    try {
      if (append) setLoadingMore(true);
      else setLoading(true);
      setError(null);
      
      const params = {
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        search: searchTerm || undefined,
        page: nextPage,
        limit: 24,
      };
      
      const response = await eventAPI.getAllEvents(params);
      const apiEvents = response?.data?.events || [];
      // Keep the catalogue useful before the first admin upload. Real events
      // always take priority as soon as the API has any records.
      setEvents((previous) => apiEvents.length > 0
        ? (append ? [...previous, ...apiEvents] : apiEvents)
        : (append ? previous : defaultEvents));
      currentPageRef.current = nextPage;
      setHasMore(nextPage < (response?.data?.totalPages || 1));
    } catch (err) {
      console.error('Error fetching events:', err);
      // The default catalogue is also used when the API is unavailable, so a
      // fresh install never opens to an empty events page.
      if (!append) setEvents(defaultEvents);
      setHasMore(false);
      setError(null);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const allEvents = events;

  const filteredEvents = allEvents.filter(event => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredEvents = filteredEvents.filter(event => event.featured);
  const regularEvents = filteredEvents.filter(event => !event.featured);
  const hasActiveFilters = Boolean(searchTerm || selectedCategory !== 'All');

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
  };

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
    <div className={`events-page min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} pt-8 pb-16 transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="events-page-header text-center mb-12">
          <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Discover Events
          </h1>
          <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Find exciting events happening around campus and connect with your community
          </p>
        </div>

        {/* Search and Filter */}
        <div className={`events-toolbar ${isDark ? 'events-toolbar-dark' : ''} rounded-xl shadow-lg p-5 mb-8`}>
          <div className="events-toolbar-top">
            <div className="events-search-field">
              <Search className="events-search-icon" aria-hidden="true" />
              <input
                type="text"
                aria-label="Search events"
                placeholder="Search by event, club, place or idea..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="events-search-input"
              />
              {searchTerm && <button type="button" className="events-clear-search" onClick={() => setSearchTerm('')} aria-label="Clear search"><X size={16} /></button>}
            </div>
            {hasActiveFilters && <button type="button" className="events-reset-button" onClick={clearFilters}><RotateCcw size={15} /> Reset</button>}
          </div>
          <div className="events-toolbar-bottom">
            <div className="events-quick-filter-label"><Filter size={15} /> Filter by</div>
            <div className="events-category-chips" role="group" aria-label="Filter events by category">
              {eventCategories.map((category) => { const CategoryIcon = eventCategoryIcons[category]; return <button type="button" key={category} className={`events-category-chip ${selectedCategory === category ? 'is-active' : ''}`} onClick={() => setSelectedCategory(category)}><CategoryIcon size={17} />{category}</button>; })}
            </div>
            <span className="events-result-summary">{filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 events-card-grid">
              {featuredEvents.map(event => (
                <div
                  key={event._id}
                  onClick={() => setSelectedEvent(event)}
                  onKeyDown={(keyboardEvent) => {
                    if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
                      keyboardEvent.preventDefault();
                      setSelectedEvent(event);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for ${event.title}`}
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
                        type="button"
                        disabled={event.isDefault}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!event.isDefault) navigate(`/register-now/${event._id}`);
                        }}
                        className={`w-full py-2 rounded-lg transition-colors duration-200 font-medium ${event.isDefault ? 'cursor-not-allowed bg-gray-200 text-gray-500' : 'bg-[#f1262d] text-white hover:bg-[#c91f2a]'}`}
                      >
                        {event.isDefault ? 'Registration opens soon' : 'Register Now'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Events */}
        {!loading && !error && regularEvents.length > 0 && (
          <section>
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
              All Events ({regularEvents.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 events-card-grid">
              {regularEvents.map(event => (
                <div
                  key={event._id}
                  onClick={() => setSelectedEvent(event)}
                  onKeyDown={(keyboardEvent) => {
                    if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
                      keyboardEvent.preventDefault();
                      setSelectedEvent(event);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for ${event.title}`}
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
                    <div className="mt-4">
                      <button
                        type="button"
                        disabled={event.isDefault}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!event.isDefault) navigate(`/register-now/${event._id}`);
                        }}
                        className={`w-full py-2 rounded-lg transition-colors duration-200 font-medium ${event.isDefault ? 'cursor-not-allowed bg-gray-200 text-gray-500' : 'bg-[#f1262d] text-white hover:bg-[#c91f2a]'}`}
                      >
                        {event.isDefault ? 'Registration opens soon' : 'Register Now'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {!loading && !error && hasMore && (
          <div className="mt-10 text-center">
            <button type="button" onClick={() => fetchEvents(true)} disabled={loadingMore} className="rounded-full border border-blue-200 px-6 py-3 font-semibold text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60">
              {loadingMore ? 'Loading more…' : 'Load more events'}
            </button>
          </div>
        )}

        {/* Event Detail Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="event-detail-title">
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto`}>
              <div className="relative">
                <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-64 object-cover" />
                <button
                  type="button"
                  aria-label="Close event details"
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 id="event-detail-title" className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
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
                    type="button"
                    disabled={selectedEvent.isDefault}
                    onClick={() => {
                      if (!selectedEvent.isDefault) navigate(`/register-now/${selectedEvent._id}`);
                    }}
                    className={`flex-1 py-3 rounded-lg transition-colors duration-200 font-semibold ${selectedEvent.isDefault ? 'cursor-not-allowed bg-gray-200 text-gray-500' : 'bg-[#f1262d] text-white hover:bg-[#c91f2a]'}`}
                  >
                    {selectedEvent.isDefault ? 'Registration opens soon' : 'Register Now'}
                  </button>
                  <button
                    type="button"
                    aria-label="Close event details"
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
                <EventFeedback eventId={selectedEvent._id} eventTitle={selectedEvent.title} />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
