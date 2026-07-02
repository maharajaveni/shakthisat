import React, { useState, useEffect } from 'react';
import { Send, AlertTriangle, Info } from 'lucide-react';
import Certificate from './Certificate';
import { API_BASE_URL } from '../config';

function HomeForm({ onSubmissionSuccess }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [shakthiResponse, setShakthiResponse] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const trimmed = shakthiResponse.trim();
    if (!trimmed) {
      setWordCount(0);
      return;
    }
    const words = trimmed.split(/\s+/);
    setWordCount(words.length);
  }, [shakthiResponse]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!phone.trim()) {
      setError('Please enter your phone number.');
      return;
    }

    const phoneRegex = /^[+0-9\s-]{7,20}$/;
    if (!phoneRegex.test(phone.trim())) {
      setError('Please enter a valid phone number.');
      return;
    }

    if (!shakthiResponse.trim()) {
      setError('Please enter your definition of Shakthi.');
      return;
    }

    const trimmedResponse = shakthiResponse.trim();
    const words = trimmedResponse.split(/\s+/);
    if (words.length > 2) {
      setError('Your definition of Shakthi must be at most two words.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          shakthiResponse: trimmedResponse
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        onSubmissionSuccess(data.submission);
      } else {
        setError(data.message || 'Submission failed. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to connect to the server. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  const isWordCountExceeded = wordCount > 2;

  return (
    <div className="grid-layout">
      {/* Registration Form Column */}
      <div className="form-container glass-card">
        <h2 className="title-gold-gradient" style={{ fontSize: '1.8rem', marginBottom: '1rem', fontFamily: 'Cinzel, serif' }}>
          Join the Mission
        </h2>
        <p style={{ color: '#b0a4c0', marginBottom: '2rem', fontSize: '0.95rem' }}>
          Submit your name and your unique two-word definition of <b>Shakthi</b> to register for Mission ShakthiSAT. Instantly generate your official participation certificate signed by Space Kidz India.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              className="form-input"
              placeholder="e.g. Klara"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              maxLength={60}
              required
              disabled={loading}
            />
            <p className="info-text">Your name as it will appear on the certificate.</p>
          </div>

          {/* Email Address */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="e.g. name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <p className="info-text">Your email for receiving official registration details.</p>
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label className="form-label" htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              className="form-input"
              placeholder="e.g. +91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              disabled={loading}
            />
            <p className="info-text">Your contact number for registration verification.</p>
          </div>

          {/* Shakthi Response */}
          <div className="form-group">
            <label className="form-label" htmlFor="shakthiResponse">What is Shakthi to you?</label>
            <div style={{ position: 'relative' }}>
              <input
                id="shakthiResponse"
                type="text"
                className="form-input"
                placeholder="e.g. Fearless Leader"
                value={shakthiResponse}
                onChange={(e) => setShakthiResponse(e.target.value)}
                maxLength={80}
                required
                disabled={loading}
                style={{ paddingRight: '70px' }}
              />
              <span className={`word-count-badge ${wordCount > 2 ? 'error' : ''}`}>
                {wordCount}/2 words
              </span>
            </div>
            <p className="info-text">Give your response in <b>maximum two words</b> (e.g. "Fearless Leader", "Infinite Power").</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-msg">
              <AlertTriangle size={16} />
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-btn"
            disabled={loading || isWordCountExceeded || !fullName.trim() || !email.trim() || !phone.trim() || !shakthiResponse.trim()}
          >
            <Send size={18} />
            {loading ? 'Submitting...' : 'Generate Certificate'}
          </button>
        </form>
      </div>

      {/* Live Certificate Preview Column */}
      <div>
        <Certificate fullName={fullName} shakthiResponse={shakthiResponse} isPreview={true} />
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '1.25rem', padding: '1rem', background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.15)', borderRadius: '8px' }}>
          <Info size={24} style={{ color: '#d4af37', flexShrink: 0 }} />
          <p style={{ fontSize: '0.8rem', color: '#b0a4c0', margin: 0 }}>
            <b>Real-time Preview:</b> The certificate layout displays your inputs exactly as they will look on the final high-quality downloaded document.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomeForm;
