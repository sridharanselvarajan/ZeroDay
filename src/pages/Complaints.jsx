import { CheckCircleIcon, ClockIcon, ExclamationIcon, PlusIcon } from '@heroicons/react/outline';
import { motion } from 'framer-motion';
import React, { useContext, useEffect, useState } from 'react';
import ComplaintForm from '../components/ComplaintForm';
import { AuthContext } from '../context/AuthContext';
import api, { fetchMyComplaints } from '../services/api';
import './Complaints.css';

const statusIcons = {
  'Pending': <ExclamationIcon className="status-icon" />,
  'In-progress': <ClockIcon className="status-icon" />,
  'Resolved': <CheckCircleIcon className="status-icon" />
};

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const { user } = useContext(AuthContext);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (user.role === 'admin') {
      api.get('/complaints/all')
        .then(res => setComplaints(res.data))
        .catch(err => console.error(err));
    } else {
      fetchMyComplaints()
        .then(res => setComplaints(res.data))
        .catch(err => console.error(err));
    }
  }, [user]);

  const handleStatusChange = async (id, status) => {
    await api.put(`/complaints/${id}/status`, { status });
    // Refetch complaints after status change
    if (!user) return;
    const url = user.role === 'admin' ? '/complaints/all' : '/complaints/my';
    api.get(url)
      .then(res => setComplaints(res.data))
      .catch(err => console.error(err));
  };

  if (!user) return (
    <div className="complaints-container">
      <div className="complaints-title">Please login to view complaints</div>
    </div>
  );

  return (
    <div className="complaints-container">
      <div className="complaints-title">Hostel Complaints</div>
      {user.role === 'student' && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFormOpen(true)}
          className="complaint-new-btn"
        >
          <PlusIcon className="status-icon" />
          New Complaint
        </motion.button>
      )}
      {isFormOpen && (
        <div style={{ margin: '2rem 0' }}>
          <ComplaintForm 
            onSuccess={() => {
              if (!user) return;
              const url = user.role === 'admin' ? '/complaints/all' : '/complaints/my';
              api.get(url)
                .then(res => setComplaints(res.data))
                .catch(err => console.error(err));
              setIsFormOpen(false);
            }} 
          />
        </div>
      )}
      {complaints.length === 0 ? (
        <div className="no-complaints">{user.role === 'admin' ? 'No complaints submitted yet' : 'You have no complaints yet'}</div>
      ) : (
        <div className="complaints-list">
          {complaints.map(c => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="complaint-item"
            >
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#2d3748' }}>{c.complaintTitle}</h3>
                  <span className={`status-badge status-${c.status.replace(/ /g, '-').toLowerCase()}`}>
                    {statusIcons[c.status]}
                    {c.status}
                  </span>
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.95rem', color: '#718096' }}>
                  {c.category} • {new Date(c.submittedAt).toLocaleString()}
                </div>
                <p style={{ marginTop: '1rem', color: '#4a5568' }}>{c.description}</p>
                {c.imagePath && (
                  <div style={{ marginTop: '1rem' }}>
                    <img 
                      src={`http://localhost:5000${c.imagePath}`} 
                      alt="complaint" 
                      className="complaint-image"
                    />
                  </div>
                )}
                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {user.role === 'admin' && (
                    <div style={{ fontSize: '0.95rem', color: '#718096' }}>
                      Submitted by: {c.submittedBy?.username || 'User'}
                    </div>
                  )}
                  {user.role === 'admin' && (
                    <div className="admin-actions">
                      <button
                        onClick={() => handleStatusChange(c._id, 'In-progress')}
                        className="admin-action-btn in-progress"
                      >
                        In-progress
                      </button>
                      <button
                        onClick={() => handleStatusChange(c._id, 'Resolved')}
                        className="admin-action-btn resolved"
                      >
                        Resolved
                      </button>
                      <button
                        onClick={() => handleStatusChange(c._id, 'Pending')}
                        className="admin-action-btn pending"
                      >
                        Pending
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Complaints;
