import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';

export default function EventCard({ event, onClick }) {
  const navigate = useNavigate();

  const handleRegisterClick = (e) => {
    e.stopPropagation();
    if (event.isDefault) return;
    navigate(`/register-now/${event._id}`);
  };

  return (
    <div
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={event.image || event.img} 
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description || event.desc}
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            {new Date(event.date).toLocaleDateString()}
            {event.time && ` at ${event.time}`}
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
            onClick={handleRegisterClick}
            className={`w-full py-2 rounded-lg transition-colors duration-200 font-medium ${event.isDefault ? 'cursor-not-allowed bg-gray-200 text-gray-500' : 'bg-[#f1262d] text-white hover:bg-[#c91f2a]'}`}
          >
            {event.isDefault ? 'Registration opens soon' : 'Register Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
