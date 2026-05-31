import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import hollowmine from '../assets/images/hollowmine.png';
import eyeball from '../assets/images/eyeball.png';
import eyebg from '../assets/images/eyebg.png';
import minepic from '../assets/images/minepic.png';

// Shader code
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uBackground;
  uniform sampler2D uDisplacement;
  uniform sampler2D uPortrait;
  uniform vec4 uPortraitBox; // (uMin, uMax, vMin, vMax)
  uniform float uHasPortrait;
  uniform float uStrength;
  uniform float uOpacity;
  uniform vec2 uTexelSize;
  uniform float uScreenAspect;
  uniform float uVideoAspect;
  
  varying vec2 vUv;
  
  void main() {
    // 1. Calculate aspect ratio corrected UV coordinates (object-fit: cover)
    vec2 coverUv = vUv;
    if (uScreenAspect > uVideoAspect) {
      // Screen is wider than video: crop vertically
      float scale = uVideoAspect / uScreenAspect;
      coverUv.y = (vUv.y - 0.5) * scale + 0.5;
    } else {
      // Screen is taller than video: crop horizontally
      float scale = uScreenAspect / uVideoAspect;
      coverUv.x = (vUv.x - 0.5) * scale + 0.5;
    }

    // 2. Read the heightmap values at neighboring pixels for central differences
    float heightLeft  = texture2D(uDisplacement, vUv - vec2(uTexelSize.x, 0.0)).r;
    float heightRight = texture2D(uDisplacement, vUv + vec2(uTexelSize.x, 0.0)).r;
    float heightDown  = texture2D(uDisplacement, vUv - vec2(0.0, uTexelSize.y)).r;
    float heightUp    = texture2D(uDisplacement, vUv + vec2(0.0, uTexelSize.y)).r;
    
    // 3. Compute slopes (gradients)
    float slopeX = (heightRight - heightLeft) * 0.5;
    float slopeY = (heightUp - heightDown) * 0.5;
    
    // 4. Offset the UVs along the normal vector (refraction displacement)
    vec2 offset = vec2(slopeX, slopeY) * uStrength;
    vec2 distortedBackgroundUv = clamp(coverUv - offset, 0.001, 0.999);
    vec2 distortedScreenUv = vUv - offset;
    
    // 5. Sample the background video texture
    vec4 bgColor = texture2D(uBackground, distortedBackgroundUv);
    
    // 6. Read the displacement value at the current UV
    float displacement = texture2D(uDisplacement, vUv).r;
    
    // 7. Tint the background color towards light brown based on the displacement (the distortion trail)
    vec3 lightBrownColor = vec3(0.80, 0.70, 0.58); // #ccb394 warm light brown
    vec3 tintedColor = mix(bgColor.rgb, lightBrownColor, displacement * 0.4);
    
    // 8. Replicate hard-light blending on white background for the video background quad inside WebGL
    vec3 blendedBg;
    blendedBg.r = tintedColor.r < 0.5 ? 2.0 * tintedColor.r : 1.0;
    blendedBg.g = tintedColor.g < 0.5 ? 2.0 * tintedColor.g : 1.0;
    blendedBg.b = tintedColor.b < 0.5 ? 2.0 * tintedColor.b : 1.0;
    
    float dynamicAlpha = mix(uOpacity, 0.30, displacement);
    vec3 bgLayer = mix(vec3(1.0), blendedBg, dynamicAlpha);
    vec3 finalRgb = bgLayer;
    
    // 9. Distort and blend portrait quad if active and UV falls inside bounding box
    if (uHasPortrait > 0.5 && 
        distortedScreenUv.x >= uPortraitBox.x && distortedScreenUv.x <= uPortraitBox.y &&
        distortedScreenUv.y >= uPortraitBox.z && distortedScreenUv.y <= uPortraitBox.w) {
      
      // Calculate coordinates relative to portrait bounding box
      vec2 portUv;
      portUv.x = (distortedScreenUv.x - uPortraitBox.x) / (uPortraitBox.y - uPortraitBox.x);
      portUv.y = (distortedScreenUv.y - uPortraitBox.z) / (uPortraitBox.w - uPortraitBox.z);
      
      // Sample portrait texture using relative UV coordinates
      vec4 portColor = texture2D(uPortrait, portUv);
      
      // Blend portrait on top using standard alpha blending (preserves original color tone)
      finalRgb = mix(finalRgb, portColor.rgb, portColor.a);
    }
    
    // Canvas is fully opaque with white backdrop
    gl_FragColor = vec4(finalRgb, 1.0);
  }
