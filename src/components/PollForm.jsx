import React, { useEffect, useState } from 'react';
import './PollForm.css';

const PollForm = ({ poll = null, onSubmit, onCancel, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    question: '',
    options: ['', ''],
    expiresAt: '',
    isActive: true
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (poll) {
      setFormData({
        question: poll.question || '',
        options: poll.options?.map(opt => opt.text) || ['', ''],
        expiresAt: poll.expiresAt ? new Date(poll.expiresAt).toISOString().slice(0, 16) : '',
        isActive: poll.isActive !== undefined ? poll.isActive : true
      });
    }
  }, [poll]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.question.trim()) {
      newErrors.question = 'Question is required';
    }

    const validOptions = formData.options.filter(option => option.trim());
    if (validOptions.length < 2) {
      newErrors.options = 'At least 2 options are required';
    }

    if (formData.expiresAt && new Date(formData.expiresAt) <= new Date()) {
      newErrors.expiresAt = 'Expiry date must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const validOptions = formData.options.filter(option => option.trim());
    onSubmit({
      question: formData.question.trim(),
      options: validOptions,
      expiresAt: formData.expiresAt || null,
      isActive: formData.isActive
    });
  };

  const addOption = () => {
    if (formData.options.length < 10) {
      setFormData(prev => ({
        ...prev,
        options: [...prev.options, '']
      }));
    }
  };

  const removeOption = (index) => {
    if (formData.options.length > 2) {
      setFormData(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const updateOption = (index, value) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((option, i) => i === index ? value : option)
    }));
  };

  return (
    <form className="poll-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h3>{poll ? 'Edit Poll' : 'Create New Poll'}</h3>
        <p>Create an interactive poll to gather feedback from students</p>
      </div>

      <div className="form-group">
        <label htmlFor="question">Question *</label>
        <textarea
          id="question"
          value={formData.question}
          onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
          placeholder="Enter your poll question..."
          rows="3"
          className={errors.question ? 'error' : ''}
        />
        {errors.question && <span className="error-message">{errors.question}</span>}
      </div>

      <div className="form-group">
        <label>Options *</label>
        <div className="options-container">
          {formData.options.map((option, index) => (
            <div key={index} className="option-input-group">
              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className={errors.options ? 'error' : ''}
              />
              {formData.options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="remove-option-btn"
                  title="Remove option"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        {errors.options && <span className="error-message">{errors.options}</span>}
        
        {formData.options.length < 10 && (
          <button
            type="button"
            onClick={addOption}
            className="add-option-btn"
          >
            + Add Option
          </button>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="expiresAt">Expiry Date (Optional)</label>
          <input
            type="datetime-local"
            id="expiresAt"
            value={formData.expiresAt}
            onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
            className={errors.expiresAt ? 'error' : ''}
          />
          {errors.expiresAt && <span className="error-message">{errors.expiresAt}</span>}
        </div>

        <div className="form-group checkbox-group">
  <label className="checkbox-container">
    <input
      type="checkbox"
      className="checkbox-input"
      checked={formData.isActive}
      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
    />
    <span className="checkbox-custom"></span>
    <span className={`checkbox-label ${formData.isActive ? 'active-label' : ''}`}>
      Active Poll
    </span>
  </label>
  <p className="checkbox-help-text">Inactive polls won't accept new votes</p>
</div>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              {poll ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            poll ? 'Update Poll' : 'Create Poll'
          )}
        </button>
        
        <button
          type="button"
          onClick={onCancel}
          className="cancel-btn"
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default PollForm;
