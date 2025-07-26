import { AnimatePresence } from 'framer-motion';
import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Announcements from './pages/Announcements';
import Complaints from './pages/Complaints';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import LostAndFound from './pages/LostAndFound';
import Register from './pages/Register';
import Timetable from './pages/Timetable';
// Skill Exchange Marketplace pages
import MySessions from './pages/MySessions';
import Profile from './pages/Profile';
import ReviewForm from './pages/ReviewForm';
import SessionBooking from './pages/SessionBooking';
import SkillForm from './pages/SkillForm';
import SkillMarketplace from './pages/SkillMarketplace';
import TechFeed from './pages/TechFeed';
import TechFeedAdmin from './pages/TechFeedAdmin';
// Polls pages
import Polls from './pages/Polls';
import PollsAdmin from './pages/PollsAdmin';

function ProtectedRoute({ children }) {
  const { user } = React.useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Sidebar />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/announcements" element={<ProtectedRoute><Announcements /></ProtectedRoute>} />
            <Route path="/lostandfound" element={<ProtectedRoute><LostAndFound /></ProtectedRoute>} />
            <Route path="/timetable" element={<ProtectedRoute><Timetable /></ProtectedRoute>} />
            <Route path="/complaints" element={<ProtectedRoute><Complaints /></ProtectedRoute>} />
            {/* Skill Exchange Marketplace routes */}
            <Route path="/skills" element={<ProtectedRoute><SkillMarketplace /></ProtectedRoute>} />
            <Route path="/add-skill" element={<ProtectedRoute><SkillForm /></ProtectedRoute>} />
            <Route path="/edit-skill/:id" element={<ProtectedRoute><SkillForm /></ProtectedRoute>} />
            <Route path="/book-session/:skillId" element={<ProtectedRoute><SessionBooking /></ProtectedRoute>} />
            <Route path="/mysessions" element={<ProtectedRoute><MySessions /></ProtectedRoute>} />
            <Route path="/review" element={<ProtectedRoute><ReviewForm /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/techfeed" element={<TechFeed />} />
            <Route path="/techfeed/admin" element={<TechFeedAdmin />} />
            <Route path="/polls" element={<ProtectedRoute><Polls /></ProtectedRoute>} />
            <Route path="/polls/admin" element={<ProtectedRoute><PollsAdmin /></ProtectedRoute>} />
          </Routes>
        </AnimatePresence>
      </Router>
    </AuthProvider>
  );
}

export default App;