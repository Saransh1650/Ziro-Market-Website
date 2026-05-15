'use client';

import { useEffect, useRef, useState } from 'react';

const floatingStocks = [
  { text: 'RELIANCE', change: '▲2.4%', cls: 'green', top: '12%',  left: '6%',   delay: '0s' },
  { text: 'INFY',     change: '▼0.8%', cls: 'red',   top: '38%',  right: '8%',  delay: '1.8s' },
  { text: 'HDFCBANK', change: '▲1.2%', cls: 'green', top: '65%',  left: '8%',   delay: '3.2s' },
  { text: 'TCS',      change: '▲3.1%', cls: 'green', top: '78%',  right: '9%',  delay: '2.1s' },
  { text: 'NIFTY 50', change: '▲0.6%', cls: 'green', top: '8%',   right: '14%', delay: '4.1s' },
  { text: 'SENSEX',   change: '▲0.4%', cls: 'green', top: '82%',  left: '16%',  delay: '0.9s' },
  { text: 'BAJFINANCE',change: '▲4.7%',cls: 'green', top: '22%',  right: '5%',  delay: '5.2s' },
  { text: 'ICICIBANK',change: '▲0.6%', cls: 'green', top: '55%',  right: '16%', delay: '0.6s' },
  { text: 'SBIN',     change: '▲3.1%', cls: 'green', top: '28%',  left: '20%',  delay: '4.6s' },
  { text: 'WIPRO',    change: '▼1.1%', cls: 'red',   top: '5%',   left: '48%',  delay: '3.7s' },
  { text: 'ITC',      change: '▲0.5%', cls: 'green', top: '91%',  left: '36%',  delay: '1.1s' },
  { text: 'ADANIENT', change: '▲1.8%', cls: 'green', top: '47%',  left: '40%',  delay: '2.8s' },
];

