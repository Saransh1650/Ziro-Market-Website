'use client';

const testimonials = [
  {
    stars: '⭐⭐⭐⭐⭐',
    text: '"The sector heatmap alone is worth it. I can see in 5 seconds which sectors are getting FII inflows — what used to take me 30 minutes of research."',
    avatar: '🧑‍💼',
    name: 'Arjun M.',
    handle: 'Swing Trader · Mumbai',
    delay: 0,
  },
  {
    stars: '⭐⭐⭐⭐⭐',
    text: '"Volume surge alerts have been a game changer. Caught 3 stocks 30 minutes before they ran up 5–8%. This is institutional-level data for retail investors."',
    avatar: '👩‍💻',
    name: 'Priya R.',
    handle: 'Options Trader · Bengaluru',
    delay: 100,
  },
  {
    stars: '⭐⭐⭐⭐⭐',
    text: '"Finally a market app that doesn\'t feel like it was designed in 2015. The watchlist comparison feature is the best I\'ve seen on mobile, period."',
    avatar: '🧑‍🎓',
    name: 'Karthik S.',
    handle: 'Long-term Investor · Chennai',
    delay: 200,
  },
];

export default function Testimonials() {
  return (
    <section className="section" id="testimonials">
      <div className="container">
        <div className="section-head" data-reveal="up">
          <div className="section-tag">
            <div className="badge">Early Users</div>
          </div>
          <h2>What beta users are saying.</h2>
          <div className="divider"></div>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((testi) => (
            <div key={testi.name} className="testi-card" data-reveal="up" data-delay={testi.delay.toString()}>
              <div className="testi-stars">{testi.stars}</div>
              <p className="testi-text">{testi.text}</p>
              <div className="testi-author">
                <div className="testi-avatar">{testi.avatar}</div>
                <div>
                  <div className="testi-name">{testi.name}</div>
                  <div className="testi-handle">{testi.handle}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
