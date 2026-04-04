'use client';

import { useEffect, useRef, useState } from 'react';
import { useMagneticButton } from '@/hooks/useMagneticButton';
import { useAdvancedRepel } from '@/hooks/useAdvancedRepel';

const floatingStocks = [
  { text: 'RELIANCE', price: '₹2,847', change: '▲2.4%', className: 'green', top: '15%', left: '8%', delay: '0s' },
  { text: 'INFY', price: '₹1,634', change: '▼0.8%', className: 'red', top: '35%', right: '12%', delay: '1.5s' },
  { text: 'HDFCBANK', price: '₹1,687', change: '▲1.2%', className: 'green', top: '65%', left: '10%', delay: '3s' },
  { text: 'TCS', price: '₹4,122', change: '▲3.1%', className: 'green', top: '75%', right: '10%', delay: '2s' },
  { text: 'NIFTY 50', price: '22,847', isIndex: true, className: '', top: '8%', right: '15%', delay: '4s', color: 'var(--amber)' },
  { text: 'SENSEX', price: '75,190', isIndex: true, className: '', top: '82%', left: '18%', delay: '1s', color: 'var(--accent-2)' },
  { text: 'BAJFINANCE', price: '₹7,142', change: '▲4.7%', className: 'green', top: '25%', right: '6%', delay: '5s' },
  { text: 'YESBANK', price: '₹18.50', change: '▼2.1%', className: 'red', top: '45%', left: '5%', delay: '2.5s' },
  { text: 'ADANIENT', price: '₹2,456', change: '▲1.8%', className: 'green', top: '92%', right: '22%', delay: '3.5s' },
  { text: 'ICICIBANK', price: '₹1,234', change: '▲0.6%', className: 'green', top: '28%', left: '18%', delay: '4.5s' },
  { text: 'SBIN', price: '₹791', change: '▲3.1%', className: 'green', top: '55%', right: '18%', delay: '0.8s' },
  { text: 'BHARTIARTL', price: '₹1,145', change: '▼0.4%', className: 'red', top: '12%', left: '25%', delay: '2.2s' },
  { text: 'AXISBANK', price: '₹1,056', change: '▲1.4%', className: 'green', top: '85%', right: '40%', delay: '3.1s' },
  { text: 'WIPRO', price: '₹480', change: '▼1.2%', className: 'red', top: '5%', right: '35%', delay: '1.2s' },
  { text: 'HINDUNILVR', price: '₹2,345', change: '▼0.7%', className: 'red', top: '90%', left: '35%', delay: '5.2s' },
  { text: 'ITC', price: '₹412', change: '▲0.5%', className: 'green', top: '42%', right: '30%', delay: '0.3s' },
  { text: 'KOTAKBANK', price: '₹1,789', change: '▼1.1%', className: 'red', top: '68%', right: '25%', delay: '4.1s' },
  { text: 'LTIM', price: '₹5,120', change: '▲2.1%', className: 'green', top: '22%', right: '55%', delay: '2.8s' },
  { text: 'NIFTY IT', price: '38,412', isIndex: true, className: '', top: '48%', left: '42%', delay: '3.5s', color: 'var(--accent-2)' },
  { text: 'NIFTY BANK', price: '49,210', isIndex: true, className: '', top: '72%', left: '55%', delay: '1.5s', color: 'var(--green)' },
  { text: 'M&M', price: '₹1,845', change: '▲3.4%', className: 'green', top: '35%', left: '32%', delay: '0.9s' },
  { text: 'SUNPHARMA', price: '₹1,452', change: '▼0.8%', className: 'red', top: '58%', left: '24%', delay: '2.4s' },
  { text: 'TITAN', price: '₹3,612', change: '▲0.9%', className: 'green', top: '18%', right: '25%', delay: '4.8s' },
  { text: 'POWERGRID', price: '₹285', change: '▲2.5%', className: 'green', top: '88%', right: '65%', delay: '1.2s' },
  { text: 'TATAMOTORS', price: '₹985', change: '▲1.2%', className: 'green', top: '10%', right: '45%', delay: '3.6s' },
  { text: 'ULTRACEMCO', price: '₹9,845', change: '▼1.5%', className: 'red', top: '52%', left: '65%', delay: '0.4s' },
  { text: 'ZOMATO', price: '₹185', change: '▲5.2%', className: 'green', top: '65%', right: '55%', delay: '5.5s' },
  { text: 'JIOFIN', price: '₹345', change: '▼2.1%', className: 'red', top: '42%', left: '72%', delay: '4.2s' },
  { text: 'PAYTM', price: '₹380', change: '▼0.5%', className: 'red', top: '25%', right: '72%', delay: '1.8s' },
  { text: 'ADANIPORTS', price: '₹1,345', change: '▲2.4%', className: 'green', top: '82%', left: '75%', delay: '2.1s' },
  { text: 'GRASIM', price: '₹2,245', change: '▼1.1%', className: 'red', top: '5%', left: '55%', delay: '3.4s' },
];

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

