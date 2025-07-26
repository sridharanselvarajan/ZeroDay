import { ExclamationCircleIcon, MapIcon, PhotographIcon, TagIcon, XIcon } from '@heroicons/react/outline';
import { motion } from 'framer-motion';
import React, { useState, useRef } from 'react';
import api from '../services/api';
import './LostItemForm.css';

const LostItemForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    type: 'lost',
    itemName: '',
    description: '',
    location: '',
    category: '',
    image: null,
  });
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const categories = [
    'Electronics',
    'Accessories',
    'Documents',
    'Clothing',
    'Jewelry',
    'Other'
  ];

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
    setError(null);
  };

  const handleRemoveImage = () => {
    setPreview('');
    setForm(f => ({ ...f, image: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    if (!form.itemName || !form.location || !form.category || !form.description) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => v && data.append(k, v));
    
    try {
      await api.post('/lostfound', data);
      setForm({ type: 'lost', itemName: '', description: '', location: '', category: '', image: null });
      setPreview('');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="form-container"
    >
      <form onSubmit={handleSubmit} className="lost-item-form">
        <h2 className="form-title">
          {form.type === 'lost' ? 'Report Lost Item' : 'Report Found Item'}
        </h2>
        <p className="form-subtitle">Help reunite items with their owners</p>

        {error && (
          <div className="error-message">
            <ExclamationCircleIcon className="icon" />
            <span>{error}</span>
          </div>
        )}

        <div className="radio-group">
          <label className={`radio-option ${form.type === 'lost' ? 'active' : ''}`}>
            <input
              type="radio"
              name="type"
              value="lost"
              checked={form.type === 'lost'}
              onChange={handleChange}
            />
            <span>Lost Item</span>
          </label>
          <label className={`radio-option ${form.type === 'found' ? 'active' : ''}`}>
            <input
              type="radio"
              name="type"
              value="found"
              checked={form.type === 'found'}
              onChange={handleChange}
            />
            <span>Found Item</span>
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="itemName">Item Name*</label>
          <input
            id="itemName"
            className="form-input"
            name="itemName"
            placeholder="e.g. Wallet, Keys, Phone"
            value={form.itemName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location*</label>
          <div className="input-with-icon">
            
            <input
              id="location"
              className="form-input icon-padding"
              name="location"
              placeholder="Where was it lost/found?"
              value={form.location}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="category">Category*</label>
          <div className="input-with-icon">
            
            <select
              id="category"
              className="form-input icon-padding"
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
        </div>

        <div className="form-group">
          <label htmlFor="description">Description*</label>
          <textarea
            id="description"
            className="form-input"
            name="description"
            placeholder="Describe the item in detail (color, brand, distinguishing features)..."
            rows="4"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Upload Image (Optional)</label>
          {preview ? (
            <div className="image-preview-container">
              <div className="image-preview">
                <img src={preview} alt="Preview" />
                <button 
                  type="button" 
                  className="remove-image-button"
                  onClick={handleRemoveImage}
                  aria-label="Remove image"
                >
                  <XIcon className="remove-icon" />
                </button>
              </div>
            </div>
          ) : (
            <label className="file-upload-label">
              <PhotographIcon className="upload-icon" />
              <span>Click to upload an image</span>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                ref={fileInputRef}
                className="file-input"
              />
            </label>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="submit-button"
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              {form.type === 'lost' ? 'Reporting...' : 'Submitting...'}
            </>
          ) : (
            form.type === 'lost' ? 'Report Lost Item' : 'Report Found Item'
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default LostItemForm;