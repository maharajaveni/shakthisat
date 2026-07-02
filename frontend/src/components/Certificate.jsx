import React from 'react';
import { Download, Printer } from 'lucide-react';
import { SIGNATURE_BASE64 } from './signature_data';

// Celestial sparkling star corner marker
const CornerStarSVG = ({ className }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" fill="#d4af37" />
    <circle cx="12" cy="12" r="3" fill="#3d1b5b" />
  </svg>
);

// Cute smiling crescent moon SVG for kids - exactly as in the reference image
const MoonSVG = ({ className }) => (
  <svg width="55" height="55" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M45 40C30 40 20 30 20 15C20 12 21 10 22 8C12 11 5 20 5 31C5 44 16 55 29 55C40 55 49 48 52 38C50 39 48 40 45 40Z" fill="#ffd54f" />
    {/* Cute closed eyes in dark purple */}
    <path d="M15 28C16 29.5 18 29.5 19 28" stroke="#3d1b5b" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M22 22C23 23.5 25 23.5 26 22" stroke="#3d1b5b" strokeWidth="2.5" strokeLinecap="round" />
    {/* Cute smiling mouth */}
    <path d="M15 35C18 38 22 38 25 35" stroke="#3d1b5b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    {/* Rosie pink cheeks */}
    <circle cx="12" cy="33" r="2.5" fill="#ff4081" opacity="0.8" />
    <circle cx="27" cy="30" r="2.5" fill="#ff4081" opacity="0.8" />
  </svg>
);

