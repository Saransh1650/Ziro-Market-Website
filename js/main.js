/* ============================================================
   SMART MONEY TRACKER — main.js
   Premium Indian Market Intelligence App · Landing Page
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     DATA — Indian Market Context
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const STOCKS = [
    { sym: 'RELIANCE',    name: 'Reliance Industries',  price: 2943.55,  base: 2943.55 },
    { sym: 'HDFCBANK',    name: 'HDFC Bank',            price: 1627.00,  base: 1627.00 },
    { sym: 'TCS',         name: 'Tata Consultancy',     price: 3846.80,  base: 3846.80 },
    { sym: 'INFY',        name: 'Infosys',              price: 1742.15,  base: 1742.15 },
    { sym: 'WIPRO',       name: 'Wipro Ltd',            price: 464.50,   base: 464.50  },
    { sym: 'ICICIBANK',   name: 'ICICI Bank',           price: 1241.30,  base: 1241.30 },
    { sym: 'BAJFINANCE',  name: 'Bajaj Finance',        price: 7290.00,  base: 7290.00 },
    { sym: 'AXISBANK',    name: 'Axis Bank',            price: 1134.80,  base: 1134.80 },
    { sym: 'SUNPHARMA',   name: 'Sun Pharma',           price: 1548.20,  base: 1548.20 },
    { sym: 'TATASTEEL',   name: 'Tata Steel',           price: 163.10,   base: 163.10  },
    { sym: 'ONGC',        name: 'ONGC',                 price: 283.55,   base: 283.55  },
    { sym: 'KOTAKBANK',   name: 'Kotak Mahindra',       price: 1895.40,  base: 1895.40 },
    { sym: 'LT',          name: 'L&T Ltd',              price: 3512.00,  base: 3512.00 },
    { sym: 'NESTLEIND',   name: 'Nestle India',         price: 2246.70,  base: 2246.70 },
    { sym: 'POWERGRID',   name: 'Power Grid Corp',      price: 316.80,   base: 316.80  },
  ];

  const SECTORS = [
    { name: 'Banking',    val: 0, cols: 2 },
    { name: 'IT',         val: 0, cols: 2 },
    { name: 'Energy',     val: 0, cols: 1 },
    { name: 'Pharma',     val: 0, cols: 1 },
    { name: 'Auto',       val: 0, cols: 1 },
    { name: 'FMCG',       val: 0, cols: 1 },
    { name: 'Metal',      val: 0, cols: 1 },
    { name: 'Realty',     val: 0, cols: 1 },
    { name: 'Infra',      val: 0, cols: 1 },
    { name: 'Media',      val: 0, cols: 1 },
  ];

  const INDICES = [
    { sym: 'NIFTY 50',    price: 22847.30, chg: 0.82 },
    { sym: 'NIFTY BANK',  price: 48730.15, chg: 1.24 },
    { sym: 'NIFTY IT',    price: 37842.50, chg: -0.61 },
    { sym: 'SENSEX',      price: 75901.55, chg: 0.74 },
    { sym: 'NIFTY MID',   price: 53218.40, chg: 1.43 },
    { sym: 'NIFTY SMALL', price: 17432.80, chg: 2.18 },
  ];

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     UTILS
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const rand    = (a, b) => Math.random() * (b - a) + a;
  const randInt = (a, b) => Math.floor(rand(a, b));
  const sign    = n => n >= 0 ? '+' : '';
  const pct     = n => `${sign(n)}${n.toFixed(2)}%`;
  const fmtINR  = n => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const chgColor = v => v >= 0 ? 'var(--green)' : 'var(--red)';
  const cellBg   = v => {
    const a = Math.min(Math.abs(v) * 0.13, 0.55);
    return v >= 0 ? `rgba(34,197,94,${a})` : `rgba(239,68,68,${a})`;
  };
  const now = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

  /* Initialize stock state with random changes */
  const state = STOCKS.map(s => ({ ...s, chg: rand(-4, 4) }));
  SECTORS.forEach(s => { s.val = rand(-3.5, 3.5); });

  function tickStocks() {
    state.forEach(s => {
      const delta = rand(-0.35, 0.35);
      s.price = Math.max(1, s.price * (1 + delta / 100));
      s.chg  += delta * 0.6;
      s.chg   = Math.max(-9, Math.min(9, s.chg));
    });
    SECTORS.forEach(s => {
      s.val += rand(-0.25, 0.25);
      s.val  = Math.max(-5.5, Math.min(5.5, s.val));
    });
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     SCROLL PROGRESS BAR
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const progressBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const total  = document.body.scrollHeight - window.innerHeight;
    const pct    = total > 0 ? (window.scrollY / total) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
  }, { passive: true });

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     CURSOR GLOW (desktop only)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const cursorGlow = document.getElementById('cursor-glow');
  if (cursorGlow && window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('mousemove', e => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top  = e.clientY + 'px';
    }, { passive: true });
  } else if (cursorGlow) { cursorGlow.remove(); }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     NAVBAR SCROLL
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     TICKER STRIP
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  function buildTicker() {
    const el = document.getElementById('ticker-inner');
    if (!el) return;
    const allItems = [...INDICES, ...state.map(s => ({ sym: s.sym, price: s.price, chg: s.chg }))];
    const doubled = [...allItems, ...allItems]; // seamless loop
    el.innerHTML = doubled.map(item => {
      const color = chgColor(item.chg);
      return `<div class="t-item">
        <span class="t-sym">${item.sym}</span>
        <span class="t-price">${fmtINR(item.price)}</span>
        <span class="t-chg" style="color:${color}">${pct(item.chg)}</span>
      </div>`;
    }).join('');
  }
  buildTicker();

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     PHONE CLOCK
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const phoneTime = document.getElementById('phone-time');
  if (phoneTime) {
    setInterval(() => { phoneTime.textContent = now(); }, 1000);
    phoneTime.textContent = now();
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     PHONE CHART BARS
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  function buildPhoneChart() {
    const el = document.getElementById('phone-chart');
    if (!el) return;
    el.innerHTML = '';
    for (let i = 0; i < 24; i++) {
      const bar = document.createElement('div');
      bar.className = 'pw-bar';
      bar.style.height = rand(20, 100) + '%';
      const pos = Math.random() > 0.35;
      bar.style.background = pos ? 'var(--green)' : 'var(--red)';
      bar.style.opacity = (0.6 + Math.random() * 0.4).toString();
      el.appendChild(bar);
    }
  }
  buildPhoneChart();

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     PHONE MOVERS
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  function buildPhoneMovers() {
    const el = document.getElementById('phone-movers');
    if (!el) return;
    const top = [...state].sort((a, b) => Math.abs(b.chg) - Math.abs(a.chg)).slice(0, 4);
    el.innerHTML = top.map(s => `
      <div class="pw-row">
        <span class="pw-sym">${s.sym.substring(0, 8)}</span>
        <span class="pw-name">${s.name.split(' ')[0]}</span>
        <span class="pw-chg" style="color:${chgColor(s.chg)}">${pct(s.chg)}</span>
      </div>`).join('');
  }
  buildPhoneMovers();

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     PHONE HEATMAP
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  function buildPhoneHeatmap() {
    const el = document.getElementById('phone-heatmap');
    if (!el) return;
    el.innerHTML = SECTORS.slice(0, 8).map(s => `
      <div class="pw-hm-cell" style="background:${cellBg(s.val)}">
        <span class="pw-hm-name">${s.name.substring(0, 5)}</span>
        <span class="pw-hm-val">${pct(s.val)}</span>
      </div>`).join('');
  }
  buildPhoneHeatmap();

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     MARQUEE
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  function buildMarquee() {
    const el = document.getElementById('marquee-track');
    if (!el) return;
    const items = [
      '🇮🇳 NSE Listed Stocks', 'Real-time NIFTY 50 Data', 'Sector Heatmap', 'FII / DII Flow',
      'Volume Surge Detection', 'Smart Watchlist', 'BSE Top Movers', 'Pre-Market Signals',
      'Delivery Volume Analysis', 'Block Deal Tracker', 'OI Change Alerts', 'News Sentiment',
    ];
    const doubled = [...items, ...items];
    el.innerHTML = doubled.map(t => `<div class="marquee-item"><span>✦</span> ${t}</div>`).join('');
  }
  buildMarquee();

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     SCROLL REVEAL
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     COUNTER ANIMATION
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el       = entry.target;
      const target   = parseFloat(el.dataset.counter);
      const suffix   = el.dataset.suffix || '';
      const decimals = parseInt(el.dataset.decimal || '0');
      const duration = 1800;
      const start    = performance.now();
      const animate  = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 4);
        const current  = target * eased;
        el.textContent = (decimals > 0 ? current.toFixed(decimals) : Math.floor(current).toLocaleString('en-IN')) + suffix;
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('[data-counter]').forEach(el => counterObs.observe(el));

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     FEATURE TABS (SCROLL-ACTIVATED)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const featureItems = document.querySelectorAll('.feature-item');
  const paneMap = { heatmap: 'pane-heatmap', watchlist: 'pane-watchlist', volume: 'pane-volume', movers: 'pane-movers' };
  const titleMap = {
    heatmap:   'SMART_MONEY_TRACKER · SECTOR_HEATMAP',
    watchlist: 'SMART_MONEY_TRACKER · MY_WATCHLIST',
    volume:    'SMART_MONEY_TRACKER · VOLUME_ALERTS',
    movers:    'SMART_MONEY_TRACKER · TOP_GAINERS',
  };

  function switchFeature(featureKey) {
    featureItems.forEach(el => el.classList.toggle('active', el.dataset.feature === featureKey));
    document.querySelectorAll('.fp-pane').forEach(p => p.classList.remove('active'));
    const pane = document.getElementById(paneMap[featureKey]);
    if (pane) pane.classList.add('active');
    const titleEl = document.getElementById('fpp-title');
    if (titleEl) titleEl.textContent = titleMap[featureKey] || '';
  }

  featureItems.forEach(item => {
    item.addEventListener('click', () => switchFeature(item.dataset.feature));
  });

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     FEATURE PREVIEW DATA
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  /* Heatmap */
  function buildPreviewHeatmap() {
    const el = document.getElementById('preview-heatmap');
    if (!el) return;
    el.innerHTML = SECTORS.map(s => `
      <div class="ph-cell ${s.cols === 2 ? 'wide' : ''}" style="background:${cellBg(s.val)}" data-sec="${s.name}">
        <span class="ph-cell-name">${s.name}</span>
        <span class="ph-cell-val">${pct(s.val)}</span>
      </div>`).join('');
  }
  buildPreviewHeatmap();

  function updatePreviewHeatmap() {
    document.querySelectorAll('.ph-cell[data-sec]').forEach((cell, i) => {
      if (!SECTORS[i]) return;
      cell.style.background = cellBg(SECTORS[i].val);
      cell.querySelector('.ph-cell-val').textContent = pct(SECTORS[i].val);
    });
  }

  /* Watchlist table */
  function buildWatchlistTable() {
    const tbody = document.getElementById('wl-table');
    if (!tbody) return;
    const picks = [...state].sort(() => Math.random() - 0.5).slice(0, 6);
    tbody.innerHTML = picks.map(s => {
      const sparkBars = Array.from({ length: 8 }, () => {
        const h = rand(20, 100);
        const pos = Math.random() > 0.4;
        return `<div class="wl-spark-bar" style="height:${h}%;flex:1;background:${pos ? 'var(--green)' : 'var(--red)'};opacity:.8;"></div>`;
      }).join('');
      return `<tr>
        <td><div class="wl-sym">${s.sym.substring(0, 9)}</div><div class="wl-co">${s.name.split(' ')[0]}</div></td>
        <td class="mono wl-price" style="color:var(--text-1);">${fmtINR(s.price)}</td>
        <td class="mono wl-chg" style="color:${chgColor(s.chg)}">${pct(s.chg)}</td>
        <td><div class="wl-spark" style="align-items:flex-end;gap:2px;height:24px;">${sparkBars}</div></td>
      </tr>`;
    }).join('');
  }
  buildWatchlistTable();

  /* Volume surges */
  function buildVolumePreview() {
    const el = document.getElementById('preview-volume');
    if (!el) return;
    const picks = [...state].slice(0, 4).map(s => ({ ...s, mult: rand(1.8, 5.5) }));
    el.innerHTML = picks.map(s => `
      <div class="vol-item">
        <div class="vol-item-top">
          <span class="vol-sym">${s.sym.substring(0, 9)}</span>
          <span class="vol-mult" style="color:${s.mult > 3 ? 'var(--green)' : 'var(--amber)'}">×${s.mult.toFixed(1)} avg vol</span>
        </div>
        <div class="vol-bar-track">
          <div class="vol-bar-fill" style="width:${Math.min(100, (s.mult / 6) * 100)}%;background:${s.mult > 3 ? 'var(--green)' : 'var(--amber)'}"></div>
        </div>
      </div>`).join('');
  }
  buildVolumePreview();

  /* Top movers */
  function buildMoversPreview() {
    const el = document.getElementById('preview-movers');
    if (!el) return;
    const top = [...state].sort((a, b) => b.chg - a.chg).slice(0, 7);
    el.innerHTML = top.map((s, i) => `
      <div class="mover-row-p">
        <span class="mover-rank">${i + 1}</span>
        <span class="mover-sym-col">${s.sym.substring(0, 9)}</span>
        <span class="mover-name-col">${s.name.split(' ').slice(0, 2).join(' ')}</span>
        <span class="mover-price-col mono">${fmtINR(s.price)}</span>
        <span class="mover-chg-col mono" style="color:${chgColor(s.chg)}">${pct(s.chg)}</span>
      </div>`).join('');
  }
  buildMoversPreview();

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     PERIODIC LIVE UPDATES
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  setInterval(() => {
    tickStocks();
    buildPhoneMovers();
    updatePreviewHeatmap();
  }, 3500);

  setInterval(() => {
    buildPhoneChart();
  }, 8000);

  setInterval(() => {
    buildMoversPreview();
    buildVolumePreview();
  }, 5000);

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     WAITLIST CANVAS — ANIMATED BG
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const canvas = document.getElementById('waitlist-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, nodes = [], candlesticks = [];

    function resizeCanvas() {
      w = canvas.width  = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    /* Generate flowing candlestick data */
    function genCandles(n) {
      const result = [];
      let price = 22000 + rand(0, 2000);
      for (let i = 0; i < n; i++) {
        const open  = price;
        const delta = rand(-150, 150);
        const close = price + delta;
        const high  = Math.max(open, close) + rand(20, 80);
        const low   = Math.min(open, close) - rand(20, 80);
        result.push({ open, high, low, close });
        price = close;
      }
      return result;
    }

    const candleData = genCandles(80);
    let animOffset = 0;

    /* Floating particles */
    const particles = Array.from({ length: 60 }, () => ({
      x: rand(0, 1), y: rand(0, 1), vy: rand(-0.0003, -0.0010),
      size: rand(1, 2.5), opacity: rand(0.2, 0.6),
      color: Math.random() > 0.6 ? '#22c55e' : Math.random() > 0.5 ? '#3b6fd4' : '#f59e0b',
    }));

    /* Grid lines */
    function drawGrid(ctx, w, h) {
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 80) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += 60) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
    }

    /* Draw candlesticks */
    function drawCandles(ctx, w, h) {
      const count    = Math.min(candleData.length, Math.floor(w / 18));
      const startIdx = Math.floor(animOffset) % candleData.length;
      const segment  = candleData.slice(0, count);
      const prices   = segment.flatMap(c => [c.high, c.low]);
      const minP     = Math.min(...prices);
      const maxP     = Math.max(...prices);
      const range    = maxP - minP || 1;

      const candleW = w / count;
      const padY    = h * 0.1;
      const availH  = h * 0.5; // bottom half
      const offsetY = h * 0.25;

      segment.forEach((c, i) => {
        const x     = (i + 0.5) * candleW;
        const openY  = offsetY + availH - ((c.open  - minP) / range) * availH;
        const closeY = offsetY + availH - ((c.close - minP) / range) * availH;
        const highY  = offsetY + availH - ((c.high  - minP) / range) * availH;
        const lowY   = offsetY + availH - ((c.low   - minP) / range) * availH;
        const isUp   = c.close >= c.open;
        const color  = isUp ? '#22c55e' : '#ef4444';
        const bH     = Math.max(1, Math.abs(closeY - openY));
        const bY     = Math.min(openY, closeY);

        ctx.globalAlpha = 0.18;
        ctx.fillStyle   = color;
        ctx.strokeStyle = color;
        ctx.lineWidth   = 1;

        // Wick
        ctx.beginPath();
        ctx.moveTo(x, highY); ctx.lineTo(x, lowY);
        ctx.stroke();

        // Body
        ctx.fillRect(x - candleW * 0.3, bY, candleW * 0.6, bH);
      });
      ctx.globalAlpha = 1;
    }

    /* Draw line chart (top area) */
    let linePoints = Array.from({ length: 100 }, (_, i) => ({
      x: i / 99, y: 0.4 + Math.sin(i * 0.15) * 0.08 + rand(-0.03, 0.03),
    }));
    let lineT = 0;

    function drawLine(ctx, w, h) {
      if (linePoints.length < 2) return;
      const points = linePoints.map(p => ({ x: p.x * w, y: p.y * h * 0.4 }));

      // Glow path
      ctx.save();
      ctx.shadowColor = '#3b6fd4';
      ctx.shadowBlur  = 12;
      ctx.strokeStyle = 'rgba(59,111,212,0.35)';
      ctx.lineWidth   = 2;
      ctx.beginPath();
      points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.stroke();
      ctx.restore();

      // Fill under
      ctx.save();
      const grad = ctx.createLinearGradient(0, 0, 0, h * 0.4);
      grad.addColorStop(0, 'rgba(59,111,212,0.12)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.lineTo(w, h * 0.4);
      ctx.lineTo(0, h * 0.4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    /* Update line points */
    function updateLine() {
      lineT += 0.3;
      linePoints = linePoints.map((p, i) => ({
        x: p.x,
        y: 0.4 + Math.sin((i * 0.15) + lineT * 0.05) * 0.1
           + Math.sin((i * 0.08) + lineT * 0.03) * 0.05,
      }));
    }

    /* Main animation loop */
    function animateCanvas() {
      if (!canvas.isConnected) return;
      ctx.clearRect(0, 0, w, h);
      drawGrid(ctx, w, h);
      drawLine(ctx, w, h);
      drawCandles(ctx, w, h);
      animOffset += 0.008;

      // Particles
      particles.forEach(p => {
        p.y += p.vy;
        if (p.y < -0.02) p.y = 1.02;
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle   = p.color;
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      updateLine();
      requestAnimationFrame(animateCanvas);
    }
    animateCanvas();
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     WAITLIST PARTICLES (DOM)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const particlesContainer = document.getElementById('wl-particles');
  if (particlesContainer) {
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'wl-particle';
      p.style.left = rand(0, 100) + '%';
      p.style.top  = rand(30, 100) + '%';
      p.style.width = p.style.height = rand(2, 4) + 'px';
      p.style.animationDelay    = rand(0, 6) + 's';
      p.style.animationDuration = rand(5, 10) + 's';
      const colors = ['var(--accent-2)', 'var(--green)', 'var(--amber)', '#fff'];
      p.style.background = colors[randInt(0, colors.length)];
      particlesContainer.appendChild(p);
    }
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     WAITLIST FORM
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const wlForm  = document.getElementById('wl-form');
  const wlMsg   = document.getElementById('wl-msg');
  const wlBtn   = document.getElementById('wl-btn');
  const wlCount = document.getElementById('wl-counter');

  if (wlForm) {
    wlForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('wl-email').value.trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (wlMsg) { wlMsg.style.color = 'var(--red)'; wlMsg.textContent = '// Please enter a valid email address.'; }
        return;
      }

      wlBtn.textContent = 'Securing your spot...';
      wlBtn.disabled = true;
      if (wlMsg) wlMsg.textContent = '';

      try {
        const res = await fetch('http://localhost:3000/api/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, source: 'landing_indian_v1' }),
        });
        if (res.ok) {
          showSuccess(email);
        } else { throw new Error('server'); }
      } catch {
        // Fallback: save locally
        const saved = JSON.parse(localStorage.getItem('smt_waitlist') || '[]');
        if (!saved.includes(email)) { saved.push(email); localStorage.setItem('smt_waitlist', JSON.stringify(saved)); }
        showSuccess(email);
      }
    });
  }

  function showSuccess(email) {
    if (wlMsg) {
      wlMsg.style.color = 'var(--green)';
      wlMsg.textContent = `✓ You're on the list, ${email.split('@')[0]}. We'll reach out shortly!`;
    }
    if (wlBtn) { wlBtn.textContent = '✓ You\'re In!'; wlBtn.style.background = 'var(--green)'; }
    // Increment counter
    if (wlCount) {
      const current = parseInt(wlCount.textContent.replace(/,/g, '')) || 1247;
      const next    = current + 1;
      wlCount.textContent = next.toLocaleString('en-IN');
    }
    document.getElementById('wl-email').value = '';
    setTimeout(() => {
      if (wlBtn) { wlBtn.textContent = 'Get Early Access →'; wlBtn.disabled = false; wlBtn.style.background = ''; }
    }, 6000);
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     PHONE MOCKUP FLOATING ANIMATION
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const phoneFrame = document.querySelector('.phone-frame');
  if (phoneFrame && window.matchMedia('(pointer:fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      const bounds = phoneFrame.getBoundingClientRect();
      const cx = bounds.left + bounds.width / 2;
      const cy = bounds.top  + bounds.height / 2;
      const dx = (e.clientX - cx) / window.innerWidth;
      const dy = (e.clientY - cy) / window.innerHeight;
      phoneFrame.style.transform = `perspective(1000px) rotateY(${dx * 8}deg) rotateX(${-dy * 6}deg) translateY(-6px)`;
    });
    document.addEventListener('mouseleave', () => {
      phoneFrame.style.transform = '';
    });
  }

  /* Idle gentle float */
  let floatT = 0;
  const phoneWrap = document.querySelector('.phone-wrap');
  if (phoneWrap) {
    function floatPhone() {
      floatT += 0.015;
      if (phoneWrap) phoneWrap.style.transform = `translateY(${Math.sin(floatT) * 8}px)`;
      requestAnimationFrame(floatPhone);
    }
    floatPhone();
  }

});
