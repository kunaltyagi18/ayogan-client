import React from "react";
import { BookOpen, Trophy, Music, Cpu, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

export default function Categories() {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const categories = [
    {
      name: "Academic",
      description: "Seminars, paper presentations, and academic competitions.",
      icon: <BookOpen className="h-10 w-10 text-blue-600" />,
      color: isDark ? "from-blue-900 to-blue-800" : "from-blue-100 to-blue-200",
    },
    {
      name: "Sports",
      description: "Indoor & outdoor sports events, tournaments, and fitness challenges.",
      icon: <Trophy className="h-10 w-10 text-green-600" />,
      color: isDark ? "from-green-900 to-green-800" : "from-green-100 to-green-200",
    },
    {
      name: "Cultural",
      description: "Dance, music, drama, and cultural fests to showcase talents.",
      icon: <Music className="h-10 w-10 text-pink-600" />,
      color: isDark ? "from-pink-900 to-pink-800" : "from-pink-100 to-pink-200",
    },
    {
      name: "Technical",
      description: "Hackathons, coding contests, robotics, and project exhibitions.",
      icon: <Cpu className="h-10 w-10 text-purple-600" />,
      color: isDark ? "from-purple-900 to-purple-800" : "from-purple-100 to-purple-200",
    },
    {
      name: "Workshop",
      description: "Hands-on training sessions to learn new skills & technologies.",
      icon: <Wrench className="h-10 w-10 text-orange-600" />,
      color: isDark ? "from-orange-900 to-orange-800" : "from-orange-100 to-orange-200",
    },
  ];

  const handleCategoryClick = (categoryName) => {
    navigate(`/events?category=${categoryName}`);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-12 px-6 transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-4`}>
          Event Categories
        </h1>
        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-lg`}>
          Explore various categories of events happening on campus. 
          From academics to culture, there's something for everyone!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category, index) => (
          <div
            key={index}
            onClick={() => handleCategoryClick(category.name)}
            className={`bg-gradient-to-r ${category.color} p-6 rounded-2xl shadow-lg hover:scale-105 transform transition duration-300 cursor-pointer`}
          >
            <div className="flex items-center justify-center mb-4">
              <div className={`${isDark ? 'bg-gray-700' : 'bg-white'} p-4 rounded-full shadow-md`}>
                {category.icon}
              </div>
            </div>
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-2`}>
              {category.name}
            </h2>
            <p className={`${isDark ? 'text-gray-200' : 'text-gray-600'} mb-4`}>
              {category.description}
            </p>
            <button
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                isDark 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-white text-gray-800 hover:bg-gray-100'
              }`}
            >
              View Events
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}