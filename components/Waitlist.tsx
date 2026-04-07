'use client';

import { useEffect, useRef, useState } from 'react';
import { useMagneticButton } from '@/hooks/useMagneticButton';
import { useAdvancedRepel } from '@/hooks/useAdvancedRepel';

const floatingStocks = [
  { text: 'RELIANCE', price: '₹2,847', change: '▲2.4%', className: 'green', top: '15%', left: '8%', delay: '0s' },
  { text: 'INFY', price: '₹1,634', change: '▼0.8%', className: 'red', top: '35%', right: '12%', delay: '1.5s' },
  { text: 'HDFCBANK', price: '₹1,687', change: '▲1.2%', className: 'green', top: '65%', left: '10%', delay: '3s' },
  { text: 'TCS', price: '₹4,122', change: '▲3.1%', className: 'green', top: '75%', right: '10%', delay: '2s' },
  { text: 'NIFTY 50', price: '22,847', isIndex: true, className: '', top: '8%', right: '15%', delay: '4s', color: 'var(--brand)' },
  { text: 'SENSEX', price: '75,190', isIndex: true, className: '', top: '82%', left: '18%', delay: '1s', color: 'var(--accent-2)' },
  { text: 'BAJFINANCE', price: '₹7,142', change: '▲4.7%', className: 'green', top: '25%', right: '6%', delay: '5s' },
  { text: 'ADANIENT', price: '₹2,456', change: '▲1.8%', className: 'green', top: '92%', right: '22%', delay: '3.5s' },
  { text: 'ICICIBANK', price: '₹1,234', change: '▲0.6%', className: 'green', top: '28%', left: '18%', delay: '4.5s' },
  { text: 'SBIN', price: '₹791', change: '▲3.1%', className: 'green', top: '55%', right: '18%', delay: '0.8s' },
  { text: 'BHARTIARTL', price: '₹1,145', change: '▼0.4%', className: 'red', top: '12%', left: '25%', delay: '2.2s' },
  { text: 'AXISBANK', price: '₹1,056', change: '▲1.4%', className: 'green', top: '85%', right: '40%', delay: '3.1s' },
  { text: 'ITC', price: '₹412', change: '▲0.5%', className: 'green', top: '42%', right: '30%', delay: '0.3s' },
  { text: 'MARUTI', price: '₹11,456', change: '▲0.9%', className: 'green', top: '48%', left: '42%', delay: '1.2s' },
  { text: 'SUNPHARMA', price: '₹1,532', change: '▲2.1%', className: 'green', top: '22%', left: '35%', delay: '4.8s' },
  { text: 'LT', price: '₹3,642', change: '▼0.7%', className: 'red', top: '72%', right: '35%', delay: '2.5s' },
  { text: 'KOTAKBANK', price: '₹1,742', change: '▲0.4%', className: 'green', top: '38%', right: '25%', delay: '0.5s' },
  { text: 'ONGC', price: '₹274', change: '▲4.2%', className: 'green', top: '18%', right: '55%', delay: '5.2s' },
  { text: 'TATAMOTORS', price: '₹954', change: '▲1.5%', className: 'green', top: '94%', left: '32%', delay: '1.8s' },
  { text: 'WIPRO', price: '₹482', change: '▼1.1%', className: 'red', top: '5%', left: '55%', delay: '3.9s' },
  { text: 'TITAN', price: '₹3,742', change: '▲0.2%', className: 'green', top: '62%', left: '55%', delay: '2.1s' },
  { text: 'COALINDIA', price: '₹442', change: '▲3.8%', className: 'green', top: '88%', right: '5%', delay: '0.9s' },
  { text: 'JSWSTEEL', price: '₹842', change: '▼0.3%', className: 'red', top: '32%', left: '6%', delay: '4.2s' },
  { text: 'HINDALCO', price: '₹594', change: '▲2.7%', className: 'green', top: '15%', right: '42%', delay: '1.4s' },
  { text: 'NESTLEIND', price: '₹2,542', change: '▲0.6%', className: 'green', top: '2%', right: '35%', delay: '2.7s' },
  { text: 'POWERGRID', price: '₹284', change: '▲1.1%', className: 'green', top: '52%', left: '12%', delay: '5.5s' },
  { text: 'ULTRACEMCO', price: '₹9,842', change: '▼0.4%', className: 'red', top: '78%', left: '48%', delay: '0.2s' },
  { text: 'GRASIM', price: '₹2,242', change: '▲0.8%', className: 'green', top: '12%', left: '48%', delay: '3.4s' },
];

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

