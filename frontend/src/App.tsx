import { useState, useEffect, useRef } from 'react';
import './App.css';
import logo from './assets/images/logo.png';
import minepic from './assets/images/minepic.png';
import hollowmine from './assets/images/hollowmine.png';
import eyeball from './assets/images/eyeball.png';
import eyebg from './assets/images/eyebg.png';
import hdbg from './assets/videos/hdbg.mp4';
// @ts-ignore
import movesCabseFont from './assets/fonts/MovesCabse-Regular.ttf';
import LiquidDistortion from './components/LiquidDistortion';

const menuItems = [
  'WORKS',
  'TECH STACKS',
  'EDUCATION',
  'RESUME',
  'CONTACT',
  'ABOUT'
];

// Helper to create cubic-bezier easing function
function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  return function(t: number) {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    
    let tGuess = t;
    for (let i = 0; i < 8; i++) {
      const x = 3 * Math.pow(1 - tGuess, 2) * tGuess * x1 + 3 * (1 - tGuess) * Math.pow(tGuess, 2) * x2 + Math.pow(tGuess, 3);
      const dx = 3 * Math.pow(1 - tGuess, 2) * x1 + 6 * (1 - tGuess) * tGuess * (x2 - x1) + 3 * Math.pow(tGuess, 2) * (1 - x2);
      if (Math.abs(dx) < 1e-6) break;
      tGuess -= (x - t) / dx;
    }
    
    return 3 * Math.pow(1 - tGuess, 2) * tGuess * y1 + 3 * (1 - tGuess) * Math.pow(tGuess, 2) * y2 + Math.pow(tGuess, 3);
  };
}

const ease = cubicBezier(0.25, 1, 0.5, 1);

