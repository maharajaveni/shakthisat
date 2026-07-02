import React from 'react';
import { Download, Printer, Calendar, Globe, User, Rocket } from 'lucide-react';

// Starry background stub rocket
const SpaceShuttleSVG = () => (
  <svg viewBox="0 0 100 200" width="70" height="140" style={{ margin: '15px auto', display: 'block' }}>
    <path d="M 35,160 Q 50,210 65,160 Q 55,180 45,180 Z" fill="#ff5722" />
    <path d="M 40,160 Q 50,195 60,160 Q 53,175 47,175 Z" fill="#ffeb3b" />
    <rect x="22" y="100" width="10" height="60" rx="3" fill="#e0e0e0" />
    <path d="M 22,100 L 27,80 L 32,100 Z" fill="#b0bec5" />
    <rect x="68" y="100" width="10" height="60" rx="3" fill="#e0e0e0" />
    <path d="M 68,100 L 73,80 L 78,100 Z" fill="#b0bec5" />
    <rect x="35" y="60" width="30" height="100" rx="6" fill="#ffffff" stroke="#90a4ae" strokeWidth="1" />
    <path d="M 35,60 L 50,30 L 65,60 Z" fill="#cfd8dc" />
    <path d="M 35,120 L 15,150 L 35,155 Z" fill="#b0bec5" />
    <path d="M 65,120 L 85,150 L 65,155 Z" fill="#b0bec5" />
    <circle cx="50" cy="75" r="4" fill="#00e5ff" />
    <circle cx="50" cy="90" r="4" fill="#00e5ff" />
    <text x="50" y="125" fill="#37474f" fontSize="6" fontWeight="bold" textAnchor="middle" transform="rotate(-90 50 120)" fontFamily="Outfit, sans-serif" letterSpacing="1px">SHAKTHISAT</text>
  </svg>
);

// Vector graphic of the circular mission patch
const MissionPatchSVG = () => (
  <svg viewBox="0 0 200 200" width="150" height="150" style={{ display: 'block', margin: '0 auto' }}>
    <defs>
      <path id="curve-top" d="M 30,100 A 70,70 0 0,1 170,100" fill="none" />
      <path id="curve-bottom" d="M 170,100 A 70,70 0 0,1 30,100" fill="none" />
    </defs>
    <circle cx="100" cy="100" r="92" fill="#0c0414" stroke="#00e5ff" strokeWidth="2.5" />
    <circle cx="100" cy="100" r="85" fill="#090615" stroke="#ffffff" strokeWidth="1.5" />
    <circle cx="100" cy="100" r="77" fill="none" stroke="#d4af37" strokeWidth="1" strokeDasharray="3,3" />
    
    {/* Curved Texts */}
    <text fill="#ffd700" fontSize="10.5" fontWeight="bold" letterSpacing="1.2px" fontFamily="Orbitron, sans-serif">
      <textPath href="#curve-top" startOffset="50%" textAnchor="middle">MISSION SHAKTHISAT</textPath>
    </text>
    <text fill="#00e5ff" fontSize="8" fontWeight="bold" letterSpacing="0.8px" fontFamily="Outfit, sans-serif">
      <textPath href="#curve-bottom" startOffset="50%" textAnchor="middle">DREAM ★ DISCOVER ★ EMPOWER</textPath>
    </text>
    
    {/* Earth Arc at the bottom */}
    <path d="M 32,120 A 68,68 0 0,0 168,120 Z" fill="#0d47a1" opacity="0.65" />
    <path d="M 32,120 A 68,68 0 0,0 168,120" stroke="#00e5ff" strokeWidth="1.5" fill="none" />
    
    {/* Stars */}
    <circle cx="65" cy="70" r="1" fill="#ffffff" />
    <circle cx="75" cy="55" r="1.5" fill="#ffffff" />
    <circle cx="140" cy="65" r="1" fill="#ffffff" />
    <circle cx="130" cy="85" r="1" fill="#ffd700" />
    <circle cx="90" cy="50" r="0.8" fill="#ffffff" />
    <circle cx="150" cy="95" r="1.2" fill="#ffffff" />
    
    {/* Orange Mars Planet */}
    <circle cx="55" cy="85" r="6" fill="#ff5722" />
    
    {/* Satellite */}
    <g transform="translate(130, 42) scale(0.65)">
      <rect x="0" y="4" width="8" height="6" fill="#00e5ff" rx="1" />
      <rect x="-8" y="6" width="8" height="2" fill="#ffd700" />
      <rect x="8" y="6" width="8" height="2" fill="#ffd700" />
      <circle cx="4" cy="4" r="2" fill="#ffffff" />
    </g>
    
    {/* Girl Silhouette looking at the Earth */}
    <circle cx="100" cy="94" r="7" fill="#ffffff" />
    <path d="M 94,94 C 90,92 88,97 86,97 C 88,99 92,97 94,96" fill="#ffffff" />
    <rect x="98" y="99" width="4" height="4" fill="#ffffff" />
    <path d="M 85,122 L 115,122 L 109,103 L 91,103 Z" fill="#ffffff" />
    <text x="100" y="112" fill="#0c0414" fontSize="4.5" fontWeight="900" textAnchor="middle" fontFamily="Outfit, sans-serif">FUTURE</text>
    <text x="100" y="117" fill="#0c0414" fontSize="4.5" fontWeight="900" textAnchor="middle" fontFamily="Outfit, sans-serif">SCIENTIST</text>
  </svg>
);

