import React from 'react';
import './PollResults.css';

const PollResults = ({ poll, onClose }) => {
  const totalVotes = poll.options.reduce((sum, option) => sum + option.voteCount, 0);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getWinningOption = () => {
    if (totalVotes === 0) return null;
    const maxVotes = Math.max(...poll.options.map(option => option.voteCount));
    return poll.options.find(option => option.voteCount === maxVotes);
  };

  const winningOption = getWinningOption();

  return (
    <div className="poll-results-modal">
      <div className="poll-results-content">
        <div className="results-header">
          <h2>Poll Results</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="poll-info">
          <h3 className="poll-question">{poll.question}</h3>
          <div className="poll-meta">
            <span className="created-by">Created by: {poll.createdBy?.username || 'Admin'}</span>
            <span className="created-date">Created: {formatDate(poll.createdAt)}</span>
            {poll.expiresAt && (
              <span className="expiry-date">Expires: {formatDate(poll.expiresAt)}</span>
            )}
          </div>
        </div>

        <div className="results-summary">
          <div className="total-votes-card">
            <div className="total-votes-number">{totalVotes}</div>
            <div className="total-votes-label">Total Votes</div>
          </div>
          {winningOption && (
            <div className="winning-option-card">
              <div className="winning-label">Most Popular</div>
              <div className="winning-text">{winningOption.text}</div>
              <div className="winning-votes">{winningOption.voteCount} votes</div>
            </div>
          )}
        </div>

        <div className="results-details">
          <h4>Detailed Results</h4>
          <div className="results-list">
            {poll.options.map((option, index) => {
              const percentage = totalVotes > 0 ? Math.round((option.voteCount / totalVotes) * 100) : 0;
              const isUserVote = poll.userVote === index;
              const isWinning = winningOption && option.voteCount === winningOption.voteCount;
              
              return (
                <div key={index} className={`result-item ${isUserVote ? 'user-vote' : ''} ${isWinning ? 'winning' : ''}`}>
                  <div className="result-header">
                    <div className="result-info">
                      <span className="option-text">{option.text}</span>
                      {isUserVote && <span className="user-vote-badge">Your Vote</span>}
                      {isWinning && <span className="winning-badge">🏆</span>}
                    </div>
                    <div className="vote-stats">
                      <span className="vote-count">{option.voteCount} votes</span>
                      <span className="vote-percentage">{percentage}%</span>
                    </div>
                  </div>
                  
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="results-footer">
          <button className="close-results-btn" onClick={onClose}>
            Close Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default PollResults;
