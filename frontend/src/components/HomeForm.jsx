import React, { useState, useEffect } from 'react';
import { Send, AlertTriangle, Info } from 'lucide-react';
import Certificate from './Certificate';

function HomeForm({ onSubmissionSuccess }) {
  const [fullName, setFullName] = useState('');
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
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
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
              placeholder="e.g. Maharajaveni"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              maxLength={60}
              required
              disabled={loading}
            />
            <p className="info-text">Your name as it will appear on the certificate.</p>
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
            disabled={loading || isWordCountExceeded || !fullName.trim() || !shakthiResponse.trim()}
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
