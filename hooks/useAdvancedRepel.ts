import { useEffect, useRef } from 'react';

interface AdvancedRepelOptions {
  radius?: number;
  strength?: number;
  tension?: number;
  friction?: number;
}

export function useAdvancedRepel<T extends HTMLElement>(
  options: AdvancedRepelOptions = {}
): React.RefObject<T | null> {
  const {
    radius = 250,
    strength = 0.8,
    tension = 0.05,
    friction = 0.9
  } = options;

  const ref = useRef<T | null>(null);
  const position = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: -1000, y: -1000 }); // Start far away
  const home = useRef({ x: 0, y: 0 });
  const isRunning = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasFinePointer) return;

    // Stable home calculation (calculate once on mount and on resize)
    const updateHome = () => {
      if (!element) return;
      
      // Temporarily remove transform to get "Home" position correctly during resize
      const prevTransform = element.style.transform;
      element.style.transform = 'none';
      
      const rect = element.getBoundingClientRect();
      home.current = {
        x: rect.left + rect.width / 2 + window.scrollX,
        y: rect.top + rect.height / 2 + window.scrollY
      };
      
      element.style.transform = prevTransform;
    };

    updateHome();
    window.addEventListener('resize', updateHome);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.pageX, y: e.pageY };
      
      if (!isRunning.current) {
        const dx = mouse.current.x - home.current.x;
        const dy = mouse.current.y - home.current.y;
        const distSq = dx * dx + dy * dy;
        
        // Slightly larger wake-up radius for responsiveness
        if (distSq < radius * radius * 9) { 
          isRunning.current = true;
          requestAnimationFrame(animate);
        }
      }
    };

    const animate = () => {
      if (!element || !isRunning.current) return;

      const dx = mouse.current.x - home.current.x;
      const dy = mouse.current.y - home.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        const force = (radius - dist) / radius;
        const angle = Math.atan2(dy, dx);
        
        target.current = {
          x: -Math.cos(angle) * force * (radius * 0.25) * strength,
          y: -Math.sin(angle) * force * (radius * 0.25) * strength
        };
      } else {
        target.current = { x: 0, y: 0 };
      }

      const ax = (target.current.x - position.current.x) * tension;
      const ay = (target.current.y - position.current.y) * tension;

      velocity.current.x += ax;
      velocity.current.y += ay;
      velocity.current.x *= friction;
      velocity.current.y *= friction;

      position.current.x += velocity.current.x;
      position.current.y += velocity.current.y;

      const rotate = position.current.x * 0.03;
      const scale = 1 + (Math.abs(position.current.x) + Math.abs(position.current.y)) * 0.0003;
      element.style.transform = `translate3d(${position.current.x}px, ${position.current.y}px, 0) rotate(${rotate}deg) scale(${scale})`;

      const distToTarget = Math.abs(target.current.x - position.current.x) + Math.abs(target.current.y - position.current.y);
      const speed = Math.abs(velocity.current.x) + Math.abs(velocity.current.y);

      // Settle at home when mouse is far and element is quiet
      if (distToTarget < 0.05 && speed < 0.05 && dist >= radius) {
        isRunning.current = false;
        position.current = { x: 0, y: 0 };
        velocity.current = { x: 0, y: 0 };
        element.style.transform = '';
      } else {
        requestAnimationFrame(animate);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    isRunning.current = true;
    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', updateHome);
      isRunning.current = false;
    };
  }, [radius, strength, tension, friction]);

  return ref;
}
