import React from 'react';
import './SkillCard.css';

const SkillCard = ({ skill, onBook, onEdit, onDelete, showActions, isOwner }) => {
  const renderRatingStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5
    
    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) {
        stars.push(<span key={i} className="star full">★</span>);
      } else if (i - 0.5 === roundedRating) {
        stars.push(<span key={i} className="star half">★</span>);
      } else {
        stars.push(<span key={i} className="star empty">★</span>);
      }
    }
    
    return (
      <div className="rating-stars">
        {stars}
        <span className="rating-value">{rating?.toFixed(1) || 'N/A'}</span>
      </div>
    );
  };

  return (
    <div className="skill-card">
      <div className="skill-card-header">
        <h3 className="skill-title">{skill.title}</h3>
        <span className="skill-category">{skill.category}</span>
      </div>
      
      <p className="skill-description">
        {skill.description.length > 120 
          ? `${skill.description.substring(0, 120)}...` 
          : skill.description}
      </p>
      
      <div className="skill-offered-by">
        <div className="user-info">
          <div className="user-avatar">
            {skill.offeredBy?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="user-details">
            <span className="username">{skill.offeredBy?.username || 'Unknown'}</span>
            {renderRatingStars(skill.offeredBy?.averageRating)}
          </div>
        </div>
      </div>
      
      {showActions && (
        <div className="skill-card-actions">
          {onBook && (
            <button 
              className="action-button book"
              onClick={() => onBook(skill._id)}
            >
              Book Session
            </button>
          )}
          {isOwner && (
            <>
              {onEdit && (
                <button 
                  className="action-button edit"
                  onClick={() => onEdit(skill._id)}
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button 
                  className="action-button delete"
                  onClick={() => onDelete(skill._id)}
                >
                  Delete
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SkillCard;