import React, { useState } from 'react';
import './PollCard.css';

const PollCard = ({ poll, onVote, showResults = false, showActions = false, onEdit, onDelete }) => {
  const [selectedOption, setSelectedOption] = useState(poll.userVote !== null ? poll.userVote : null);
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState('');

  const handleVote = async () => {
    if (selectedOption === null) {
      setError('Please select an option');
      return;
    }

    setIsVoting(true);
    setError('');

    try {
      await onVote(poll._id, selectedOption);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to vote');
    } finally {
      setIsVoting(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isExpired = poll.expiresAt && new Date() > new Date(poll.expiresAt);
  const totalVotes = poll.options.reduce((sum, option) => sum + option.voteCount, 0);

  return (
    <div className={`poll-card ${isExpired ? 'expired' : ''} ${poll.hasVoted ? 'voted' : ''}`}>
      <div className="poll-header">
        <div className="poll-status">
          {isExpired ? (
            <span className="status-badge expired">Expired</span>
          ) : !poll.isActive ? (
            <span className="status-badge inactive">Inactive</span>
          ) : (
            <span className="status-badge active">Active</span>
          )}
        </div>
        <div className="poll-meta">
          <span className="poll-date">{formatDate(poll.createdAt)}</span>
          {poll.expiresAt && (
            <span className="poll-expiry">
              Expires: {formatDate(poll.expiresAt)}
            </span>
          )}
        </div>
      </div>

      <h3 className="poll-question">{poll.question}</h3>

      {showResults ? (
        <div className="poll-results">
          {poll.options.map((option, index) => {
            const percentage = totalVotes > 0 ? Math.round((option.voteCount / totalVotes) * 100) : 0;
            const isUserVote = poll.userVote === index;
            
            return (
              <div key={index} className={`result-option ${isUserVote ? 'user-vote' : ''}`}>
                <div className="result-header">
                  <span className="option-text">{option.text}</span>
                  <span className="vote-count">{option.voteCount} votes ({percentage}%)</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
          <div className="total-votes">Total votes: {totalVotes}</div>
        </div>
      ) : (
        <div className="poll-options">
          {poll.options.map((option, index) => (
            <label key={index} className="option-label">
              <input
                type="radio"
                name={`poll-${poll._id}`}
                value={index}
                checked={selectedOption === index}
                onChange={() => setSelectedOption(index)}
                disabled={poll.hasVoted || isExpired || !poll.isActive}
              />
              <span className="option-text">{option.text}</span>
              {poll.hasVoted && poll.userVote === index && (
                <span className="voted-indicator">✓ Your vote</span>
              )}
            </label>
          ))}
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <div className="poll-footer">
        {!showResults && !poll.hasVoted && !isExpired && poll.isActive && (
          <button 
            className="vote-button"
            onClick={handleVote}
            disabled={isVoting || selectedOption === null}
          >
            {isVoting ? 'Voting...' : 'Submit Vote'}
          </button>
        )}

        {poll.hasVoted && !showResults && (
          <button 
            className="view-results-button"
            onClick={() => onVote(poll._id, null, true)}
          >
            View Results
          </button>
        )}

        {showActions && (
          <div className="admin-actions">
            <button 
              className="edit-button"
              onClick={() => onEdit(poll)}
              title="Edit poll"
            >
              ✏️
            </button>
            <button 
              className="delete-button"
              onClick={() => onDelete(poll._id)}
              title="Delete poll"
            >
              🗑️
            </button>
          </div>
        )}

        <div className="poll-info">
          <span className="created-by">By: {poll.createdBy?.username || 'Admin'}</span>
        </div>
      </div>
    </div>
  );
};

export default PollCard;
