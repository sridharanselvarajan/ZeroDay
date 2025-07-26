import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { fetchMySessions, updateSessionStatus } from '../services/api';
import './MySessions.css';

const MySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const getId = (obj) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    if (typeof obj === 'object' && obj._id) return obj._id;
    return '';
  };

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const response = await fetchMySessions();
        setSessions(response.data);
      } catch (err) {
        console.error('Failed to fetch sessions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadSessions();
    }
  }, [user]);

  const handleStatusChange = async (id, status) => {
    try {
      await updateSessionStatus(id, status);
      const res = await fetchMySessions();
      setSessions(res.data);
    } catch (error) {
      console.error('Error updating session status:', error);
    }
  };

  const handleReview = (sessionId) => {
    navigate('/review', { state: { sessionId } });
  };

  if (!user) {
    return (
      <div className="my-sessions-container">
        <div className="no-sessions">Loading user data...</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="my-sessions-container">
        <div className="no-sessions">Loading sessions...</div>
      </div>
    );
  }

  const tutorSessions = sessions.filter(
    (session) => getId(session.tutor)?.toString() === user._id?.toString()
  );

  const learnerSessions = sessions.filter(
    (session) => getId(session.learner)?.toString() === user._id?.toString()
  );

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    return hour > 12 ? `${hour - 12}:${minutes} PM` : `${hour}:${minutes} AM`;
  };

  return (
    <div className="my-sessions-container">
      <h2>My Tutoring Sessions</h2>

      {/* Tutor Section */}
      <div className="sessions-section">
        <h3>As Tutor</h3>
        {tutorSessions.length === 0 ? (
          <div className="no-sessions">No tutoring sessions scheduled</div>
        ) : (
          tutorSessions.map((session) => (
            <div key={session._id} className="session-card">
              <h4>Skill: {session.skill?.title || 'N/A'}</h4>
              <p><b>Learner:</b> {session.learner?.username || 'Unknown'}</p>
              <p><b>Date:</b> {new Date(session.date).toLocaleDateString('en-US', { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}</p>
              <p><b>Time:</b> {formatTime(session.timeSlot?.startTime)} - {formatTime(session.timeSlot?.endTime)}</p>
              <p><b title="Status" data-status={session.status}>Status:</b> {session.status}</p>

              {session.status === 'Pending' && (
                <div className="session-actions">
                  <button onClick={() => handleStatusChange(session._id, 'Confirmed')}>
                    Confirm Session
                  </button>
                  <button onClick={() => handleStatusChange(session._id, 'Cancelled')}>
                    Decline Session
                  </button>
                </div>
              )}

              {session.status === 'Confirmed' && (
                <div className="session-actions">
                  <button onClick={() => handleStatusChange(session._id, 'Completed')}>
                    Mark as Completed
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Learner Section */}
      <div className="sessions-section">
        <h3>As Learner</h3>
        {learnerSessions.length === 0 ? (
          <div className="no-sessions">No learning sessions scheduled</div>
        ) : (
          learnerSessions.map((session) => (
            <div key={session._id} className="session-card">
              <h4>Skill: {session.skill?.title || 'N/A'}</h4>
              <p><b>Tutor:</b> {session.tutor?.username || 'Unknown'}</p>
              <p><b>Date:</b> {new Date(session.date).toLocaleDateString('en-US', { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}</p>
              <p><b>Time:</b> {formatTime(session.timeSlot?.startTime)} - {formatTime(session.timeSlot?.endTime)}</p>
              <p><b title="Status" data-status={session.status}>Status:</b> {session.status}</p>

              {session.status === 'Completed' && !session.feedbackGiven && (
                <div className="session-actions">
                  <button onClick={() => handleReview(session._id)}>
                    Leave Review
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MySessions;