import React, { useCallback, useEffect, useState } from 'react';
import TechFeedFilter from '../components/TechFeedFilter';
import TechPostCard from '../components/TechPostCard';
import { getSavedTechPosts, getTechPosts, saveTechPost, unsaveTechPost } from '../services/techFeedApi';
import './TechFeed.css';

const TechFeed = () => {
  const [posts, setPosts] = useState([]);
  const [saved, setSaved] = useState([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [expandedPost, setExpandedPost] = useState(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filter) params.category = filter;
      if (search) params.search = search;
      const res = await getTechPosts(params);
      setPosts(res.data);
    } catch (err) {
      setError('Failed to load posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  const fetchSaved = useCallback(async () => {
    try {
      const res = await getSavedTechPosts();
      setSaved(res.data.map(s => s.postId));
    } catch (err) {
      console.error('Error fetching saved posts:', err);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    fetchSaved();
  }, [fetchPosts, fetchSaved]);

  const handleSave = async (id) => {
    setSaveError('');
    try {
      await saveTechPost(id);
      setSaved(prev => [...prev, id]);
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.message === 'Already saved') {
        setSaveError('This post is already saved.');
      } else {
        setSaveError('Failed to save post. Please try again.');
      }
    }
  };

  const handleUnsave = async (id) => {
    try {
      await unsaveTechPost(id);
      setSaved(prev => prev.filter(postId => postId !== id));
    } catch (err) {
      console.error('Error unsaving post:', err);
    }
  };

  const toggleExpandPost = (id) => {
    setExpandedPost(expandedPost === id ? null : id);
  };

  return (
    <div className="tech-feed-container">
      <div className="tech-feed-header">
        <h1>Tech Opportunities Hub</h1>
        <p>Discover the latest tech news, hackathons, internships and more</p>
      </div>
      
      <TechFeedFilter
        filter={filter}
        setFilter={setFilter}
        search={search}
        setSearch={setSearch}
        onFilter={fetchPosts}
      />

      {saveError && <div className="notification error">{saveError}</div>}
      
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading opportunities...</p>
        </div>
      ) : error ? (
        <div className="notification error">{error}</div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <img src="/images/no-results.svg" alt="No results" />
          <h3>No opportunities found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="tech-feed-grid">
          {posts.map(post => (
            <TechPostCard
              key={post._id}
              post={post}
              onSave={handleSave}
              onUnsave={handleUnsave}
              isSaved={saved.includes(post._id)}
              isExpanded={expandedPost === post._id}
              onToggleExpand={toggleExpandPost}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TechFeed;