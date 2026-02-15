import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import Loader from '../Loader/Loader';
import '../Login/Login.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const response = await apiClient.post('/auth/signup', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      const userId = response?.data?.user?.id || response?.data?.user?._id || '';
      if (userId) {
        localStorage.setItem('userId', userId);
      }
      navigate('/home');
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Registration failed. Please try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // <div className="p-5 bg-white shadow rounded">
    //   <h2 className="mb-3 text-lg font-bold">Register</h2>
    //   <form onSubmit={handleSubmit} className="flex flex-col">
    //     <input type="text" name="username" placeholder="Username" className="mb-2 p-2 border" onChange={handleChange} required />
    //     <input type="text" name="name" placeholder="Name" className="mb-2 p-2 border" onChange={handleChange} required />
    //     <input type="email" name="email" placeholder="Email" className="mb-2 p-2 border" onChange={handleChange} required />
    //     <input type="password" name="password" placeholder="Password" className="mb-2 p-2 border" onChange={handleChange} required />
    //     <button type="submit" className="bg-blue-500 text-white p-2 rounded">Register</button>
    //   </form>
    // </div>


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
        {/* Logo and title */}
        <div className="logo-container">
          <img src="https://res.cloudinary.com/dbrb9ptmn/image/upload/v1738654508/oj7qqwdo1uimyam74bvh.png" alt="Trazex Logo" />
        </div>

        <h2 className="welcome-text" style={{marginTop: 10}}>Join TRAZEX11</h2>
        <p className="auth-subtitle">Create your account to get started.</p>

        {/* Login form */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-inputs">
             <label className="auth-label" htmlFor="username">Username</label>
             <input type="text" name="username" id="username" placeholder="Username" style={{marginTop: -10}} className="input-field" onChange={handleChange} required />

             <label className="auth-label" htmlFor="name">Name</label>
             <input type="text" name="name" id="name" placeholder="Name" className="input-field" onChange={handleChange} required />

             <label className="auth-label" htmlFor="email">Email</label>
             <input type="email" name="email" id="email" placeholder="Email" className="input-field" onChange={handleChange} required />

             <label className="auth-label" htmlFor="password">Password</label>
             <input type="password" name="password" id="password" placeholder="Password" className="input-field" onChange={handleChange} required />

          </div>

          {error && <div className="auth-error">{error}</div>}
           
           <div className="button-container">
          <button type="submit" style={{marginTop: 0}} className="login-button2" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Sign-up'}
          </button>
          </div>

          <div className="forgot-password">
          <Link to="/login"><div className='text-[#3FD68C]'> <span  style={{color: 'black'}}>Already have an Account? </span>Sign-In</div></Link>
          </div>
          <div className="auth-footer">
            <span>By signing up, you agree to the Terms & Privacy Policy.</span>
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

export default Register;
