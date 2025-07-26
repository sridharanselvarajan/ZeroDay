import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { fetchMyReviews, fetchMySkills } from '../services/api';
import './Profile.css';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [mySkills, setMySkills] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user._id) {
      setIsLoading(true);
      Promise.all([fetchMySkills(), fetchMyReviews()])
        .then(([skillsRes, reviewsRes]) => {
          setMySkills(skillsRes.data);
          setReviews(reviewsRes.data);
          setError(null);
        })
        .catch(err => {
          setError('Failed to load profile data. Please try again later.');
          setMySkills([]);
          setReviews([]);
        })
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  // Calculate average rating from reviews
  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  };

  const averageRating = calculateAverageRating();

  const renderRatingStars = (rating) => {
    return (
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((i) => (
          <span 
            key={i} 
            className={`star ${i <= rating ? 'filled' : ''}`}
            aria-hidden="true"
          >
            {i <= rating ? '★' : '☆'}
          </span>
        ))}
        <span className="sr-only">Rating: {rating} out of 5 stars</span>
      </div>
    );
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error-message">
          <svg className="error-icon" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <header className="profile-header">
        <h1>My Profile</h1>
        <div className="profile-avatar">
          {user.username.charAt(0).toUpperCase()}
        </div>
      </header>
      
      <div className="profile-card">
        <div className="profile-info">
          <div className="info-item">
            <span className="info-label">Username</span>
            <span className="info-value">{user.username}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email</span>
            <span className="info-value">{user.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Average Rating</span>
            <div className="info-value">
              {averageRating > 0 ? (
                <div className="rating-container">
                  {renderRatingStars(Math.round(averageRating))}
                  <span className="rating-text">
                    {averageRating.toFixed(1)}/5.0
                  </span>
                </div>
              ) : (
                <span className="no-rating">Not rated yet</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <section className="profile-section">
        <h2 className="profile-section-title">
          <svg className="section-icon" viewBox="0 0 24 24">
            <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
            <path d="M14 17H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
          Skills Offered
        </h2>
        {mySkills.length > 0 ? (
          <ul className="skills-list">
            {mySkills.map(skill => (
              <li key={skill._id} className="skill-item">
                <div className="skill-content">
                  <span className="skill-title">{skill.title}</span>
                  <span className="skill-category">{skill.category}</span>
                </div>
                <div className="skill-level">
                  <div className="level-bar" style={{ width: `${(skill.level || 5) * 20}%` }}></div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            <svg className="empty-icon" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <p>No skills added yet</p>
          </div>
        )}
      </section>

      <section className="profile-section">
        <h2 className="profile-section-title">
          <svg className="section-icon" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
          Reviews Received
        </h2>
        {reviews.length > 0 ? (
          <ul className="reviews-list">
            {reviews.map(review => (
              <li key={review._id} className="review-item">
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">
                      {review.reviewer?.username?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <span className="reviewer-name">
                      {review.reviewer?.username || 'Anonymous'}
                    </span>
                  </div>
                  <div className="review-meta">
                    {renderRatingStars(review.rating)}
                    <span className="rating-date">
                      {review.createdAt ? 
                        new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : 
                        'Date not available'
                      }
                    </span>
                  </div>
                </div>
                <div className="review-comment">
                  {review.comment || 'No comment provided'}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            <svg className="empty-icon" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <p>No reviews yet</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;