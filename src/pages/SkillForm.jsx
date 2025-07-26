import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createSkill, fetchSkill, updateSkill } from '../services/api';
import './SkillForm.css';

const SkillForm = () => {
  const [form, setForm] = useState({ 
    title: '', 
    category: '', 
    description: '', 
    availability: [] 
  });
  const [availability, setAvailability] = useState([{ day: '', startTime: '', endTime: '' }]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetchSkill(id)
        .then(res => {
          setForm(res.data);
          setAvailability(res.data.availability || [{ day: '', startTime: '', endTime: '' }]);
        })
        .catch(err => {
          setError('Failed to load skill data');
          console.error(err);
        })
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleAvailChange = (idx, e) => {
    const newAvail = [...availability];
    newAvail[idx][e.target.name] = e.target.value;
    setAvailability(newAvail);
  };

  const addAvail = () => {
    setAvailability([...availability, { day: '', startTime: '', endTime: '' }]);
  };

  const removeAvail = idx => {
    if (availability.length > 1) {
      setAvailability(availability.filter((_, i) => i !== idx));
    } else {
      setError('At least one availability slot is required');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    if (!form.title || !form.category) {
      setError('Title and category are required');
      return;
    }

    if (availability.some(slot => !slot.day || !slot.startTime || !slot.endTime)) {
      setError('Please fill all availability fields');
      return;
    }

    setIsLoading(true);
    try {
      const data = { ...form, availability };
      if (id) {
        await updateSkill(id, data);
      } else {
        await createSkill(data);
      }
      navigate('/skills', { state: { success: true } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save skill');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="skill-form-container loading">
        <div className="loading-spinner">{id ? 'Loading skill...' : 'Creating skill...'}</div>
      </div>
    );
  }

  return (
    <div className="skill-form-container">
      <div className="form-header">
        <h2>{id ? 'Edit Skill' : 'Add New Skill'}</h2>
        <p>{id ? 'Update your skill details' : 'Share your expertise with others'}</p>
      </div>

      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit} className="skill-form">
        <div className="form-group">
          <label htmlFor="title">Skill Title</label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g., JavaScript Programming"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="e.g., Web Development"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe what you'll teach..."
            rows="4"
          />
        </div>

        <div className="availability-section">
          <h3>Availability</h3>
          <p>Add your available time slots</p>
          
          {availability.map((slot, idx) => (
            <div key={idx} className="availability-slot">
              <div className="slot-row">
                <div className="form-group">
                  <label htmlFor={`day-${idx}`}>Day</label>
                  <select
                    id={`day-${idx}`}
                    name="day"
                    value={slot.day}
                    onChange={e => handleAvailChange(idx, e)}
                    required
                  >
                    <option value="">Select Day</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor={`startTime-${idx}`}>Start Time</label>
                  <input
                    id={`startTime-${idx}`}
                    name="startTime"
                    type="time"
                    value={slot.startTime}
                    onChange={e => handleAvailChange(idx, e)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`endTime-${idx}`}>End Time</label>
                  <input
                    id={`endTime-${idx}`}
                    name="endTime"
                    type="time"
                    value={slot.endTime}
                    onChange={e => handleAvailChange(idx, e)}
                    required
                  />
                </div>
              </div>

              <button
                type="button"
                className="remove-button"
                onClick={() => removeAvail(idx)}
                disabled={availability.length <= 1}
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            className="add-button"
            onClick={addAvail}
          >
            Add Time Slot
          </button>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? (id ? 'Updating...' : 'Creating...') : (id ? 'Update Skill' : 'Create Skill')}
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate('/skills')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SkillForm;