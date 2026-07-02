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
const BlueSealSVG = ({ size = 220, opacity = 0.25 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'block', opacity: opacity, filter: 'drop-shadow(0 4px 8px rgba(13, 71, 161, 0.25))' }}>
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

// Vector graphic of the circular mission patch (420x420 px scaled with premium textures)
const MissionPatchSVG = ({ size = 420 }) => (
  <svg viewBox="0 0 200 200" width={size} height={size} style={{ display: 'block', margin: '0 auto', filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.3))' }}>
    <defs>
      <path id="curve-top" d="M 30,100 A 70,70 0 0,1 170,100" fill="none" />
      <path id="curve-bottom" d="M 170,100 A 70,70 0 0,1 30,100" fill="none" />
      {/* Radial lighting glow */}
      <radialGradient id="patch-glow" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#1f143a" />
        <stop offset="60%" stopColor="#0c0414" />
        <stop offset="100%" stopColor="#050209" />
      </radialGradient>
      {/* Thread/stitch pattern representation */}
      <pattern id="stitch-pattern" width="6" height="6" patternUnits="userSpaceOnUse">
        <line x1="0" y1="3" x2="6" y2="3" stroke="rgba(255,255,255,0.04)" strokeWidth="0.8" />
        <line x1="3" y1="0" x2="3" y2="6" stroke="rgba(255,255,255,0.04)" strokeWidth="0.8" />
      </pattern>
    </defs>
    
    {/* Base Patch Borders with Stitched feel */}
    <circle cx="100" cy="100" r="95" fill="#0d47a1" stroke="#00e5ff" strokeWidth="2.5" />
    <circle cx="100" cy="100" r="92" fill="url(#patch-glow)" />
    <circle cx="100" cy="100" r="92" fill="url(#stitch-pattern)" />
    <circle cx="100" cy="100" r="85" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3,1.5" />
    <circle cx="100" cy="100" r="77" fill="none" stroke="#d4af37" strokeWidth="1.2" strokeDasharray="4,2" />
    
    {/* Curved Texts */}
    <text fill="#ffd700" fontSize="10" fontWeight="bold" letterSpacing="1.4px" fontFamily="Orbitron, sans-serif">
      <textPath href="#curve-top" startOffset="50%" textAnchor="middle">MISSION SHAKTHISAT</textPath>
    </text>
    <text fill="#00e5ff" fontSize="7.8" fontWeight="bold" letterSpacing="0.9px" fontFamily="Montserrat, sans-serif">
      <textPath href="#curve-bottom" startOffset="50%" textAnchor="middle">DREAM • DISCOVER • EMPOWER</textPath>
    </text>
    
    {/* Earth Arc at the bottom with atmospheric lighting */}
    <path d="M 32,120 A 68,68 0 0,0 168,120 Z" fill="#0d47a1" opacity="0.8" />
    <path d="M 32,120 A 68,68 0 0,0 168,120" stroke="#00e5ff" strokeWidth="1.8" fill="none" />
    
    {/* Celestial elements */}
    <circle cx="65" cy="70" r="1" fill="#ffffff" />
    <circle cx="75" cy="55" r="1.5" fill="#ffffff" />
    <circle cx="140" cy="65" r="1" fill="#ffffff" />
    <circle cx="130" cy="85" r="1.2" fill="#ffd700" />
    <circle cx="90" cy="50" r="0.8" fill="#ffffff" />
    <circle cx="150" cy="95" r="1.2" fill="#ffffff" />
    <circle cx="170" cy="60" r="1" fill="#ffffff" />
    
    {/* Moon */}
    <circle cx="155" cy="68" r="4" fill="#cfd8dc" opacity="0.9" />
    <circle cx="154" cy="67" r="1" fill="#90a4ae" opacity="0.5" />
    
    {/* Orange Mars Planet */}
    <circle cx="55" cy="85" r="6.5" fill="#ff5722" />
    <path d="M 49,85 Q 55,87 61,85" stroke="rgba(0,0,0,0.15)" strokeWidth="0.8" fill="none" />
    
    {/* Satellite */}
    <g transform="translate(130, 42) scale(0.65)">
      <rect x="0" y="4" width="8" height="6" fill="#00e5ff" rx="1" />
      <rect x="-8" y="6" width="8" height="2" fill="#ffd700" />
      <rect x="8" y="6" width="8" height="2" fill="#ffd700" />
      <circle cx="4" cy="4" r="2" fill="#ffffff" />
    </g>
    
    {/* Girl Silhouette looking at the Earth */}
    <circle cx="100" cy="94" r="7.5" fill="#ffffff" />
    <path d="M 94,94 C 90,92 88,97 86,97 C 88,99 92,97 94,96" fill="#ffffff" />
    <rect x="98" y="99" width="4" height="4" fill="#ffffff" />
    <path d="M 84,122 L 116,122 L 109,103 L 91,103 Z" fill="#ffffff" />
    <text x="100" y="112" fill="#0c0414" fontSize="4.5" fontWeight="900" textAnchor="middle" fontFamily="Montserrat, sans-serif">FUTURE SCIENTIST</text>
  </svg>
);

