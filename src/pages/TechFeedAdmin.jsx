import React, { useCallback, useEffect, useState } from 'react';
import TechPostCard from '../components/TechPostCard';
import { createTechPost, deleteTechPost, getTechPosts, updateTechPost } from '../services/techFeedApi';
import './TechFeedAdmin.css';

const initialForm = {
  title: '',
  content: '',
  category: '',
  link: '',
  expiresAt: '',
};

const categories = [
  'Tech News',
  'Hackathon',
  'Internship',
  'Workshop',
  'Conference',
  'Scholarship'
];

const TechFeedAdmin = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(initialForm);
  const [editing, setEditing] = useState(null);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [expandedPost, setExpandedPost] = useState(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getTechPosts();
      setPosts(res.data);
    } catch (err) {
      setError('Failed to load posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    
    try {
      if (!form.title || !form.category) {
        throw new Error('Title and category are required');
      }
      
      if (editing) {
        await updateTechPost(editing._id, form);
      } else {
        await createTechPost(form);
      }
      
      setForm(initialForm);
      setEditing(null);
      fetchPosts();
    } catch (err) {
      setFormError(err.message || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (post) => {
    setEditing(post);
    setForm({
      title: post.title,
      content: post.content,
      category: post.category,
      link: post.link || '',
      expiresAt: post.expiresAt ? post.expiresAt.slice(0, 10) : '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await deleteTechPost(id);
      fetchPosts();
    } catch (err) {
      setError('Failed to delete post. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setForm(initialForm);
    setFormError('');
  };

  const toggleExpandPost = (id) => {
    setExpandedPost(expandedPost === id ? null : id);
  };

  return (
    <div className="tech-feed-admin">
      <div className="admin-header">
        <h1>Manage Tech Opportunities</h1>
        <p>Create, edit, and manage tech news and opportunities</p>
      </div>
      
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="title">Title*</label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter post title"
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
          
          <div className="form-group full-width">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Enter post content"
              rows="5"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="link">External Link</label>
            <input
              id="link"
              name="link"
              value={form.link}
              onChange={handleChange}
              placeholder="https://example.com"
              type="url"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="expiresAt">Expiry Date</label>
            <input
              id="expiresAt"
              name="expiresAt"
              value={form.expiresAt}
              onChange={handleChange}
              type="date"
            />
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button"
            disabled={submitting}
          >
            {submitting ? (
              <span className="button-spinner"></span>
            ) : editing ? (
              'Update Post'
            ) : (
              'Create Post'
            )}
          </button>
          
          {editing && (
            <button 
              type="button" 
              className="cancel-button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
        </div>
        
        {formError && (
          <div className="form-error">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {formError}
          </div>
        )}
      </form>
      
      <div className="posts-section">
        <h2>Current Opportunities</h2>
        
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading posts...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p>No posts found</p>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map(post => (
              <TechPostCard
                key={post._id}
                post={post}
                onSave={() => {}} // Empty function since admin doesn't need save functionality
                onUnsave={() => {}} // Empty function since admin doesn't need unsave functionality
                isSaved={false} // Admin doesn't need saved state
                isExpanded={expandedPost === post._id}
                onToggleExpand={toggleExpandPost}
                showActions={true}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TechFeedAdmin;