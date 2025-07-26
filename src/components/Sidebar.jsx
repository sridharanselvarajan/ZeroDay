import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Link to="/" className="sidebar-logo-link">
            <span className="logo-icon">🏫</span>
            <span className="logo-text">CampusLink</span>
          </Link>
        </div>
        <div className="sidebar-user">
          {user && (
            <div className="user-info">
              <div className="user-avatar">
                {user.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="user-details">
                <span className="username">{user.username}</span>
                <span className="user-role">{user.role}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <nav className="sidebar-nav">
        {user ? (
          <ul>
            <li>
              <Link 
                to="/dashboard" 
                className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
              >
                <span className="nav-icon">📊</span>
                <span className="nav-text">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/announcements" 
                className={`nav-link ${location.pathname === '/announcements' ? 'active' : ''}`}
              >
                <span className="nav-icon">📢</span>
                <span className="nav-text">Announcements</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/lostandfound" 
                className={`nav-link ${location.pathname === '/lostandfound' ? 'active' : ''}`}
              >
                <span className="nav-icon">🔍</span>
                <span className="nav-text">Lost & Found</span>
              </Link>
            </li>
            {user.role === 'student' && (
              <li>
                <Link 
                  to="/timetable" 
                  className={`nav-link ${location.pathname === '/timetable' ? 'active' : ''}`}
                >
                  <span className="nav-icon">📅</span>
                  <span className="nav-text">Timetable</span>
                </Link>
              </li>
            )}
            <li>
              <Link 
                to="/complaints" 
                className={`nav-link ${location.pathname === '/complaints' ? 'active' : ''}`}
              >
                <span className="nav-icon">📝</span>
                <span className="nav-text">Complaints</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/polls" 
                className={`nav-link ${location.pathname.startsWith('/polls') && !location.pathname.startsWith('/polls/admin') ? 'active' : ''}`}
              >
                <span className="nav-icon">📊</span>
                <span className="nav-text">Polls & Feedback</span>
              </Link>
            </li>
            {user.role === 'student' && (
              <>
                <li>
                  <Link 
                    to="/skills" 
                    className={`nav-link ${location.pathname === '/skills' ? 'active' : ''}`}
                  >
                    <span className="nav-icon">🛠️</span>
                    <span className="nav-text">Skill Marketplace</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/mysessions" 
                    className={`nav-link ${location.pathname === '/mysessions' ? 'active' : ''}`}
                  >
                    <span className="nav-icon">⏱️</span>
                    <span className="nav-text">My Sessions</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/profile" 
                    className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
                  >
                    <span className="nav-icon">👤</span>
                    <span className="nav-text">My Profile</span>
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link 
                to="/techfeed" 
                className={`nav-link ${location.pathname.startsWith('/techfeed') && !location.pathname.startsWith('/techfeed/admin') ? 'active' : ''}`}
              >
                <span className="nav-icon">📰</span>
                <span className="nav-text">Tech Feed</span>
              </Link>
            </li>
            {user.role === 'admin' && (
              <>
                <li>
                  <Link 
                    to="/techfeed/admin" 
                    className={`nav-link ${location.pathname === '/techfeed/admin' ? 'active' : ''}`}
                  >
                    <span className="nav-icon">🛠️</span>
                    <span className="nav-text">Manage Tech Feed</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/polls/admin" 
                    className={`nav-link ${location.pathname === '/polls/admin' ? 'active' : ''}`}
                  >
                    <span className="nav-icon">📊</span>
                    <span className="nav-text">Manage Polls</span>
                  </Link>
                </li>
                <li className="admin-section">
                  <div className="admin-label">
                    <span className="nav-icon">🔒</span>
                    <span className="nav-text">Admin</span>
                  </div>
                </li>
              </>
            )}
          </ul>
        ) : (
          <ul>
            <li>
              <Link 
                to="/login" 
                className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
              >
                <span className="nav-icon">🔑</span>
                <span className="nav-text">Login</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/register" 
                className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}
              >
                <span className="nav-icon">📝</span>
                <span className="nav-text">Register</span>
              </Link>
            </li>
          </ul>
        )}
      </nav>

      {user && (
        <div className="sidebar-footer">
          <button className="logout-button" onClick={logout}>
            <span className="logout-icon">🚪</span>
            <span className="logout-text">Logout</span>
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;