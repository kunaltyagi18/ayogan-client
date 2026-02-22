import React, { useState, useEffect } from "react";
import { X, Calendar, MapPin } from "lucide-react";
import { eventAPI } from "../utils/api";
import { useTheme } from "../contexts/ThemeContext";

export default function Gallery() {
  const { isDark } = useTheme();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  // Demo events for gallery showcase
  const demoGalleryEvents = [
    {
      _id: 'demo-1',
      title: "Tech Symposium 2024",
      category: "Technical",
      description: "Students presenting innovative tech solutions and networking with industry experts.",
      date: "2024-03-15",
      location: "Main Auditorium",
      organizer: "Tech Club",
      galleryImage: "https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      _id: 'demo-2',
      title: "Cultural Festival",
      category: "Cultural",
      description: "Vibrant celebration of diverse cultures with music, dance, and traditional performances.",
      date: "2024-04-20",
      location: "Campus Lawn",
      organizer: "Cultural Committee",
      galleryImage: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      _id: 'demo-3',
      title: "Annual Sports Meet 2024",
      category: "Sports",
      description: "Inter-college sports competition featuring athletics, basketball, cricket and more.",
      date: "2024-05-10",
      location: "College Sports Complex",
      organizer: "Sports Committee",
      galleryImage: "https://images.pexels.com/photos/3076514/pexels-photo-3076514.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      _id: 'demo-4',
      title: "Research Symposium",
      category: "Academic",
      description: "Student research presentations and poster sessions showcasing innovative projects.",
      date: "2024-06-15",
      location: "Engineering Block",
      organizer: "Research Committee",
      galleryImage: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      _id: 'demo-5',
      title: "Music Concert Night",
      category: "Cultural",
      description: "Live music performances by college bands and guest artists.",
      date: "2024-07-20",
      location: "Open Amphitheater",
      organizer: "Music Club",
      galleryImage: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      _id: 'demo-6',
      title: "Hackathon 2024",
      category: "Technical",
      description: "24-hour coding marathon with exciting prizes and networking opportunities.",
      date: "2024-08-25",
      location: "Computer Lab",
      organizer: "Coding Club",
      galleryImage: "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
  ];

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      // Fetch all events (not just completed ones)
      const response = await eventAPI.getAllEvents({});
      
      // Filter events that have galleryImage
      const eventsWithGallery = response.data.events.filter(
        event => event.galleryImage && event.galleryImage.trim() !== ''
      );
      
      setEvents(eventsWithGallery);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
    } finally {
      setLoading(false);
    }
  };

  // Combine demo events with real events
  const allGalleryEvents = [...demoGalleryEvents, ...events];

  const openLightbox = (event) => {
    setSelectedImage(event);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <section className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gradient-to-b from-gray-50 to-white'} py-16 px-6 transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className={`text-4xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Event <span className="text-blue-600">Gallery</span>
          </h2>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Explore memorable moments from our past events
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : allGalleryEvents.length === 0 ? (
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className={`mt-4 text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              No gallery images yet
            </h3>
            <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Gallery images will appear here when you create events with gallery images
            </p>
          </div>
        ) : (
          <>
            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {allGalleryEvents.map((event) => (
                <div
                  key={event._id}
                  onClick={() => openLightbox(event)}
                  className={`group relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-300`}
                >
                  {/* Use galleryImage */}
                  <img
                    src={event.galleryImage}
                    alt={event.title}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=800';
                    }}
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="font-bold text-lg mb-1 line-clamp-2">
                        {event.title}
                      </h3>
                      <div className="flex items-center text-sm space-x-3">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {event.category}
                  </div>

                  {/* Demo Badge for demo events */}
                  {event._id.startsWith('demo-') && (
                    <div className="absolute top-3 left-3 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Showcase
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
              <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                <button
                  onClick={closeLightbox}
                  className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors z-10"
                >
                  <X className="h-6 w-6" />
                </button>

                <div className="max-w-5xl w-full">
                  <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl overflow-hidden shadow-2xl`}>
                    {/* Use galleryImage in lightbox */}
                    <img
                      src={selectedImage.galleryImage}
                      alt={selectedImage.title}
                      className="w-full h-auto max-h-[70vh] object-contain"
                      onError={(e) => {
                        e.target.src = 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=800';
                      }}
                    />
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                            {selectedImage.title}
                          </h3>
                          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                            {selectedImage.description}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                            {selectedImage.category}
                          </span>
                          {selectedImage._id.startsWith('demo-') && (
                            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                              Showcase
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className={`flex items-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                          <span>{new Date(selectedImage.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                        <div className={`flex items-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                          <span>{selectedImage.location}</span>
                        </div>
                        <div className={`flex items-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          <span className="font-semibold">Organized by:</span>
                          <span className="ml-2">{selectedImage.organizer}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Info Section */}
        <div className={`mt-16 ${isDark ? 'bg-gray-800' : 'bg-gradient-to-r from-blue-50 to-indigo-50'} rounded-2xl shadow-lg p-10 text-center`}>
          <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Want to See Your Event Here?
          </h3>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6 max-w-2xl mx-auto`}>
            When creating an event, upload a special gallery image that will be showcased here! 
            Your event will appear in this gallery as soon as you create it.
          </p>
          <button
            onClick={() => window.location.href = '/register'}
            className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors font-semibold"
          >
            Create Event
          </button>
        </div>
      </div>
    </section>
  );
}