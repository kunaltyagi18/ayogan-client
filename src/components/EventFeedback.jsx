import React, { useState, useEffect } from 'react';
import { Star, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { feedbackAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function EventFeedback({ eventId, eventTitle }) {
  const { isAuthenticated, user } = useAuth();
  const { isDark } = useTheme();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    fetchFeedbacks();
    checkUserFeedback();
  }, [eventId]);

  const fetchFeedbacks = async () => {
    try {
      const response = await feedbackAPI.getEventFeedback(eventId);
      setFeedbacks(response.data.feedback);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkUserFeedback = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await feedbackAPI.getUserFeedback();
      const userFeedback = response.data.feedback.find(
        f => f.event._id === eventId
      );
      if (userFeedback) {
        setHasSubmitted(true);
        setRating(userFeedback.rating);
        setComment(userFeedback.comment);
      }
    } catch (error) {
      console.error('Error checking user feedback:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to submit feedback');
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    const loadingToast = toast.loading('Submitting feedback...');
    setSubmitting(true);

    try {
      const response = await feedbackAPI.submitFeedback({
        eventId,
        rating,
        comment
      });

      toast.dismiss(loadingToast);
      toast.success('Thank you for your feedback!');
      setHasSubmitted(true);
      
      // Refresh feedbacks
      fetchFeedbacks();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (currentRating, interactive = false) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            disabled={!interactive}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <Star
              className={`h-5 w-5 ${
                star <= (interactive ? (hoverRating || rating) : currentRating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : isDark ? 'text-gray-600' : 'text-gray-300'
              } ${interactive ? 'transition-colors' : ''}`}
            />
          </button>
        ))}
      </div>
    );
  };

  const getAverageRating = () => {
    if (feedbacks.length === 0) return 0;
    const sum = feedbacks.reduce((acc, f) => acc + f.rating, 0);
    return (sum / feedbacks.length).toFixed(1);
  };

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 mt-8`}>
      <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
        Feedback & Reviews
      </h2>

      {/* Rating Summary */}
      {feedbacks.length > 0 && (
        <div className={`${isDark ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg p-4 mb-6`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className={`text-3xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  {getAverageRating()}
                </span>
                {renderStars(parseFloat(getAverageRating()))}
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                Based on {feedbacks.length} {feedbacks.length === 1 ? 'review' : 'reviews'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Form */}
      {isAuthenticated && !hasSubmitted && (
        <form onSubmit={handleSubmit} className={`mb-8 p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Share Your Experience
          </h3>
          
          <div className="mb-4">
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
              Your Rating *
            </label>
            {renderStars(rating, true)}
          </div>

          <div className="mb-4">
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
              Your Feedback *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              maxLength={500}
              className={`w-full px-4 py-2 border ${
                isDark 
                  ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                  : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Share your thoughts about this event..."
            />
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
              {comment.length}/500 characters
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting || rating === 0 || !comment.trim()}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
            <span>{submitting ? 'Submitting...' : 'Submit Feedback'}</span>
          </button>
        </form>
      )}

      {hasSubmitted && (
        <div className={`mb-8 p-4 ${isDark ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-200'} border rounded-lg`}>
          <p className={isDark ? 'text-green-200' : 'text-green-800'}>
            Thank you for your feedback! Your review has been submitted and is pending approval.
          </p>
        </div>
      )}

      {/* Feedbacks List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="text-center py-8">
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            No reviews yet. Be the first to review!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <div
              key={feedback._id}
              className={`border ${isDark ? 'border-gray-700 bg-gray-750' : 'border-gray-200'} rounded-lg p-4 hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {feedback.user?.firstName?.[0]}{feedback.user?.lastName?.[0]}
                  </div>
                  <div>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {feedback.user?.firstName} {feedback.user?.lastName}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {renderStars(feedback.rating)}
              </div>
              <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                {feedback.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}