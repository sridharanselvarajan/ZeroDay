import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Register.css';

const Register = () => {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    role: 'student' 
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      await register(form.username, form.email, form.password, form.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2 className="register-title">Create Account</h2>
          <p className="register-subtitle">Join our community today</p>
        </div>
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input 
              id="username"
              name="username" 
              placeholder="Enter your username" 
              value={form.username} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input 
              id="email"
              name="email" 
              type="email" 
              placeholder="Enter your email" 
              value={form.email} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input 
              id="password"
              name="password" 
              type="password" 
              placeholder="Create a password" 
              value={form.password} 
              onChange={handleChange} 
              required 
              minLength="6"
            />
            <div className="password-hint">Minimum 6 characters</div>
          </div>

          <div className="form-group">
            <label htmlFor="role" className="form-label">Account Type</label>
            <select 
              id="role"
              name="role" 
              value={form.role} 
              onChange={handleChange} 
              required
            >
              <option value="student">Student</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          {error && (
            <div className="error-message">
              <svg className="error-icon" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              {error}
            </div>
          )}

          <button 
            className="register-button" 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="spinner" viewBox="0 0 50 50">
                  <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                </svg>
                Creating Account...
              </>
            ) : 'Register Now'}
          </button>
        </form>

        <div className="register-footer">
          Already have an account? 
          <button 
            className="login-link" 
            onClick={() => navigate('/login')}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;