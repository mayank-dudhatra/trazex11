import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import Loader from '../Loader/Loader';
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const response = await apiClient.post('/auth/login', formData);
      const userId = response?.data?.user?.id || response?.data?.user?._id || '';
      if (userId) {
        localStorage.setItem('userId', userId);
      }
      navigate('/home');
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Login failed. Please try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <div className="login-container">
      {/* Left side illustration */}
      <div className="login-illustration">
        <img 
          src="https://res-console.cloudinary.com/dbrb9ptmn/media_explorer_thumbnails/39f4821eaf276362d0697de76607c4ce/detailed" 
          alt="Login illustration" 
          className="illustration-image"
        />
      </div>

      {/* Right side login form */}
      <div className="login-form-container">
        <div className="login-card auth-card">
          <div className="logo-container">
            <img src="https://res.cloudinary.com/dbrb9ptmn/image/upload/v1738654508/oj7qqwdo1uimyam74bvh.png" alt="Trazex Logo" />
          </div>

          <h2 className="welcome-text">Welcome back!</h2>
          <p className="auth-subtitle">Sign in to continue your trading journey.</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-inputs">
              <label className="auth-label" htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                className="input-field"
                onChange={handleChange}
                required
              />
              <label className="auth-label" htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                className="input-field"
                onChange={handleChange}
                required
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <div className="button-container">
              <button type="submit" className="login-button2" disabled={submitting}>
                {submitting ? 'Signing in...' : 'Log-In'}
              </button>
            </div>

            <div className="forgot-password">
              <span>Forgot Password?</span>
            </div>
            <div className="auth-footer">
              <span>New here?</span>
              <Link to="/register">Create an account</Link>
            </div>
          </form>
          {submitting && (
            <div className="auth-overlay">
              <Loader fullScreen={false} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
