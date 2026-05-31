import { useState, useEffect, useRef } from 'react';
import './App.css';
import logo from './assets/images/logo.png';
import minepic from './assets/images/minepic.png';
import hollowmine from './assets/images/hollowmine.png';
import eyeball from './assets/images/eyeball.png';
import eyebg from './assets/images/eyebg.png';
import hdbg from './assets/videos/hdbg.mp4';
import intersect from './assets/images/Intersect.png';
// @ts-ignore
import movesCabseFont from './assets/fonts/MovesCabse-Regular.ttf';
import LiquidDistortion from './components/LiquidDistortion';

const menuItems = [
  'WORKS',
  'TECH STACKS',
  'EDUCATION',
  'RESUME',
  'CONTACT',
  // 'ABOUT'
];

const techStackCategories = [
  {
    title: "Languages",
    icon: "💬",
    skills: [
      { name: "C/C++", key: "cpp" },
      { name: "JavaScript", key: "js" },
      { name: "TypeScript", key: "ts" },
      { name: "Python", key: "python" },
      { name: "HTML", key: "html" },
      { name: "CSS", key: "css" },
      { name: "SQL", key: "mysql" }
    ]
  },
  {
    title: "Frontend",
    icon: "🌐",
    skills: [
      { name: "React.js", key: "react" },
      { name: "Tailwind", key: "tailwind" },
      { name: "Three.js", key: "threejs" },
      { name: "Figma", key: "figma" },
      { name: "Blender", key: "blender" }
    ]
  },
  {
    title: "Backend",
    icon: "⚙️",
    skills: [
      { name: "Node.js", key: "nodejs" },
      { name: "Express.js", key: "express" },
      { name: "FastAPI", key: "fastapi" },
      { name: "OpenCV", key: "opencv" }
    ]
  },
  {
    title: "Databases & Cloud",
    icon: "🗄️",
    skills: [
      { name: "MongoDB", key: "mongodb" },
      { name: "MySQL", key: "mysql" },
      { name: "PostgreSQL", key: "postgresql" },
      { name: "Redis", key: "redis" },
      { name: "Supabase", key: "supabase" },
      { name: "Prisma", key: "prisma" },
      { name: "Vercel", key: "vercel" },
      { name: "AWS", key: "aws" }
    ]
  },
  {
    title: "Tools & DevOps",
    icon: "🔧",
    skills: [
      { name: "Git", key: "git" },
      { name: "GitHub", key: "github" },
      { name: "Docker", key: "docker" },
      { name: "Github Actions", key: "githubactions" },
      { name: "VS Code", key: "vscode" },
      { name: "Postman", key: "postman" },
      { name: "Linux", key: "linux" }
    ]
  }
];

const educationData = [
  {
    degree: "Bachelor of Technology in Computer Science & Engineering",
    institute: "Indian Institute of Information Technology, Vadodara",
    extra: "(IIT WITH AN EXTRA I)",
    // details: "SPI: 8.00 | CPI: 7.52 (Current)",
    timeline: "Expected May 2028"
  },
  {
    degree: "Class XII (Higher Secondary): PCM + Electronics",
    institute: "Major Hemant Jakate Institute of Science & Commerce",
    details: "",
    timeline: "2023"
  },
  {
    degree: "Class X (Secondary)",
    institute: "Kendriya Vidyalaya C.R.P.F. Nagpur",
    details: "",
    timeline: "2021"
  }
];