export default function Waitlist() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [os, setOs] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('var(--green)');
  const [btnText, setBtnText] = useState('Get Early Access →');
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsMobile(window.innerWidth <= 768);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Minimal canvas: just a quiet candle chart background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w: number, h: number;
    const resize = () => {
      if (canvas) { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; }
    };
    window.addEventListener('resize', resize);
    resize();

    // Generate candle data
    const candles: { o:number; h:number; l:number; c:number }[] = [];
    let p = 22000;
    for (let i = 0; i < 100; i++) {
      const o = p;
      const d = (Math.random() - 0.46) * 120;
      const c = o + d;
      candles.push({ o, h: Math.max(o,c) + Math.random() * 60, l: Math.min(o,c) - Math.random() * 60, c });
      p = c;
    }

    let raf: number;
    const draw = () => {
      if (!canvas || !canvas.isConnected || !ctx) return;
      ctx.clearRect(0, 0, w, h);

      // Draw candles
      const count = Math.min(candles.length, Math.floor(w / 18));
      const slice = candles.slice(0, count);
      const prices = slice.flatMap(c => [c.h, c.l]);
      const minP = Math.min(...prices), maxP = Math.max(...prices);
      const range = maxP - minP || 1;
      const cw = w / count;
      const aH = h * 0.5, offY = h * 0.2;

      slice.forEach((c, i) => {
        const x = (i + 0.5) * cw;
        const oY = offY + aH - ((c.o - minP) / range) * aH;
        const cY = offY + aH - ((c.c - minP) / range) * aH;
        const hY = offY + aH - ((c.h - minP) / range) * aH;
        const lY = offY + aH - ((c.l - minP) / range) * aH;
        const up = c.c >= c.o;
        const color = up ? '#22c55e' : '#ef4444';
        const bH = Math.max(1, Math.abs(cY - oY));
        const bY = Math.min(oY, cY);

        ctx.globalAlpha = 0.07;
        ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x, hY); ctx.lineTo(x, lY); ctx.stroke();
        ctx.fillRect(x - cw * 0.28, bY, cw * 0.56, bH);
      });
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!os) { setMessageColor('var(--red)'); setMessage('Please select your device platform first.'); return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setMessageColor('var(--red)'); setMessage('Please enter a valid email address.'); return; }

    setBtnText('Securing your spot...'); setBtnDisabled(true); setMessage('');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, os, source: 'landing_bw_v2' }),
      });
      if (res.ok) showSuccess(); else throw new Error();
    } catch {
      const saved = JSON.parse(localStorage.getItem('ziro_waitlist') || '[]');
      if (!saved.find((s: { email: string }) => s.email === email)) {
        saved.push({ email, os, timestamp: new Date().toISOString() });
        localStorage.setItem('ziro_waitlist', JSON.stringify(saved));
      }
      showSuccess();
    }
  };

  const showSuccess = () => {
    setMessageColor('var(--green)');
    setMessage(`✓ You're on the list! We'll be in touch, ${email.split('@')[0]}.`);
    setBtnText("✓ You're In!"); setEmail('');
    setTimeout(() => { setBtnText('Get Early Access →'); setBtnDisabled(false); }, 6000);
  };

  return (
    <section className="waitlist-section" id="waitlist">
      <canvas ref={canvasRef} id="waitlist-canvas" />

      {/* Floating tickers */}
      <div className="wl-tickers-container">
        {floatingStocks.map((s, i) => (
          <div
            key={i}
            className="wl-ticker-float-wrap"
            style={{ top: s.top, left: (s as { left?: string }).left, right: (s as { right?: string }).right, animationDelay: s.delay }}
          >
            <div className={`wl-ticker-float ${s.cls}`}>
              <span className="wl-ticker-symbol">{s.text}</span>
              <span className="wl-ticker-change">{s.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Card */}
      <div className="container wl-card-wrap">
        <div className="wl-card">

          {/* Eyebrow */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '28px', padding: '5px 14px', borderRadius: '99px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)', display: 'inline-block', animation: 'blink 2s ease infinite' }} />
            <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-4)', textTransform: 'uppercase' }}>Reserved Access</span>
          </div>

          <h2 className="wl-title">Ziro Market</h2>
          <p className="wl-subtitle">
            Join a waitlist of investors who want a smarter way to track the Indian market.
          </p>

          <form className="wl-form" onSubmit={handleSubmit} noValidate>
            {/* OS toggle */}
            <div className="wl-toggle-group">
              <button
                type="button"
                className={`wl-toggle-btn ${os === 'ios' ? 'active' : ''}`}
                onClick={() => setOs('ios')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.96 0-1.76-.36-2.4-.36-.64 0-1.4.36-2.4.36-3.23 0-5.75-2.6-5.75-6.12 0-3.52 2.52-6.12 5.75-6.12.96 0 1.76.36 2.4.36.64 0 1.4-.36 2.4-.36 1.83 0 3.23.96 4.03 2.16-3.66 1.14-3.05 6.13.62 7.37-.62 1.48-2.12 3.09-4.65 3.09zM12 2c0 2.22 1.8 3.84 3.75 3.84V5.75c0-2.22-1.8-3.84-3.75-3.84z"/></svg>
                iOS
              </button>
              <button
                type="button"
                className={`wl-toggle-btn ${os === 'android' ? 'active' : ''}`}
                onClick={() => setOs('android')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 15.34a.42.42 0 1 1-.841 0 .42.42 0 0 1 .841 0zm-10.205 0a.42.42 0 1 1-.84 0 .42.42 0 0 1 .84 0zM17.653 11.76l1.814-3.147a.38.38 0 0 0-.659-.378l-1.837 3.19A9.08 9.08 0 0 0 12 10.49a9.08 9.08 0 0 0-2.97.934L7.19 8.234a.38.38 0 1 0-.659.378l1.813 3.148C5.896 13.064 4.222 15.59 4.023 18.572h15.954c-.199-2.982-1.873-5.508-4.324-6.812z"/></svg>
                Android
              </button>
            </div>

            <input
              type="email"
              className="wl-input"
              placeholder="Enter your email address"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <button type="submit" className="wl-btn" disabled={btnDisabled}>
              {btnText}
            </button>
          </form>

          {message && (
            <p className="wl-msg" style={{ color: messageColor }}>{message}</p>
          )}

          {/* Trust note */}
          <p style={{ fontSize: '0.72rem', color: 'var(--text-4)', marginTop: '20px', lineHeight: 1.6 }}>
            No spam. Early access only. You&apos;ll be the first to know when we launch.
          </p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `@keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }` }} />
    </section>
  );
}
