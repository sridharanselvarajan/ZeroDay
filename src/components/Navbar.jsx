import { motion } from "framer-motion";
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';
const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <nav className="navbar-inner">
        <div className="logo">
          <Link to="/">CampusLink</Link>
        </div>
        <div className="nav-links">
          {user && (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/announcements" className="nav-link">Announcements</Link>
              <Link to="/lostandfound" className="nav-link">Lost & Found</Link>
              {user.role === 'student' && <Link to="/timetable" className="nav-link">Timetable</Link>}
              <Link to="/complaints" className="nav-link">Complaints</Link>
              {user.role === 'student' && <Link to="/skills" className="nav-link">Skill Marketplace</Link>}
              {user.role === 'student' && <Link to="/mysessions" className="nav-link">My Sessions</Link>}
              {user.role === 'student' && <Link to="/profile" className="nav-link">My Profile</Link>}
              
              {user.role === 'admin' && <span className="admin-badge nav-link">Admin</span>}
              <button onClick={logout} className="logout-button nav-link">Logout</button>
            </>
          )}
          {!user && (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </div>
      </nav>
    </motion.nav>
  );
};

export default Navbar;
