import React, { useState, useRef } from 'react';

interface LiquidGlassButtonProps {
  label: string;      // e.g. "github", "leetcode", etc.
  url: string;
  style?: React.CSSProperties;
}

export const LiquidGlassButton: React.FC<LiquidGlassButtonProps> = ({ label, url, style }) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const buttonRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ x: 0, y: 0 });

  const threshold = 100; // 30px drag threshold to unlock

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only drag with left click or touch/pen
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    buttonRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    let dx = e.clientX - dragStart.current.x;
    let dy = e.clientY - dragStart.current.y;
    const rawDistance = Math.sqrt(dx * dx + dy * dy);

    // Apply elastic/physical resistance using Math.tanh
    // This makes the button harder to drag as it gets closer to the threshold
    if (rawDistance > 0) {
      const actualDistance = threshold * Math.tanh(rawDistance / threshold);
      dx = (dx / rawDistance) * actualDistance;
      dy = (dy / rawDistance) * actualDistance;

      // Unlock threshold is 90% of the maximum threshold
      setIsUnlocked(actualDistance >= threshold * 0.9);
    } else {
      setIsUnlocked(false);
    }

    setOffset({ x: dx, y: dy });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    setIsDragging(false);
    buttonRef.current?.releasePointerCapture(e.pointerId);

    const distance = Math.sqrt(offset.x * offset.x + offset.y * offset.y);

    // Trigger if drag distance reached the activation threshold (90% of threshold)
    if (distance >= threshold * 0.9) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }

    // Reset state
    setOffset({ x: 0, y: 0 });
    setIsUnlocked(false);
  };

  const transformStyle = isDragging
    ? `translate3d(${offset.x}px, ${offset.y}px, 0) scale(1.05)`
    : 'translate3d(0, 0, 0)';

  // Determine the label text shown above the button
  let labelText = "drag me anywhere to unlock";
  if (isDragging) {
    labelText = isUnlocked ? "oouch ok fine (release!)" : "More..";
  }

  return (
    <div className="liquid-glass-btn-wrapper" style={style}>
      <span className={`liquid-glass-label ${isDragging ? 'dragging' : ''} ${isUnlocked ? 'unlocked' : ''}`}>
        {labelText}
      </span>
      <div
        ref={buttonRef}
        className={`liquid-glass-btn ${isDragging ? 'dragging' : ''} ${isUnlocked ? 'unlocked' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          transform: transformStyle,
          backdropFilter: 'blur(12px) saturate(120%)',
          WebkitBackdropFilter: 'blur(12px) saturate(120%)',
          transition: isDragging
            ? 'none'
            : 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.3s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.3s cubic-bezier(0.25, 1, 0.5, 1), color 0.3s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
      >
        {label}
      </div>
    </div>
  );
};