function Certificate({ fullName, shakthiResponse, isPreview = false }) {
  const displayName = fullName || "Future Astronaut";
  const displayResponse = shakthiResponse || "Super Girl";

  // Auto-download PDF using client-side library
  const handleDownload = () => {
    try {
      if (isPreview) return;
      const element = document.getElementById('certificate-print-area');
      if (!element) {
        alert("Error: Certificate element not found in DOM!");
        return;
      }
      
      const opt = {
        margin: 0,
        filename: `ShakthiSAT_Kids_Certificate_${displayName.trim().replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          logging: true, // Enable logging for debugging
          letterRendering: true,
          scrollX: 0,
          scrollY: 0
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: 'avoid-all' }
      };
      
      if (window.html2pdf) {
        window.html2pdf().set(opt).from(element).save()
          .then(() => {
            console.log('PDF download initiated successfully');
          })
          .catch((err) => {
            alert('PDF Conversion Error: ' + err.toString() + '\n\nPlease try the "Save as PDF / Print" option instead.');
            console.error(err);
          });
      } else {
        alert("The PDF conversion library is still loading. Falling back to the browser print dialog...");
        window.print();
      }
    } catch (e) {
      alert('Execution Error: ' + e.message + '\n\nPlease try the "Save as PDF / Print" option instead.');
      console.error(e);
    }
  };

  // Trigger high-resolution browser print / save dialog
  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      alert('Print dialog error: ' + e.message);
      console.error(e);
    }
  };

  // Adjust font size dynamically for long name values
  const getNameFontSize = (name) => {
    if (name.length > 25) return '36px';
    if (name.length > 20) return '44px';
    return '56px';
  };

  const certificateHTML = (
    <div id="certificate-print-area" className="certificate-container kids-theme dark-mode">
      {/* SVG filter to mathematically remove white backgrounds from logos and signatures in real-time */}
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
        <defs>
          <filter id="remove-white" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              -1.5 -1.5 -1.5 4.5 0
            "/>
          </filter>
        </defs>
      </svg>

      <div className="certificate-content">
        {/* Smiling moon overlay - centered via CSS class */}
        <MoonSVG className="cert-moon-overlay" />

        {/* Branding Header: Space Kidz India (top left) and Ski Star (top right) with transparent background */}
        <div className="certificate-header-logos" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="cert-logo-container" style={{ marginLeft: '-35px' }}>
            <img src="/spacekidz_logo.png" alt="Space Kidz India Logo" className="cert-logo-spacekidz" crossOrigin="anonymous" style={{ width: '240px', height: '76px', objectFit: 'contain' }} />
          </div>
          <div className="cert-logo-container" style={{ marginRight: '-125px' }}>
            <img src="/skistar_logo.png" alt="Ski Star Logo" className="cert-logo-skistar" crossOrigin="anonymous" style={{ width: '240px', height: '76px', objectFit: 'contain' }} />
          </div>
        </div>
        
        {/* Certificate Titles */}
        <div className="certificate-title-group">
          <h2 className="certificate-title">CERTIFICATE</h2>
          <h3 className="certificate-subtitle">✦─ OF COSMIC PARTICIPATION ─✦</h3>
        </div>
        
        {/* Achievement Text & Details */}
        <div className="certificate-body-group">
          <div className="certificate-text">This space-tastic certificate is proudly awarded to</div>
          
          <div className="certificate-recipient" style={{ fontSize: getNameFontSize(displayName) }}>
            {displayName}
          </div>
          <div className="certificate-gold-line"></div>
          
          <div className="certificate-text" style={{ marginTop: '5px' }}>for successfully blasting off with the crew of</div>
          
          <h4 className="certificate-program-title">MISSION SHAKTHISAT</h4>
          
          <div className="certificate-description">
            An all-girl space squad of 12,000 future scientists from 108 countries launching satellites, exploring the universe, and empowering girls in STEM!
          </div>

          {/* Highlighted Quote Section with custom gold border & cursive text */}
          <div className="certificate-quote-section" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {/* Tiny stars in the corners of the quote section */}
            <span className="quote-box-star-tl">✦</span>
            <span className="quote-box-star-tr">✦</span>
            <span className="quote-box-star-bl">✦</span>
            <span className="quote-box-star-br">✦</span>
            
            <div className="certificate-quote-text" style={{ fontStyle: 'italic', fontSize: '1.25rem', color: '#ffd700', margin: '0 0 6px 0', fontFamily: 'EB Garamond, serif', textTransform: 'none', letterSpacing: 'normal' }}>
              “The sky isn't my limit; it's my beginning.”
            </div>
            <div className="certificate-quote-author" style={{ fontSize: '0.82rem', color: '#ffd700', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'Outfit, sans-serif', textAlign: 'center', marginTop: '6px' }}>
              — Dr. Srimathy Kesan
              <div style={{ fontSize: '0.72rem', color: 'rgba(255, 215, 0, 0.8)', fontWeight: '500', textTransform: 'none', letterSpacing: '0.5px', marginTop: '3px' }}>
                Founder and CEO of Space Kidz India
              </div>
            </div>
            
            {/* Little rocket icon in bottom-right of the box */}
            <span className="quote-box-rocket">🚀</span>
          </div>
        </div>
        
        {/* Footer: Signature block on the left, Seal on the right (restored to older places!) */}
        {/* Footer: Signature block on the left (black text), Seal centered, right empty for rocket */}
        <div className="certificate-footer-signatures" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative' }}>
          {/* Girl Silhouette Pointing to the Sky - Left Side */}
          <div style={{ zIndex: 10, width: '150px', marginLeft: '25px', display: 'flex', justifyContent: 'center' }}>
            <svg width="85" height="110" viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Earth curve */}
              <path d="M0 120 Q50 115 100 120" stroke="rgba(255, 215, 0, 0.4)" strokeWidth="1.5" />
              {/* Girl silhouette pointing up */}
              <path d="M42 120 L44 95 L41 73 M48 120 L46 95 L49 73" stroke="#000000" strokeWidth="4.5" strokeLinecap="round" />
              <path d="M41 73 L49 73 L47 54 L43 54 Z" fill="#000000" />
              <circle cx="45" cy="46" r="6.5" fill="#000000" />
              {/* Ponytail */}
              <path d="M40 46 C33 44 31 52 27 49 C29 54 35 51 39 48 Z" fill="#000000" />
              {/* Pointing arm up and right */}
              <path d="M47 58 L73 26 L77 29 L51 63 Z" fill="#000000" />
              {/* Left arm down */}
              <path d="M41 58 L36 78 L40 78 L43 62 Z" fill="#000000" />
            </svg>
          </div>

          <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: '-5px', zIndex: 5 }}>
            <img src="/shakthisat_seal.png" alt="Mission ShakthiSAT Official Seal" className="cert-seal-img" crossOrigin="anonymous" style={{ width: '115px', height: '115px' }} />
          </div>

          <div style={{ width: '145px' }}></div>
        </div>
      </div>
    </div>
  );

  if (isPreview) {
    return (
      <div className="certificate-preview-wrapper">
        <div className="certificate-preview-label">Live Certificate Preview</div>
        <div className="certificate-preview-container">
          {certificateHTML}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Inline visual representation (reused for printing) */}
      <div className="certificate-display-wrapper" style={{ maxWidth: '450px', margin: '0 auto', paddingBottom: '1rem' }}>
        {certificateHTML}
      </div>
      
      {/* Action buttons */}
      <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', margin: '20px auto 0' }}>
        <button className="submit-btn" onClick={handleDownload}>
          <Download size={20} />
          Auto-Download PDF
        </button>
        <button className="submit-btn" style={{ background: 'rgba(212, 175, 55, 0.15)', color: '#d4af37', border: '1px solid #d4af37' }} onClick={handlePrint}>
          <Printer size={20} />
          Save as PDF / Print (Vector High-Res)
        </button>
        
        {/* Troubleshooting Notice */}
        <div style={{ marginTop: '15px', padding: '12px', background: 'rgba(74, 47, 150, 0.05)', border: '1px dashed rgba(74, 47, 150, 0.25)', borderRadius: '8px', textAlign: 'left' }}>
          <p style={{ fontSize: '0.8rem', color: '#655e73', margin: '0 0 6px 0', fontWeight: 'bold' }}>
            💡 Having trouble downloading?
          </p>
          <p style={{ fontSize: '0.78rem', color: '#7e758c', margin: 0, lineHeight: '1.4' }}>
            If you are viewing this page inside the IDE preview frame, Chrome may block downloads. Please copy and open 
            <a href="http://localhost:5000" target="_blank" rel="noopener noreferrer" style={{ color: '#4a2f96', textDecoration: 'underline', marginLeft: '4px', fontWeight: 'bold' }}>
              http://localhost:5000
            </a> in a regular browser tab to download or print your certificate!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Certificate;