// Barcode rendering
const Barcode = ({ width = '100%' }) => {
  const linePattern = [
    2, 1, 3, 1, 1, 2, 4, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 4, 1, 2, 
    2, 1, 3, 1, 1, 2, 4, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 4, 1, 2,
    2, 1, 3, 1, 1, 2, 4, 1, 2
  ];
  return (
    <div style={{ display: 'flex', height: '35px', background: '#ffffff', padding: '2px', alignItems: 'stretch', width: width, justifyContent: 'center' }}>
      {linePattern.map((w, idx) => (
        <div key={idx} style={{
          width: `${w}px`,
          backgroundColor: idx % 2 === 0 ? '#000000' : 'transparent',
          marginRight: '1px'
        }} />
      ))}
    </div>
  );
};

// QR Code block
const QRCodeGraphic = () => (
  <div style={{ width: '65px', height: '65px', border: '2.5px solid #0c0414', padding: '3px', background: '#ffffff', display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px' }}>
    {[
      1,1,1,1,1,1,1,
      1,0,0,0,0,0,1,
      1,0,1,1,1,0,1,
      1,0,1,0,1,0,1,
      1,0,1,1,1,0,1,
      1,0,0,0,0,0,1,
      1,1,1,1,1,1,1,
      0,0,0,1,0,0,0,
      1,0,1,0,1,1,0,
      0,1,1,1,0,1,1,
      1,1,0,0,1,0,1,
      0,0,1,1,0,1,0,
      1,1,1,1,1,1,1,
      1,0,0,0,0,0,1,
      1,0,1,1,1,0,1,
      1,0,1,0,1,0,1,
      1,0,1,1,1,0,1,
      1,0,0,0,0,0,1,
      1,1,1,1,1,1,1
    ].map((val, idx) => (
      <div key={idx} style={{ backgroundColor: val ? '#0c0414' : '#ffffff' }} />
    ))}
  </div>
);

function BoardingPass({ submission, isPreview = false }) {
  const displayName = submission?.fullName || "Future Astronaut";
  const category = submission?.category || "school";
  const submissionId = submission?.id || 1;

  // Generate realistic unique Boarding Pass ID
  const generatePassID = (id) => {
    const pad = (num, size) => {
      let s = "0000" + num;
      return s.substring(s.length - size);
    };
    
    const getHashStr = (str, length) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let result = '';
      let val = Math.abs(hash);
      for (let i = 0; i < length; i++) {
        result += chars[val % chars.length];
        val = Math.floor(val / chars.length) || (val + i + 1);
      }
      return result;
    };
    
    const block1 = getHashStr(`shakthisat-b1-${id}`, 4);
    const block2 = getHashStr(`shakthisat-b2-${id}`, 4);
    const block3 = pad(id || 1, 4);
    
    return `MS25-${block1}-${block2}-${block3}`;
  };

  const passId = generatePassID(submissionId);

  // Set crew position based on registration category
  const getCrewPosition = (cat) => {
    if (cat === 'school') return 'SCHOOL SCIENTIST';
    if (cat === 'college') return 'COLLEGE SCIENTIST';
    return 'SPACE EXPLORER';
  };

  const handleDownload = () => {
    try {
      if (isPreview) return;
      const element = document.getElementById('boarding-pass-print-area');
      if (!element) {
        alert("Error: Boarding Pass print element not found!");
        return;
      }
      
      const opt = {
        margin: 0,
        filename: `ShakthiSAT_BoardingPass_${displayName.trim().replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2.5, 
          useCORS: true, 
          letterRendering: true,
          scrollX: 0,
          scrollY: 0
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
        pagebreak: { mode: 'avoid-all' }
      };
      
      if (window.html2pdf) {
        window.html2pdf().set(opt).from(element).save();
      } else {
        alert("The PDF conversion library is still loading. Please try again in a few seconds.");
      }
    } catch (e) {
      alert('Error rendering PDF: ' + e.message);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const boardingPassHTML = (
    <div id="boarding-pass-print-area" className="boarding-pass-container">
      {/* 1. LEFT STUB PORTION */}
      <div className="boarding-stub">
        <div style={{ padding: '20px 15px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <img src="/spacekidz_logo.png" alt="Space Kidz India Logo" style={{ width: '85px', height: 'auto' }} />
            </div>
            <div style={{ marginTop: '20px' }}>
              <div style={{ fontSize: '0.75rem', color: '#b0a4c0', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>MISSION</div>
              <div style={{ fontSize: '1.25rem', fontFamily: 'Cinzel, serif', fontWeight: '900', color: '#ffffff', letterSpacing: '1px' }}>SHAKTHISAT</div>
              <div style={{ fontSize: '0.55rem', color: '#ffd700', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '2px' }}>GIRLS • SPACE • STEM • FUTURE</div>
            </div>
          </div>

          <img src="/realistic_rocket.png" alt="Realistic Space Rocket" style={{ width: '70px', height: '140px', objectFit: 'contain', margin: '15px auto', display: 'block' }} />

          <div>
            <div style={{ fontSize: '0.55rem', color: '#ffd700', fontWeight: 'bold', letterSpacing: '1.5px', textTransform: 'uppercase', textAlign: 'center', marginBottom: '8px' }}>
              LAUNCH YOUR DREAMS.<br />INSPIRE THE UNIVERSE.
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.55rem', color: '#ffd700', fontWeight: 'bold', letterSpacing: '0.5px' }}>PASS ID</div>
              <div style={{ fontSize: '0.75rem', color: '#ff4081', fontWeight: 'bold', fontFamily: 'Orbitron, sans-serif', margin: '2px 0' }}>{passId}</div>
              <Barcode width="90px" />
            </div>
            <div style={{ fontSize: '0.5rem', color: '#b0a4c0', textAlign: 'center', marginTop: '10px', letterSpacing: '2px', textTransform: 'uppercase' }}>
              ◀  TEAR HERE  ▶
            </div>
          </div>
        </div>
      </div>

      {/* 2. DOTTED SEPARATOR */}
      <div className="boarding-separator"></div>

      {/* 3. RIGHT MAIN BOARDING PASS */}
      <div className="boarding-main">
        <div style={{ padding: '16px 24px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          
          {/* Header row inside dark blue banner */}
          <div className="boarding-main-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src="/spacekidz_logo.png" alt="Space Kidz India Logo" style={{ width: '105px', height: 'auto' }} />
            </div>
            <div style={{ fontSize: '0.7rem', color: '#ffffff', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>ALL-GIRL SPACE MISSION</span>
              <span style={{ color: '#00e5ff' }}>|</span>
              <span>12,000 GIRLS</span>
              <span style={{ color: '#00e5ff' }}>|</span>
              <span>108 COUNTRIES</span>
              <span style={{ color: '#00e5ff' }}>|</span>
              <span>1 UNIVERSE</span>
            </div>
            <Globe size={18} style={{ color: '#00e5ff' }} />
          </div>

          {/* Ticket Body Card */}
          <div className="boarding-main-card">
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1, paddingRight: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#0c0414', fontWeight: '800', letterSpacing: '2.5px', textTransform: 'uppercase', fontFamily: 'Orbitron, sans-serif' }}>
                      BOARDING PASS ✈
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#ff4081', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '6px' }}>
                      MISSION
                    </div>
                    <div style={{ fontSize: '2.4rem', fontFamily: 'Orbitron, sans-serif', fontWeight: '900', color: '#0c0414', lineHeight: '1.0', letterSpacing: '1px' }}>
                      SHAKTHISAT
                    </div>
                  </div>
                  
                  {/* Mission ID label */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.6rem', color: '#0c0414', fontWeight: 'bold', letterSpacing: '0.5px' }}>MISSION ID</div>
                    <div style={{ fontSize: '0.78rem', color: '#ff4081', fontWeight: 'bold', fontFamily: 'Orbitron, sans-serif' }}>{passId}</div>
                  </div>
                </div>

                <div style={{ margin: '15px 0 8px 0', fontSize: '0.7rem', color: '#ff4081', fontWeight: 'bold', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                  THIS IS TO CERTIFY THAT
                </div>
                
                {/* Custom Name with line */}
                <div style={{ borderBottom: '1.5px solid #0c0414', paddingBottom: '4px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.8rem', fontFamily: 'Cinzel, serif', fontWeight: '900', color: '#0c0414', fontStyle: 'italic' }}>
                    {displayName}
                  </span>
                </div>

                <div style={{ fontSize: '0.82rem', color: '#37474f', lineHeight: '1.4', fontFamily: 'Outfit, sans-serif' }}>
                  has successfully joined the all-girl space crew of <b style={{ color: '#0c0414' }}>MISSION SHAKTHISAT</b> and is now officially a future scientist, dreamer and changemaker blasting off towards the stars!
                </div>
              </div>

              {/* Right graphics: QR Code & Patch */}
              <div style={{ width: '175px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <QRCodeGraphic />
                <MissionPatchSVG />
              </div>
            </div>

            {/* Crew fields Box */}
            <div style={{ display: 'flex', background: '#f5f5f7', border: '1.5px solid #0c0414', borderRadius: '8px', padding: '10px 15px', marginTop: '12px', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={15} style={{ color: '#ff4081' }} />
                <div>
                  <div style={{ fontSize: '0.52rem', color: '#655e73', fontWeight: 'bold' }}>LAUNCH DATE</div>
                  <div style={{ fontSize: '0.72rem', color: '#0c0414', fontWeight: 'bold' }}>01 MAY 2025</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Globe size={15} style={{ color: '#ff4081' }} />
                <div>
                  <div style={{ fontSize: '0.52rem', color: '#655e73', fontWeight: 'bold' }}>DESTINATION</div>
                  <div style={{ fontSize: '0.72rem', color: '#0c0414', fontWeight: 'bold' }}>INFINITE POSSIBILITIES</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={15} style={{ color: '#ff4081' }} />
                <div>
                  <div style={{ fontSize: '0.52rem', color: '#655e73', fontWeight: 'bold' }}>CREW POSITION</div>
                  <div style={{ fontSize: '0.72rem', color: '#0c0414', fontWeight: 'bold' }}>{getCrewPosition(category)}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Rocket size={15} style={{ color: '#ff4081' }} />
                <div>
                  <div style={{ fontSize: '0.52rem', color: '#655e73', fontWeight: 'bold' }}>FLIGHT</div>
                  <div style={{ fontSize: '0.72rem', color: '#0c0414', fontWeight: 'bold' }}>MS-2025</div>
                </div>
              </div>
            </div>

            {/* Bottom Signature Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '14px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: '900', color: '#0c0414', letterSpacing: '0.5px' }}>YOU ARE PART OF HISTORY.</div>
                <div style={{ fontSize: '0.75rem', fontWeight: '900', color: '#ff4081', letterSpacing: '0.5px' }}>YOU ARE THE FUTURE.</div>
                <div style={{ borderBottom: '1px solid #ff4081', width: '130px', margin: '4px 0' }}></div>
                <div style={{ fontSize: '0.52rem', color: '#ff4081', fontWeight: 'bold', letterSpacing: '1px' }}>★ KEEP DREAMING. KEEP EXPLORING. KEEP RISING.</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {/* Circular Seal */}
                <div style={{ width: '55px', height: '55px', border: '1.5px dashed #0d47a1', borderRadius: '50%', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.45rem', color: '#0d47a1', fontWeight: 'bold', lineHeight: '1.1' }}>SPACEKIDZ<br />INDIA<br /><span style={{ fontSize: '0.35rem', color: '#ff4081' }}>OFFICIAL</span></span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Dark Banner */}
          <div className="boarding-main-footer">
            <Barcode width="280px" />
            <div style={{ color: '#ffffff', fontSize: '0.6rem', fontWeight: 'bold', letterSpacing: '0.5px', fontFamily: 'Orbitron, sans-serif' }}>
              PASS ID: {passId}
            </div>
            <div style={{ color: '#00e5ff', fontSize: '0.62rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>SECURE YOUR DREAMS. THE UNIVERSE IS WAITING.</span>
              <span>🪐</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );

  if (isPreview) {
    return (
      <div className="certificate-preview-wrapper" style={{ marginTop: '2rem' }}>
        <div className="certificate-preview-label">Live Boarding Pass Preview</div>
        <div className="certificate-preview-container" style={{ height: '390px' }}>
          {boardingPassHTML}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Inline visual representation */}
      <div className="certificate-display-wrapper" style={{ maxWidth: '750px', margin: '0 auto', paddingBottom: '1rem' }}>
        {boardingPassHTML}
      </div>
      
      {/* Action buttons */}
      <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', margin: '20px auto 0' }}>
        <button className="submit-btn" onClick={handleDownload}>
          <Download size={20} />
          Auto-Download Boarding Pass
        </button>
        <button className="submit-btn" style={{ background: 'rgba(212, 175, 55, 0.15)', color: '#d4af37', border: '1px solid #d4af37' }} onClick={handlePrint}>
          <Printer size={20} />
          Save / Print (High-Res Vector)
        </button>
      </div>
    </div>
  );
}

export default BoardingPass;
