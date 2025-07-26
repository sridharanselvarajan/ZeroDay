import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { bookSession, fetchSkill } from '../services/api';
import './SessionBooking.css';

const SessionBooking = () => {
  const { skillId } = useParams();
  const [skill, setSkill] = useState(null);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSkill = async () => {
      try {
        const response = await fetchSkill(skillId);
        setSkill(response.data);
      } catch (err) {
        setError('Failed to load skill details');
      } finally {
        setIsLoading(false);
      }
    };
    loadSkill();
  }, [skillId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!date || !startTime || !endTime) {
      setError('Please fill in all fields');
      return;
    }

    if (startTime >= endTime) {
      setError('End time must be after start time');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await bookSession({ 
        skillId, 
        date, 
        timeSlot: { startTime, endTime } 
      });
      navigate('/mysessions', { 
        state: { bookingSuccess: true } 
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="session-booking-container loading">
        <div className="loading-spinner">Loading skill details...</div>
      </div>
    );
  }

  if (error && !skill) {
    return (
      <div className="session-booking-container error">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="session-booking-container">
      <div className="booking-header">
        <h2>Book a Session</h2>
        <div className="skill-info">
          <span className="skill-title">{skill.title}</span>
          <span className="skill-category">{skill.category}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="time-inputs">
          <div className="form-group">
            <label htmlFor="start-time">Start Time</label>
            <input
              type="time"
              id="start-time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="end-time">End Time</label>
            <input
              type="time"
              id="end-time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Booking...' : 'Confirm Booking'}
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SessionBooking;