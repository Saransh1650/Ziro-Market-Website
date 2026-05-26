const TRUTHS = [
  {
    num: '01',
    line: 'Your broker shows prices. Not what drove them.',
  },
  {
    num: '02',
    line: 'News breaks. You check four apps to know if it matters to you.',
  },
  {
    num: '03',
    line: "Staying informed has become a second job — one you didn't apply for.",
  },
];

export default function PainSection() {
  return (
    <section id="pain" className="section section-dark pain-section">
      <div className="container">
        <span className="section-num" style={{ opacity: 0.5 }}>04 / The Problem</span>

        {/* Editorial statement — this IS the pain */}
        <div className="pain-statement">
          <p className="pain-big">
            You have five apps open.
          </p>
          <p className="pain-big pain-big--light">
            None of them answer
            <br />the same question.
          </p>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.08)', margin: '56px 0 0' }} />

        {/* Three sharp truths */}
        <div className="pain-truths">
          {TRUTHS.map((t) => (
            <div key={t.num} className="pain-truth-row">
              <span className="pain-truth-num">{t.num}</span>
              <p className="pain-truth-line">{t.line}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .pain-section { padding: 120px 0 100px; }

        .pain-statement { margin-top: 40px; }
        .pain-big {
          font-family: var(--sans);
          font-weight: 800;
          font-size: clamp(2.6rem, 6vw, 5.2rem);
          letter-spacing: -0.03em;
          line-height: 1.0;
          color: #ffffff;
          margin: 0 0 4px;
        }
        .pain-big--light {
          font-weight: 200;
          color: rgba(255,255,255,0.45);
        }

        .pain-truths {
          display: flex;
          flex-direction: column;
        }
        .pain-truth-row {
          display: grid;
          grid-template-columns: 60px 1fr;
          align-items: baseline;
          gap: 0 28px;
          padding: 30px 0;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .pain-truth-row:last-child { border-bottom: none; }
        .pain-truth-num {
          font-family: var(--mono);
          font-size: 0.58rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          color: rgba(255,255,255,0.18);
          padding-top: 2px;
        }
        .pain-truth-line {
          font-family: var(--sans);
          font-size: clamp(1.15rem, 2.2vw, 1.55rem);
          font-weight: 600;
          letter-spacing: -0.015em;
          line-height: 1.35;
          color: rgba(255,255,255,0.72);
          margin: 0;
        }

        @media (max-width: 600px) {
          .pain-section { padding: 80px 0 72px; }
          .pain-truth-row { grid-template-columns: 1fr; gap: 6px; padding: 24px 0; }
          .pain-truth-num { padding-top: 0; }
        }
      `}</style>
    </section>
  );
}
