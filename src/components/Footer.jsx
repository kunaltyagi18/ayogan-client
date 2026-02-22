import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-2 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">College Events</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your one-stop platform for discovering, organizing, and participating in college events.
              Connect with peers and create memorable experiences.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-blue-500 cursor-pointer transition-colors duration-200" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors duration-200" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-pink-500 cursor-pointer transition-colors duration-200" />
              <Linkedin className="h-5 w-5 text-gray-400 hover:text-blue-600 cursor-pointer transition-colors duration-200" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Register Event
                </Link>
              </li>
              <li>
                <Link to="/Gallary" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Gallary
                </Link>
              </li>
              <li>
                <Link to="/FAQ" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Event Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Event Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/events?category=Academic" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Academic
                </Link>
              </li>
              <li>
                <Link to="/events?category=Sports" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Sports
                </Link>
              </li>
              <li>
                <Link to="/events?category=Cultural" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Cultural
                </Link>
              </li>
              <li>
                <Link to="/events?category=Technical" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Technical
                </Link>
              </li>
              <li>
                <Link to="/events?category=Workshop" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Workshops
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-500" />
                <span className="text-gray-400 text-sm">events@college.edu</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-blue-500" />
                <span className="text-gray-400 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span className="text-gray-400 text-sm">123 College Ave, Campus City</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} College Events. All rights reserved. Built with ❤️ for students.
          </p>
        </div>
      </div>
    </footer>
  );
}
