const screenshots = [
  { src: '/screenshots/sc-1.png', alt: 'Market heatmap',    rotate: -3   },
  { src: '/screenshots/sc-2.png', alt: 'Discovery sectors', rotate: 2    },
  { src: '/screenshots/sc-3.png', alt: 'Watchlist',         rotate: -1.5 },
  { src: '/screenshots/sc-1.png', alt: 'Sector view',       rotate: 3    },
  { src: '/screenshots/sc-2.png', alt: 'Stock detail',      rotate: -2   },
  { src: '/screenshots/sc-3.png', alt: 'Portfolio',         rotate: 1.5  },
];

export default function ScreenshotMosaic() {
  return (
    <section
      style={{
        background: 'var(--bg)',
        borderTop: '1px solid var(--border)',
        overflow: 'hidden',
        padding: 'clamp(60px, 8vh, 100px) 0',
      }}
    >
      <div
        className="no-scrollbar"
        style={{
          display: 'flex',
          gap: '28px',
          padding: '40px clamp(24px, 5vw, 80px)',
          overflowX: 'auto',
          alignItems: 'center',
        }}
      >
        {screenshots.map((s, idx) => (
          <div
            key={idx}
            data-reveal="up"
            data-delay={String(idx * 100)}
            style={{
              flexShrink: 0,
              width: 'clamp(160px, 22vw, 260px)',
              borderRadius: '20px',
              overflow: 'hidden',
              transform: `rotate(${s.rotate}deg)`,
              boxShadow: '0 30px 60px rgba(0,0,0,0.65)',
            }}
          >
            <img
              src={s.src}
              alt={s.alt}
              style={{ width: '100%', display: 'block' }}
              draggable={false}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
