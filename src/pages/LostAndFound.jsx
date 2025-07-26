import React, { useContext, useEffect, useState } from 'react';
import LostItemForm from '../components/LostItemForm';
import { AuthContext } from '../context/AuthContext';
import api, { fetchMyLostFound } from '../services/api';
import './LostAndFound.css';

const LostAndFound = () => {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ type: 'lost', itemName: '', description: '', location: '', category: '', image: null });
  const { user } = useContext(AuthContext);

  const fetchItems = () => {
    if (user && user.role === 'admin') {
      api.get('/lostfound')
        .then(res => setItems(res.data))
        .catch(err => console.error(err));
    } else {
      fetchMyLostFound()
        .then(res => setItems(res.data))
        .catch(err => console.error(err));
    }
  };

  useEffect(() => {
    if (user) fetchItems();
  }, [user]);

  const handleEditClick = item => {
    setEditing(item._id);
    setEditForm({
      type: item.type,
      itemName: item.itemName,
      description: item.description,
      location: item.location,
      category: item.category,
      image: null,
    });
  };

  const handleEditChange = e => {
    const { name, value, files } = e.target;
    setEditForm(f => ({ ...f, [name]: files ? files[0] : value }));
  };

  const handleEditSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(editForm).forEach(([k, v]) => v && data.append(k, v));
    await api.put(`/lostfound/${editing}`, data);
    setEditing(null);
    setEditForm({ type: 'lost', itemName: '', description: '', location: '', category: '', image: null });
    fetchItems();
  };

  const handleDelete = async id => {
    await api.delete(`/lostfound/${id}`);
    fetchItems();
  };

  if (!user) return <div className="lost-found-container">Please login to view lost & found items.</div>;

  return (
    <div className="lost-found-container">
      <h2 className="lost-found-title">Lost & Found</h2>
      <LostItemForm onSuccess={fetchItems} />
      {items.length === 0 ? (
        <div>No items found.</div>
      ) : (
        items.map(item => (
          <div key={item._id} className="item-card">
            {editing === item._id ? (
              <form onSubmit={handleEditSubmit} className="edit-form">
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <label>
                    <input type="radio" name="type" value="lost" checked={editForm.type === 'lost'} onChange={handleEditChange} /> Lost
                  </label>
                  <label>
                    <input type="radio" name="type" value="found" checked={editForm.type === 'found'} onChange={handleEditChange} /> Found
                  </label>
                </div>
                <input className="edit-input" name="itemName" placeholder="Item Name" value={editForm.itemName} onChange={handleEditChange} required />
                <input className="edit-input" name="location" placeholder="Location" value={editForm.location} onChange={handleEditChange} required />
                <input className="edit-input" name="category" placeholder="Category" value={editForm.category} onChange={handleEditChange} required />
                <textarea className="edit-input" name="description" placeholder="Description" value={editForm.description} onChange={handleEditChange} required />
                <input className="edit-file" type="file" name="image" accept="image/*" onChange={handleEditChange} />
                <button className="edit-btn" type="submit">Update</button>
                <button type="button" className="cancel-btn" onClick={() => setEditing(null)}>Cancel</button>
              </form>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="item-name">{item.itemName}</span>
                  <span className={`item-type-badge item-type-${item.type}`}>{item.type}</span>
                </div>
                <div className="item-meta">{item.category} | {item.location} | {new Date(item.dateReported).toLocaleString()}</div>
                <div className="item-desc">{item.description}</div>
                {item.imagePath && <img src={`http://localhost:5000${item.imagePath}`} alt="item" className="item-image" />}
                
                {(user.role === 'admin' || user._id === item.reportedBy?._id) && (
                  <div className="action-buttons">
                    <button className="edit-btn" onClick={() => handleEditClick(item)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
                  </div>
                )}
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default LostAndFound;
