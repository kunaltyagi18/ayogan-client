import React, { useState } from 'react';
import { ChevronDown, Info } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const faqs = [
  { question: 'How do I register for an event?', answer: 'Click "Register Now" on the event page.' },
  { question: 'Can I cancel my registration?', answer: 'Yes, before the event starts from your dashboard.' },
  { question: 'Are events free for students?', answer: 'Most are free; some workshops may have a fee.' },
  { question: 'How do I get notified about new events?', answer: 'Sign up and enable notifications.' }
];

export default function FAQ() {
  const { isDark } = useTheme();
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-12 transition-colors duration-200`}>
      <div className="max-w-4xl mx-auto px-4">
        <h1 className={`text-4xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'} mb-12 text-center`}>
          Frequently Asked Questions
        </h1>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-md border overflow-hidden transition-colors duration-200`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className={`w-full px-6 py-4 flex justify-between items-center text-left transition-colors duration-300 ${
                  isDark ? 'hover:bg-gray-750' : 'hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Info className="h-5 w-5 text-blue-600" />
                  <span className={`font-medium text-lg ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                    {faq.question}
                  </span>
                </div>
                <ChevronDown
                  className={`h-5 w-5 transform transition-transform duration-300 ${
                    openIndex === index 
                      ? 'rotate-180 text-blue-600' 
                      : isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}
                />
              </button>
              <div
                className={`px-6 py-4 border-t transition-all duration-300 ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                } ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                }`}
              >
                <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}