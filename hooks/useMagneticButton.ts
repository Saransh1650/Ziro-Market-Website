import { useEffect, useRef } from 'react';

interface MagneticButtonOptions {
  strength?: number;
  speed?: number;
}

export function useMagneticButton<T extends HTMLElement>(
  options: MagneticButtonOptions = {}
): React.RefObject<T | null> {
  const { strength = 0.3, speed = 400 } = options;
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if device has fine pointer (mouse)
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasFinePointer) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      element.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    };

    const handleMouseLeave = () => {
      element.style.transform = '';
    };

    element.addEventListener('mouseenter', () => {
      element.addEventListener('mousemove', handleMouseMove);
    });

    element.addEventListener('mouseleave', () => {
      handleMouseLeave();
      element.removeEventListener('mousemove', handleMouseMove);
    });

    element.style.transition = `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`;

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength, speed]);

  return ref;
}