// Barcode rendering
const Barcode = ({ width = 900, height = 45 }) => {
  const linePattern = [
    2, 1, 3, 1, 1, 2, 4, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 4, 1, 2, 
    2, 1, 3, 1, 1, 2, 4, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 4, 1, 2,
    2, 1, 3, 1, 1, 2, 4, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 4, 1, 2,
    2, 1, 3, 1, 1, 2, 4, 1, 2, 3, 1, 2, 1, 1, 2
  ];
  return (
    <div style={{ display: 'flex', height: `${height}px`, background: '#ffffff', padding: '3px', alignItems: 'stretch', width: `${width}px`, justifyContent: 'center', boxSizing: 'border-box' }}>
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

// QR Code block (210x210 px scaled with padding)
const QRCodeGraphic = ({ size = 210 }) => (
  <div style={{ width: `${size}px`, height: `${size}px`, border: '4px solid #071A35', padding: '20px', background: '#ffffff', display: 'grid', gridTemplateColumns: 'repeat(11, 1fr)', gap: '2px', boxSizing: 'border-box', borderRadius: '8px' }}>
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
      <div key={idx} style={{ backgroundColor: val ? '#071A35' : '#ffffff' }} />
    ))}
  </div>
);

function BoardingPass({ submission, isPreview = false }) {
  const displayName = submission?.fullName || "Maha";
  const submissionId = submission?.id || 847;

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

  // Generate unique Boarding Pass ID in format MS25-XXXX-XXXX-XXXX matching user spec
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

  const handleDownload = () => {
    try {
      if (isPreview) return;
      const element = document.getElementById('boarding-pass-print-area');
      if (!element) return;
      
      const originalTransform = element.style.transform;
      element.style.transform = 'scale(1)';
      
      import('html2canvas').then((html2canvas) => {
        html2canvas.default(element, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#FCFCFB',
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
        backgroundColor: '#FCFCFB', 
        borderRadius: '30px', 
        display: 'flex', 
        overflow: 'hidden', 
        position: 'relative', 
        boxSizing: 'border-box',
        border: '2px solid #071A35',
        boxShadow: '0 25px 75px rgba(0, 0, 0, 0.25)'
      }}
    >
      {/* 1. LEFT TICKET STUB (390 px Wide) */}
      <div 
        style={{ 
          width: '390px', 
          height: '100%', 
          background: 'linear-gradient(to bottom, #061A40 0%, #0A2342 100%)', 
          position: 'relative', 
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
      >
        {/* Subtle Constellations, Stars, Blueprint Lines Overlay */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.55 }}>
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

        {/* Space Kidz logo (Top-left, sharp white logo using filter invert) */}
        <img 
          src="/spacekidz_logo.png" 
          alt="Space Kidz India Logo" 
          style={{ 
            position: 'absolute', 
            left: '45px', 
            top: '40px', 
            width: '180px', 
            height: 'auto',
            objectFit: 'contain',
            filter: 'brightness(0) invert(1)'
          }} 
        />

        {/* Title & Tagline Group */}
        <div style={{ position: 'absolute', left: '45px', top: '140px', width: '300px', textAlign: 'left' }}>
          <div style={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'Orbitron, sans-serif', color: '#ffffff', letterSpacing: '2px', textTransform: 'uppercase' }}>
            MISSION SHAKTHISAT
          </div>
          <div style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'Montserrat, sans-serif', color: '#00e5ff', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '6px' }}>
            GIRLS • SPACE • STEM • FUTURE
          </div>
        </div>

        {/* Photorealistic Rocket Launch (centered vertically) */}
        <img 
          src="/realistic_rocket.png" 
          alt="Photorealistic Rocket Launch" 
          style={{ 
            position: 'absolute', 
            left: '20px', 
            top: '245px', 
            width: '350px', 
            height: '500px', 
            objectFit: 'contain'
          }} 
        />

        {/* Caption */}
        <div style={{ position: 'absolute', left: '20px', top: '765px', width: '350px', textAlign: 'center', fontFamily: 'Montserrat, sans-serif' }}>
          <div style={{ fontSize: '30px', fontWeight: '900', color: '#ffffff', letterSpacing: '0.5px' }}>
            LAUNCH YOUR DREAMS.
          </div>
          <div style={{ fontSize: '30px', fontWeight: '900', color: '#00e5ff', letterSpacing: '0.5px', marginTop: '2px' }}>
            INSPIRE THE UNIVERSE.
          </div>
        </div>

        {/* PASS ID Card Box (Clean black background, red Pass ID text) */}
        <div 
          style={{ 
            position: 'absolute', 
            left: '35px', 
            top: '850px', 
            width: '320px', 
            height: '175px', 
            backgroundColor: '#000000', 
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
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', color: '#ffffff', fontWeight: 'bold', fontFamily: 'Orbitron, sans-serif', letterSpacing: '1px' }}>
              PASS ID
            </div>
            <div style={{ fontSize: '24px', color: '#ff1744', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '0.5px', marginTop: '2px' }}>
              {passId}
            </div>
          </div>
          <Barcode width={285} height={45} />
        </div>

        {/* Tear Here Label */}
        <div 
          style={{ 
            position: 'absolute', 
            left: '20px', 
            top: '1052px', 
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
          borderLeft: '3px dashed #8D99AE', 
          zIndex: 10 
        }} 
      />

      {/* 3. RIGHT MAIN BOARDING PASS (1408 px Wide) */}
      <div 
        style={{ 
          width: '1408px', 
          height: '100%', 
          backgroundColor: '#FFFFFF', 
          position: 'relative', 
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Faint Constellation, Orbit and Blueprint Watermark (10% Opacity) */}
        <svg style={{ position: 'absolute', top: '10%', left: '12%', width: '70%', height: '80%', pointerEvents: 'none', opacity: 0.10 }} viewBox="0 0 800 600">
          <line x1="400" y1="50" x2="400" y2="550" stroke="#0A2342" strokeWidth="1.2" strokeDasharray="5,5" />
          <line x1="200" y1="100" x2="600" y2="100" stroke="#0A2342" strokeWidth="0.6" />
          <line x1="200" y1="250" x2="600" y2="250" stroke="#0A2342" strokeWidth="0.6" />
          <line x1="150" y1="450" x2="650" y2="450" stroke="#0A2342" strokeWidth="0.6" />
          <path d="M 250,150 L 300,100 L 400,200 L 480,180" fill="none" stroke="#0A2342" strokeWidth="0.75" strokeDasharray="2,2" />
          <circle cx="250" cy="150" r="3" fill="#0A2342" />
          <circle cx="300" cy="100" r="3" fill="#0A2342" />
          <circle cx="400" cy="200" r="3" fill="#0A2342" />
          <circle cx="480" cy="180" r="3" fill="#0A2342" />
          <path d="M 400,80 C 430,150 430,220 430,380 L 370,380 C 370,220 370,150 400,80 Z" fill="none" stroke="#0A2342" strokeWidth="1.2" />
          <circle cx="400" cy="200" r="120" fill="none" stroke="#0A2342" strokeWidth="0.5" strokeDasharray="2,2" />
        </svg>

        {/* 3A. HEADER RIBBON (Height: 120px) */}
        <div 
          style={{ 
            height: '120px', 
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
            <div style={{ fontSize: '24px', color: '#ffffff', fontWeight: 'bold', fontFamily: 'Montserrat, sans-serif', letterSpacing: '1px' }}>
              ALL-GIRL SPACE MISSION
            </div>
            <div style={{ fontSize: '18px', color: '#00e5ff', fontWeight: '600', letterSpacing: '0.5px', marginLeft: '10px' }}>
              12,000 GIRLS | 108 COUNTRIES | 1 UNIVERSE
            </div>
          </div>

          <Globe size={28} style={{ color: '#00e5ff' }} />
        </div>

        {/* 3B. CARD BODY (Height: 830px) */}
        <div style={{ flex: 1, position: 'relative', padding: '40px 45px', boxSizing: 'border-box' }}>
          
          {/* Embossed Background Seal (low opacity, 25%) */}
          <div style={{ position: 'absolute', left: '1100px', top: '560px', pointerEvents: 'none' }}>
            <BlueSealSVG size={220} opacity={0.25} />
          </div>

          {/* Left Column content: Title, Certification text, cards, quote */}
          <div style={{ width: '870px', position: 'absolute', left: '45px', top: '35px' }}>
            
            {/* Main Title (Center aligned with Name) */}
            <div style={{ width: '820px', textAlign: 'center', fontFamily: 'Orbitron, sans-serif', color: '#071A35' }}>
              <div style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '8px' }}>
                BOARDING PASS
              </div>
              <div style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '5px', marginTop: '10px', fontFamily: 'Montserrat, sans-serif' }}>
                MISSION
              </div>
              <div style={{ fontSize: '72px', fontWeight: '900', letterSpacing: '2px', marginTop: '-3px' }}>
                SHAKTHISAT
              </div>
            </div>

            {/* Certify Label (Montserrat SemiBold, 24px, centered blue text) */}
            <div style={{ fontSize: '24px', color: '#1f5eff', fontWeight: 'bold', fontFamily: 'Montserrat, sans-serif', letterSpacing: '3px', marginTop: '30px', textAlign: 'center', width: '820px' }}>
              THIS IS TO CERTIFY THAT
            </div>

            {/* Cursive Signature Participant Name over a fine underline */}
            <div style={{ borderBottom: '1px solid #1B1B1B', width: '450px', paddingBottom: '3px', marginTop: '5px', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}>
              <span style={{ fontSize: '48px', fontFamily: "'Great Vibes', cursive", color: '#1B1B1B', fontWeight: 'normal' }}>
                {displayName}
              </span>
            </div>

            {/* Centered blue paragraph (650px wide, center-aligned, 20px font, 1.6 spacing) */}
            <div style={{ width: '820px', display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <div style={{ fontSize: '20px', color: '#1f5eff', fontFamily: 'Montserrat, sans-serif', lineHeight: '1.6', width: '650px', textAlign: 'center', fontWeight: '500' }}>
                has successfully joined the all-girl space crew of MISSION SHAKTHISAT and is now officially a future scientist, dreamer and changemaker blasting off towards the stars!
              </div>
            </div>

            {/* Info Cards Grid (Titles in light blue, Data in bold dark text) */}
            <div style={{ display: 'flex', gap: '15px', marginTop: '35px', width: '1060px' }}>
              
              {/* Card 1: Launch Date */}
              <div style={{ width: '250px', height: '140px', border: '2px solid #D9E3F0', borderRadius: '12px', padding: '15px 20px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#ffffff' }}>
                <Calendar size={22} style={{ color: '#1f5eff' }} />
                <div>
                  <div style={{ fontSize: '12px', color: '#00e5ff', fontWeight: 'bold', letterSpacing: '1px' }}>L-A-U-N-C-H DATE</div>
                  <div style={{ fontSize: '18px', color: '#071A35', fontWeight: 'bold', fontFamily: 'Montserrat, sans-serif', marginTop: '4px' }}>01 MAY 2025</div>
                </div>
              </div>

              {/* Card 2: Destination */}
              <div style={{ width: '250px', height: '140px', border: '2px solid #D9E3F0', borderRadius: '12px', padding: '15px 20px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#ffffff' }}>
                <SaturnIcon size={22} style={{ color: '#1f5eff' }} />
                <div>
                  <div style={{ fontSize: '12px', color: '#00e5ff', fontWeight: 'bold', letterSpacing: '1px' }}>DESTINATION</div>
                  <div style={{ fontSize: '18px', color: '#071A35', fontWeight: 'bold', fontFamily: 'Montserrat, sans-serif', marginTop: '4px', lineHeight: '1.2' }}>INFINITE POSSIBILITIES</div>
                </div>
              </div>

              {/* Card 3: Crew Position */}
              <div style={{ width: '250px', height: '140px', border: '2px solid #D9E3F0', borderRadius: '12px', padding: '15px 20px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#ffffff' }}>
                <User size={22} style={{ color: '#1f5eff' }} />
                <div>
                  <div style={{ fontSize: '12px', color: '#00e5ff', fontWeight: 'bold', letterSpacing: '1px' }}>CREW POSITION</div>
                  <div style={{ fontSize: '18px', color: '#071A35', fontWeight: 'bold', fontFamily: 'Montserrat, sans-serif', marginTop: '4px' }}>FUTURE SCIENTIST</div>
                </div>
              </div>

              {/* Card 4: Flight */}
              <div style={{ width: '250px', height: '140px', border: '2px solid #D9E3F0', borderRadius: '12px', padding: '15px 20px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#ffffff' }}>
                <Rocket size={22} style={{ color: '#1f5eff' }} />
                <div>
                  <div style={{ fontSize: '12px', color: '#00e5ff', fontWeight: 'bold', letterSpacing: '1px' }}>FLIGHT</div>
                  <div style={{ fontSize: '20px', color: '#071A35', fontWeight: 'bold', fontFamily: 'Montserrat, sans-serif', marginTop: '4px' }}>MS-2025</div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Quote and Signature */}
            <div style={{ display: 'flex', gap: '40px', marginTop: '40px', alignItems: 'flex-end', width: '920px' }}>
              {/* Inspirational Quote (centered blue quote) */}
              <div style={{ width: '560px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: '900', fontFamily: 'Orbitron, sans-serif', color: '#1f5eff', lineHeight: '1.2', letterSpacing: '1px' }}>
                  YOU ARE PART OF HISTORY.
                </div>
                <div style={{ fontSize: '32px', fontWeight: '900', fontFamily: 'Orbitron, sans-serif', color: '#1f5eff', lineHeight: '1.2', letterSpacing: '1px' }}>
                  YOU ARE THE FUTURE.
                </div>
                <div style={{ borderBottom: '1.5px solid #ff1744', width: '200px', margin: '10px auto' }}></div>
                <div style={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'Montserrat, sans-serif', color: '#ff1744', letterSpacing: '1px', marginTop: '5px' }}>
                  ★ KEEP DREAMING. KEEP EXPLORING. KEEP RISING.
                </div>
              </div>

              {/* Signature Block (on the right side of quote) */}
              <div style={{ width: '320px', textAlign: 'center', paddingBottom: '5px' }}>
                <div style={{ borderBottom: '1px solid #8D99AE', width: '220px', margin: '0 auto 10px' }}>
                  <img 
                    src="/srimathy_signature.png" 
                    alt="Dr. Srimathy Kesan Signature" 
                    style={{ 
                      height: '75px', 
                      width: 'auto', 
                      display: 'block', 
                      margin: '0 auto',
                      mixBlendMode: 'multiply' 
                    }} 
                  />
                </div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'Montserrat, sans-serif', color: '#071A35', letterSpacing: '0.5px' }}>
                  DR. SRIMATHY KESAN
                </div>
                <div style={{ fontSize: '16px', fontWeight: '600', fontFamily: 'Montserrat, sans-serif', color: '#8D99AE', marginTop: '2px' }}>
                  Founder & CEO, Space Kidz India
                </div>
              </div>
            </div>
          </div>

          {/* Right Column elements: Mission ID, QR Code, Patch */}
          <div style={{ position: 'absolute', left: '925px', top: '25px', width: '438px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            
            {/* Top row of right col: Mission ID (red ID) & QR Code */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '20px', color: '#071A35', fontWeight: 'bold', fontFamily: 'Orbitron, sans-serif', letterSpacing: '2px' }}>
                  MISSION ID
                </div>
                <div style={{ fontSize: '30px', color: '#ff1744', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '0.5px', marginTop: '3px' }}>
                  {passId}
                </div>
              </div>
              <QRCodeGraphic size={210} />
            </div>

            {/* Mission Patch emblem for MISSION SHAKTHISAT (420x420 px) */}
            <div style={{ marginTop: '30px' }}>
              <MissionPatchSVG size={420} />
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
          {/* Horizontal Barcode strip */}
          <Barcode width={900} height={45} />
          
          <div 
            style={{ 
              width: '900px', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              fontFamily: 'Montserrat, sans-serif', 
              color: '#ffffff',
              marginTop: '2px'
            }}
          >
            <div style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>
              {passId}
            </div>
            
            <div style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'Orbitron, sans-serif', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '1px' }}>
              <span>SECURE YOUR DREAMS. THE UNIVERSE IS WAITING.</span>
            </div>

            <SaturnIcon size={32} color="#ffffff" />
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
