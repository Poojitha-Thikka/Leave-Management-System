import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/css/Login.css';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginAsAdmin, setLoginAsAdmin] = useState(false); // New state for admin login option
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password,
        isAdmin: loginAsAdmin
      });
      
      // Store token and role in localStorage
      localStorage.setItem('token', response.data.token);
      const tokenData = JSON.parse(atob(response.data.token.split('.')[1]));
      localStorage.setItem('role', tokenData.role);
      
      // Redirect based on role
      onLogin({ token: response.data.token, role: tokenData.role });
      
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div>
          <h2>Leave Management System</h2>
          <p>Login to your account</p>
        </div>
        
        {error && (
          <div className="message error">
            {error}
          </div>
        )}
        {message && (
          <div className="message success">
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group checkbox-group">
            <input
              id="loginAsAdmin"
              type="checkbox"
              checked={loginAsAdmin}
              onChange={(e) => setLoginAsAdmin(e.target.checked)}
            />
            <label htmlFor="loginAsAdmin">Login as Admin</label>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-login"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}