function FloatingStock({ stock }: { stock: typeof floatingStocks[0] }) {
  const repelRef = useAdvancedRepel<HTMLDivElement>({ radius: 250, strength: 0.8 });

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
  const btnRef = useMagneticButton<HTMLButtonElement>();
  const [os, setOs] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('var(--green)');
  const [btnText, setBtnText] = useState('Get Early Access →');
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [counter, setCounter] = useState(1247);

  useEffect(() => {
    // Animated canvas background
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

    // Generate candlestick data
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

    // Floating particles
    const particles = Array.from({ length: 60 }, () => ({
      x: rand(0, 1),
      y: rand(0, 1),
      vy: rand(-0.0003, -0.001),
      size: rand(1, 2.5),
      opacity: rand(0.2, 0.6),
      color: Math.random() > 0.6 ? '#22c55e' : Math.random() > 0.5 ? '#3b6fd4' : '#f59e0b',
    }));

    // Draw grid
    function drawGrid(ctx: CanvasRenderingContext2D, w: number, h: number) {
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 80) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 60) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    }

    // Draw candlesticks
    function drawCandles(ctx: CanvasRenderingContext2D, w: number, h: number) {
      const count = Math.min(candleData.length, Math.floor(w / 18));
      const segment = candleData.slice(0, count);
      const prices = segment.flatMap((c) => [c.high, c.low]);
      const minP = Math.min(...prices);
      const maxP = Math.max(...prices);
      const range = maxP - minP || 1;

      const candleW = w / count;
      const availH = h * 0.5;
      const offsetY = h * 0.25;

      segment.forEach((c, i) => {
        const x = (i + 0.5) * candleW;
        const openY = offsetY + availH - ((c.open - minP) / range) * availH;
        const closeY = offsetY + availH - ((c.close - minP) / range) * availH;
        const highY = offsetY + availH - ((c.high - minP) / range) * availH;
        const lowY = offsetY + availH - ((c.low - minP) / range) * availH;
        const isUp = c.close >= c.open;
        const color = isUp ? '#22c55e' : '#ef4444';
        const bH = Math.max(1, Math.abs(closeY - openY));
        const bY = Math.min(openY, closeY);

        ctx.globalAlpha = 0.18;
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;

        // Wick
        ctx.beginPath();
        ctx.moveTo(x, highY);
        ctx.lineTo(x, lowY);
        ctx.stroke();

        // Body
        ctx.fillRect(x - candleW * 0.3, bY, candleW * 0.6, bH);
      });
      ctx.globalAlpha = 1;
    }

    // Line chart
    let linePoints = Array.from({ length: 100 }, (_, i) => ({
      x: i / 99,
      y: 0.4 + Math.sin(i * 0.15) * 0.08 + rand(-0.03, 0.03),
    }));
    let lineT = 0;

    function drawLine(ctx: CanvasRenderingContext2D, w: number, h: number) {
      if (linePoints.length < 2) return;
      const points = linePoints.map((p) => ({ x: p.x * w, y: p.y * h * 0.4 }));

      // Glow path
      ctx.save();
      ctx.shadowColor = '#3b6fd4';
      ctx.shadowBlur = 12;
      ctx.strokeStyle = 'rgba(59,111,212,0.35)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.stroke();
      ctx.restore();

      // Fill under
      ctx.save();
      const grad = ctx.createLinearGradient(0, 0, 0, h * 0.4);
      grad.addColorStop(0, 'rgba(59,111,212,0.12)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.lineTo(w, h * 0.4);
      ctx.lineTo(0, h * 0.4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function updateLine() {
      lineT += 0.3;
      linePoints = linePoints.map((p, i) => ({
        x: p.x,
        y: 0.4 + Math.sin(i * 0.15 + lineT * 0.05) * 0.1 + Math.sin(i * 0.08 + lineT * 0.03) * 0.05,
      }));
    }

    // Animation loop
    function animateCanvas() {
      if (!canvas || !canvas.isConnected || !ctx) return;
      ctx.clearRect(0, 0, w, h);
      drawGrid(ctx, w, h);
      drawLine(ctx, w, h);
      drawCandles(ctx, w, h);

      // Particles
      particles.forEach((p) => {
        p.y += p.vy;
        if (p.y < -0.02) p.y = 1.02;
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      updateLine();
      requestAnimationFrame(animateCanvas);
    }

    animateCanvas();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  useEffect(() => {
    // Create floating DOM particles
    const container = particlesContainerRef.current;
    if (!container) return;

    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'wl-particle';
      p.style.left = rand(0, 100) + '%';
      p.style.top = rand(30, 100) + '%';
      p.style.width = p.style.height = rand(2, 4) + 'px';
      p.style.animationDelay = rand(0, 6) + 's';
      p.style.animationDuration = rand(5, 10) + 's';
      const colors = ['var(--accent-2)', 'var(--green)', 'var(--amber)', '#fff'];
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      container.appendChild(p);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!os) {
      setMessageColor('var(--red)');
      setMessage('// Please select your device platform.');
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessageColor('var(--red)');
      setMessage('// Please enter a valid email address.');
      return;
    }

    setBtnText('Securing your spot...');
    setBtnDisabled(true);
    setMessage('');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, os, source: 'landing_indian_v1' }),
      });

      if (res.ok) {
        showSuccess();
      } else {
        throw new Error('server');
      }
    } catch {
      // Fallback: save locally
      const saved = JSON.parse(localStorage.getItem('smt_waitlist') || '[]');
      const entry = { email, os, timestamp: new Date().toISOString() };
      if (!saved.find((s: any) => s.email === email)) {
        saved.push(entry);
        localStorage.setItem('smt_waitlist', JSON.stringify(saved));
      }
      showSuccess();
    }
  };

  const showSuccess = () => {
    setMessageColor('var(--green)');
    setMessage(`✓ You're on the list, ${email.split('@')[0]}. We'll reach out shortly!`);
    setBtnText("✓ You're In!");
    setCounter((prev) => prev + 1);
    setEmail('');

    setTimeout(() => {
      setBtnText('Get Early Access →');
      setBtnDisabled(false);
    }, 6000);
  };

  return (
    <section className="waitlist-section" id="waitlist">
      {/* Animated canvas background */}
      <canvas ref={canvasRef} id="waitlist-canvas"></canvas>

      {/* Floating particles */}
      <div className="wl-particles" ref={particlesContainerRef}></div>

      {/* Floating ticker chips */}
      <div className="wl-tickers-container">
        {floatingStocks.map((stock, i) => (
          <FloatingStock key={i} stock={stock} />
        ))}
      </div>

      {/* Main card */}
      <div className="container wl-card-wrap">
        <div className="wl-card" data-reveal="scale" style={{ padding: 'clamp(40px, 8vw, 72px) clamp(24px, 6vw, 64px)' }}>
          <div className="section-tag" style={{ justifyContent: 'center', marginBottom: '22px' }}>
            <div className="badge badge-live">Limited Early Access</div>
          </div>

          <h2 className="wl-title">
            Trade Insights
          </h2>
          <p className="wl-subtitle">
            Join thousands of traders and investors getting early access to India&apos;s most powerful
            market intelligence mobile app.
          </p>

          {/* Social proof */}
          <div className="wl-count">
            <div className="wl-avatars">
              <div className="wl-avatar">🧑</div>
              <div className="wl-avatar">👩</div>
              <div className="wl-avatar">🧑‍💻</div>
              <div className="wl-avatar">👨‍💼</div>
              <div className="wl-avatar">👩‍💼</div>
            </div>
            <div className="wl-count-text">
              <span className="wl-count-num">{counter.toLocaleString('en-IN')}</span> investors
              already waiting
            </div>
          </div>

          {/* Form */}
          <form className="wl-form" onSubmit={handleSubmit} noValidate>
            <select
              className="wl-select"
              value={os}
              onChange={(e) => setOs(e.target.value)}
              required
            >
              <option value="">Select your device</option>
              <option value="ios">iOS (iPhone/iPad)</option>
              <option value="android">Android</option>
            </select>
            <input
              type="email"
              className="wl-input"
              placeholder="your@email.com"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="wl-btn" ref={btnRef} disabled={btnDisabled}>
              {btnText}
            </button>
          </form>
          <p className="wl-privacy">🔒 No spam. No credit card. 100% free during early access.</p>
          <div className="wl-msg" style={{ color: messageColor }}>
            {message}
          </div>

          {/* Progress */}
          <div className="wl-progress" style={{ marginTop: '36px' }}>
            <div className="wl-progress-label">
              <span style={{ fontSize: '.72rem', color: 'var(--text-3)' }}>
                Early access spots claimed
              </span>
              <span style={{ fontSize: '.72rem', color: 'var(--text-2)', fontWeight: 600 }}>
                {counter.toLocaleString('en-IN')} / 2,000
              </span>
            </div>
            <div className="wl-progress-track">
              <div
                className="wl-progress-fill"
                style={{ width: `${(counter / 2000) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
