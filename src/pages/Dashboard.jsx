import { motion } from 'framer-motion';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { getPolls } from '../services/pollApi';
import { getSavedTechPosts, getTechPosts } from '../services/techFeedApi';
import './Dashboard.css';

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10
    }
  },
  hover: {
    y: -5,
    scale: 1.02,
    transition: { duration: 0.2 }
  }
};

const welcomeText = {
  hidden: { opacity: 0, x: -20 },
  show: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const roleBadge = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { 
    opacity: 1, 
    scale: 1,
    transition: {
      delay: 0.2,
      type: 'spring',
      stiffness: 200
    }
  }
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ 
    announcements: 0, 
    complaints: 0, 
    lostfound: 0,
    techPosts: 0,
    savedPosts: 0,
    activePolls: 0,
    totalPolls: 0
  });

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    
    const fetchData = async () => {
      try {
        console.log('Fetching dashboard data for user:', user.role);
        
        const [
          annRes,
          compRes, 
          lostRes,
          techRes
        ] = await Promise.all([
          api.get('/announcements'),
          user.role === 'admin' ? api.get('/complaints/all') : api.get('/complaints/my'),
          user.role === 'admin' ? api.get('/lostfound') : api.get('/lostfound/my'),
          getTechPosts()
        ]);

        // Handle polls separately with error handling
        let pollsData = [];
        try {
          const pollsRes = await getPolls();
          pollsData = pollsRes.data || [];
          console.log('Polls data:', pollsData);
        } catch (pollsError) {
          console.log('Polls API error:', pollsError.message);
          pollsData = [];
        }

        console.log('API Responses:', {
          announcements: annRes.data.length,
          complaints: compRes.data.length,
          lostfound: lostRes.data.length,
          techPosts: techRes.data.length,
          polls: pollsData.length
        });

        let savedPostsCount = 0;
        if (user.role === 'student') {
          try {
            const savedRes = await getSavedTechPosts();
            savedPostsCount = savedRes.data.length;
            console.log('Saved posts count:', savedPostsCount);
          } catch (err) {
            console.log('No saved posts or error:', err.message);
            savedPostsCount = 0;
          }
        }

        const activePolls = Array.isArray(pollsData) ? pollsData.filter(poll => poll.isActive).length : 0;
        console.log('Active polls count:', activePolls);

        const newStats = {
          announcements: annRes.data.length,
          complaints: compRes.data.length,
          lostfound: lostRes.data.length,
          techPosts: techRes.data.length,
          savedPosts: savedPostsCount,
          activePolls: activePolls,
          totalPolls: pollsData.length
        };

        console.log('Setting stats:', newStats);
        setStats(newStats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set default values on error
        setStats({
          announcements: 0,
          complaints: 0,
          lostfound: 0,
          techPosts: 0,
          savedPosts: 0,
          activePolls: 0,
          totalPolls: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (!user) return (
    <motion.div 
      className="dashboard-container text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      Please login to view your dashboard.
    </motion.div>
  );

  return (
    <div className="dashboard-container">
      <motion.div
        initial="hidden"
        animate="show"
        className="welcome-message"
      >
        <motion.h2 
          className="welcome-message"
          variants={welcomeText}
        >
          Welcome, {user.username}!
        </motion.h2>
        
        <motion.div 
          // className="role-badge"
          variants={roleBadge}
        >
          Role: <span>{user.role}</span>
        </motion.div>
      </motion.div>

      {/* Quick Stats Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="stats-grid"
      >
        <motion.div variants={item} className="stat-card">
          <div className="stat-icon stat-icon-blue">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{loading ? '...' : stats.announcements || 0}</h3>
            <p className="stat-label">Announcements</p>
          </div>
        </motion.div>

        <motion.div variants={item} className="stat-card">
          <div className="stat-icon stat-icon-green">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{loading ? '...' : stats.complaints || 0}</h3>
            <p className="stat-label">Complaints</p>
          </div>
        </motion.div>

        <motion.div variants={item} className="stat-card">
          <div className="stat-icon stat-icon-purple">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{loading ? '...' : stats.techPosts || 0}</h3>
            <p className="stat-label">Tech Posts</p>
          </div>
        </motion.div>

        <motion.div variants={item} className="stat-card">
          <div className="stat-icon stat-icon-orange">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{loading ? '...' : stats.activePolls || 0}</h3>
            <p className="stat-label">Active Polls</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Quick Access Links */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="dashboard-links"
      >
        <motion.div variants={item}>
          <Link 
            to="/announcements" 
            className="dashboard-link"
            whileHover="hover"
          >
            📢 Announcements
          </Link>
        </motion.div>

        <motion.div variants={item}>
          <Link 
            to="/lostandfound" 
            className="dashboard-link"
            whileHover="hover"
          >
            🔍 Lost &amp; Found
          </Link>
        </motion.div>

        <motion.div variants={item}>
          <Link 
            to="/techfeed" 
            className="dashboard-link"
            whileHover="hover"
          >
            📰 Tech Feed
          </Link>
        </motion.div>

        <motion.div variants={item}>
          <Link 
            to="/polls" 
            className="dashboard-link"
            whileHover="hover"
          >
            📊 Polls &amp; Feedback
          </Link>
        </motion.div>

        {user.role === 'student' && (
          <motion.div variants={item}>
            <Link 
              to="/timetable" 
              className="dashboard-link"
              whileHover="hover"
            >
              📅 Timetable
            </Link>
          </motion.div>
        )}

        <motion.div variants={item}>
          <Link 
            to="/complaints" 
            className="dashboard-link"
            whileHover="hover"
          >
            📝 Complaints
          </Link>
        </motion.div>

        {user.role === 'admin' && (
          <>
            <motion.div variants={item}>
              <Link 
                to="/techfeed/admin" 
                className="dashboard-link dashboard-link-admin"
                whileHover="hover"
              >
                🛠️ Manage Tech Feed
              </Link>
            </motion.div>
            <motion.div variants={item}>
              <Link 
                to="/polls/admin" 
                className="dashboard-link dashboard-link-admin"
                whileHover="hover"
              >
                📊 Manage Polls
              </Link>
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Recent Activity Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="recent-activity"
      >
        <h3 className="recent-activity-title">Recent Activity</h3>
        <div className="recent-activity-list">
          <div className="recent-activity-item">
            <div className="recent-activity-icon recent-activity-icon-blue">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="recent-activity-text">
                {loading ? 'Loading...' : `${stats.announcements} announcements available`}
              </p>
              <p className="recent-activity-time">{loading ? '' : 'Updated just now'}</p>
            </div>
          </div>

          <div className="recent-activity-item">
            <div className="recent-activity-icon recent-activity-icon-green">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="recent-activity-text">
                {loading ? 'Loading...' : `${stats.complaints} complaints ${user.role === 'admin' ? 'to review' : 'submitted'}`}
              </p>
              <p className="recent-activity-time">{loading ? '' : 'Updated just now'}</p>
            </div>
          </div>

          <div className="recent-activity-item">
            <div className="recent-activity-icon recent-activity-icon-purple">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="recent-activity-text">
                {loading ? 'Loading...' : `${stats.techPosts} tech posts available`}
                {user.role === 'student' && stats.savedPosts > 0 && ` (${stats.savedPosts} saved)`}
              </p>
              <p className="recent-activity-time">{loading ? '' : 'Updated just now'}</p>
            </div>
          </div>

          <div className="recent-activity-item">
            <div className="recent-activity-icon recent-activity-icon-orange">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="recent-activity-text">
                {loading ? 'Loading...' : `${stats.activePolls} active polls available`}
              </p>
              <p className="recent-activity-time">{loading ? '' : 'Updated just now'}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;