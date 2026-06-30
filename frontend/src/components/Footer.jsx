import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} <span className="footer-text-gold">Mission ShakthiSAT</span>. All Rights Reserved.</p>
        <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>An initiative powered by Space Kidz India. Promoting space sciences & women empowerment.</p>
        
        <div className="footer-logos">
          <img src="/spacekidz_logo.jpg" alt="Space Kidz India Logo" className="footer-logo-sk" />
          <img src="/shakthisat_logo.jpg" alt="ShakthiSAT Logo" className="footer-logo-sts" />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
