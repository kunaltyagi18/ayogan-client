import React from "react";
import { Users, Target, Award, Heart } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export default function About() {
  const { isDark } = useTheme();

  return (
    <section className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gradient-to-b from-blue-50 to-white'} py-16 px-6 transition-colors duration-200`}>
      <div className="max-w-6xl mx-auto text-center">
        {/* Heading */}
        <h2 className={`text-4xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
          About <span className="text-blue-600">Us</span>
        </h2>
        <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto mb-12`}>
          We are a passionate team committed to creating engaging events and meaningful experiences.
        </p>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Mission */}
          <div className={`p-6 ${isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white'} rounded-2xl shadow-md hover:shadow-lg transition`}>
            <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
              Our Mission
            </h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
              To bring people together and create lasting memories through innovative and exciting events.
            </p>
          </div>

          {/* Team */}
          <div className={`p-6 ${isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white'} rounded-2xl shadow-md hover:shadow-lg transition`}>
            <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
              Our Team
            </h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
              A group of creative thinkers, planners, and executors working with passion and dedication.
            </p>
          </div>

          {/* Achievements */}
          <div className={`p-6 ${isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white'} rounded-2xl shadow-md hover:shadow-lg transition`}>
            <Award className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
              Achievements
            </h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
              Successfully organized 100+ events with excellent feedback and memorable experiences.
            </p>
          </div>

          {/* Values */}
          <div className={`p-6 ${isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white'} rounded-2xl shadow-md hover:shadow-lg transition`}>
            <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
              Our Values
            </h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
              We believe in trust, creativity, teamwork, and delivering the best for our community.
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl shadow-lg p-10">
          <h3 className="text-2xl font-bold mb-4">Why Choose Us?</h3>
          <p className="text-lg max-w-3xl mx-auto">
            With years of experience and a passionate team, we make sure every event is unique, unforgettable,
            and filled with joy. Let's create something amazing together!
          </p>
        </div>
      </div>
    </section>
  );
}