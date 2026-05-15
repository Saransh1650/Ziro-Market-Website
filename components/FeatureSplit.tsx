interface FeatureSplitProps {
  num: string;
  tag: string;
  headline: string;
  body: string;
  screenshot: string;
  screenshotAlt: string;
  reverse?: boolean;
}

export default function FeatureSplit({
  num,
  tag,
  headline,
  body,
  screenshot,
  screenshotAlt,
  reverse = false,
}: FeatureSplitProps) {
  return (
    <section
      style={{
        background: 'var(--bg)',
        borderTop: '1px solid var(--border)',
        padding: 'clamp(80px, 12vh, 140px) clamp(24px, 5vw, 80px)',
      }}
    >
      <div
        className="feature-split-inner"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: reverse ? 'row-reverse' : 'row',
          alignItems: 'center',
          gap: 'clamp(48px, 6vw, 120px)',
        }}
      >
        {/* Text side */}
        <div
          style={{ flex: '0 0 45%' }}
          data-reveal={reverse ? 'right' : 'left'}
        >
          <p
            style={{
              fontFamily: 'var(--mono)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: 'var(--text-4)',
              textTransform: 'uppercase',
              marginBottom: '24px',
            }}
          >
            {num} / {tag}
          </p>
          <h2
            style={{
              fontSize: 'clamp(32px, 4vw, 56px)',
              fontWeight: 800,
              color: 'var(--text-1)',
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              marginBottom: '20px',
              whiteSpace: 'pre-line',
            }}
          >
            {headline}
          </h2>
          <p
            style={{
              fontSize: 'clamp(15px, 1.3vw, 17px)',
              color: 'var(--text-2)',
              lineHeight: 1.7,
              maxWidth: '400px',
            }}
          >
            {body}
          </p>
        </div>

        {/* Screenshot side */}
        <div
          style={{ flex: '0 0 50%', display: 'flex', justifyContent: 'center' }}
          data-reveal={reverse ? 'left' : 'right'}
          data-delay="150"
        >
          <img
            src={screenshot}
            alt={screenshotAlt}
            style={{
              width: '100%',
              maxWidth: '300px',
              borderRadius: '20px',
              transform: reverse ? 'rotate(-2.5deg)' : 'rotate(2.5deg)',
              boxShadow: '0 40px 80px rgba(0,0,0,0.7)',
              display: 'block',
            }}
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
}
