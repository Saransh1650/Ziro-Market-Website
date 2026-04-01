document.addEventListener('DOMContentLoaded', () => {


    // 2. Intersection Observer for Scroll Reveals
    const revealOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, revealOptions);

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // 3. Floating CTA & Header Scroll Logic
    const header = document.getElementById('header');
    const floatingCta = document.getElementById('floating-cta');
    const heroHeight = document.getElementById('hero')?.offsetHeight || 600;

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;
        if (scrollPos > 100) header.classList.add('scrolled');
        else header.classList.remove('scrolled');

        if (scrollPos > heroHeight - 100) floatingCta.classList.add('visible');
        else floatingCta.classList.remove('visible');
    });

    // 4. Live Heatmap Treemap (Restored)
    const heatmapTarget = document.getElementById('heatmap-target');
    const sectors = [
        { name: 'Nifty Bank', size: 'large' },
        { name: 'IT Services', size: 'large' },
        { name: 'Reliance', size: 'wide' },
        { name: 'Auto', size: 'normal' },
        { name: 'Energy', size: 'normal' },
        { name: 'Pharma', size: 'tall' },
        { name: 'FMCG', size: 'normal' },
        { name: 'Metal', size: 'normal' },
        { name: 'Media', size: 'normal' },
        { name: 'Infra', size: 'wide' },
        { name: 'PSU Bank', size: 'normal' }
    ];

    if (heatmapTarget) {
        sectors.forEach(sec => {
            const node = document.createElement('div');
            node.className = `glass-panel heatmap-node ${sec.size || 'normal'}`;
            node.innerHTML = `
                <div class="heatmap-label">${sec.name}</div>
                <div class="heatmap-value mono">0.00%</div>
            `;
            heatmapTarget.appendChild(node);
            updateHeatmapNode(node);
        });

        function updateHeatmapNode(node) {
            const valEl = node.querySelector('.heatmap-value');
            const change = (Math.random() * 6 - 3).toFixed(2);
            const isPos = change >= 0;
            
            valEl.innerText = `${isPos ? '▲' : '▼'} ${Math.abs(change)}%`;
            
            let colorClass = 'heat-neutral';
            const absChange = Math.abs(change);
            
            if (isPos) {
                if (absChange > 2) colorClass = 'heat-pos-high';
                else if (absChange > 1) colorClass = 'heat-pos-mid';
                else colorClass = 'heat-pos-low';
            } else {
                if (absChange > 2) colorClass = 'heat-neg-high';
                else if (absChange > 1) colorClass = 'heat-neg-mid';
                else colorClass = 'heat-neg-low';
            }

            node.classList.remove('heat-pos-high', 'heat-pos-mid', 'heat-pos-low', 
                                 'heat-neg-high', 'heat-neg-mid', 'heat-neg-low', 'heat-neutral');
            node.classList.add(colorClass);
            
            valEl.classList.add('flicker');
            setTimeout(() => valEl.classList.remove('flicker'), 400);
        }

        setInterval(() => {
            const nodes = heatmapTarget.querySelectorAll('.heatmap-node');
            if (nodes.length) updateHeatmapNode(nodes[Math.floor(Math.random() * nodes.length)]);
        }, 1200);
    }

    // 5. Premium Bar Graph Generator & Animator (Restored Choice)
    const chartTarget = document.getElementById('mock-chart-target');
    if (chartTarget) {
        const barCount = 40;
        for (let i = 0; i < barCount; i++) {
            const bar = document.createElement('div');
            bar.className = 'mock-bar';
            chartTarget.appendChild(bar);
        }

        const updateBars = () => {
            const bars = chartTarget.querySelectorAll('.mock-bar');
            bars.forEach(bar => {
                const heightPercent = 20 + Math.random() * 70;
                bar.style.height = `${heightPercent}%`;
                
                // Bonus touch: dynamic color shifts
                if (heightPercent > 70) {
                    bar.classList.add('positive');
                    bar.classList.remove('negative');
                } else if (heightPercent < 30) {
                    bar.classList.add('negative');
                    bar.classList.remove('positive');
                } else {
                    bar.classList.remove('positive', 'negative');
                }
            });
        };

        updateBars();
        setInterval(updateBars, 1500);
    }

    // 6. Waitlist Form Handling
    const handleWaitlist = async (formId) => {
        const form = document.getElementById(formId);
        if (!form) return;

        const emailInput = form.querySelector('input[type="email"]');
        const expInput = form.querySelector('select');
        const submitBtn = form.querySelector('button');
        const targetMsg = document.getElementById('form-message');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();
            const experience = expInput ? expInput.value : 'not_specified';

            if (!email) return;

            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Joining...';
            submitBtn.disabled = true;

            try {
                const API_URL = 'http://localhost:3000/api/waitlist';
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, experience, source: 'landing_v2' })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    if (targetMsg) {
                        targetMsg.textContent = "You're on the list! Check your inbox.";
                        targetMsg.className = 'form-message success';
                    } else {
                        alert("Success! You're on the list.");
                    }
                    form.reset();
                } else {
                    throw new Error(data.message || 'Signup failed');
                }
            } catch (err) {
                console.error(err);
                if (targetMsg) {
                    targetMsg.textContent = "Signup failed. Is the backend running?";
                    targetMsg.className = 'form-message error';
                } else {
                    alert("Error: " + err.message);
                }
            } finally {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
                if (targetMsg) setTimeout(() => { targetMsg.className = 'form-message'; }, 5000);
            }
        });
    };

    handleWaitlist('hero-waitlist-form');
    handleWaitlist('waitlist-form');

    // 8. Market Ticker Logic
    const initTicker = () => {
        const tickerTarget = document.getElementById('ticker-target');
        if (!tickerTarget) return;

        const stocks = [
            { s: 'HDFCBANK', v: '1462.50', c: '+1.2%' },
            { s: 'RELIANCE', v: '2542.10', c: '+0.8%' },
            { s: 'INFY', v: '1420.35', c: '-0.3%' },
            { s: 'ICICIBANK', v: '942.15', c: '+1.5%' },
            { s: 'TCS', v: '3210.40', c: '+0.4%' },
            { s: 'SBIN', v: '582.30', c: '+2.1%' },
            { s: 'KOTAKBANK', v: '1840.10', c: '-0.6%' },
            { s: 'BHARTIARTL', v: '812.45', c: '+1.1%' }
        ];

        // Duplicate for seamless loop
        const displayStocks = [...stocks, ...stocks, ...stocks];

        displayStocks.forEach(stock => {
            const item = document.createElement('div');
            item.className = 'ticker-item';
            const isPos = stock.c.startsWith('+');
            item.innerHTML = `
                <span class="ticker-symbol">${stock.s}</span>
                <span class="ticker-value mono">${stock.v}</span>
                <span class="ticker-change mono ${isPos ? 'positive' : 'negative'}">${stock.c}</span>
            `;
            tickerTarget.appendChild(item);
        });
    };

    initTicker();

    // 9. Smart Signal Feed Logic
    const initSignalFeed = () => {
        const feedTarget = document.getElementById('signal-feed');
        if (!feedTarget) return;

        const signals = [
            { tag: 'FII Flow', content: 'Aggressive institutional buying detected in Private Banking sector (v: +18%).', time: 'Just Now' },
            { tag: 'Whale Alert', content: 'Large block trade of 1.2M shares in RELIANCE executed at ₹2,540.', time: '2m ago' },
            { tag: 'Sector Alpha', content: 'IT Services index breaks resistance level 32,450. Expect momentum continuation.', time: '5m ago' },
            { tag: 'Delivery Surge', content: 'HDFCBANK sees 3x average delivery volume in first hour of trade.', time: '12m ago' },
            { tag: 'Momentum', content: 'Automobile index outperforms Nifty 50 for the 4th consecutive session.', time: '15m ago' }
        ];

        let currentIndex = 0;

        const addSignal = (signal, isInitial = false) => {
            const item = document.createElement('div');
            item.className = 'signal-item';
            item.innerHTML = `
                <div class="signal-meta">
                    <span class="signal-tag">${signal.tag}</span>
                    <span class="signal-time">${signal.time}</span>
                </div>
                <div class="signal-content">${signal.content}</div>
            `;
            
            if (isInitial) {
                feedTarget.appendChild(item);
            } else {
                feedTarget.prepend(item);
                if (feedTarget.children.length > 6) {
                    feedTarget.lastElementChild.remove();
                }
            }
        };

        // Initial population
        signals.slice(0, 4).reverse().forEach(s => addSignal(s, true));

        // Periodic updates
        setInterval(() => {
            const mockSignal = {
                tag: ['INSIGHT', 'FLOW', 'ALERT', 'MOMENTUM'][Math.floor(Math.random() * 4)],
                content: [
                    'Unexpected open interest surge in NIFTY options near 22,500.',
                    'Institutional sentiment shifts to "Bullish" for Chemical sector.',
                    'Relative strength index shows divergence in MidCap tech stocks.',
                    'Heavy rotation detected from FMCG to Energy sectors.'
                ][Math.floor(Math.random() * 4)],
                time: 'Live'
            };
            addSignal(mockSignal);
        }, 6000);
    };

    initSignalFeed();
});
