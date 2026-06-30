import React, { useState } from 'react';
import { Lock, User, LogIn, AlertTriangle } from 'lucide-react';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        onLoginSuccess(data.token, data.user);
      } else {
        setError(data.message || 'Invalid username or password.');
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('Failed to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper glass-card">
      <div className="login-header">
        <h2>Admin Portal</h2>
        <p style={{ color: '#b0a4c0', fontSize: '0.85rem' }}>Access the secure Mission ShakthiSAT admin panel</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Username */}
        <div className="form-group">
          <label className="form-label" htmlFor="username">Username</label>
          <div style={{ position: 'relative' }}>
            <input
              id="username"
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Enter admin username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
            <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(212, 175, 55, 0.6)' }} />
          </div>
        </div>

        {/* Password */}
        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <div style={{ position: 'relative' }}>
            <input
              id="password"
              type="password"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(212, 175, 55, 0.6)' }} />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="error-msg" style={{ marginBottom: '1.5rem' }}>
            <AlertTriangle size={16} />
            {error}
          </div>
        )}

        {/* Submit */}
        <button type="submit" className="submit-btn" disabled={loading}>
          <LogIn size={18} />
          {loading ? 'Logging In...' : 'Access Dashboard'}
        </button>
      </form>
    </div>
  );
}

export default Login;
