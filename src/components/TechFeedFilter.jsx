import React from 'react';
import './TechFeedFilter.css';

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'Tech News', label: 'Tech News' },
  { value: 'Hackathon', label: 'Hackathon' },
  { value: 'Internship', label: 'Internship' },
  { value: 'Workshop', label: 'Workshop' },
  { value: 'Conference', label: 'Conference' },
  { value: 'Scholarship', label: 'Scholarship' }
];

const TechFeedFilter = ({ filter, setFilter, search, setSearch, onFilter }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter();
  };

  return (
    <form className="tech-feed-filter" onSubmit={handleSubmit}>
      <div className="filter-group">
        <select
          className="category-select"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            onFilter();
          }}
        >
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className="search-group">
        <input
          className="search-input"
          type="text"
          placeholder="Search opportunities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onFilter()}
        />
        <button className="search-button" type="submit">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </div>
    </form>
  );
};

export default TechFeedFilter;