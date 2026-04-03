'use client';

import { useEffect, useRef } from 'react';

const features = [
  'Real-Time NIFTY & SENSEX Tracking',
  'Sector Heatmap (34+ NSE Sectors)',
  'Volume Surge Alerts (2x, 3x, 5x)',
  'FII/DII Daily Data',
  'Smart Watchlists',
  'Institutional Flow Signals',
  'Top Movers & Gainers',
  'Options Chain Analysis',
  'Derivatives Data',
  'Multi-Index Support',
];

export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Create marquee items (duplicate for seamless loop)
    const marqueeHTML = features
      .map((feature) => `<span class="marquee-item">${feature}</span>`)
      .join('<span class="marquee-sep">•</span>');

    track.innerHTML = marqueeHTML + marqueeHTML + marqueeHTML;

    // Animate marquee
    let offset = 0;
    const speed = 1; // pixels per frame

    function animate() {
      offset += speed;
      if (track) {
        const width = track.scrollWidth / 3;
        if (offset >= width) {
          offset = 0;
        }
        track.style.transform = `translateX(-${offset}px)`;
      }
      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  return (
    <div className="marquee-section" aria-hidden="true">
      <div className="marquee-track" ref={trackRef}></div>
    </div>
  );
}
