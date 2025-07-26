import React, { useContext, useEffect, useState } from 'react';
import AnnouncementCard from '../components/AnnouncementCard';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import './Announcements.css';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', category: 'Exam' });
  const [editing, setEditing] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchAnnouncements = () => {
    api.get('/announcements')
      .then(res => setAnnouncements(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (user) fetchAnnouncements();
  }, [user]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (editing) {
      await api.put(`/announcements/${editing}`, form);
      setEditing(null);
    } else {
      await api.post('/announcements', form);
    }
    setForm({ title: '', content: '', category: 'Exam' });
    fetchAnnouncements();
  };

  const handleEdit = a => {
    setForm({ title: a.title, content: a.content, category: a.category });
    setEditing(a._id);
  };

  const handleDelete = async id => {
    await api.delete(`/announcements/${id}`);
    fetchAnnouncements();
  };

  if (!user) return <div className="announcements-container">Please login to view announcements.</div>;

  return (
    <div className="announcements-container">
      <h2 className="announcements-title">Campus Announcements</h2>
      {user.role === 'admin' && (
        <form onSubmit={handleSubmit} className="announcement-form">
          <input className="announcement-input" name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
          <textarea className="announcement-input" name="content" placeholder="Content" value={form.content} onChange={handleChange} required />
          <select className="announcement-input" name="category" value={form.category} onChange={handleChange} required>
            <option value="Exam">Exam</option>
            <option value="Event">Event</option>
            <option value="Holiday">Holiday</option>
          </select>
          <div className="form-actions">
            <button className="announcement-button" type="submit">{editing ? 'Update' : 'Add'} Announcement</button>
            {editing && <button type="button" className="announcement-cancel" onClick={() => { setEditing(null); setForm({ title: '', content: '', category: 'Exam' }); }}>Cancel</button>}
          </div>
        </form>
      )}
      {announcements.length === 0 ? (
        <div className="no-announcements">No announcements found.</div>
      ) : (
        announcements.map(a => (
          <div key={a._id} className="announcement-item" style={{ position: 'relative' }}>
            <AnnouncementCard announcement={a} />
            {user.role === 'admin' && (
              <div className="edit-buttons" style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: '0.5rem' }}>
                <button className="announcement-edit" onClick={() => handleEdit(a)}>Edit</button>
                <button className="announcement-delete" onClick={() => handleDelete(a._id)}>Delete</button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Announcements;
