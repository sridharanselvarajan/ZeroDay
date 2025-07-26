import React from 'react';
import './ReviewCard.css';

const ReviewCard = ({ review }) => {
  // Generate star rating display
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i} className="star full-star">★</span>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<span key={i} className="star half-star">★</span>);
      } else {
        stars.push(<span key={i} className="star empty-star">★</span>);
      }
    }
    
    return stars;
  };

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="reviewer-info">
          <div className="reviewer-avatar">
            {review.reviewer?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h4 className="reviewer-name">{review.reviewer?.username || 'Anonymous'}</h4>
            <div className="review-date">
              {new Date(review.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>
        <div className="rating-display">
          <div className="stars">{renderStars(review.rating)}</div>
          <span className="rating-value">{review.rating.toFixed(1)}</span>
        </div>
      </div>
      <div className="review-content">
        <p className="review-comment">{review.comment}</p>
      </div>
    </div>
  );
};

export default ReviewCard;