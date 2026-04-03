import { useEffect, useRef } from 'react';

interface MouseRepelOptions {
  radius?: number;
  strength?: number;
}

export function useMouseRepel<T extends HTMLElement>(
  options: MouseRepelOptions = {}
): React.RefObject<T | null> {
  const { radius = 200, strength = 1 } = options;
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if device has fine pointer (mouse)
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasFinePointer) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const elementCenterX = rect.left + rect.width / 2;
      const elementCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - elementCenterX;
      const deltaY = e.clientY - elementCenterY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance < radius) {
        const force = (radius - distance) / radius;
        const angle = Math.atan2(deltaY, deltaX);
        
        const repelX = -Math.cos(angle) * force * radius * strength;
        const repelY = -Math.sin(angle) * force * radius * strength;

        element.style.transform = `translate(${repelX}px, ${repelY}px)`;
      } else {
        element.style.transform = '';
      }
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    element.style.transition = 'transform 0.2s ease-out';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [radius, strength]);

  return ref;
}
