import React, { useCallback, useContext, useEffect, useState } from 'react';
import PollCard from '../components/PollCard';
import PollForm from '../components/PollForm';
import { AuthContext } from '../context/AuthContext';
import { createPoll, deletePoll, getPolls, updatePoll } from '../services/pollApi';
import './PollsAdmin.css';

const PollsAdmin = () => {
  const { user } = useContext(AuthContext);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPoll, setEditingPoll] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('active');

  const fetchPolls = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getPolls();
      setPolls(response.data.polls);
    } catch (err) {
      setError('Failed to load polls. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPolls();
  }, [fetchPolls]);

  const handleCreatePoll = () => {
    setEditingPoll(null);
    setShowForm(true);
  };

  const handleEditPoll = (poll) => {
    setEditingPoll(poll);
    setShowForm(true);
  };

  const handleDeletePoll = async (pollId) => {
    if (!window.confirm('Are you sure you want to delete this poll? This action cannot be undone.')) {
      return;
    }

    try {
      await deletePoll(pollId);
      await fetchPolls();
    } catch (err) {
      setError('Failed to delete poll. Please try again.');
    }
  };

  const handleSubmitPoll = async (pollData) => {
    setSubmitting(true);
    setError('');

    try {
      if (editingPoll) {
        await updatePoll(editingPoll._id, pollData);
      } else {
        await createPoll(pollData);
      }
      
      setShowForm(false);
      setEditingPoll(null);
      await fetchPolls();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save poll. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingPoll(null);
    setError('');
  };

  const activePolls = polls.filter(poll => 
    poll.isActive && (!poll.expiresAt || new Date() < new Date(poll.expiresAt))
  );
  const inactivePolls = polls.filter(poll => 
    !poll.isActive || (poll.expiresAt && new Date() >= new Date(poll.expiresAt))
  );

  return (
    <div className="polls-admin-container">
      <div className="polls-admin-header">
        <div className="polls-admin-title">
          <h1>Manage Polls & Feedback</h1>
          <p>Create and manage interactive polls for student feedback</p>
        </div>
        
        <button 
          className="create-poll-btn"
          onClick={handleCreatePoll}
        >
          <span className="btn-icon">➕</span>
          Create New Poll
        </button>
      </div>

      {error && (
        <div className="error-notification">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="polls-admin-tabs">
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
          Inactive Polls ({inactivePolls.length})
        </button>
      </div>

      {showForm && (
        <div className="form-overlay">
          <PollForm
            poll={editingPoll}
            onSubmit={handleSubmitPoll}
            onCancel={handleCancelForm}
            isSubmitting={submitting}
          />
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading polls...</p>
        </div>
      ) : (
        <div className="polls-admin-content">
          {activeTab === 'active' ? (
            activePolls.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📊</div>
                <h3>No Active Polls</h3>
                <p>Create your first poll to start gathering student feedback!</p>
                <button 
                  className="create-first-poll-btn"
                  onClick={handleCreatePoll}
                >
                  Create Your First Poll
                </button>
              </div>
            ) : (
              <div className="polls-grid">
                {activePolls.map(poll => (
                  <PollCard
                    key={poll._id}
                    poll={poll}
                    showActions={true}
                    onEdit={handleEditPoll}
                    onDelete={handleDeletePoll}
                  />
                ))}
              </div>
            )
          ) : (
            inactivePolls.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No Inactive Polls</h3>
                <p>All polls are currently active.</p>
              </div>
            ) : (
              <div className="polls-grid">
                {inactivePolls.map(poll => (
                  <PollCard
                    key={poll._id}
                    poll={poll}
                    showActions={true}
                    onEdit={handleEditPoll}
                    onDelete={handleDeletePoll}
                  />
                ))}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default PollsAdmin;
