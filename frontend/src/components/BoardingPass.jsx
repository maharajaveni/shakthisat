import React, { useState, useEffect, useRef } from 'react';
import { Download, Printer, Calendar, Globe, User, Rocket } from 'lucide-react';

// Custom Saturn Icon SVG
const SaturnIcon = ({ size = 24, color = '#ff4081' }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <circle cx="12" cy="12" r="5" fill={color} opacity="0.15" />
    <circle cx="12" cy="12" r="5" />
    <path d="M 4,15 C 4,15 8,9 14,9 C 20,9 20,15 20,15" />
    <path d="M 20,9 C 20,9 16,15 10,15 C 4,15 4,9 4,9" />
  </svg>
);

// Custom Embossed Blue Seal SVG (220x220 px scaled)
const BlueSealSVG = ({ size = 220 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'block', filter: 'drop-shadow(0 4px 8px rgba(13, 71, 161, 0.25))' }}>
    <circle cx="50" cy="50" r="47" fill="#0d47a1" opacity="0.05" />
    <circle cx="50" cy="50" r="47" fill="none" stroke="#0d47a1" strokeWidth="1.5" />
    <circle cx="50" cy="50" r="43" fill="none" stroke="#0d47a1" strokeWidth="1" strokeDasharray="2,2" />
    
    <defs>
      <path id="seal-text-path" d="M 50,91 A 41,41 0 1,1 50.1,91" fill="none" />
    </defs>
    <text fill="#0d47a1" fontSize="6.2" fontWeight="800" letterSpacing="0.3px" fontFamily="Outfit, sans-serif">
      <textPath href="#seal-text-path" startOffset="0%">SPACE KIDZ INDIA • WE BELIEVE IN GIRLS & SPACE •</textPath>
    </text>
    
    <g transform="translate(50, 50) scale(0.65)">
      {/* Orbit ring */}
      <ellipse cx="0" cy="0" rx="24" ry="8" fill="none" stroke="#0d47a1" strokeWidth="1.5" transform="rotate(-25)" />
      {/* Small stars */}
      <circle cx="-12" cy="-12" r="1.5" fill="#0d47a1" />
      <circle cx="12" cy="12" r="1" fill="#0d47a1" />
      <circle cx="15" cy="-8" r="1.2" fill="#0d47a1" />
      {/* Rocket */}
      <g transform="rotate(45) translate(-4, -14)">
        <path d="M 4,0 L 8,12 L 0,12 Z" fill="#0d47a1" />
        <rect x="1.5" y="12" width="5" height="12" fill="#0d47a1" />
        <path d="M 0,20 L 1.5,24 L 3,20 Z" fill="#ff4081" />
        <path d="M 8,20 L 6.5,24 L 5,20 Z" fill="#ff4081" />
      </g>
    </g>
  </svg>
);