const socialPlatforms = [
  {
    name: "INSTAGRAM",
    handle: "@ojasdhargave",
    url: "https://instagram.com",
    color: "#E1306C",
    glow: "rgba(225, 48, 108, 0.35)",
    className: "card-insta",
    bgColor: "#E1306C",
    textColor: "#ffffff",
    iconColor: "#ffffff",
    borderColor: "rgba(255, 255, 255, 0.1)",
    xOffset: -240,
    rotateDeg: -12,
    yOffset: 30,
    renderIcon: () => (
      <svg className="social-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    )
  },
  {
    name: "LINKEDIN",
    handle: "Ojas Dhargave",
    url: "https://linkedin.com",
    color: "#0077B5",
    glow: "rgba(0, 119, 181, 0.35)",
    className: "card-linkedin",
    bgColor: "#0077B5",
    textColor: "#ffffff",
    iconColor: "#ffffff",
    borderColor: "rgba(255, 255, 255, 0.1)",
    xOffset: -120,
    rotateDeg: -6,
    yOffset: 10,
    renderIcon: () => (
      <svg className="social-icon" width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    )
  },
  {
    name: "GMAIL",
    handle: "ojasdhargave@gmail.com",
    url: "mailto:ojasdhargave@gmail.com",
    color: "#EA4335",
    glow: "rgba(234, 67, 53, 0.35)",
    className: "card-gmail",
    bgColor: "#EA4335",
    textColor: "#ffffff",
    iconColor: "#ffffff",
    borderColor: "rgba(255, 255, 255, 0.1)",
    xOffset: 0,
    rotateDeg: 0,
    yOffset: 0,
    renderIcon: () => (
      <svg className="social-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
      </svg>
    )
  },
  {
    name: "GITHUB",
    handle: "ojasdhargave",
    url: "https://github.com/ojasdhargave",
    color: "#ffffff",
    glow: "rgba(255, 255, 255, 0.25)",
    className: "card-github",
    bgColor: "#181717",
    textColor: "#ffffff",
    iconColor: "#ffffff",
    borderColor: "rgba(255, 255, 255, 0.12)",
    xOffset: 120,
    rotateDeg: 6,
    yOffset: 10,
    renderIcon: () => (
      <svg className="social-icon" width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    )
  },
  {
    name: "BEHANCE",
    handle: "ojasdhargave",
    url: "https://behance.net",
    color: "#0057ff",
    glow: "rgba(0, 87, 255, 0.35)",
    className: "card-behance",
    bgColor: "#fffef5",
    textColor: "#282C20",
    iconColor: "#0057ff",
    borderColor: "rgba(40, 44, 32, 0.15)",
    xOffset: 240,
    rotateDeg: 12,
    yOffset: 30,
    renderIcon: () => (
      <svg className="social-icon" width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 13H5v2.5h4c.83 0 1.5-.67 1.5-1.5s-.67-1-1.5-1zm-.5-5H5v2.5h3.5c.83 0 1.5-.67 1.5-1.5s-.67-1.25-1.5-1.25zM22 2H2v20h20V2zm-9 13.5c0 2.48-2.02 4.5-4.5 4.5H4V8h4.5C10.98 8 13 10.02 13 12.5c0 1.09-.39 2.08-1.03 2.86.64.13 1.03.64 1.03 1.14zm7.5-3.5h-5c-.83 0-1.5.67-1.5 1.5v2c0 .83.67 1.5 1.5 1.5h5c.83 0 1.5-.67 1.5-1.5v-2c0-.83-.67-1.5-1.5-1.5zm-5 1.5h3v1h-3v-1zm5-4.5h-5v1.5h5V8.5z"/>
      </svg>
    )
  }
];

const projects = [
  {
    title: "F1 TELEMETRY GRAPH",
    tag: "REAL-TIME DATA STREAMING / NEON DASHBOARD",
    description: "Real-time high-speed data visualizer for Formula 1 telemetric metrics using WebSockets.",
    githubUrl: "https://github.com/ojasdhargave/f1-telemetry-dashboard",
    renderVisual: () => (
      <div className="project-visual f1-telemetry-visual">
        <div className="f1-grid" />
        <div className="f1-dial">
          <div className="f1-dial-inner">330</div>
        </div>
      </div>
    )
  },
  {
    title: "CORE BALANCER",
    tag: "DISTRIBUTED CLOUD ROUTER / SYSTEM INFRA",
    description: "Distributed request router with active load-balancing algorithms and system status dashboards.",
    githubUrl: "https://github.com/ojasdhargave/core-balancer",
    renderVisual: () => (
      <div className="project-visual cloud-balancer-visual">
        <div className="balancer-node" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
        <div className="balancer-subnode" style={{ left: '20%', top: '30%' }} />
        <div className="balancer-subnode" style={{ left: '80%', top: '30%' }} />
        <div className="balancer-subnode" style={{ left: '30%', top: '70%' }} />
        <div className="balancer-subnode" style={{ left: '70%', top: '70%' }} />
        <div className="balancer-line" style={{ width: '42%', transform: 'rotate(-33deg)', left: '20%', top: '30%', transformOrigin: 'left top' }} />
        <div className="balancer-line" style={{ width: '42%', transform: 'rotate(33deg)', left: '50%', top: '50%', transformOrigin: 'left top' }} />
        <div className="balancer-line" style={{ width: '36%', transform: 'rotate(53deg)', left: '20%', top: '30%', transformOrigin: 'left top' }} />
        <div className="balancer-line" style={{ width: '36%', transform: 'rotate(-53deg)', left: '50%', top: '50%', transformOrigin: 'left top' }} />
      </div>
    )
  },
  {
    title: "AURA DESIGN STUDIO",
    tag: "CREATIVE DESIGN & LAYOUT / BRAND PORTAL",
    description: "Interactive 3D web showcase incorporating physics engines, fluid shaders, and modern layouts.",
    githubUrl: "https://github.com/ojasdhargave/aura-design-studio",
    renderVisual: () => (
      <div className="project-visual aura-studio-visual">
        <div className="aura-sphere" />
      </div>
    )
  },
  {
    title: "NEURAL DRIFT SIM",
    tag: "SELF-DRIVING AI AGENT / PYTHON SYSTEM",
    description: "Deep reinforcement learning driving simulator simulating path-finding AI agents in real-time.",
    githubUrl: "https://github.com/ojasdhargave/neural-drift-simulator",
    renderVisual: () => (
      <div className="project-visual neural-drift-visual">
        <div className="neural-core">
          <div className="balancer-node" style={{ position: 'relative', margin: 0 }} />
        </div>
        <div className="neural-wave" style={{ animationDelay: '0s' }} />
        <div className="neural-wave" style={{ animationDelay: '0.8s' }} />
        <div className="neural-wave" style={{ animationDelay: '1.6s' }} />
      </div>
    )
  }
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
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isTablet = windowWidth <= 1024;

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

  const scrollToSection = (targetVal: number) => {
    targetScrollRef.current = targetVal;
  };

  const [progress, setProgress] = useState(0);

  // Preloaded URLs initialized to the static imports as fallbacks
  const [logoUrl, setLogoUrl] = useState(logo);
  const [minepicUrl, setMinepicUrl] = useState(minepic);
  const [hollowmineUrl, setHollowmineUrl] = useState(hollowmine);
  const [eyeballUrl, setEyeballUrl] = useState(eyeball);
  const [eyebgUrl, setEyebgUrl] = useState(eyebg);
  const [hdbgUrl, setHdbgUrl] = useState(hdbg);
  const [intersectUrl, setIntersectUrl] = useState(intersect);

  // Asset preloading with progress tracking
  useEffect(() => {
    const assetsToLoad = [
      { key: 'logo', src: logo, size: 2273 },
      { key: 'minepic', src: minepic, size: 2426407 },
      { key: 'hollowmine', src: hollowmine, size: 2447583 },
      { key: 'eyeball', src: eyeball, size: 5184 },
      { key: 'eyebg', src: eyebg, size: 19807 },
      { key: 'hdbg', src: hdbg, size: 3092733 },
      { key: 'movesCabseFont', src: movesCabseFont, size: 109040 },
      { key: 'intersect', src: intersect, size: 4017612 }
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
          else if (asset.key === 'intersect') setIntersectUrl(objectUrl);
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
      newTarget = Math.max(0, Math.min(6.5, newTarget));
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
        newTarget = Math.max(0, Math.min(6.5, newTarget));
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

  const easedProgress = ease(Math.min(1, scrollProgress));
  
  // Phase 1: Card shrinks (easedProgress from 0.0 to 0.5)
  const progress1 = Math.min(1, easedProgress * 2);
  
  // Phase 2: Background text scrolls off-screen (easedProgress from 0.5 to 1.0)
  const progress2 = Math.max(0, (easedProgress - 0.5) * 2);

  // Scroll from Section 2 to Section 3 (1.0 to 1.5 scrollProgress)
  const scroll2to3 = scrollProgress >= 1.0 ? Math.min(1, (scrollProgress - 1.0) * 2) : 0;

  // Phase 3: Horizontal scroll of Section 3 (1.5 to 2.0 scrollProgress)
  const progress3 = scrollProgress >= 1.5 ? Math.min(1, (scrollProgress - 1.5) * 2) : 0;

  // Scroll from Section 3 to Section 4 (2.0 to 2.5 scrollProgress)
  const scroll3to4 = scrollProgress >= 2.0 ? Math.min(1, (scrollProgress - 2.0) * 2) : 0;

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
  const baseTextColor = `rgb(${r}, ${g}, ${b})`;

  // Scrolling background color & text color transitions based on scroll2to3 (Section 2 to 3 scroll)
  const bgR = Math.round(40 + (255 - 40) * scroll2to3);
  const bgG = Math.round(44 + (254 - 44) * scroll2to3);
  const bgB = Math.round(32 + (245 - 32) * scroll2to3);
  const backgroundColor = `rgb(${bgR}, ${bgG}, ${bgB})`;

  // Scroll from Section 4 to Section 5 (3.0 to 3.5 scrollProgress)
  const scroll4to5 = scrollProgress >= 3.0 ? Math.min(1.0, (scrollProgress - 3.0) * 2) : 0;

  // Scroll from Section 5 to Section 6 (4.0 to 4.5 scrollProgress)
  const scroll5to6 = scrollProgress >= 4.0 ? Math.min(1.0, (scrollProgress - 4.0) * 2) : 0;

  // Scroll from Section 6 to Section 7 (5.0 to 5.5 scrollProgress)
  const scroll6to7 = scrollProgress >= 5.0 ? Math.min(1.0, (scrollProgress - 5.0) * 2) : 0;

  // Scroll from Section 7 Part 1 to Part 2 (5.5 to 6.5 scrollProgress)
  const progress7 = scrollProgress >= 5.5 ? Math.min(1.0, (scrollProgress - 5.5)) : 0;

  const textR = Math.round(255 - (255 - 40) * scroll2to3 + (255 - 40) * scroll4to5 - (255 - 40) * scroll5to6 + (255 - 40) * progress7);
  const textG = Math.round(254 - (254 - 44) * scroll2to3 + (254 - 44) * scroll4to5 - (254 - 44) * scroll5to6 + (254 - 44) * progress7);
  const textB = Math.round(245 - (245 - 32) * scroll2to3 + (245 - 32) * scroll4to5 - (245 - 32) * scroll5to6 + (245 - 32) * progress7);
  const textColor = scroll2to3 > 0.05 ? `rgb(${textR}, ${textG}, ${textB})` : baseTextColor;

  const logoFilter = progress7 > 0.5
    ? 'brightness(0) invert(1)'
    : scroll5to6 > 0.5
      ? 'none'
      : scroll4to5 > 0.5
        ? 'brightness(0) invert(1)'
        : scroll2to3 > 0.5 
          ? 'none' 
          : easedProgress > 0.5 
            ? 'brightness(0) invert(1)' 
            : 'none';

  // Vertical translation value (Hero offset is 0, Section 2 is -100, Section 3 is -200, Section 4 is -300, Section 5 is -360)
  // Section 4 scrolls internally by 60vh (from -300vh to -360vh)
  // Section 5 enters vertically, shifting translateYVal from -360vh to -460vh
  // Section 6 enters vertically, shifting translateYVal from -460vh to -560vh
  // Section 7 enters vertically, shifting translateYVal from -560vh to -660vh
  // Section 7 Part 2 enters vertically, shifting translateYVal from -660vh to -760vh
  const progress4 = scrollProgress >= 2.5 && scrollProgress < 3.0 ? (scrollProgress - 2.5) * 2 : scrollProgress >= 3.0 ? 1 : 0;
  const translateYVal = -(progress2 * 100 + scroll2to3 * 100 + scroll3to4 * 100 + progress4 * 60 + scroll4to5 * 100 + scroll5to6 * 100 + scroll6to7 * 100 + progress7 * 100);

  // Scrolling parallax background text calculations
  const bgTextOpacity = Math.min(progress1 * 1.5, 0.85); // fades in as we scroll (up to 0.85 opacity)
  const line1Transform = `translateX(${progress2 * 120}vw)`; // slides off right in Phase 2
  const line2Transform = `translateX(${-progress2 * 120}vw)`; // slides off left in Phase 2

  const activeSectionIndex = scrollProgress >= 5.0
    ? 4
    : scrollProgress >= 4.0
      ? 3
      : scrollProgress >= 3.0
        ? 2
        : scrollProgress >= 2.0
          ? 1
          : scrollProgress >= 1.0
            ? 0
            : -1;

  // Section 6 (Resume) animation calculations
  const resumeStaggerStart = 0.35;
  const resumeStaggerEnd = 0.8;
  let resumeLocalProgress = 0;
  if (scroll5to6 > resumeStaggerStart) {
    resumeLocalProgress = Math.min(1.0, (scroll5to6 - resumeStaggerStart) / (resumeStaggerEnd - resumeStaggerStart));
  }
  const resumeEased = resumeLocalProgress * (2 - resumeLocalProgress);
  const resumeLeftTransform = `translateX(${(1 - resumeEased) * -500}px)`;
  const resumeRightTransform = `translateX(${(1 - resumeEased) * 500}px)`;
  const resumeOpacity = resumeEased;

  // Section 7 (Contact) animation calculations
  const contactStaggerStart = 0.35;
  const contactStaggerEnd = 0.8;
  let contactLocalProgress = 0;
  if (scroll6to7 > contactStaggerStart) {
    contactLocalProgress = Math.min(1.0, (scroll6to7 - contactStaggerStart) / (contactStaggerEnd - contactStaggerStart));
  }
  const contactEased = contactLocalProgress * (2 - contactLocalProgress);
  const contactOpacity = contactEased;

  return (
    <div 
      className="home"
      style={{
        '--text-color': textColor,
        backgroundColor: backgroundColor,
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
        style={{
          mixBlendMode: scroll2to3 > 0.5 ? 'multiply' : 'hard-light',
          opacity: 0.10 - scroll2to3 * 0.03
        } as React.CSSProperties}
      />

      {/* Fixed Sticky Header Elements (stationary like in reference image) */}
      <div className="name-block" onClick={() => scrollToSection(0)} style={{cursor: 'pointer'}}>
        <span className='texttrans' style={{transition: 'color 0.3s ease'}}>OJAS</span>
        <span className="name-block2">DHAR</span>
        <span className="name-block2" style={{fontSize: '25.5px'}}>GAVE</span>
      </div>

      <img 
        className="brand-logo" 
        src={logoUrl} 
        alt="OD logo" 
        onClick={() => scrollToSection(0)}
        style={{
          filter: logoFilter,
          cursor: 'pointer'
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
            {menuItems.map((item, index) => {
              const isSectionHighlighted = (activeSectionIndex === index && hoveredIndex === null);
              const isActive = (hoveredIndex === index) || isSectionHighlighted;
              return (
                <li 
                  key={item}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onClick={() => {
                    if (index === 0) scrollToSection(1.6);
                    else if (index === 1) scrollToSection(2.6);
                    else if (index === 2) scrollToSection(3.6);
                    else if (index === 3) scrollToSection(4.6);
                    else if (index === 4) scrollToSection(5.3);
                  }}
                >
                  <span className={isActive ? 'active' : ''}>
                    {item}
                  </span>
                </li>
              );
            })}
          </ul>
          
          <div className={`slider-track ${isMenuHovered || activeSectionIndex !== -1 ? 'visible' : ''}`}>
            <div 
              className={`slider-thumb ${(hoveredIndex !== null || activeSectionIndex !== -1) ? 'visible' : ''}`}
              style={{
                top: hoveredIndex !== null
                  ? `${hoveredIndex * (100 / (menuItems.length - 1))}%`
                  : activeSectionIndex !== -1
                    ? `${activeSectionIndex * (100 / (menuItems.length - 1))}%`
                    : '0%'
              }}
            />
          </div>
        </div>
      </nav>

      {/* Scrollable vertical content layout */}
      <div 
        className="scrollable-content"
        style={{
          transform: `translateY(${translateYVal}vh)`
        }}
      >
        {/* Section 1: Hero landing */}
        <div className="section hero-section">
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
                I'M OJAS, DESIGNER BY VISION. ENGINEER BY EXECUTION. BUILDING EXPERIENCES PEOPLE LOVE AND SYSTEMS THEY TRUST. • I'M OJAS, DESIGNER BY VISION. ENGINEER BY EXECUTION. BUILDING EXPERIENCES PEOPLE LOVE AND SYSTEMS THEY TRUST. • I'M OJAS, DESIGNER BY VISION. ENGINEER BY EXECUTION. BUILDING EXPERIENCES PEOPLE LOVE AND SYSTEMS THEY TRUST. • I'M OJAS, DESIGNER BY VISION. ENGINEER BY EXECUTION. BUILDING EXPERIENCES PEOPLE LOVE AND SYSTEMS THEY TRUST. • I'M OJAS, DESIGNER BY VISION. ENGINEER BY EXECUTION. BUILDING EXPERIENCES PEOPLE LOVE AND SYSTEMS THEY TRUST. • I'M OJAS, DESIGNER BY VISION. ENGINEER BY EXECUTION. BUILDING EXPERIENCES PEOPLE LOVE AND SYSTEMS THEY TRUST. •&nbsp;
              </div>
              <div className="marquee-content">
                I'M OJAS, DESIGNER BY VISION. ENGINEER BY EXECUTION. BUILDING EXPERIENCES PEOPLE LOVE AND SYSTEMS THEY TRUST. • I'M OJAS, DESIGNER BY VISION. ENGINEER BY EXECUTION. BUILDING EXPERIENCES PEOPLE LOVE AND SYSTEMS THEY TRUST. • I'M OJAS, DESIGNER BY VISION. ENGINEER BY EXECUTION. BUILDING EXPERIENCES PEOPLE LOVE AND SYSTEMS THEY TRUST. • I'M OJAS, DESIGNER BY VISION. ENGINEER BY EXECUTION. BUILDING EXPERIENCES PEOPLE LOVE AND SYSTEMS THEY TRUST. • I'M OJAS, DESIGNER BY VISION. ENGINEER BY EXECUTION. BUILDING EXPERIENCES PEOPLE LOVE AND SYSTEMS THEY TRUST. • I'M OJAS, DESIGNER BY VISION. ENGINEER BY EXECUTION. BUILDING EXPERIENCES PEOPLE LOVE AND SYSTEMS THEY TRUST. •&nbsp;
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
              easedProgress={progress1}
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
                  style={{ left: '44.73%', top: '46.54%', opacity: 1 - progress1 }}
                />
                <img
                  className="eye-bg"
                  src={eyebgUrl}
                  alt="Right eye background"
                  style={{ left: '59.44%', top: '47.54%', opacity: 1 - progress1 }}
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
                    opacity: 1 - progress1
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
                    opacity: 1 - progress1
                  }}
                />

                {/* Top Layer: Hollow portrait */}
                <img
                  className="portrait-front"
                  src={hollowmineUrl}
                  alt="Ojas Dhar Gave portrait"
                  style={{ opacity: 1 - progress1 }}
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
                    opacity: progress1
                  }}
                />
              </div>
            </div>
          </div>

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

        {/* Section 2: Revealed Paragraph */}
        <div className="section paragraph-section">
          <div 
            className="revealed-paragraph-container"
            style={{ 
              opacity: progress2,
              transform: `translate(-50%, calc(-50% + ${(1 - progress2) * 40}px))`,
              visibility: progress2 > 0 ? 'visible' : 'hidden'
            }}
          >
            <p className="revealed-paragraph">
              <span className="highlight">Redefining</span> possibilities. <br />
              Building what <span className="highlight">matters</span>. <br />
              Creating <span className="highlight">impact</span> through <br />
              design, <span className="highlight">code</span>, and <br />
              relentless <span className="highlight">execution</span>.
            </p>
          </div>
        </div>

        {/* Section 3: Works (Horizontal Scroll & Off-White background transition) */}
        <div className="section works-section">
          <div 
            className="works-track"
            style={{
              transform: `translateX(${-progress3 * 125}vw)`
            }}
          >
            {/* Vertically stacked Title scrolling with the track */}
            <div className="works-vertical-title">
              <span>W</span>
              <span>O</span>
              <span>R</span>
              <span>K</span>
              <span>S</span>
            </div>

            {projects.map((project, idx) => (
              <div 
                className="work-card" 
                key={idx}
                onClick={() => window.open(project.githubUrl, '_blank', 'noopener,noreferrer')}
              >
                {/* Card Header */}
                <div className="work-card-header">
                  <span className="work-card-project-name">{project.title}</span>
                  <div className="work-card-header-dots">
                    <span className="header-dot"></span>
                    <span className="header-dot"></span>
                  </div>
                </div>

                {/* Card Middle: Image/Video Visual */}
                <div className="work-card-image-wrap" onClick={(e) => e.stopPropagation()}>
                  {project.renderVisual()}
                </div>

                {/* Card Bottom: Description, Count, and See More Button */}
                <div className="work-card-footer-container">
                  <p className="work-card-desc">{project.description}</p>
                  
                  <div className="work-card-footer-row">
                    <a 
                      href={project.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="work-card-link-underlined"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {project.title.toLowerCase().replace(/ /g, '-')}
                    </a>
                    
                    <div className="work-card-footer-right" onClick={(e) => e.stopPropagation()}>
                      <div className="work-card-count">
                        <svg className="count-arrow" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>0{idx + 1}/0{projects.length}</span>
                      </div>
                      <div className="footer-separator" />
                      <a 
                        href={project.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="work-card-btn"
                      >
                        See more
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Tech Stack (Vertical Scroll & Off-White background) */}
        <div className="section tech-stack-section">
          <div className="tech-stack-container">
            {/* Horizontal heading TECH STACKS in one line at the top of the section */}
            <div 
              className="tech-stack-header-title"
              style={{
                transform: `translateY(${(1 - Math.min(1.0, scroll3to4 * 1.5)) * -30}px)`,
                opacity: Math.min(1.0, scroll3to4 * 1.5)
              }}
            >
              TECH STACKS
            </div>

            <div className="tech-stack-rows-container">
              {techStackCategories.map((category, catIdx) => {
                const staggerStart = 0.45 + catIdx * 0.08;
                const staggerEnd = Math.min(1.0, staggerStart + 0.45);
                
                let localProgress = 0;
                if (scroll3to4 > staggerStart) {
                  localProgress = Math.min(1.0, (scroll3to4 - staggerStart) / (staggerEnd - staggerStart));
                }
                
                const easedLocal = localProgress * (2 - localProgress);

                const headingTransform = `translateX(${(1 - easedLocal) * -500}px)`;
                const headingOpacity = easedLocal;

                const gridTransform = `translateX(${(1 - easedLocal) * 500}px)`;
                const gridOpacity = easedLocal;

                return (
                  <div className="tech-stack-row" key={catIdx}>
                    <div 
                      className="tech-category-header"
                      style={{
                        transform: headingTransform,
                        opacity: headingOpacity
                      }}
                    >
                      <span className="tech-category-bullet" />
                      <h3 className="tech-category-title">{category.title}</h3>
                    </div>

                    <div 
                      className="tech-icons-box"
                      style={{
                        transform: gridTransform,
                        opacity: gridOpacity
                      }}
                    >
                      {category.skills.map((skill, skillIdx) => (
                        <div className="tech-icon-cell" key={skillIdx}>
                          <img 
                            src={`https://skillicons.dev/icons?i=${skill.key}`} 
                            width="45" 
                            height="45" 
                            alt={skill.name} 
                            className="tech-icon-img"
                          />
                          <span className="tech-icon-name">{skill.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 5: Education (Vertical Scroll & Solid Theme Black background overlay) */}
        <div className="section education-section">
          <div className="education-container">
            {/* Heading EDUCATION in one line at the top of the section */}
            <div 
              className="education-header-title"
              style={{
                transform: `translateY(${(1 - Math.min(1.0, scroll4to5 * 1.5)) * -30}px)`,
                opacity: Math.min(1.0, scroll4to5 * 1.5)
              }}
            >
              EDUCATION
            </div>

            <div className="education-list">
              {educationData.map((item, idx) => {
                const staggerStart = 0.4 + idx * 0.1;
                const staggerEnd = Math.min(1.0, staggerStart + 0.45);
                
                let localProgress = 0;
                if (scroll4to5 > staggerStart) {
                  localProgress = Math.min(1.0, (scroll4to5 - staggerStart) / (staggerEnd - staggerStart));
                }
                
                const easedLocal = localProgress * (2 - localProgress);
                const transform = `translateX(${(1 - easedLocal) * -500}px)`;
                const opacity = easedLocal;

                return (
                  <div 
                    className="education-card" 
                    key={idx}
                    style={{ transform, opacity }}
                  >
                    <div className="education-card-left">
                      <span className="tech-category-bullet" />
                      <div className="education-meta">
                        <span className="education-timeline">{item.timeline}</span>
                        {item.details && <span className="education-grade">{item.details}</span>}
                      </div>
                    </div>

                    <div className="education-card-right">
                      <h4 className="education-degree">{item.degree}</h4>
                      <p className="education-institute">
                        {item.institute} {item.extra && <span className="institute-extra">{item.extra}</span>}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 6: Resume (Vertical Scroll & Transparent background revealing video/off-white) */}
        <div className="section resume-section">
          <div className="resume-container">
            <div 
              className="resume-left"
              style={{
                transform: resumeLeftTransform,
                opacity: resumeOpacity
              }}
            >
              <h2 className="resume-header-title">RESUME</h2>
            </div>
            
            <div 
              className="resume-right"
              style={{
                transform: resumeRightTransform,
                opacity: resumeOpacity
              }}
            >
              <a 
                href="https://drive.google.com/file/d/1dLvQrq_nfjMAMF-0Zdvhz27b9i40FF8V/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="resume-btn"
              >
                VIEW RESUME
              </a>
            </div>
          </div>
        </div>

        {/* Section 7: Contact (Vertical Scroll & Transparent background revealing video/off-white) */}
        <div className="section contact-section">
          {/* Part 1: Social Cards Viewport */}
          <div className="contact-cards-viewport">
            <div className="contact-container">
              {/* Header: WHAT'S UP ON SOCIALS */}
              <div 
                className="contact-header-container"
                style={{
                  transform: `translateY(${(1 - contactEased) * -30}px)`,
                  opacity: contactOpacity
                }}
              >
                <h2 className="contact-header-title">WHAT'S UP</h2>
                <h2 className="contact-header-subtitle">ON SOCIALS</h2>
              </div>

              {/* Fanning Cards Container */}
              <div className="social-cards-wrap">
                {socialPlatforms.map((platform, idx) => {
                  const isMobile = windowWidth <= 768;
                  // Determine layout multipliers based on viewport width
                  const xMult = isTablet ? 0.75 : 1.0;
                  const rotMult = isTablet ? 0.83 : 1.0;

                  // Base coordinates in fan
                  const baseCardX = platform.xOffset * xMult;
                  const baseCardRot = platform.rotateDeg * rotMult;
                  const baseCardY = platform.yOffset * (isTablet ? 0.75 : 1.0);

                  // Add spreading layout offsets on hover
                  let hoverScale = 1.0;
                  let finalX = baseCardX;

                  if (hoveredCardIndex !== null) {
                    if (hoveredCardIndex === idx) {
                      hoverScale = 1.08; // Enlarge focus card slightly in place
                    } else {
                      hoverScale = 0.95; // Slightly scale down surrounding cards
                      // Shift left or right based on relative positions
                      const shiftDir = idx < hoveredCardIndex ? -1 : 1;
                      const shiftAmount = isTablet ? 30 : 45;
                      finalX = baseCardX + shiftDir * shiftAmount;
                    }
                  }

                  // Compute dynamic transform using the ease progression
                  const transform = isMobile
                    ? 'none'
                    : `translateX(${finalX * contactEased}px) rotate(${baseCardRot * contactEased}deg) translateY(${(1 - contactEased) * 200 + baseCardY * contactEased}px) scale(${hoverScale})`;

                  // Dynamic z-index layering
                  // Default: Gmail (index 2) is top (5), LinkedIn/GitHub (1,3) is mid (4), Instagram/Behance (0,4) is bottom (3)
                  // Hovered card goes to absolute top (10)
                  const baseZ = idx === 2 ? 5 : (idx === 1 || idx === 3) ? 4 : 3;
                  const finalZIndex = hoveredCardIndex === idx ? 10 : baseZ;

                  return (
                    <a 
                      key={idx}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`social-card ${platform.className}`}
                      onMouseEnter={() => setHoveredCardIndex(idx)}
                      onMouseLeave={() => setHoveredCardIndex(null)}
                      style={{
                        transform,
                        zIndex: finalZIndex,
                        backgroundColor: platform.bgColor,
                        color: platform.textColor,
                        borderColor: platform.borderColor,
                        opacity: contactOpacity,
                        '--platform-color': platform.color,
                        '--platform-glow': platform.glow
                      } as React.CSSProperties}
                    >
                      {/* Card Top: Platform Name + Arrow */}
                      <div className="social-card-top">
                        <span className="social-platform-name" style={{ color: platform.textColor === '#282C20' ? 'rgba(40,44,32,0.6)' : 'rgba(255,255,255,0.6)' }}>
                          {platform.name}
                        </span>
                        <svg className="social-card-arrow" style={{ color: platform.textColor === '#282C20' ? 'rgba(40,44,32,0.4)' : 'rgba(255,255,255,0.4)' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="7" y1="17" x2="17" y2="7"></line>
                          <polyline points="7,7 17,7 17,17"></polyline>
                        </svg>
                      </div>

                      {/* Card Middle: Brand Visual & Glow Logo */}
                      <div className="social-card-mid">
                        <div className="social-icon-wrapper" style={{ color: platform.iconColor }}>
                          {platform.renderIcon()}
                        </div>
                        <div className="social-glow-orb" style={{ background: platform.glow }} />
                      </div>

                      {/* Card Bottom: Handle & Subtitle */}
                      <div className="social-card-bottom">
                        <span className="social-handle" style={{ color: platform.textColor }}>
                          {platform.handle}
                        </span>
                        <span className="social-action" style={{ color: platform.textColor === '#282C20' ? 'rgba(40,44,32,0.5)' : 'rgba(255,255,255,0.5)' }}>
                          VISIT LINK
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Part 2: Footer Overlay Viewport */}
          <div 
            className="contact-footer-viewport"
            style={{
              backgroundImage: `url(${intersectUrl})`
            }}
          >
            <div className="footer-overlay-content">
              {/* Signature and Motto */}
              <div className="footer-header">
 
                <h2 className="footer-motto">
                  ALWAYS <span className="bring">BRINGING</span><br />
                  THE FIGHT.
                </h2>
              </div>

              {/* Navigation and Info Grid */}
              <div className="footer-grid">
                <div className="footer-col">
                  <span className="footer-col-label">PAGES</span>
                  <ul className="footer-links">
                    <li onClick={() => scrollToSection(0)}>HOME</li>
                    <li onClick={() => scrollToSection(1.6)}>WORKS</li>
                    <li onClick={() => scrollToSection(2.6)}>TECH STACKS</li>
                    <li onClick={() => scrollToSection(3.6)}>EDUCATION</li>
                    <li onClick={() => scrollToSection(4.6)}>RESUME</li>
                    <li onClick={() => scrollToSection(5.3)}>CONTACT</li>
                  </ul>
                </div>

                <div className="footer-col">
                  <span className="footer-col-label">FOLLOW ON</span>
                  <ul className="footer-links">
                    <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">INSTAGRAM</a></li>
                    <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LINKEDIN</a></li>
                    <li><a href="mailto:ojasdhargave@gmail.com">GMAIL</a></li>
                    <li><a href="https://github.com/ojasdhargave" target="_blank" rel="noopener noreferrer">GITHUB</a></li>
                    <li><a href="https://behance.net" target="_blank" rel="noopener noreferrer">BEHANCE</a></li>
                  </ul>
                </div>
              </div>


              {/* Neon Business Enquiry Pill Button */}
              <div className="business-enquiries-wrap">
                <a 
                  href="mailto:ojasdhargave@gmail.com?subject=Business%20Enquiry" 
                  className="business-btn"
                >
                  BUSINESS ENQUIRIES ↗
                </a>
              </div>
            </div>

            {/* Bottom copyright / legal bar */}
            <div className="footer-bottom-bar">
              <span className="copyright">© 2026 Ojas Dhargave. <br></br>All rights reserved</span>
              <div className="legal-links">
                <span>PRIVACY POLICY</span>
                <span>TERMS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
