import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSkills } from '../services/api';
import './SkillMarketplace.css';

const SkillMarketplace = () => {
  const [skills, setSkills] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const response = await fetchSkills();
        setSkills(response.data);
      } catch (err) {
        setError('Failed to load skills. Please try again later.');
        console.error('Error fetching skills:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadSkills();
  }, []);

  const handleBook = (skillId) => {
    navigate(`/book-session/${skillId}`);
  };

  const handleViewDetails = (skill) => {
    setSelectedSkill(skill);
    setModalOpen(true);
  };

  const filteredSkills = skills.filter(skill =>
    skill.title.toLowerCase().includes(search.toLowerCase()) &&
    (category ? skill.category === category : true)
  );

  const uniqueCategories = [...new Set(skills.map(s => s.category))];

  const renderRatingStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating || 0);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= roundedRating ? 'filled' : ''}`}>
          {i <= roundedRating ? '★' : '☆'}
        </span>
      );
    }
    return <div className="rating-stars">{stars}</div>;
  };

  if (isLoading) {
    return (
      <div className="skill-marketplace-container loading">
        <div className="loading-spinner">Loading skills...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="skill-marketplace-container error">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="skill-marketplace-container">
      <div className="marketplace-header">
        <h1>Skill Exchange Marketplace</h1>
        <p>Find and book sessions with skilled tutors</p>
      </div>

      <div className="action-bar">
        <button 
          className="add-skill-button"
          onClick={() => navigate('/add-skill')}
        >
          + Add Your Skill
        </button>

        <div className="search-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search skills..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <select 
            value={category} 
            onChange={e => setCategory(e.target.value)}
            className="category-filter"
          >
            <option value="">All Categories</option>
            {uniqueCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredSkills.length === 0 ? (
        <div className="no-results">
          No skills found matching your search criteria.
        </div>
      ) : (
        <div className="skill-grid">
          {filteredSkills.map(skill => (
            <div key={skill._id} className="skill-card">
              <div className="skill-content">
                <h3>{skill.title}</h3>
                <span className="skill-category">{skill.category}</span>
                <p className="skill-description">
                  {skill.description.length > 100 
                    ? `${skill.description.substring(0, 100)}...` 
                    : skill.description}
                </p>
                
                <div className="skill-tutor">
                  <div className="tutor-info">
                    <span className="tutor-name">{skill.offeredBy?.username}</span>
                    {skill.offeredBy?.averageRating && (
                      <div className="tutor-rating">
                        {renderRatingStars(skill.offeredBy.averageRating)}
                        <span>({skill.offeredBy.averageRating.toFixed(1)})</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="skill-actions">
                <button 
                  className="book-button"
                  onClick={() => handleBook(skill._id)}
                >
                  Book Session
                </button>
                <button 
                  className="details-button"
                  onClick={() => handleViewDetails(skill)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && selectedSkill && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="skill-modal" onClick={e => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => setModalOpen(false)}
            >
              ×
            </button>
            
            <div className="modal-header">
              <h2>{selectedSkill.title}</h2>
              <span className="modal-category">{selectedSkill.category}</span>
            </div>
            
            <div className="modal-body">
              <p className="modal-description">{selectedSkill.description}</p>
              
              <div className="tutor-section">
                <h3>Offered by</h3>
                <div className="tutor-details">
                  <span className="tutor-name">{selectedSkill.offeredBy?.username}</span>
                  {selectedSkill.offeredBy?.averageRating && (
                    <div className="tutor-rating">
                      {renderRatingStars(selectedSkill.offeredBy.averageRating)}
                      <span>({selectedSkill.offeredBy.averageRating.toFixed(1)})</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="availability-section">
                <h3>Availability</h3>
                {selectedSkill.availability && selectedSkill.availability.length > 0 ? (
                  <ul className="availability-list">
                    {selectedSkill.availability.map((slot, idx) => (
                      <li key={idx}>
                        <span className="day">{slot.day}</span>
                        <span className="time">{slot.startTime} - {slot.endTime}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-availability">No availability listed</p>
                )}
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="modal-book-button"
                onClick={() => {
                  setModalOpen(false);
                  handleBook(selectedSkill._id);
                }}
              >
                Book This Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillMarketplace;