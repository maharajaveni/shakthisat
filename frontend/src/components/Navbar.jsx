import React from 'react';
import { LayoutDashboard, LogOut, Home, ArrowLeft } from 'lucide-react';

function Navbar({ view, setView, user, onLogout }) {
  return (
    <nav className="navbar">
      <a href="#" className="nav-brand" onClick={(e) => { e.preventDefault(); setView('home'); }}>
        <img src="/shakthisat_logo.jpg" alt="Mission SakthiSAT Logo" className="nav-logo" />
        <span className="nav-title title-gold-gradient">SakthiSAT</span>
      </a>
      
      <div className="nav-links">
        {user ? (
          <>
            <span className="dashboard-user-info">
              <span className="role-badge">{user.role}</span>
              <span style={{ fontSize: '0.9rem', color: '#b0a4c0' }}>Logged in as <b>{user.username}</b></span>
            </span>
            <button className="nav-btn" onClick={() => setView('dashboard')}>
              <LayoutDashboard size={18} />
              Dashboard
            </button>
            <button className="nav-btn" onClick={onLogout}>
              <LogOut size={18} />
              Logout
            </button>
          </>
        ) : (
          <>
            {view === 'home' && (
              <button className="nav-btn" onClick={() => setView('login')}>
                <LayoutDashboard size={18} />
                Admin Login
              </button>
            )}
            {view === 'login' && (
              <button className="nav-btn" onClick={() => setView('home')}>
                <ArrowLeft size={18} />
                Back to Registration
              </button>
            )}
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
