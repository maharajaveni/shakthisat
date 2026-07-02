import React, { useState, useEffect } from 'react';
import { Send, AlertTriangle, Info } from 'lucide-react';
import Certificate from './Certificate';
import { API_BASE_URL } from '../config';

function HomeForm({ onSubmissionSuccess }) {
  const [category, setCategory] = useState('school'); // 'school', 'college', 'public'
  const [fullName, setFullName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [collegeName, setCollegeName] = useState('');
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

  // Reset category-specific fields when category changes to prevent stale data
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (category === 'school') {
      if (!schoolName.trim()) {
        setError('Please enter your school name.');
        return;
      }
    }

    if (category === 'college') {
      if (!collegeName.trim()) {
        setError('Please enter your college name.');
        return;
      }
    }

    if (category === 'college' || category === 'public') {
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
    }

    if (!shakthiResponse.trim()) {
      setError('Please enter your definition of Sakthi.');
      return;
    }

    const trimmedResponse = shakthiResponse.trim();
    const words = trimmedResponse.split(/\s+/);
    if (words.length > 2) {
      setError('Your definition of Sakthi must be at most two words.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        category,
        fullName: fullName.trim(),
        shakthiResponse: trimmedResponse
      };

      if (category === 'school') {
        payload.schoolName = schoolName.trim();
      } else if (category === 'college') {
        payload.collegeName = collegeName.trim();
        payload.email = email.trim().toLowerCase();
        payload.phone = phone.trim();
      } else { // public
        payload.email = email.trim().toLowerCase();
        payload.phone = phone.trim();
      }

      const response = await fetch(`${API_BASE_URL}/api/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
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

  const isFormInvalid = () => {
    if (loading || isWordCountExceeded || !fullName.trim() || !shakthiResponse.trim()) {
      return true;
    }
    if (category === 'school' && !schoolName.trim()) {
      return true;
    }
    if (category === 'college' && (!collegeName.trim() || !email.trim() || !phone.trim())) {
      return true;
    }
    if (category === 'public' && (!email.trim() || !phone.trim())) {
      return true;
    }
    return false;
  };

  return (
    <div className="grid-layout">
      {/* Registration Form Column */}
      <div className="form-container glass-card">
        <h2 className="title-gold-gradient" style={{ fontSize: '1.8rem', marginBottom: '0.5rem', fontFamily: 'Cinzel, serif' }}>
          Join the Mission
        </h2>
        <p style={{ color: '#b0a4c0', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          Select your category, submit your registration details and unique two-word definition of <b>Sakthi</b> to register for Mission SakthiSAT. Instantly generate your participation certificate.
        </p>

        {/* Category Tabs Selection */}
        <div className="category-tabs-container">
          <label className="category-tabs-label">Participant Type</label>
          <div className="category-tabs">
            <button
              type="button"
              className={`category-tab ${category === 'school' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('school')}
              disabled={loading}
            >
              School Student
            </button>
            <button
              type="button"
              className={`category-tab ${category === 'college' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('college')}
              disabled={loading}
            >
              College Student
            </button>
            <button
              type="button"
              className={`category-tab ${category === 'public' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('public')}
              disabled={loading}
            >
              Public / Others
            </button>
          </div>
        </div>

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

          {/* School Name (School Student only) */}
          {category === 'school' && (
            <div className="form-group">
              <label className="form-label" htmlFor="schoolName">School Name</label>
              <input
                id="schoolName"
                type="text"
                className="form-input"
                placeholder="e.g. Oakridge International School"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                maxLength={100}
                required
                disabled={loading}
              />
              <p className="info-text">Your school name for cosmic participation records.</p>
            </div>
          )}

          {/* College Name (College Student only) */}
          {category === 'college' && (
            <div className="form-group">
              <label className="form-label" htmlFor="collegeName">College Name</label>
              <input
                id="collegeName"
                type="text"
                className="form-input"
                placeholder="e.g. Stella Maris College"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                maxLength={100}
                required
                disabled={loading}
              />
              <p className="info-text">Your college name for institutional registration.</p>
            </div>
          )}

          {/* Email Address (College & Public only) */}
          {(category === 'college' || category === 'public') && (
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
          )}

          {/* Phone Number (College & Public only) */}
          {(category === 'college' || category === 'public') && (
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
          )}

          {/* Sakthi Response */}
          <div className="form-group">
            <label className="form-label" htmlFor="shakthiResponse">What is Sakthi to you?</label>
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
            disabled={isFormInvalid()}
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
