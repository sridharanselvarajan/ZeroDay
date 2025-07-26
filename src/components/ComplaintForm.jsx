import React, { useState } from 'react';
import api from '../services/api';
import './ComplaintForm.css';

const ComplaintForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    complaintTitle: '',
    description: '',
    category: '',
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');

  const handleChange = e => {
    const { name, value, files } = e.target;
    
    if (name === 'image' && files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(files[0]);
      setForm(f => ({ ...f, [name]: files[0] }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    if (!form.complaintTitle || !form.description || !form.category) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => v && data.append(k, v));
    
    try {
      await api.post('/complaints', data);
      setForm({ complaintTitle: '', description: '', category: '', image: null });
      setPreview('');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting complaint');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Water Issue',
    'Electricity Problem',
    'Road Maintenance',
    'Sanitation',
    'Noise Complaint',
    'Other'
  ];

  return (
    <div className="complaint-form-container">
      <form onSubmit={handleSubmit} className="complaint-form">
        <h2 className="form-title">File a Complaint</h2>
        <p className="form-subtitle">Help us improve your community</p>
        
        <div className="form-group">
          <label htmlFor="complaintTitle">Title*</label>
          <input
            id="complaintTitle"
            name="complaintTitle"
            placeholder="Brief complaint title"
            value={form.complaintTitle}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category*</label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description*</label>
          <textarea
            id="description"
            name="description"
            placeholder="Describe your complaint in detail..."
            value={form.description}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Upload Image (Optional)</label>
          <div className="file-upload">
            <label htmlFor="image" className="file-label">
              {preview ? (
                <div className="image-preview">
                  <img src={preview} alt="Preview" />
                  <button 
                    type="button" 
                    className="remove-image"
                    onClick={() => {
                      setPreview('');
                      setForm(f => ({ ...f, image: null }));
                    }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                    <line x1="16" y1="5" x2="22" y2="5"></line>
                    <line x1="19" y1="2" x2="19" y2="8"></line>
                    <circle cx="9" cy="9" r="2"></circle>
                    <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                  </svg>
                  <span>Choose an image</span>
                </>
              )}
            </label>
            <input 
              id="image"
              type="file" 
              name="image" 
              accept="image/*" 
              onChange={handleChange}
              className="file-input"
            />
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button className="submit-button" type="submit" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner"></span>
              Submitting...
            </>
          ) : (
            'Submit Complaint'
          )}
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;