function FloatingStock({ stock }: { stock: typeof floatingStocks[0] }) {
  const repelRef = useAdvancedRepel<HTMLDivElement>({ radius: 320, strength: 0.4 });

  return (
    <div
      className={`wl-ticker-float-wrap ${stock.isIndex ? 'is-index' : ''}`}
      style={{
        top: stock.top,
        left: stock.left,
        right: stock.right,
        animationDelay: stock.delay,
      }}
    >
      <div
        ref={repelRef}
        className={`wl-ticker-float ${stock.className}`}
        style={{
          boxShadow: `0 8px 30px rgba(0,0,0,0.4)`,
          border: `1px solid ${stock.isIndex ? 'var(--brand)' : 'var(--border)'}`,
          color: stock.color,
        }}
      >
        <div className="wl-ticker-symbol">{stock.text}</div>
        {!stock.isIndex && stock.change && <div className="wl-ticker-change">{stock.change}</div>}
      </div>
    </div>
  );
}

export default function Waitlist() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesContainerRef = useRef<HTMLDivElement>(null);
  const [os, setOs] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('var(--green)');
  const [btnText, setBtnText] = useState('Get Early Access →');
  const [btnDisabled, setBtnDisabled] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w: number, h: number;

    function resizeCanvas() {
      if (canvas) {
        w = canvas.width = canvas.offsetWidth;
        h = canvas.height = canvas.offsetHeight;
      }
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const genCandles = (n: number) => {
      const result = [];
      let price = 22000 + rand(0, 2000);
      for (let i = 0; i < n; i++) {
        const open = price;
        const delta = rand(-150, 150);
        const close = price + delta;
        const high = Math.max(open, close) + rand(20, 80);
        const low = Math.min(open, close) - rand(20, 80);
        result.push({ open, high, low, close });
        price = close;
      }
      return result;
    };

    const candleData = genCandles(80);

    const particles = Array.from({ length: 50 }, () => ({
      x: rand(0, 1),
      y: rand(0, 1),
      vy: rand(-0.0003, -0.0008),
      size: rand(1, 2),
      opacity: rand(0.2, 0.5),
      color: Math.random() > 0.6 ? '#10b981' : Math.random() > 0.5 ? '#3a6ea5' : '#4b7fb8',
    }));

    function drawGrid(ctx: CanvasRenderingContext2D, w: number, h: number) {
      ctx.strokeStyle = 'rgba(255,255,255,0.02)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 100) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += 80) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
    }

    function drawCandles(ctx: CanvasRenderingContext2D, w: number, h: number) {
      const count = Math.min(candleData.length, Math.floor(w / 20));
      const segment = candleData.slice(0, count);
      const prices = segment.flatMap((c) => [c.high, c.low]);
      const minP = Math.min(...prices);
      const maxP = Math.max(...prices);
      const range = maxP - minP || 1;

      const candleW = w / count;
      const availH = h * 0.45;
      const offsetY = h * 0.25;

      segment.forEach((c, i) => {
        const x = (i + 0.5) * candleW;
        const openY = offsetY + availH - ((c.open - minP) / range) * availH;
        const closeY = offsetY + availH - ((c.close - minP) / range) * availH;
        const highY = offsetY + availH - ((c.high - minP) / range) * availH;
        const lowY = offsetY + availH - ((c.low - minP) / range) * availH;
        const isUp = c.close >= c.open;
        const color = isUp ? '#10b981' : '#ef4444';
        const bH = Math.max(1, Math.abs(closeY - openY));
        const bY = Math.min(openY, closeY);

        ctx.globalAlpha = 0.15;
        ctx.fillStyle = color; ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x, highY); ctx.lineTo(x, lowY); ctx.stroke();
        ctx.fillRect(x - candleW * 0.3, bY, candleW * 0.6, bH);
      });
      ctx.globalAlpha = 1;
    }

    let linePoints = Array.from({ length: 120 }, (_, i) => ({
      x: i / 119,
      y: 0.4 + Math.sin(i * 0.2) * 0.05,
    }));
    let lineT = 0;

    function drawLine(ctx: CanvasRenderingContext2D, w: number, h: number) {
      const points = linePoints.map((p) => ({ x: p.x * w, y: p.y * h * 0.4 }));
      ctx.save();
      ctx.shadowColor = '#3a6ea5';
      ctx.shadowBlur = 15;
      ctx.strokeStyle = 'rgba(58, 110, 165, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.stroke();
      ctx.restore();

      ctx.save();
      const grad = ctx.createLinearGradient(0, 0, 0, h * 0.5);
      grad.addColorStop(0, 'rgba(58, 110, 165, 0.08)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.lineTo(w, h * 0.5); ctx.lineTo(0, h * 0.5); ctx.fill();
      ctx.restore();
    }

    function animateCanvas() {
      if (!canvas || !canvas.isConnected || !ctx) return;
      ctx.clearRect(0, 0, w, h);
      drawGrid(ctx, w, h);
      drawLine(ctx, w, h);
      drawCandles(ctx, w, h);

      particles.forEach((p) => {
        p.y += p.vy; if (p.y < -0.02) p.y = 1.02;
        ctx.globalAlpha = p.opacity; ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x * w, p.y * h, p.size, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;
      lineT += 0.2;
      linePoints = linePoints.map((p, i) => ({
        x: p.x, y: 0.4 + Math.sin(i * 0.15 + lineT * 0.05) * 0.08 + Math.sin(i * 0.07 + lineT * 0.04) * 0.04
      }));
      requestAnimationFrame(animateCanvas);
    }
    animateCanvas();
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  useEffect(() => {
    const container = particlesContainerRef.current;
    if (!container) return;
    for (let i = 0; i < 25; i++) {
      const p = document.createElement('div');
      p.className = 'wl-particle';
      p.style.left = rand(0, 100) + '%'; p.style.top = rand(10, 90) + '%';
      p.style.width = p.style.height = rand(2, 4) + 'px';
      p.style.animationDelay = rand(0, 6) + 's'; p.style.animationDuration = rand(6, 12) + 's';
      const colors = ['var(--brand)', 'var(--accent)', 'var(--text-4)', 'rgba(255,255,255,0.2)'];
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      container.appendChild(p);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!os) { setMessageColor('var(--red)'); setMessage('// Please select your device platform (iOS or Android).'); return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setMessageColor('var(--red)'); setMessage('// Please enter a valid email address.'); return; }
    setBtnText('Securing your spot...'); setBtnDisabled(true); setMessage('');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, os, source: 'landing_warm_v1' }),
      });
      if (res.ok) showSuccess(); else throw new Error();
    } catch {
      const saved = JSON.parse(localStorage.getItem('ziro_waitlist') || '[]');
      if (!saved.find((s: any) => s.email === email)) {
        saved.push({ email, os, timestamp: new Date().toISOString() });
        localStorage.setItem('ziro_waitlist', JSON.stringify(saved));
      }
      showSuccess();
    }
  };

  const showSuccess = () => {
    setMessageColor('var(--green)');
    setMessage(`✓ You're on the list, ${email.split('@')[0]}. We'll reach out shortly!`);
    setBtnText("✓ You're In!"); setEmail('');
    setTimeout(() => { setBtnText('Get Early Access →'); setBtnDisabled(false); }, 6000);
  };

  return (
    <section className="waitlist-section" id="waitlist" style={{ background: 'var(--bg)', position: 'relative' }}>
      <canvas ref={canvasRef} id="waitlist-canvas" style={{ opacity: 0.6 }}></canvas>
      <div className="wl-particles" ref={particlesContainerRef}></div>
      <div className="wl-tickers-container">
        {floatingStocks.map((stock, i) => (
          <FloatingStock key={i} stock={stock} />
        ))}
      </div>

      <div className="container wl-card-wrap">
        <div className="wl-card glass-surface" data-reveal="scale" style={{ 
          padding: 'clamp(40px, 8vw, 80px) clamp(24px, 6vw, 64px)',
          background: 'rgba(11, 12, 14, 0.85)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-2xl)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.6)'
        }}>
          <div className="section-tag" style={{ justifyContent: 'center', marginBottom: '24px' }}>
                      <div className="badge badge-stable" style={{ background: 'var(--brand-dim)', color: 'var(--brand)', border: '1px solid var(--brand)' }}>
              Reserved Access
            </div>
          </div>

          <h2 className="wl-title" style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', letterSpacing: '-0.06em', marginBottom: '20px' }}>
            Ziro Market
          </h2>
          <p className="wl-subtitle" style={{ color: 'var(--text-3)', fontSize: '1.1rem', marginBottom: '48px' }}>
            Elevate your perspective. Join the refined intelligence network for the modern market investor.
          </p>

          <form className="wl-form" onSubmit={handleSubmit} noValidate style={{ maxWidth: '520px', margin: '0 auto' }}>
            <div className="wl-toggle-group" style={{ 
              background: 'var(--bg-2)', 
              padding: '6px', 
              borderRadius: '20px', 
              marginBottom: '16px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '4px'
            }}>
              <button 
                type="button" 
                className={`wl-toggle-btn ${os === 'ios' ? 'active' : ''}`}
                onClick={() => setOs('ios')}
                style={{ borderRadius: '14px', fontSize: '0.9rem', fontWeight: 600, padding: '10px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.96 0-1.76-.36-2.4-.36-.64 0-1.4.36-2.4.36-3.23 0-5.75-2.6-5.75-6.12 0-3.52 2.52-6.12 5.75-6.12.96 0 1.76.36 2.4.36.64 0 1.4-.36 2.4-.36 1.83 0 3.23.96 4.03 2.16-3.66 1.14-3.05 6.13.62 7.37-.62 1.48-2.12 3.09-4.65 3.09zM12 2c0 2.22 1.8 3.84 3.75 3.84V5.75c0-2.22-1.8-3.84-3.75-3.84z"/></svg>
                iOS
              </button>
              <button 
                type="button" 
                className={`wl-toggle-btn ${os === 'android' ? 'active' : ''}`}
                onClick={() => setOs('android')}
                style={{ borderRadius: '14px', fontSize: '0.9rem', fontWeight: 600, padding: '10px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 15.3414C17.523 15.1105 17.336 14.9235 17.1051 14.9235C16.8742 14.9235 16.6873 15.1105 16.6873 15.3414C16.6873 15.5723 16.8742 15.7593 17.1051 15.7593C17.336 15.7593 17.523 15.5723 17.523 15.3414ZM7.31267 15.3414C7.31267 15.1105 7.12571 14.9235 6.89482 14.9235C6.66392 14.9235 6.47696 15.1105 6.47696 15.3414C6.47696 15.5723 6.66392 15.7593 6.89482 15.7593C7.12571 15.7593 7.31267 15.5723 7.31267 15.3414ZM17.6534 11.7584L19.4678 8.61114C19.5546 8.46083 19.5029 8.26786 19.3526 8.18113C19.2023 8.0944 19.0093 8.14603 18.9226 8.29633L17.0754 11.4988C15.6565 10.8524 13.914 10.4906 12 10.4906C10.086 10.4906 8.34346 10.8524 6.92455 11.4988L5.07739 8.29633C4.99066 8.14603 4.79769 8.0944 4.64739 8.18113C4.49708 8.26786 4.44545 8.46083 4.53218 8.61114L6.34658 11.7584C3.8966 13.0645 2.2222 15.5898 2.02325 18.5721H21.9767C21.7778 15.5898 20.1034 13.0645 17.6534 11.7584Z"/></svg>
                Android
              </button>
            </div>
            <input
              type="email"
              className="wl-input"
              placeholder="Enter your email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ background: 'var(--bg-1)', border: '1px solid var(--border-2)', color: 'var(--text-1)', padding: '18px 24px', borderRadius: 'var(--r-lg)', marginBottom: '16px' }}
            />
            <button type="submit" className="wl-btn btn-primary" disabled={btnDisabled} style={{ 
              width: '100%', 
              padding: '18px', 
              fontSize: '1.1rem', 
              fontWeight: 800, 
              borderRadius: 'var(--r-lg)', 
              transition: 'transform 0.2s var(--ease-out), background 0.2s ease, box-shadow 0.2s ease' 
            }}>
              {btnText}
            </button>
          </form>
          <div className="wl-msg" style={{ color: messageColor, marginTop: '16px', fontWeight: 600 }}>
            {message}
          </div>
        </div>
      </div>
    </section>
  );
}