// Vector graphic of the circular mission patch (430x430 px scaled)
const MissionPatchSVG = ({ size = 430 }) => (
  <svg viewBox="0 0 200 200" width={size} height={size} style={{ display: 'block', margin: '0 auto' }}>
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
      <textPath href="#curve-bottom" startOffset="50%" textAnchor="middle">DREAM • DISCOVER • EMPOWER</textPath>
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
const Barcode = ({ width = 300, height = 70 }) => {
  const linePattern = [
    2, 1, 3, 1, 1, 2, 4, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 4, 1, 2, 
    2, 1, 3, 1, 1, 2, 4, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 4, 1, 2,
    2, 1, 3, 1, 1, 2, 4, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 4, 1, 2,
    2, 1, 3, 1, 1, 2, 4, 1, 2
  ];
  return (
    <div style={{ display: 'flex', height: `${height}px`, background: '#ffffff', padding: '5px', alignItems: 'stretch', width: `${width}px`, justifyContent: 'center', boxSizing: 'border-box' }}>
      {linePattern.map((w, idx) => (
        <div key={idx} style={{
          flexGrow: w,
          backgroundColor: idx % 2 === 0 ? '#000000' : 'transparent',
          marginRight: '2px'
        }} />
      ))}
    </div>
  );
};

// QR Code block (180x180 px scaled)
const QRCodeGraphic = ({ size = 180 }) => (
  <div style={{ width: `${size}px`, height: `${size}px`, border: '5px solid #0a2342', padding: '6px', background: '#ffffff', display: 'grid', gridTemplateColumns: 'repeat(11, 1fr)', gap: '2px', boxSizing: 'border-box' }}>
    {[
      1,1,1,1,1,1,1,0,1,1,1,
      1,0,0,0,0,0,1,0,0,0,1,
      1,0,1,1,1,0,1,1,1,0,1,
      1,0,1,1,1,0,1,0,1,0,1,
      1,0,1,1,1,0,1,1,0,1,1,
      1,0,0,0,0,0,1,0,1,0,0,
      1,1,1,1,1,1,1,1,1,1,1,
      0,0,1,0,1,0,0,1,0,1,0,
      1,1,0,1,0,1,1,0,1,1,1,
      1,0,1,1,0,0,1,0,0,0,1,
      1,1,1,1,1,1,1,1,1,1,1
    ].map((val, idx) => (
      <div key={idx} style={{ backgroundColor: val ? '#0a2342' : '#ffffff' }} />
    ))}
  </div>
);

function BoardingPass({ submission, isPreview = false }) {
  const displayName = submission?.fullName || "Future Astronaut";
  const submissionId = submission?.id || 1;

  // Fit view inside any screen size (base resolution: 1800x1100 px)
  const [scale, setScale] = useState(0.5);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (wrapperRef.current) {
        const parentWidth = wrapperRef.current.parentElement.offsetWidth;
        const displayWidth = Math.min(parentWidth, 900); // Max displaying width on desktop page
        setScale(displayWidth / 1800);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Generate unique Boarding Pass ID (matching SKI-MS26-IN-L1-000842 spec)
  const generatePassID = (id) => {
    const pad = (num, size) => {
      let s = "000000" + num;
      return s.substring(s.length - size);
    };
    const paddedId = pad(id || 1, 6);
    return `SKI-MS26-IN-L1-${paddedId}`;
  };

  const passId = generatePassID(submissionId);

  const handleDownload = () => {
    try {
      if (isPreview) return;
      const element = document.getElementById('boarding-pass-print-area');
      if (!element) return;
      
      // Temporary inline style override to ensure full scale during capture
      const originalTransform = element.style.transform;
      element.style.transform = 'scale(1)';
      
      import('html2canvas').then((html2canvas) => {
        html2canvas.default(element, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#071A35',
          width: 1800,
          height: 1100
        }).then((canvas) => {
          element.style.transform = originalTransform; // Restore original scale
          const link = document.createElement('a');
          link.download = `boarding_pass_${displayName.replace(/\s+/g, '_')}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
        });
      }).catch(err => {
        element.style.transform = originalTransform;
        console.error("Html2Canvas library error:", err);
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handlePrint = () => {
    if (isPreview) return;
    window.print();
  };

  const boardingPassHTML = (
    <div 
      id="boarding-pass-print-area" 
      style={{ 
        width: '1800px', 
        height: '1100px', 
        backgroundColor: '#071A35', 
        borderRadius: '32px', 
        display: 'flex', 
        overflow: 'hidden', 
        position: 'relative', 
        boxSizing: 'border-box',
        border: '3px solid rgba(212, 175, 55, 0.35)',
        boxShadow: '0 25px 75px rgba(0, 0, 0, 0.75)'
      }}
    >
      {/* 1. LEFT TICKET STUB (390 px Wide) */}
      <div 
        style={{ 
          width: '390px', 
          height: '100%', 
          background: 'linear-gradient(to bottom, #04152D 0%, #081E46 100%)', 
          position: 'relative', 
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
      >
        {/* Subtle Orbit and Stars Vector Overlays */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.45 }}>
          <path d="M -50,200 Q 200,400 450,200" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
          <path d="M -50,300 Q 200,600 450,400" fill="none" stroke="rgba(0,229,255,0.12)" strokeWidth="1" strokeDasharray="3,3" />
          <path d="M -50,600 Q 150,900 450,800" fill="none" stroke="rgba(255,107,53,0.08)" strokeWidth="1" />
          <circle cx="50" cy="120" r="1" fill="#fff" />
          <circle cx="120" cy="80" r="1.5" fill="#fff" opacity="0.8" />
          <circle cx="280" cy="150" r="1" fill="#fff" />
          <circle cx="320" cy="350" r="1.2" fill="#fff" opacity="0.6" />
          <circle cx="80" cy="500" r="1" fill="#fff" />
          <circle cx="150" cy="720" r="1" fill="#ffd700" opacity="0.5" />
          <circle cx="250" cy="900" r="1.5" fill="#fff" />
          <circle cx="330" cy="980" r="1" fill="#fff" />
        </svg>

        {/* Space Kidz logo (X=50, Y=40 from spec, 300px wide) */}
        <img 
          src="/spacekidz_logo.png" 
          alt="Space Kidz India Logo" 
          style={{ 
            position: 'absolute', 
            left: '45px', 
            top: '40px', 
            width: '300px', 
            height: 'auto',
            objectFit: 'contain'
          }} 
        />

        {/* Title & Tagline Group */}
        <div style={{ position: 'absolute', left: '45px', top: '155px', width: '300px', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'Orbitron, sans-serif', color: '#ffffff', letterSpacing: '5px', textTransform: 'uppercase' }}>
            MISSION
          </div>
          <div style={{ fontSize: '54px', fontWeight: '900', fontFamily: 'Orbitron, sans-serif', color: '#ffffff', letterSpacing: '3px', marginTop: '2px' }}>
            SHAKTHISAT
          </div>
          <div style={{ fontSize: '19px', fontWeight: '600', fontFamily: 'Montserrat, sans-serif', color: '#FF6B35', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '6px' }}>
            GIRLS • SPACE • STEM • FUTURE
          </div>
        </div>

        {/* Realistic Rocket Launch (300x420 px) */}
        <img 
          src="/realistic_rocket.png" 
          alt="Realistic Rocket Launch" 
          style={{ 
            position: 'absolute', 
            left: '45px', 
            top: '315px', 
            width: '300px', 
            height: '420px', 
            objectFit: 'contain'
          }} 
        />

        {/* Caption */}
        <div style={{ position: 'absolute', left: '20px', top: '750px', width: '350px', textAlign: 'center', fontFamily: 'Montserrat, sans-serif' }}>
          <div style={{ fontSize: '30px', fontWeight: 'bold', color: '#ffffff', letterSpacing: '0.5px' }}>
            LAUNCH YOUR DREAMS.
          </div>
          <div style={{ fontSize: '30px', fontWeight: 'bold', color: '#FF6B35', letterSpacing: '0.5px', marginTop: '2px' }}>
            INSPIRE THE UNIVERSE.
          </div>
        </div>

        {/* PASS ID Card Box (320x180 px) */}
        <div 
          style={{ 
            position: 'absolute', 
            left: '35px', 
            top: '840px', 
            width: '320px', 
            height: '180px', 
            backgroundColor: 'rgba(4, 17, 34, 0.85)', 
            border: '1.5px solid rgba(255,255,255,0.12)', 
            borderRadius: '18px', 
            padding: '12px', 
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <div style={{ fontSize: '20px', color: '#ffffff', fontWeight: 'bold', fontFamily: 'Orbitron, sans-serif', letterSpacing: '1px', textAlign: 'center' }}>
              PASS ID
            </div>
            <div style={{ fontSize: '24px', color: '#FF6B35', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '0.5px', marginTop: '3px', textAlign: 'center' }}>
              {passId}
            </div>
          </div>
          <Barcode width={285} height={60} />
        </div>

        {/* Tear Here Label */}
        <div 
          style={{ 
            position: 'absolute', 
            left: '20px', 
            top: '1048px', 
            width: '350px', 
            textAlign: 'center', 
            fontSize: '18px', 
            color: '#8D99AE', 
            fontWeight: 'bold', 
            letterSpacing: '3px' 
          }}
        >
          ◀  TEAR HERE  ▶
        </div>
      </div>

      {/* 2. DASHED VERTICAL SEPARATOR LINE */}
      <div 
        style={{ 
          width: '2px', 
          height: '100%', 
          borderLeft: '3px dashed rgba(212, 175, 55, 0.45)', 
          zIndex: 10 
        }} 
      />

      {/* 3. RIGHT MAIN BOARDING PASS (1408 px Wide) */}
      <div 
        style={{ 
          width: '1408px', 
          height: '100%', 
          backgroundColor: '#FDFDFB', 
          position: 'relative', 
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Faint Rocket Blueprint Watermark (15% opacity) */}
        <svg style={{ position: 'absolute', top: '10%', left: '12%', width: '70%', height: '80%', pointerEvents: 'none', opacity: 0.08 }} viewBox="0 0 800 600">
          <line x1="400" y1="50" x2="400" y2="550" stroke="#0A2342" strokeWidth="1.2" strokeDasharray="5,5" />
          <line x1="200" y1="100" x2="600" y2="100" stroke="#0A2342" strokeWidth="0.6" />
          <line x1="200" y1="250" x2="600" y2="250" stroke="#0A2342" strokeWidth="0.6" />
          <line x1="150" y1="450" x2="650" y2="450" stroke="#0A2342" strokeWidth="0.6" />
          <path d="M 400,80 C 430,150 430,220 430,380 L 370,380 C 370,220 370,150 400,80 Z" fill="none" stroke="#0A2342" strokeWidth="1.2" />
          <path d="M 370,280 L 350,300 L 350,420 L 370,410 Z" fill="none" stroke="#0A2342" strokeWidth="1" />
          <path d="M 430,280 L 450,300 L 450,420 L 430,410 Z" fill="none" stroke="#0A2342" strokeWidth="1" />
          <path d="M 370,380 L 310,480 L 370,450 Z" fill="none" stroke="#0A2342" strokeWidth="1.2" />
          <path d="M 430,380 L 490,480 L 430,450 Z" fill="none" stroke="#0A2342" strokeWidth="1.2" />
          <circle cx="400" cy="200" r="120" fill="none" stroke="#0A2342" strokeWidth="0.5" strokeDasharray="2,2" />
          <circle cx="400" cy="350" r="180" fill="none" stroke="#0A2342" strokeWidth="0.5" strokeDasharray="2,2" />
          <text x="415" y="115" fill="#0A2342" fontSize="10" fontFamily="monospace">STAGE 1 / NOZZLE CLADDING</text>
          <text x="415" y="265" fill="#0A2342" fontSize="10" fontFamily="monospace">PAYLOAD BAY / DIA 6200</text>
          <text x="460" y="440" fill="#0A2342" fontSize="10" fontFamily="monospace">R-4500 FINS</text>
        </svg>

        {/* 3A. HEADER RIBBON (Height: 130px) */}
        <div 
          style={{ 
            height: '130px', 
            backgroundColor: '#071A35', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '0 45px', 
            boxSizing: 'border-box' 
          }}
        >
          {/* Logo & Banner Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginLeft: '-15px' }}>
            <img src="/spacekidz_logo.png" alt="Space Kidz India Logo" style={{ width: '180px', height: 'auto', objectFit: 'contain' }} />
            <div style={{ fontSize: '30px', color: '#ffffff', fontWeight: 'bold', fontFamily: 'Orbitron, sans-serif', letterSpacing: '12px' }}>
              BOARDING PASS ✈
            </div>
          </div>

          {/* Stats Ribbon (Dark Blue Card Ribbon style) */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '15px', 
              background: 'rgba(255,255,255,0.06)', 
              border: '1.5px solid rgba(255,255,255,0.15)',
              borderRadius: '10px', 
              padding: '12px 25px' 
            }}
          >
            <div style={{ textAlign: 'right', fontFamily: 'Montserrat, sans-serif' }}>
              <div style={{ fontSize: '20px', color: '#ffffff', fontWeight: 'bold', letterSpacing: '1px' }}>
                ALL-GIRL SPACE MISSION
              </div>
              <div style={{ fontSize: '18px', color: '#00e5ff', fontWeight: '600', letterSpacing: '0.5px', marginTop: '2px' }}>
                12,000 GIRLS | 108 COUNTRIES | 1 UNIVERSE
              </div>
            </div>
            <Globe size={32} style={{ color: '#00e5ff' }} />
          </div>
        </div>

        {/* 3B. CARD BODY (Height: 820px) */}
        <div style={{ flex: 1, position: 'relative', padding: '40px 45px', boxSizing: 'border-box' }}>
          
          {/* Left Column content: Title, Certification text, cards, quote */}
          <div style={{ width: '870px', position: 'absolute', left: '45px', top: '35px' }}>
            
            {/* Mission Title */}
            <div>
              <div style={{ fontSize: '28px', color: '#FF6B35', fontWeight: '800', fontFamily: 'Orbitron, sans-serif', letterSpacing: '2px' }}>
                MISSION
              </div>
              
              {/* Formatted Title with Dotless-ı and Sri Yantra Image */}
              <div style={{ fontSize: '92px', fontFamily: "'Cormorant Garamond', serif", fontWeight: '900', color: '#0A2342', lineHeight: '0.9', letterSpacing: '1px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                Shakth
                <span style={{ position: 'relative', display: 'inline-block', verticalAlign: 'baseline' }}>
                  ı
                  <img 
                    src="/sriyantra.jpg" 
                    alt="dot" 
                    style={{ 
                      width: '0.16em', 
                      height: '0.16em', 
                      borderRadius: '50%',
                      position: 'absolute',
                      top: '0.45em', 
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
              </div>
            </div>

            {/* Certify Label */}
            <div style={{ fontSize: '24px', color: '#FF6B35', fontWeight: 'bold', fontFamily: 'Montserrat, sans-serif', letterSpacing: '3px', marginTop: '35px' }}>
              THIS IS TO CERTIFY THAT
            </div>

            {/* Cursive Signature Participant Name */}
            <div style={{ borderBottom: '2.5px solid #0A2342', width: '820px', paddingBottom: '5px', marginTop: '5px' }}>
              <span style={{ fontSize: '72px', fontFamily: "'Great Vibes', cursive", color: '#000000', fontWeight: 'normal' }}>
                {displayName}
              </span>
            </div>

            {/* Description Paragraph */}
            <div style={{ fontSize: '22px', color: '#37474f', fontFamily: 'Montserrat, sans-serif', lineHeight: '1.6', width: '820px', marginTop: '22px', fontWeight: '500' }}>
              has successfully joined the all-girl space crew of <b style={{ color: '#0A2342', fontFamily: "'Cormorant Garamond', serif", fontWeight: 'bold', fontSize: '24px' }}>Mission ShakthiSAT</b> and is officially recognized as a Future Scientist, Dreamer, Explorer and Changemaker, embarking on a journey beyond limits to inspire the next generation of innovators.
            </div>

            {/* Info Cards Grid (4 in a row) */}
            <div style={{ display: 'flex', gap: '20px', marginTop: '45px', width: '1060px' }}>
              
              {/* Card 1: Launch Date */}
              <div style={{ width: '250px', height: '120px', border: '2px solid #D9E3F0', borderRadius: '14px', padding: '15px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#ffffff' }}>
                <Calendar size={32} style={{ color: '#ff4081' }} />
                <div>
                  <div style={{ fontSize: '14px', color: '#8D99AE', fontWeight: 'bold', letterSpacing: '0.5px' }}>LAUNCH DATE</div>
                  <div style={{ fontSize: '20px', color: '#0A2342', fontWeight: 'bold', fontFamily: 'Montserrat, sans-serif', marginTop: '3px' }}>02 JULY 2026</div>
                </div>
              </div>

              {/* Card 2: Destination */}
              <div style={{ width: '250px', height: '120px', border: '2px solid #D9E3F0', borderRadius: '14px', padding: '15px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#ffffff' }}>
                <SaturnIcon size={32} style={{ color: '#ff4081' }} />
                <div>
                  <div style={{ fontSize: '14px', color: '#8D99AE', fontWeight: 'bold', letterSpacing: '0.5px' }}>DESTINATION</div>
                  <div style={{ fontSize: '18px', color: '#0A2342', fontWeight: 'bold', fontFamily: 'Montserrat, sans-serif', marginTop: '3px', lineHeight: '1.2' }}>INFINITE POSSIBILITIES</div>
                </div>
              </div>

              {/* Card 3: Crew Position */}
              <div style={{ width: '250px', height: '120px', border: '2px solid #D9E3F0', borderRadius: '14px', padding: '15px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#ffffff' }}>
                <User size={32} style={{ color: '#ff4081' }} />
                <div>
                  <div style={{ fontSize: '14px', color: '#8D99AE', fontWeight: 'bold', letterSpacing: '0.5px' }}>CREW POSITION</div>
                  <div style={{ fontSize: '19px', color: '#0A2342', fontWeight: 'bold', fontFamily: 'Montserrat, sans-serif', marginTop: '3px' }}>FUTURE SCIENTIST</div>
                </div>
              </div>

              {/* Card 4: Flight */}
              <div style={{ width: '250px', height: '120px', border: '2px solid #D9E3F0', borderRadius: '14px', padding: '15px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#ffffff' }}>
                <Rocket size={32} style={{ color: '#ff4081' }} />
                <div>
                  <div style={{ fontSize: '14px', color: '#8D99AE', fontWeight: 'bold', letterSpacing: '0.5px' }}>FLIGHT</div>
                  <div style={{ fontSize: '20px', color: '#0A2342', fontWeight: 'bold', fontFamily: 'Montserrat, sans-serif', marginTop: '3px' }}>MS-2026</div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Quote on Left, Scanned Signature next to it */}
            <div style={{ display: 'flex', gap: '40px', marginTop: '45px', alignItems: 'flex-end', width: '920px' }}>
              {/* Inspirational Quote */}
              <div style={{ width: '560px' }}>
                <div style={{ fontSize: '46px', fontWeight: '900', fontFamily: 'Orbitron, sans-serif', color: '#1F5EFF', lineHeight: '1.2', letterSpacing: '1px' }}>
                  YOU ARE PART OF HISTORY.
                </div>
                <div style={{ fontSize: '46px', fontWeight: '900', fontFamily: 'Orbitron, sans-serif', color: '#1F5EFF', lineHeight: '1.2', letterSpacing: '1px' }}>
                  YOU ARE THE FUTURE.
                </div>
                <div style={{ borderBottom: '2.5px solid #FF6B35', width: '200px', margin: '10px 0' }}></div>
                <div style={{ fontSize: '26px', fontWeight: 'bold', fontFamily: 'Montserrat, sans-serif', color: '#FF6B35', letterSpacing: '1.5px', marginTop: '5px' }}>
                  ★ KEEP DREAMING. KEEP EXPLORING. KEEP RISING.
                </div>
              </div>

              {/* Signature Block */}
              <div style={{ width: '320px', textAlign: 'center', paddingBottom: '5px' }}>
                <img 
                  src="/srimathy_signature.png" 
                  alt="Dr. Srimathy Kesan Signature" 
                  style={{ 
                    height: '90px', 
                    width: 'auto', 
                    display: 'block', 
                    margin: '0 auto 10px',
                    mixBlendMode: 'multiply' 
                  }} 
                />
                <div style={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'Montserrat, sans-serif', color: '#0A2342', letterSpacing: '0.5px' }}>
                  DR. SRIMATHY KESAN
                </div>
                <div style={{ fontSize: '18px', fontWeight: '600', fontFamily: 'Montserrat, sans-serif', color: '#8D99AE', marginTop: '2px' }}>
                  Founder & CEO, Space Kidz India
                </div>
              </div>
            </div>
          </div>

          {/* Right Column elements: Mission ID, QR Code, Patch, Official Seal */}
          <div style={{ position: 'absolute', left: '925px', top: '35px', width: '438px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            
            {/* Top row of right col: Mission ID & QR Code */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '24px', color: '#0A2342', fontWeight: 'bold', fontFamily: 'Orbitron, sans-serif', letterSpacing: '2px' }}>
                  MISSION ID
                </div>
                <div style={{ fontSize: '30px', color: '#FF6B35', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '0.5px', marginTop: '5px' }}>
                  {passId}
                </div>
              </div>
              <QRCodeGraphic size={180} />
            </div>

            {/* Mission Patch (430x430 px) */}
            <div style={{ marginTop: '35px' }}>
              <MissionPatchSVG size={430} />
            </div>

            {/* Official Seal (220x220 px) */}
            <div style={{ marginTop: '25px', marginRight: '30px' }}>
              <BlueSealSVG size={220} />
            </div>
          </div>

        </div>

        {/* 3C. BOTTOM DARK FOOTER (Height: 150px) */}
        <div 
          style={{ 
            height: '150px', 
            backgroundColor: '#071A35', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8px', 
            padding: '10px 45px', 
            boxSizing: 'border-box' 
          }}
        >
          {/* Full-width Barcode (1100 px Wide) */}
          <Barcode width={1100} height={70} />
          
          <div 
            style={{ 
              width: '1100px', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              fontFamily: 'Montserrat, sans-serif', 
              color: '#ffffff',
              marginTop: '4px'
            }}
          >
            <div style={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>
              {passId}
            </div>
            
            <div style={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'Orbitron, sans-serif', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '1px' }}>
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
        <div className="certificate-preview-container" style={{ height: `${1100 * scale + 20}px`, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div ref={wrapperRef} style={{ width: '100%', maxWidth: '900px', height: `${1100 * scale}px`, position: 'relative' }}>
            <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', position: 'absolute', top: 0, left: 0 }}>
              {boardingPassHTML}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Inline visual representation */}
      <div className="certificate-display-wrapper" style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '1rem' }}>
        <div ref={wrapperRef} style={{ width: '100%', maxWidth: '900px', height: `${1100 * scale}px`, position: 'relative' }}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', position: 'absolute', top: 0, left: 0 }}>
            {boardingPassHTML}
          </div>
        </div>
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
