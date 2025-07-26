import React, { useCallback, useContext, useEffect, useState } from 'react';
import PollCard from '../components/PollCard';
import PollResults from '../components/PollResults';
import { AuthContext } from '../context/AuthContext';
import { getPollResults, getPolls, voteOnPoll } from '../services/pollApi';
import './Polls.css';

const Polls = () => {
  const { user } = useContext(AuthContext);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const fetchPolls = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { active: activeTab === 'active' ? 'true' : 'false' };
      const response = await getPolls(params);
      setPolls(response.data.polls);
    } catch (err) {
      setError('Failed to load polls. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchPolls();
  }, [fetchPolls]);

  const handleVote = async (pollId, optionIndex, showResultsOnly = false) => {
    if (showResultsOnly) {
      try {
        const response = await getPollResults(pollId);
        setSelectedPoll(response.data.poll);
        setShowResults(true);
      } catch (err) {
        setError('Failed to load poll results.');
      }
      return;
    }

    try {
      await voteOnPoll(pollId, optionIndex);
      // Refresh polls to update vote counts
      await fetchPolls();
    } catch (err) {
      throw err; // Let PollCard handle the error
    }
  };

  const closeResults = () => {
    setShowResults(false);
    setSelectedPoll(null);
  };

  const activePolls = polls.filter(poll => 
    poll.isActive && (!poll.expiresAt || new Date() < new Date(poll.expiresAt))
  );
  const inactivePolls = polls.filter(poll => 
    !poll.isActive || (poll.expiresAt && new Date() >= new Date(poll.expiresAt))
  );

  return (
    <div className="polls-container">
      <div className="polls-header">
        <div className="polls-title">
          <h1>Polls & Feedback</h1>
          <p>Share your opinion and see what others think</p>
        </div>
        
        <div className="polls-tabs">
          <button
            className={`tab-button ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            <span className="tab-icon">📊</span>
            Active Polls ({activePolls.length})
          </button>
          <button
            className={`tab-button ${activeTab === 'inactive' ? 'active' : ''}`}
            onClick={() => setActiveTab('inactive')}
          >
            <span className="tab-icon">📋</span>
            Past Polls ({inactivePolls.length})
          </button>
        </div>
      </div>

      {error && (
        <div className="error-notification">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading polls...</p>
        </div>
      ) : (
        <div className="polls-content">
          {activeTab === 'active' ? (
            activePolls.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📊</div>
                <h3>No Active Polls</h3>
                <p>There are currently no active polls. Check back later!</p>
              </div>
            ) : (
              <div className="polls-grid">
                {activePolls.map(poll => (
                  <PollCard
                    key={poll._id}
                    poll={poll}
                    onVote={handleVote}
                    showResults={false}
                  />
                ))}
              </div>
            )
          ) : (
            inactivePolls.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No Past Polls</h3>
                <p>No polls have been completed yet.</p>
              </div>
            ) : (
              <div className="polls-grid">
                {inactivePolls.map(poll => (
                  <PollCard
                    key={poll._id}
                    poll={poll}
                    onVote={handleVote}
                    showResults={false}
                  />
                ))}
              </div>
            )
          )}
        </div>
      )}

      {showResults && selectedPoll && (
        <PollResults
          poll={selectedPoll}
          onClose={closeResults}
        />
      )}
    </div>
  );
};

export default Polls;
