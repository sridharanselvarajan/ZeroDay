import React from 'react';
import './TechPostCard.css';

const categoryIcons = {
  'Tech News': '📰',
  'Hackathon': '⚔️',
  'Internship': '💼',
  'Workshop': '🔧',
  'Conference': '🎤',
  'Scholarship': '🎓'
};

const TechPostCard = ({ 
  post, 
  onSave, 
  onUnsave, 
  isSaved, 
  isExpanded, 
  onToggleExpand,
  showActions,
  onEdit,
  onDelete
}) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSaveClick = (e) => {
    e.stopPropagation();
    onSave(post._id);
  };

  const handleUnsaveClick = (e) => {
    e.stopPropagation();
    onUnsave(post._id);
  };

  return (
    <div 
      className={`tech-post-card ${isExpanded ? 'expanded' : ''}`}
      onClick={() => onToggleExpand(post._id)}
    >
      <div className="post-header">
        <div className="category-tag">
          <span className="category-icon">{categoryIcons[post.category] || '📌'}</span>
          <span className="category-label">{post.category}</span>
        </div>
        <span className="post-date">{formatDate(post.createdAt)}</span>
      </div>
      
      <h3 className="post-title">{post.title}</h3>
      
      <div className={`post-content ${isExpanded ? 'expanded' : ''}`}>
        <p>{post.content}</p>
        {post.link && (
          <a 
            href={post.link} 
            className="post-link" 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            Learn More ↗
          </a>
        )}
      </div>
      
      <div className="post-footer">
        {isSaved ? (
          <button 
            className="saved-button"
            onClick={handleUnsaveClick}
          >
            <span className="icon">✓</span> Saved
          </button>
        ) : (
          <button 
            className="save-button"
            onClick={handleSaveClick}
          >
            <span className="icon">+</span> Save
          </button>
        )}
        
        {showActions && (
          <div className="admin-actions">
            <button 
              className="edit-button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(post);
              }}
              title="Edit post"
            >
              ✏️
            </button>
            <button 
              className="delete-button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(post._id);
              }}
              title="Delete post"
            >
              🗑️
            </button>
          </div>
        )}
        
        <button 
          className="expand-button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand(post._id);
          }}
        >
          {isExpanded ? 'Show Less' : 'Read More'}
          <span className="arrow-icon">
            {isExpanded ? '↑' : '↓'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default TechPostCard;