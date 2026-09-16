import { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [followerPos, setFollowerPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const targetRef = useRef({ x: -100, y: -100 });
  const currentRef = useRef({ x: -100, y: -100 });
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check if hovering over interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest('button, a, input, textarea, select, [role="button"], .cursor-pointer, .card, iframe')
        );
        setIsHovered(isInteractive);
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth trailing physics using requestAnimationFrame
    const animate = () => {
      const ease = 0.18;
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * ease;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * ease;

      setFollowerPos({
        x: currentRef.current.x,
        y: currentRef.current.y,
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isVisible]);

  if (isTouch || !isVisible) return null;

  return (
    <>
      {/* Outer Fluid Follower Ring */}
      <div
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full transition-transform ease-out will-change-transform"
        style={{
          transform: `translate3d(${followerPos.x}px, ${followerPos.y}px, 0) translate(-50%, -50%) scale(${
            isClicked ? 0.75 : isHovered ? 1.6 : 1
          })`,
          width: '36px',
          height: '36px',
          border: '1.5px solid var(--color-accent)',
          backgroundColor: isHovered ? 'rgba(74, 124, 111, 0.16)' : 'rgba(74, 124, 111, 0.04)',
          boxShadow: isHovered
            ? '0 0 24px rgba(74, 124, 111, 0.45), inset 0 0 12px rgba(74, 124, 111, 0.25)'
            : '0 0 12px rgba(74, 124, 111, 0.2)',
          transitionDuration: '160ms',
        }}
      />

      {/* Inner Precision Dot with white border for crisp contrast */}
      <div
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full transition-transform will-change-transform"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%) scale(${
            isClicked ? 1.3 : isHovered ? 0.6 : 1
          })`,
          width: '8px',
          height: '8px',
          backgroundColor: 'var(--color-accent)',
          border: '1.5px solid #ffffff',
          boxShadow: '0 0 10px rgba(74, 124, 111, 0.7), 0 2px 4px rgba(0,0,0,0.2)',
          transitionDuration: '40ms',
        }}
      />
    </>
  );
}
