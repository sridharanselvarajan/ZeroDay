import React from 'react';
import './SessionCard.css';

const SessionCard = ({ session, onStatusChange, onReview }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'Confirmed':
        return '#3b82f6'; // blue
      case 'Completed':
        return '#10b981'; // green
      case 'Cancelled':
        return '#ef4444'; // red
      case 'Pending':
        return '#f59e0b'; // amber
      default:
        return '#6b7280'; // gray
    }
  };

  return (
    <div className="session-card">
      <div className="session-header">
        <h3 className="session-title">{session.skill?.title || 'Skill Session'}</h3>
        <span 
          className="session-status" 
          style={{ backgroundColor: getStatusColor(session.status) }}
        >
          {session.status}
        </span>
      </div>

      <div className="session-details">
        <div className="detail-row">
          <span className="detail-label">Tutor:</span>
          <span className="detail-value with-avatar">
            <span className="user-avatar small">
              {session.tutor?.username?.charAt(0).toUpperCase() || 'T'}
            </span>
            {session.tutor?.username || 'Not assigned'}
          </span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">Learner:</span>
          <span className="detail-value with-avatar">
            <span className="user-avatar small">
              {session.learner?.username?.charAt(0).toUpperCase() || 'L'}
            </span>
            {session.learner?.username || 'Not assigned'}
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Date:</span>
          <span className="detail-value">
            {new Date(session.date).toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Time:</span>
          <span className="detail-value">
            {session.timeSlot?.startTime} - {session.timeSlot?.endTime}
          </span>
        </div>
      </div>

      {session.status !== 'Completed' && onStatusChange && (
        <div className="session-actions">
          {session.status === 'Pending' && (
            <button 
              className="action-button confirm"
              onClick={() => onStatusChange(session._id, 'Confirmed')}
            >
              Confirm Session
            </button>
          )}
          <button 
            className="action-button complete"
            onClick={() => onStatusChange(session._id, 'Completed')}
          >
            Mark Complete
          </button>
          <button 
            className="action-button cancel"
            onClick={() => onStatusChange(session._id, 'Cancelled')}
          >
            Cancel Session
          </button>
        </div>
      )}

      {session.status === 'Completed' && !session.feedbackGiven && onReview && (
        <div className="session-actions">
          <button 
            className="action-button review"
            onClick={() => onReview(session._id)}
          >
            Leave Review
          </button>
        </div>
      )}
    </div>
  );
};

export default SessionCard;