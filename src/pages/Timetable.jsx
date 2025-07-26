import React, { useContext, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import TimetableGrid from '../components/TimetableGrid';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import './Timetable.css';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const INITIAL_FORM_STATE = {
  dayOfWeek: 'Monday',
  startTime: '',
  endTime: '',
  subject: '',
  location: '',
  faculty: ''
};

const Timetable = () => {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchEntries = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/timetable');
      setEntries(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch timetable entries:', err);
      setError('Failed to load timetable. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user, fetchEntries]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      if (editingId) {
        await api.put(`/timetable/${editingId}`, form);
      } else {
        await api.post('/timetable', form);
      }
      setForm(INITIAL_FORM_STATE);
      setEditingId(null);
      await fetchEntries();
    } catch (err) {
      console.error('Failed to save timetable entry:', err);
      setError('Failed to save entry. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = entry => {
    setForm(entry);
    setEditingId(entry._id);
  };

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    
    try {
      setIsLoading(true);
      await api.delete(`/timetable/${id}`);
      await fetchEntries();
    } catch (err) {
      console.error('Failed to delete timetable entry:', err);
      setError('Failed to delete entry. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setForm(INITIAL_FORM_STATE);
    setEditingId(null);
  };

  if (!user) {
    return (
      <div className="timetable-container">
        <p className="timetable-login-message">Please login to view your timetable.</p>
      </div>
    );
  }

  return (
    <div className="timetable-container">
      <header className="timetable-header">
        <h1 className="timetable-title">My Timetable</h1>
        {error && <div className="timetable-error">{error}</div>}
      </header>

      <section aria-labelledby="timetable-form-heading">
        <h2 id="timetable-form-heading" className="visually-hidden">
          {editingId ? 'Edit Timetable Entry' : 'Add New Timetable Entry'}
        </h2>
        
        <form onSubmit={handleSubmit} className="timetable-form" noValidate>
          <div className="form-group">
            <label htmlFor="dayOfWeek">Day of Week</label>
            <select
              id="dayOfWeek"
              name="dayOfWeek"
              value={form.dayOfWeek}
              onChange={handleChange}
              required
            >
              {DAYS.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="startTime">Start Time</label>
            <input
              id="startTime"
              name="startTime"
              type="time"
              value={form.startTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="endTime">End Time</label>
            <input
              id="endTime"
              name="endTime"
              type="time"
              value={form.endTime}
              onChange={handleChange}
              required
              min={form.startTime}
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              name="subject"
              placeholder="Subject"
              value={form.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="faculty">Faculty</label>
            <input
              id="faculty"
              name="faculty"
              placeholder="Faculty"
              value={form.faculty}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="timetable-add-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : editingId ? 'Update' : 'Add'}
            </button>
            
            {editingId && (
              <button
                type="button"
                className="timetable-cancel-btn"
                onClick={resetForm}
                disabled={isLoading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section aria-labelledby="timetable-grid-heading">
        <h2 id="timetable-grid-heading" className="visually-hidden">Timetable Grid View</h2>
        <TimetableGrid entries={entries} isLoading={isLoading} />
      </section>

      <section aria-labelledby="timetable-list-heading">
        <h2 id="timetable-list-heading" className="timetable-list-title">
          Timetable Entries
        </h2>
        
        {isLoading && !entries.length ? (
          <div className="timetable-loading">Loading timetable entries...</div>
        ) : entries.length === 0 ? (
          <div className="timetable-empty">No timetable entries found.</div>
        ) : (
          <ul className="timetable-entries-list">
            {entries.map(entry => (
              <li key={entry._id} className="timetable-entry">
                <div className="entry-details">
                  <span className="entry-day">{entry.dayOfWeek}</span>
                  <span className="entry-time">
                    {entry.startTime} - {entry.endTime}
                  </span>
                  <span className="entry-subject">{entry.subject}</span>
                  <span className="entry-location">({entry.location})</span>
                </div>
                
                <div className="entry-actions">
                  <button
                    className="timetable-edit-btn"
                    onClick={() => handleEdit(entry)}
                    disabled={isLoading}
                    aria-label={`Edit ${entry.subject} on ${entry.dayOfWeek}`}
                  >
                    Edit
                  </button>
                  <button
                    className="timetable-delete-btn"
                    onClick={() => handleDelete(entry._id)}
                    disabled={isLoading}
                    aria-label={`Delete ${entry.subject} on ${entry.dayOfWeek}`}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

Timetable.propTypes = {
  // Add prop types if this component receives any props
};

export default Timetable;