import { useState, useEffect, useRef } from 'react';
import './App.css';
import logo from './assets/images/logo.png';
import minepic from './assets/images/minepic.png';
import hollowmine from './assets/images/hollowmine.png';
import eyeball from './assets/images/eyeball.png';
import eyebg from './assets/images/eyebg.png';
import hdbg from './assets/videos/hdbg.mp4';

const menuItems = [
  'WORKS',
  'TECH STACKS',
  'EDUCATION',
  'RESUME',
  'CONTACT',
  'ABOUT'
];

export default function App() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMenuHovered, setIsMenuHovered] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const [leftOffset, setLeftOffset] = useState({ x: 0, y: -3.5 });
  const [rightOffset, setRightOffset] = useState({ x: 0, y: -3.5 });
  const [portraitShiftX, setPortraitShiftX] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [shouldRenderLoader, setShouldRenderLoader] = useState(true);

  // Asset preloading
  useEffect(() => {
    const assets = [logo, hollowmine, eyeball, eyebg, hdbg];
    let loadedCount = 0;
    const totalAssets = assets.length;

    const onAssetLoaded = () => {
      loadedCount++;
      if (loadedCount === totalAssets) {
        setIsLoading(false);
      }
    };

    // Safety timeout of 6 seconds
    const safetyTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 6000);

    assets.forEach((src) => {
      if (src.endsWith('.mp4')) {
        const video = document.createElement('video');
        video.src = src;
        video.muted = true;
        video.oncanplaythrough = onAssetLoaded;
        video.onerror = onAssetLoaded;
        video.load();
      } else {
        const img = new Image();
        img.src = src;
        img.onload = onAssetLoaded;
        img.onerror = onAssetLoaded;
      }
    });

    return () => clearTimeout(safetyTimeout);
  }, []);

  // Handle unmounting after fade-out transition completes (500ms)
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShouldRenderLoader(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  useEffect(() => {
    let timeoutId: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }

      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Center of left and right eye in pixels relative to viewport
      const leftCenterX = rect.left + width * 0.44726;
      const leftCenterY = rect.top + height * 0.46538;

      const rightCenterX = rect.left + width * 0.59443;
      const rightCenterY = rect.top + height * 0.47538;

      // Mouse vector and distance
      const dxLeft = e.clientX - leftCenterX;
      const dyLeft = e.clientY - leftCenterY;
      const distLeft = Math.sqrt(dxLeft * dxLeft + dyLeft * dyLeft);

      const dxRight = e.clientX - rightCenterX;
      const dyRight = e.clientY - rightCenterY;
      const distRight = Math.sqrt(dxRight * dxRight + dyRight * dyRight);

      // Clamping travel distance relative to scaled wrapper width
      const maxRadius = width * 0.012;

      if (distLeft > 0) {
        const limitLeft = Math.min(distLeft * 0.05, maxRadius);
        const angleLeft = Math.atan2(dyLeft, dxLeft);
        setLeftOffset({
          x: Math.cos(angleLeft) * limitLeft,
          y: Math.sin(angleLeft) * limitLeft
        });
      } else {
        setLeftOffset({ x: 0, y: -3.5 });
      }

      if (distRight > 0) {
        const limitRight = Math.min(distRight * 0.05, maxRadius);
        const angleRight = Math.atan2(dyRight, dxRight);
        setRightOffset({
          x: Math.cos(angleRight) * limitRight,
          y: Math.sin(angleRight) * limitRight
        });
      } else {
        setRightOffset({ x: 0, y: -3.5 });
      }

      // Calculate portrait shift based on mouse X coordinate relative to container center
      const portraitCenterX = rect.left + rect.width / 2;
      const dxContainer = e.clientX - portraitCenterX;
      // Shift up to +/- 3px
      const shiftX = Math.max(-3, Math.min(3, -(dxContainer * 0.015)));
      setPortraitShiftX(shiftX);

      // Reset to center after 1.5s of inactivity
      timeoutId = window.setTimeout(() => {
        setLeftOffset({ x: 0, y: -3.5 });
        setRightOffset({ x: 0, y: -3.5 });
        setPortraitShiftX(0);
      }, 1000);
    };

    const handleMouseLeave = () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      setLeftOffset({ x: 0, y: -3.5 });
      setRightOffset({ x: 0, y: -3.5 });
      setPortraitShiftX(0);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <div className="home">
      {shouldRenderLoader && (
        <div className={`preloader ${!isLoading ? 'fade-out' : ''}`}>
          <img className="preloader-logo" src={logo} alt="OD Logo" />
          <div className="preloader-text">LOAD OJAS</div>
        </div>
      )}
      <video
        className="bg-video"
        src={hdbg}
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="name-block">
        <span className='texttrans' style={{transition: 'color 0.3s ease'}}>OJAS</span>
        <span className="name-block2">DHAR</span>
        <span className="name-block2" style={{fontSize: '25.5px'}}>GAVE</span>
      </div>

      <img className="brand-logo" src={logo} alt="OD logo" />

      <nav 
        className="menu" 
        aria-label="Primary"
        onMouseEnter={() => setIsMenuHovered(true)}
        onMouseLeave={() => {
          setIsMenuHovered(false);
          setHoveredIndex(null);
        }}
      >
        <div className="menu-inner">
          <ul>
            {menuItems.map((item, index) => (
              <li 
                key={item}
                onMouseEnter={() => setHoveredIndex(index)}
              >
                <span className={hoveredIndex === index ? 'active' : ''}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
          
          <div className={`slider-track ${isMenuHovered ? 'visible' : ''}`}>
            <div 
              className={`slider-thumb ${hoveredIndex !== null ? 'visible' : ''}`}
              style={{
                top: hoveredIndex !== null
                  ? `calc(${hoveredIndex} * 20%)`
                  : '0%'
              }}
            />
          </div>
        </div>
      </nav>

      <div className="portrait-wrap">
        {/*
        <img
          className="portrait"
          src={minepic}
          alt="Ojas Dhar Gave portrait"
        />
        */}
        <div className="portrait-container" ref={containerRef} style={{ transform: `translateX(${portraitShiftX}px)` }}>
          {/* Bottom Layer: Eye backgrounds */}
          <img
            className="eye-bg"
            src={eyebg}
            alt="Left eye background"
            style={{ left: '44.73%', top: '46.54%' }}
          />
          <img
            className="eye-bg"
            src={eyebg}
            alt="Right eye background"
            style={{ left: '59.44%', top: '47.54%' }}
          />

          {/* Middle Layer: Eyeballs */}
          <img
            className="eyeball"
            src={eyeball}
            alt="Left eyeball"
            style={{
              left: '44.73%',
              top: '46.54%',
              transform: `translate(-50%, -50%) translate(${leftOffset.x}px, ${leftOffset.y}px)`
            }}
          />
          <img
            className="eyeball"
            src={eyeball}
            alt="Right eyeball"
            style={{
              left: '59.44%',
              top: '47.54%',
              transform: `translate(-50%, -50%) translate(${rightOffset.x}px, ${rightOffset.y}px)`
            }}
          />

          {/* Top Layer: Hollow portrait */}
          <img
            className="portrait-front"
            src={hollowmine}
            alt="Ojas Dhar Gave portrait"
          />
        </div>
      </div>

      <div className="left-block">
        <div className="title" style={{marginBottom:'30px'}}>FULL STACK <span className='texttrans' style={{transition: 'color 0.3s ease'}}>DEVOPS</span> <br/>ENGINEER </div>
        <div className="title">CREATIVE <span className='texttrans' style={{transition: 'color 0.3s ease'}}>DESIGNER</span> <br/>& <span className='texttrans' style={{transition: 'color 0.3s ease'}}>DEVELOPER</span></div>
        <div className="year">©2026</div>
      </div>

      <div className="right-block">
        <div className="location-label">CURRENTLY BASED IN <br/><a href="https://maps.google.com/?q=Nagpur" target="_blank" rel="noopener noreferrer" className='texttrans' style={{transition: 'color 0.3s ease'}}>NAG</a> | <a href="https://maps.google.com/?q=Ahmedabad" target="_blank" rel="noopener noreferrer" className='texttrans' style={{transition: 'color 0.3s ease'}}>AMD</a></div>
      </div>
    </div>
  );
}