export default function App() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMenuHovered, setIsMenuHovered] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const [leftOffset, setLeftOffset] = useState({ x: 0, y: -3.5 });
  const [rightOffset, setRightOffset] = useState({ x: 0, y: -3.5 });
  const [portraitShiftX, setPortraitShiftX] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [shouldRenderLoader, setShouldRenderLoader] = useState(true);
  const [isWebGLActive, setIsWebGLActive] = useState(false);

  const [scrollProgress, setScrollProgress] = useState(0);
  const targetScrollRef = useRef(0);
  const currentScrollRef = useRef(0);

  const [progress, setProgress] = useState(0);

  // Preloaded URLs initialized to the static imports as fallbacks
  const [logoUrl, setLogoUrl] = useState(logo);
  const [minepicUrl, setMinepicUrl] = useState(minepic);
  const [hollowmineUrl, setHollowmineUrl] = useState(hollowmine);
  const [eyeballUrl, setEyeballUrl] = useState(eyeball);
  const [eyebgUrl, setEyebgUrl] = useState(eyebg);
  const [hdbgUrl, setHdbgUrl] = useState(hdbg);

  // Asset preloading with progress tracking
  useEffect(() => {
    const assetsToLoad = [
      { key: 'logo', src: logo, size: 2273 },
      { key: 'minepic', src: minepic, size: 2426407 },
      { key: 'hollowmine', src: hollowmine, size: 2447583 },
      { key: 'eyeball', src: eyeball, size: 5184 },
      { key: 'eyebg', src: eyebg, size: 19807 },
      { key: 'hdbg', src: hdbg, size: 3092733 },
      { key: 'movesCabseFont', src: movesCabseFont, size: 109040 }
    ];

    const loadedBytes: Record<string, number> = {};
    const totalBytes = assetsToLoad.reduce((acc, a) => acc + a.size, 0);
    const objectUrls: string[] = [];

    const updateProgress = () => {
      const currentLoaded = Object.values(loadedBytes).reduce((acc, bytes) => acc + bytes, 0);
      const percent = Math.min(99, Math.round((currentLoaded / totalBytes) * 99)); // Keep at 99% until fonts.ready is done
      setProgress(percent);
    };

    const fetchAsset = async (asset: typeof assetsToLoad[0]) => {
      try {
        const response = await fetch(asset.src);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        
        const reader = response.body?.getReader();
        if (!reader) {
          // Fallback if ReadableStream reader is not available
          const blob = await response.blob();
          loadedBytes[asset.key] = asset.size;
          updateProgress();
          return blob;
        }

        const chunks: Uint8Array[] = [];
        let loaded = 0;
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            chunks.push(value);
            loaded += value.length;
            loadedBytes[asset.key] = loaded;
            updateProgress();
          }
        }
        return new Blob(chunks);
      } catch (error) {
        console.warn(`Failed to dynamically fetch asset ${asset.key}:`, error);
        // Mark as fully loaded to prevent blockages
        loadedBytes[asset.key] = asset.size;
        updateProgress();
        // Return fallback
        const fallbackResponse = await fetch(asset.src);
        return await fallbackResponse.blob();
      }
    };

    let active = true;

    const startPreloading = async () => {
      try {
        const promises = assetsToLoad.map(async (asset) => {
          const blob = await fetchAsset(asset);
          if (!active) return;

          const objectUrl = URL.createObjectURL(blob);
          objectUrls.push(objectUrl);

          if (asset.key === 'logo') setLogoUrl(objectUrl);
          else if (asset.key === 'minepic') setMinepicUrl(objectUrl);
          else if (asset.key === 'hollowmine') setHollowmineUrl(objectUrl);
          else if (asset.key === 'eyeball') setEyeballUrl(objectUrl);
          else if (asset.key === 'eyebg') setEyebgUrl(objectUrl);
          else if (asset.key === 'hdbg') setHdbgUrl(objectUrl);
          else if (asset.key === 'movesCabseFont') {
            try {
              const fontFace = new FontFace('Moves Cabse', `url(${objectUrl})`);
              const loadedFont = await fontFace.load();
              document.fonts.add(loadedFont);
            } catch (err) {
              console.error('Failed to load FontFace:', err);
            }
          }
        });

        await Promise.all(promises);

        if (!active) return;

        // Ensure all fonts are ready (including CSS imported Cabin)
        try {
          await document.fonts.ready;
        } catch (e) {
          console.warn('document.fonts.ready failed or timed out:', e);
        }

        setProgress(100);
        setIsLoading(false);
      } catch (err) {
        console.error('Preloading error:', err);
        setProgress(100);
        setIsLoading(false);
      }
    };

    // Safety timeout of 15 seconds
    const safetyTimeout = setTimeout(() => {
      if (active) {
        console.warn('Safety loading timeout fired.');
        setProgress(100);
        setIsLoading(false);
      }
    }, 15000);

    startPreloading();

    return () => {
      active = false;
      clearTimeout(safetyTimeout);
      objectUrls.forEach(url => URL.revokeObjectURL(url));
    };
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
      }, 500);
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

  // Scroll tracking with damping (inertia)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // More scroll in hand: 0.00035 multiplier gives highly premium, low-sensitivity control
      const speedMultiplier = 0.00035;
      let newTarget = targetScrollRef.current + e.deltaY * speedMultiplier;
      newTarget = Math.max(0, Math.min(1, newTarget));
      targetScrollRef.current = newTarget;
    };

    let touchStart = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStart = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touchCurrent = e.touches[0].clientY;
        const deltaY = touchStart - touchCurrent;
        touchStart = touchCurrent;
        
        const speedMultiplier = 0.0008;
        let newTarget = targetScrollRef.current + deltaY * speedMultiplier;
        newTarget = Math.max(0, Math.min(1, newTarget));
        targetScrollRef.current = newTarget;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Animation frame loop to smoothly transition currentScroll to targetScroll
  useEffect(() => {
    let animationId: number;
    
    const updateScroll = () => {
      const target = targetScrollRef.current;
      const current = currentScrollRef.current;
      
      const lerpFactor = 0.06; // Lower value for smoother and more damped transitions
      const diff = target - current;
      
      if (Math.abs(diff) > 0.0001) {
        currentScrollRef.current = current + diff * lerpFactor;
        setScrollProgress(currentScrollRef.current);
      } else if (current !== target) {
        currentScrollRef.current = target;
        setScrollProgress(target);
      }
      
      animationId = requestAnimationFrame(updateScroll);
    };
    
    animationId = requestAnimationFrame(updateScroll);
    
    return () => cancelAnimationFrame(animationId);
  }, []);

  const easedProgress = ease(scrollProgress);
  
  // Phase 1: Card shrinks (easedProgress from 0.0 to 0.5)
  const progress1 = Math.min(1, easedProgress * 2);
  
  // Phase 2: Background text scrolls off-screen (easedProgress from 0.5 to 1.0)
  const progress2 = Math.max(0, (easedProgress - 0.5) * 2);

  const shrinkScale = 1 - progress1 * 0.55; // vertical scale from 1.0 down to 0.45
  const shrinkScaleX = 1 - progress1 * 0.65; // horizontal scale from 1.0 down to 0.35 (reduces card width additional to height)
  const shrinkBorderRadius = progress1 * 32; // border radius from 0px to 32px
  
  // Opacities
  const textOpacity = Math.max(0, 1 - progress1 * 1.3); // completely hides towards the end
  const pillOpacity = Math.max(0, 0.5 - progress1 * 5); // fades very quickly

  // Interpolated text color: from #282C20 (40, 44, 32) to #fffef5 (255, 254, 245)
  const r = Math.round(40 + (255 - 40) * progress1);
  const g = Math.round(44 + (254 - 44) * progress1);
  const b = Math.round(32 + (245 - 32) * progress1);
  const textColor = `rgb(${r}, ${g}, ${b})`;

  // Scrolling parallax background text calculations
  const bgTextOpacity = Math.min(progress1 * 1.5, 0.85); // fades in as we scroll (up to 0.85 opacity)
  const line1Transform = `translateX(${progress2 * 120}vw)`; // slides off right in Phase 2
  const line2Transform = `translateX(${-progress2 * 120}vw)`; // slides off left in Phase 2

  return (
    <div 
      className="home"
      style={{
        '--text-color': textColor,
      } as React.CSSProperties}
    >
      {shouldRenderLoader && (
        <div className={`preloader ${!isLoading ? 'fade-out' : ''}`}>
          <img className="preloader-logo" src={logoUrl} alt="OD Logo" />
          <div className="preloader-bar-container">
            <div className="preloader-bar" style={{ width: `${progress}%` }} />
          </div>
          <div className="preloader-text">LOAD OJAS {progress}%</div>
        </div>
      )}

      <video
        src={hdbgUrl}
        autoPlay
        loop
        muted
        playsInline
        className="bg-video"
      />

      {/* Background Scrolling Parallax Text */}
      <div 
        className="scroll-text-bg"
        style={{ opacity: bgTextOpacity }}
      >
        <div 
          className="bg-text-line-1 marquee-ltr"
          style={{ transform: line1Transform }}
        >
          <div className="marquee-content">
            SYSTEMS THAT SCALE, PRODUCTS THAT SHIP • SYSTEMS THAT SCALE, PRODUCTS THAT SHIP • SYSTEMS THAT SCALE, PRODUCTS THAT SHIP • SYSTEMS THAT SCALE, PRODUCTS THAT SHIP • SYSTEMS THAT SCALE, PRODUCTS THAT SHIP • SYSTEMS THAT SCALE, PRODUCTS THAT SHIP • SYSTEMS THAT SCALE, PRODUCTS THAT SHIP • SYSTEMS THAT SCALE, PRODUCTS THAT SHIP • SYSTEMS THAT SCALE, PRODUCTS THAT SHIP • SYSTEMS THAT SCALE, PRODUCTS THAT SHIP •&nbsp;
          </div>
          <div className="marquee-content">
            SYSTEMS THAT SCALE, PRODUCTS THAT SHIP • SYSTEMS THAT SCALE, PRODUCTS THAT SHIP • SYSTEMS THAT SCALE, PRODUCTS THAT SHIP • SYSTEMS THAT SCALE, PRODUCTS THAT SHIP • SYSTEMS THAT SCALE, PRODUCTS THAT SHIP • SYSTEMS THAT SCALE, PRODUCTS THAT SHIP • SYSTEMS THAT SCALE, PRODUCTS THAT SHIP • SYSTEMS THAT SCALE, PRODUCTS THAT SHIP • SYSTEMS THAT SCALE, PRODUCTS THAT SHIP • SYSTEMS THAT SCALE, PRODUCTS THAT SHIP •&nbsp;
          </div>
        </div>
        <div 
          className="bg-text-line-2 marquee-rtl"
          style={{ transform: line2Transform }}
        >
          <div className="marquee-content">
            I'M OJAS, AN ARTIST BY VIRTUE WHO BUILDS SYSTEMS THAT SCALE AND BUSINESSES THAT DON'T LOSE CUSTOMER TRUST. • I'M OJAS, AN ARTIST BY VIRTUE WHO BUILDS SYSTEMS THAT SCALE AND BUSINESSES THAT DON'T LOSE CUSTOMER TRUST. • I'M OJAS, AN ARTIST BY VIRTUE WHO BUILDS SYSTEMS THAT SCALE AND BUSINESSES THAT DON'T LOSE CUSTOMER TRUST. • I'M OJAS, AN ARTIST BY VIRTUE WHO BUILDS SYSTEMS THAT SCALE AND BUSINESSES THAT DON'T LOSE CUSTOMER TRUST. • I'M OJAS, AN ARTIST BY VIRTUE WHO BUILDS SYSTEMS THAT SCALE AND BUSINESSES THAT DON'T LOSE CUSTOMER TRUST. • I'M OJAS, AN ARTIST BY VIRTUE WHO BUILDS SYSTEMS THAT SCALE AND BUSINESSES THAT DON'T LOSE CUSTOMER TRUST. •&nbsp;
          </div>
          <div className="marquee-content">
            I'M OJAS, AN ARTIST BY VIRTUE WHO BUILDS SYSTEMS THAT SCALE AND BUSINESSES THAT DON'T LOSE CUSTOMER TRUST. • I'M OJAS, AN ARTIST BY VIRTUE WHO BUILDS SYSTEMS THAT SCALE AND BUSINESSES THAT DON'T LOSE CUSTOMER TRUST. • I'M OJAS, AN ARTIST BY VIRTUE WHO BUILDS SYSTEMS THAT SCALE AND BUSINESSES THAT DON'T LOSE CUSTOMER TRUST. • I'M OJAS, AN ARTIST BY VIRTUE WHO BUILDS SYSTEMS THAT SCALE AND BUSINESSES THAT DON'T LOSE CUSTOMER TRUST. • I'M OJAS, AN ARTIST BY VIRTUE WHO BUILDS SYSTEMS THAT SCALE AND BUSINESSES THAT DON'T LOSE CUSTOMER TRUST. • I'M OJAS, AN ARTIST BY VIRTUE WHO BUILDS SYSTEMS THAT SCALE AND BUSINESSES THAT DON'T LOSE CUSTOMER TRUST. •&nbsp;
          </div>
        </div>
      </div>

      <div 
        className="shrink-wrapper"
        style={{
          transform: `scale(${shrinkScaleX}, ${shrinkScale})`,
          borderRadius: `${shrinkBorderRadius}px`,
          boxShadow: `rgba(0, 0, 0, ${easedProgress * 0.15}) 0px ${easedProgress * 20}px ${easedProgress * 50}px`,
        }}
      >
        <div 
          className="shrink-overlay"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(60, 60, 60, 0.6)',
            opacity: easedProgress,
            zIndex: 4,
            pointerEvents: 'none'
          }}
        />
        <LiquidDistortion
          src={hdbgUrl}
          strength={0.15}
          radius={120}
          relaxation={0.95}
          blur={0.1}
          opacity={0.10}
          leftOffset={leftOffset}
          rightOffset={rightOffset}
          portraitRef={containerRef}
          onWebGLActive={setIsWebGLActive}
          easedProgress={easedProgress}
          hollowmineUrl={hollowmineUrl}
          eyeballUrl={eyeballUrl}
          eyebgUrl={eyebgUrl}
          minepicUrl={minepicUrl}
        />
        <div 
          className="portrait-wrap"
          style={{
            transform: `translateX(-54%) scaleX(${shrinkScale / shrinkScaleX})`,
            transformOrigin: 'bottom center'
          }}
        >
          <div 
            className="portrait-container" 
            ref={containerRef} 
            style={{ 
              transform: `translateX(${portraitShiftX}px)`,
              opacity: isWebGLActive ? 0 : 1,
              pointerEvents: isWebGLActive ? 'none' : 'auto'
            }}
          >
            {/* Bottom Layer: Eye backgrounds */}
            <img
              className="eye-bg"
              src={eyebgUrl}
              alt="Left eye background"
              style={{ left: '44.73%', top: '46.54%', opacity: 1 - easedProgress }}
            />
            <img
              className="eye-bg"
              src={eyebgUrl}
              alt="Right eye background"
              style={{ left: '59.44%', top: '47.54%', opacity: 1 - easedProgress }}
            />

            {/* Middle Layer: Eyeballs */}
            <img
              className="eyeball"
              src={eyeballUrl}
              alt="Left eyeball"
              style={{
                left: '44.73%',
                top: '46.54%',
                transform: `translate(-50%, -50%) translate(${leftOffset.x}px, ${leftOffset.y}px)`,
                opacity: 1 - easedProgress
              }}
            />
            <img
              className="eyeball"
              src={eyeballUrl}
              alt="Right eyeball"
              style={{
                left: '59.44%',
                top: '47.54%',
                transform: `translate(-50%, -50%) translate(${rightOffset.x}px, ${rightOffset.y}px)`,
                opacity: 1 - easedProgress
              }}
            />

            {/* Top Layer: Hollow portrait */}
            <img
              className="portrait-front"
              src={hollowmineUrl}
              alt="Ojas Dhar Gave portrait"
              style={{ opacity: 1 - easedProgress }}
            />

            {/* Solid portrait */}
            <img
              className="portrait-solid"
              src={minepicUrl}
              alt="Ojas Dhar Gave portrait solid"
              style={{
                height: '100%',
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 4,
                pointerEvents: 'none',
                opacity: easedProgress
              }}
            />
          </div>
        </div>
      </div>

      <div className="name-block">
        <span className='texttrans' style={{transition: 'color 0.3s ease'}}>OJAS</span>
        <span className="name-block2">DHAR</span>
        <span className="name-block2" style={{fontSize: '25.5px'}}>GAVE</span>
      </div>

      <img 
        className="brand-logo" 
        src={logoUrl} 
        alt="OD logo" 
        style={{
          filter: easedProgress > 0.5 ? 'brightness(0) invert(1)' : 'none'
        }}
      />

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

      <div className="left-block" style={{ opacity: textOpacity }}>
        <div className="title" style={{marginBottom:'30px'}}>FULL STACK <span className='texttrans' style={{transition: 'color 0.3s ease'}}>DEVOPS</span> <br/>ENGINEER </div>
        <div className="title">CREATIVE <span className='texttrans' style={{transition: 'color 0.3s ease'}}>DESIGNER</span> <br/>& <span className='texttrans' style={{transition: 'color 0.3s ease'}}>DEVELOPER</span></div>
        <div className="year">©2026</div>
      </div>

      <div className="right-block" style={{ opacity: textOpacity }}>
        <div className="location-label">CURRENTLY BASED IN <br/><a href="https://maps.google.com/?q=Nagpur" target="_blank" rel="noopener noreferrer" className='texttrans' style={{transition: 'color 0.3s ease'}}>NAG</a> | <a href="https://maps.google.com/?q=Ahmedabad" target="_blank" rel="noopener noreferrer" className='texttrans' style={{transition: 'color 0.3s ease'}}>AMD</a></div>
      </div>

      <div className="scroll-pill" style={{ opacity: pillOpacity, pointerEvents: pillOpacity > 0 ? 'auto' : 'none' }}>
        <span>scroll to unveil magic</span>
      </div>
    </div>
  );
}