`;

interface LiquidDistortionProps {
  src: string;
  strength?: number;
  radius?: number;
  relaxation?: number;
  blur?: number;
  opacity?: number;
  leftOffset?: { x: number; y: number };
  rightOffset?: { x: number; y: number };
  portraitRef?: React.RefObject<HTMLDivElement | null>;
  onWebGLActive?: (active: boolean) => void;
  easedProgress?: number;
}

export default function LiquidDistortion({
  src,
  strength = 0.15,
  radius = 120,
  relaxation = 0.95,
  blur = 0.1,
  opacity = 0.10,
  leftOffset,
  rightOffset,
  portraitRef,
  onWebGLActive,
  easedProgress = 0
}: LiquidDistortionProps) {
  const leftOffsetRef = useRef(leftOffset);
  const rightOffsetRef = useRef(rightOffset);
  const easedProgressRef = useRef(easedProgress);

  useEffect(() => {
    leftOffsetRef.current = leftOffset;
    rightOffsetRef.current = rightOffset;
    easedProgressRef.current = easedProgress;
  }, [leftOffset, rightOffset, easedProgress]);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check for WebGL support and mobile devices to trigger fallback
  useEffect(() => {
    const isWebGLAvailable = () => {
      try {
        const canvas = document.createElement('canvas');
        return !!(
          window.WebGLRenderingContext &&
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        );
      } catch (e) {
        return false;
      }
    };

    const checkMobile = () => {
      const active = isWebGLAvailable();
      setIsMobile(!active);
      if (onWebGLActive) {
        onWebGLActive(active);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // WebGL implementation
  useEffect(() => {
    if (isMobile || !canvasRef.current || !videoRef.current || !containerRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const container = containerRef.current;

    // Start video playback if not already started
    video.play().catch(() => {
      // Autoplay might be blocked until user interaction, which is fine
    });

    let width = container.clientWidth;
    let height = container.clientHeight;

    // 1. Setup heightmap canvas (2D)
    const size = 256;
    const canvas2d = document.createElement('canvas');
    canvas2d.width = size;
    canvas2d.height = size;
    const ctx2d = canvas2d.getContext('2d')!;
    ctx2d.fillStyle = 'black';
    ctx2d.fillRect(0, 0, size, size);

    // 2. Setup Three.js
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Setup textures
    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;

    const displacementTexture = new THREE.CanvasTexture(canvas2d);
    displacementTexture.minFilter = THREE.LinearFilter;
    displacementTexture.magFilter = THREE.LinearFilter;

    // 2D Portrait canvas & texture setup
    const portW = 1024;
    const portH = 791;
    const portCanvas2d = document.createElement('canvas');
    portCanvas2d.width = portW;
    portCanvas2d.height = portH;
    const portCtx2d = portCanvas2d.getContext('2d')!;

    const portraitTexture = new THREE.CanvasTexture(portCanvas2d);
    portraitTexture.minFilter = THREE.LinearFilter;
    portraitTexture.magFilter = THREE.LinearFilter;

    // Custom shader material
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uBackground: { value: videoTexture },
        uDisplacement: { value: displacementTexture },
        uStrength: { value: strength },
        uOpacity: { value: opacity },
        uTexelSize: { value: new THREE.Vector2(1.0 / size, 1.0 / size) },
        uScreenAspect: { value: width / height },
        uVideoAspect: { value: 16 / 9 }, // default ratio, updated on metadata load
        uPortrait: { value: portraitTexture },
        uPortraitBox: { value: new THREE.Vector4(0, 0, 0, 0) },
        uHasPortrait: { value: 0.0 }
      },
      transparent: true,
      depthWrite: false,
      depthTest: false
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // --- Particle System Setup ---
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      decay: number;
      size: number;
      active: boolean;
    }

    const maxParticles = 300;
    const particles: Particle[] = Array.from({ length: maxParticles }, () => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      decay: 0,
      size: 0,
      active: false
    }));
    let pIndex = 0;

    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(maxParticles * 3);
    const sizes = new Float32Array(maxParticles);
    const alphas = new Float32Array(maxParticles);

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    particleGeometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));

    const particleVertexShader = `
      uniform float uPixelRatio;
      attribute float size;
      attribute float alpha;
      varying float vAlpha;
      void main() {
        vAlpha = alpha;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * uPixelRatio;
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const particleFragmentShader = `
      varying float vAlpha;
      void main() {
        vec2 center = gl_PointCoord - vec2(0.5);
        float dist = length(center);
        if (dist > 0.5) discard;
        float intensity = smoothstep(0.5, 0.3, dist);
        // Light brown particle color (#ccb394)
        gl_FragColor = vec4(0.80, 0.70, 0.58, vAlpha * intensity);
      }
    `;

    const particleMaterial = new THREE.ShaderMaterial({
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending
    });

    const particlePoints = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particlePoints);

    // Preload portrait images
    const imgHollow = new Image();
    const imgEyebg = new Image();
    const imgEyeball = new Image();
    const imgMine = new Image();

    let hollowLoaded = false;
    let eyebgLoaded = false;
    let eyeballLoaded = false;
    let mineLoaded = false;

    const checkLoaded = () => {
      if (hollowLoaded && eyebgLoaded && eyeballLoaded && mineLoaded) {
        material.uniforms.uHasPortrait.value = 1.0;
      }
    };

    imgHollow.onload = () => {
      hollowLoaded = true;
      checkLoaded();
    };
    imgEyebg.onload = () => {
      eyebgLoaded = true;
      checkLoaded();
    };
    imgEyeball.onload = () => {
      eyeballLoaded = true;
      checkLoaded();
    };
    imgMine.onload = () => {
      mineLoaded = true;
      checkLoaded();
    };

    imgHollow.src = hollowmine;
    imgEyebg.src = eyebg;
    imgEyeball.src = eyeball;
    imgMine.src = minepic;

    if (imgHollow.complete) hollowLoaded = true;
    if (imgEyebg.complete) eyebgLoaded = true;
    if (imgEyeball.complete) eyeballLoaded = true;
    if (imgMine.complete) mineLoaded = true;
    checkLoaded();

    // Update video aspect ratio when metadata loads
    const handleMetadata = () => {
      if (video.videoWidth && video.videoHeight) {
        material.uniforms.uVideoAspect.value = video.videoWidth / video.videoHeight;
      }
    };
    video.addEventListener('loadedmetadata', handleMetadata);
    handleMetadata(); // run once immediately in case metadata is already loaded

    // 3. Mouse and touch move tracking
    let lastMouse = { x: 0, y: 0 };
    let prevMouse = { x: 0, y: 0 };
    let hasMoved = false;
    let initialized = false;

    const spawnParticles = (clientX: number, clientY: number, rect: DOMRect, count: number) => {
      const ndcX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -(((clientY - rect.top) / rect.height) * 2 - 1);

      for (let i = 0; i < count; i++) {
        const index = pIndex;
        pIndex = (pIndex + 1) % maxParticles;

        particles[index].x = ndcX;
        particles[index].y = ndcY;
        
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.001 + Math.random() * 0.004;
        particles[index].vx = Math.cos(angle) * speed;
        particles[index].vy = Math.sin(angle) * speed;
        
        particles[index].life = 1.0;
        particles[index].decay = 0.015 + Math.random() * 0.02; // lasts 1.5 - 3 seconds
        particles[index].size = 4.0 + Math.random() * 8.0; // soft small visible sizes
        particles[index].active = true;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * size;
      const y = ((e.clientY - rect.top) / rect.height) * size;

      if (!initialized) {
        lastMouse = { x, y };
        prevMouse = { x, y };
        initialized = true;
      } else {
        lastMouse = { x, y };
      }
      hasMoved = true;

      // Spawn particles
      spawnParticles(e.clientX, e.clientY, rect, 2);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        const x = ((touch.clientX - rect.left) / rect.width) * size;
        const y = ((touch.clientY - rect.top) / rect.height) * size;

        if (!initialized) {
          lastMouse = { x, y };
          prevMouse = { x, y };
          initialized = true;
        } else {
          lastMouse = { x, y };
        }
        hasMoved = true;

        // Spawn particles
        spawnParticles(touch.clientX, touch.clientY, rect, 2);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // 4. Window resize handler
    const handleResize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      renderer.setSize(width, height);
      material.uniforms.uScreenAspect.value = width / height;
      particleMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
    };
    window.addEventListener('resize', handleResize);

    // 5. Animation loop
    let animationId: number;

    const tick = () => {
      // Fade heightmap canvas towards black (wave relaxation)
      const fadeRate = 1.0 - relaxation; // e.g. 0.05
      ctx2d.fillStyle = `rgba(0, 0, 0, ${fadeRate})`;
      ctx2d.fillRect(0, 0, size, size);

      // Draw mouse trail on heightmap if mouse has moved
      if (hasMoved) {
        const dist = Math.hypot(lastMouse.x - prevMouse.x, lastMouse.y - prevMouse.y);
        const steps = Math.ceil(dist / 2);
        
        // Brush radius in heightmap coordinate space
        const brushRadius = radius * (size / width);

        for (let i = 0; i <= steps; i++) {
          const t = steps === 0 ? 1.0 : i / steps;
          const x = prevMouse.x + (lastMouse.x - prevMouse.x) * t;
          const y = prevMouse.y + (lastMouse.y - prevMouse.y) * t;

          const grad = ctx2d.createRadialGradient(x, y, 0, x, y, brushRadius);
          // Scale intensity to 1.0 for a stronger heightmap delta
          const alpha = 1.0;
          grad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
          grad.addColorStop(1.0 - blur, `rgba(255, 255, 255, ${alpha * 0.5})`);
          grad.addColorStop(1.0, 'rgba(255, 255, 255, 0)');

          ctx2d.fillStyle = grad;
          ctx2d.beginPath();
          ctx2d.arc(x, y, brushRadius, 0, Math.PI * 2);
          ctx2d.fill();
        }

        // Reset mouse movement state so we only draw when cursor moves
        prevMouse = { ...lastMouse };
        hasMoved = false;
      }

      // --- Update Particle System ---
      const posAttr = particleGeometry.attributes.position as THREE.BufferAttribute;
      const sizeAttr = particleGeometry.attributes.size as THREE.BufferAttribute;
      const alphaAttr = particleGeometry.attributes.alpha as THREE.BufferAttribute;

      const posArray = posAttr.array as Float32Array;
      const sizeArray = sizeAttr.array as Float32Array;
      const alphaArray = alphaAttr.array as Float32Array;

      for (let i = 0; i < maxParticles; i++) {
        const p = particles[i];
        if (p.active) {
          p.x += p.vx;
          p.y += p.vy;
          
          p.vx *= 0.95;
          p.vy *= 0.95;
          
          // Subtle upward floating motion
          p.vy += 0.00015;

          p.life -= p.decay;
          if (p.life <= 0) {
            p.active = false;
          }
        }

        const idx = i * 3;
        if (p.active) {
          posArray[idx] = p.x;
          posArray[idx + 1] = p.y;
          posArray[idx + 2] = 0;
          sizeArray[i] = p.size;
          alphaArray[i] = p.life * 0.7; // cap particle max alpha at 0.7
        } else {
          // Off-screen
          posArray[idx] = -999;
          posArray[idx + 1] = -999;
          posArray[idx + 2] = 0;
          sizeArray[i] = 0;
          alphaArray[i] = 0;
        }
      }

      posAttr.needsUpdate = true;
      sizeAttr.needsUpdate = true;
      alphaAttr.needsUpdate = true;

      // --- Update Portrait Canvas and Uniforms ---
      if (portraitRef && portraitRef.current && material.uniforms.uHasPortrait.value > 0.5) {
        const rect = portraitRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        
        // Calculate bounds in UV coordinates
        const uMin = (rect.left - containerRect.left) / containerRect.width;
        const uMax = (rect.right - containerRect.left) / containerRect.width;
        const vMin = (containerRect.bottom - rect.bottom) / containerRect.height;
        const vMax = (containerRect.bottom - rect.top) / containerRect.height;

        material.uniforms.uPortraitBox.value.set(uMin, uMax, vMin, vMax);

        // Draw portrait layers onto portCanvas2d
        portCtx2d.clearRect(0, 0, portW, portH);

        const domWidth = rect.width;
        const cx1 = portW * 0.44726;
        const cy1 = portH * 0.46538;
        const cx2 = portW * 0.59443;
        const cy2 = portH * 0.47538;
        const bgW = portW * 0.088;
        const bgH = bgW * (116 / 180);
        const ebW = portW * 0.0259;
        const ebH = ebW * (51 / 53);

        const ox1 = (leftOffsetRef.current?.x || 0) * (portW / domWidth);
        const oy1 = (leftOffsetRef.current?.y || -3.5) * (portW / domWidth);
        const ox2 = (rightOffsetRef.current?.x || 0) * (portW / domWidth);
        const oy2 = (rightOffsetRef.current?.y || -3.5) * (portW / domWidth);

        const progress = easedProgressRef.current;

        // Draw hollow layers (eye backgrounds, eyeballs, hollow portrait) with opacity (1 - progress)
        portCtx2d.globalAlpha = Math.max(0, 1 - progress);
        portCtx2d.drawImage(imgEyebg, cx1 - bgW / 2, cy1 - bgH / 2, bgW, bgH);
        portCtx2d.drawImage(imgEyebg, cx2 - bgW / 2, cy2 - bgH / 2, bgW, bgH);

        portCtx2d.drawImage(imgEyeball, cx1 + ox1 - ebW / 2, cy1 + oy1 - ebH / 2, ebW, ebH);
        portCtx2d.drawImage(imgEyeball, cx2 + ox2 - ebW / 2, cy2 + oy2 - ebH / 2, ebW, ebH);

        portCtx2d.drawImage(imgHollow, 0, 0, portW, portH);

        // Draw solid minepic layer with opacity (progress)
        portCtx2d.globalAlpha = Math.min(1, progress);
        portCtx2d.drawImage(imgMine, 0, 0, portW, portH);

        // Reset global alpha
        portCtx2d.globalAlpha = 1.0;

        portraitTexture.needsUpdate = true;
      }

      displacementTexture.needsUpdate = true;
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(tick);
    };

    tick();

    // 6. Cleanup WebGL context and listeners
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      video.removeEventListener('loadedmetadata', handleMetadata);

      geometry.dispose();
      material.dispose();
      videoTexture.dispose();
      displacementTexture.dispose();

      portraitTexture.dispose();

      particleGeometry.dispose();
      particleMaterial.dispose();

      renderer.dispose();
    };
  }, [isMobile, src, strength, radius, relaxation, blur, opacity]);

  return (
    <div ref={containerRef} className="distortion-container">
      {/* Hidden background video source for WebGL or active fallback video for mobile */}
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className={isMobile ? 'bg-video mobile-fallback' : 'hidden-video'}
      />
      {!isMobile && (
        <canvas ref={canvasRef} className="distortion-canvas" />
      )}
    </div>
  );
}
