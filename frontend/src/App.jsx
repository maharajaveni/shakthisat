import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeForm from './components/HomeForm';
import Certificate from './components/Certificate';
import BoardingPass from './components/BoardingPass';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [view, setView] = useState('home'); // 'home', 'success', 'login', 'dashboard'
  const [token, setToken] = useState(localStorage.getItem('adminToken') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('adminUser')) || null);
  
  // Participant submission details for success certificate
  const [registeredData, setRegisteredData] = useState(null);
  const [successTab, setSuccessTab] = useState('certificate'); // 'certificate' or 'boardingpass'

  // Synchronize authentication state
  const handleLoginSuccess = (token, user) => {
    setToken(token);
    setUser(user);
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', JSON.stringify(user));
    setView('dashboard');
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setView('home');
  };

  const handleSubmissionSuccess = (submission) => {
    setRegisteredData(submission);
    setSuccessTab('certificate');
    setView('success');
  };

  // Check if token is expired by doing a simple validation or catching auth errors in calls.
  // For safety, if user is authenticated, check token and send them to dashboard on direct refresh.
  useEffect(() => {
    if (token && user) {
      setView('dashboard');
    }
  }, []);

  return (
    <div className="app-container">
      {/* Navbar navigation controls */}
      <Navbar view={view} setView={setView} user={user} onLogout={handleLogout} />

      {/* Main viewport */}
      <main className="main-content">
        
        {/* HOMEPAGE VIEW */}
        {view === 'home' && (
          <>
            <div className="hero-section">
              <div className="hero-logo-container">
                <img src="/spacekidz_logo.jpg" alt="Space Kidz India Logo" className="hero-spacekidz-logo" />
                <img src="/shakthisat_logo.jpg" alt="Mission ShakthiSAT Logo" className="hero-shakthi-logo" />
              </div>
              <h1 
                aria-label="Mission ShakthiSAT"
                style={{ fontSize: '3.4rem', fontFamily: "'Cormorant Garamond', serif", fontWeight: '600', letterSpacing: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}
              >
                <span style={{ color: '#ffffff' }}>Mission</span>
                <span className="title-gold-gradient" style={{ display: 'inline-flex', alignItems: 'baseline' }}>
                  Shakth
                  <span style={{ 
                    position: 'relative', 
                    display: 'inline-block',
                    background: 'var(--gold-gradient)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    verticalAlign: 'baseline'
                  }}>
                    ı
                    {/* The Dot: Sri Yantra Image */}
                    <img 
                      src="/sriyantra.jpg" 
                      alt="dot" 
                      style={{ 
                        width: '0.16em', 
                        height: '0.16em', 
                        borderRadius: '50%',
                        position: 'absolute',
                        top: '0.28em', 
                        left: '50%', 
                        transform: 'translateX(-50%)', 
                        border: '0.8px solid #ffd700',
                        boxShadow: '0 0 5px #ffd700, 0 0 1.5px #ff4081',
                        pointerEvents: 'none',
                        background: '#090615'
                      }} 
                    />
                  </span>
                  SAT
                </span>
              </h1>
              <p className="hero-subtitle">
                A monumental space initiative by Space Kidz India, empowering women in space sciences and STEM. Participate now to register your name and define your core vision of "Shakthi" for this global mission.
              </p>
            </div>

            <HomeForm onSubmissionSuccess={handleSubmissionSuccess} />
          </>
        )}

        {/* REGISTRATION SUCCESS VIEW */}
        {view === 'success' && registeredData && (
          <div className="success-card glass-card">
            <div className="success-icon">
              <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>✓</span>
            </div>
            <h2 className="title-gold-gradient" style={{ fontFamily: 'Cinzel, serif', fontSize: '2.2rem', marginBottom: '0.5rem' }}>
              Registration Successful!
            </h2>
            <p style={{ color: '#b0a4c0', marginBottom: '2rem' }}>
              Thank you, <b>{registeredData.fullName}</b>, for joining Mission ShakthiSAT. Your cosmic registration is complete!
            </p>

            {/* Document Selection Tabs */}
            <div className="category-tabs-container" style={{ width: '100%', maxWidth: '560px', margin: '0 auto 2.5rem auto' }}>
              <div className="category-tabs">
                <button
                  type="button"
                  className={`category-tab ${successTab === 'certificate' ? 'active' : ''}`}
                  onClick={() => setSuccessTab('certificate')}
                >
                  Participation Certificate
                </button>
                <button
                  type="button"
                  className={`category-tab ${successTab === 'boardingpass' ? 'active' : ''}`}
                  onClick={() => setSuccessTab('boardingpass')}
                >
                  Space Boarding Pass
                </button>
              </div>
            </div>

            {/* Conditionally Render Document */}
            {successTab === 'certificate' ? (
              <Certificate 
                fullName={registeredData.fullName} 
                shakthiResponse={registeredData.shakthiResponse} 
                isPreview={false} 
              />
            ) : (
              <BoardingPass 
                submission={registeredData} 
                isPreview={false} 
              />
            )}

            <div className="success-actions" style={{ marginTop: '2.5rem' }}>
              <button className="nav-btn" onClick={() => { setRegisteredData(null); setView('home'); }}>
                Register Another Participant
              </button>
            </div>
          </div>
        )}

        {/* ADMIN PORTAL ACCESS VIEW */}
        {view === 'login' && (
          <Login onLoginSuccess={handleLoginSuccess} />
        )}

        {/* ADMIN DASHBOARD WORKSPACE VIEW */}
        {view === 'dashboard' && token && user && (
          <Dashboard token={token} user={user} />
        )}

      </main>

      {/* Global site footer */}
      <Footer />
    </div>
  );
}

export default App;
