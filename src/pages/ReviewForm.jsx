import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { addReview } from '../services/api';
import './ReviewForm.css';

const ReviewForm = () => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionId } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please enter a comment');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      await addReview({ sessionId, rating, comment });
      navigate('/mysessions', { state: { reviewSubmitted: true } });
    } catch (err) {
      setError('Failed to submit review. Please try again.');
      console.error('Review submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderRatingStars = () => {
    return (
      <div className="rating-stars-input">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? 'filled' : ''}`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setRating(star)}
          >
            {star <= rating ? '★' : '☆'}
          </span>
        ))}
        <span className="rating-value">{rating} out of 5</span>
      </div>
    );
  };

  if (!sessionId) {
    return (
      <div className="review-form-container error-message">
        No session selected for review. Please go back and select a session to review.
      </div>
    );
  }

  return (
    <div className="review-form-container">
      <div className="review-form-header">
        <h2>Share Your Experience</h2>
        <p>How was your tutoring session?</p>
      </div>

      <form onSubmit={handleSubmit} className="review-form">
        <div className="form-group">
          <label className="form-label">Your Rating</label>
          {renderRatingStars()}
        </div>

        <div className="form-group">
          <label className="form-label">Your Review</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share details about your experience..."
            className="review-textarea"
            rows="5"
          />
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate('/mysessions')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;