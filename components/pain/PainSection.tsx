/* The five-tab problem, shown rather than described.
   CSS-only tab switching (radio + sibling selectors) keeps this a server
   component — no JS ships for it. */

const SOURCES = [
  {
    id: 'broker',
    tab: 'Broker app',
    shows: '−0.8%. Nifty at 22,847.',
    gap: 'Which sector dragged it down, or whether you hold any of it.',
  },
  {
    id: 'news',
    tab: 'News feed',
    shows: '“IT stocks slip on weak guidance.”',
    gap: 'Whether IT is 4% of your portfolio or 40%.',
  },
  {
    id: 'screener',
    tab: 'Screener',
    shows: 'P/E 24.6 · ROE 18.2% · D/E 0.31',
    gap: 'Anything at all about today.',
  },
  {
    id: 'charts',
    tab: 'Charting site',
    shows: 'RSI 41. 50-DMA broken.',
    gap: 'What happened to put the price there.',
  },
  {
    id: 'chat',
    tab: 'Group chat',
    shows: 'Six opinions. Three tips. One blurry screenshot.',
    gap: 'Where a single one of them came from.',
  },
];

/* Per-index rules for the radio → tab/panel wiring. */
const tabRules = SOURCES.map(
  (_, i) => `
        .pain-radio:nth-of-type(${i + 1}):checked ~ .pain-tabbar .pain-tab:nth-child(${i + 1}) {
          color: #ffffff;
          box-shadow: inset 0 -2px 0 var(--amber);
        }
        .pain-radio:nth-of-type(${i + 1}):checked ~ .pain-panels .pain-panel:nth-child(${i + 1}) {
          opacity: 1;
          visibility: visible;
        }
        .pain-radio:nth-of-type(${i + 1}):focus-visible ~ .pain-tabbar .pain-tab:nth-child(${i + 1}) {
          outline: 2px solid var(--amber);
          outline-offset: -2px;
        }`,
).join('');

export default function PainSection() {
  return (
    <section id="pain" className="section-dark pain-section">
      <div className="container pain-grid">
        {/* ── Left: the setup ── */}
        <div className="pain-copy">
          <span className="section-num">The problem</span>

          <h2 className="pain-head">
            Nifty drops 0.8%.<br />
            Now go find out why.
          </h2>

          <p className="pain-lede">
            Nobody has one app for this. You have five, and each one answers a
            different piece of the question.
          </p>
        </div>

        {/* ── Right: the five tabs ── */}
        <div className="pain-tabs" role="group" aria-label="What each app tells you">
          {SOURCES.map((s, i) => (
            <input
              key={s.id}
              className="pain-radio"
              type="radio"
              name="pain-source"
              id={`pain-${s.id}`}
              defaultChecked={i === 0}
            />
          ))}

          <div className="pain-tabbar">
            {SOURCES.map((s) => (
              <label key={s.id} className="pain-tab" htmlFor={`pain-${s.id}`}>
                {s.tab}
              </label>
            ))}
          </div>

          <div className="pain-panels">
            {SOURCES.map((s) => (
              <div key={s.id} className="pain-panel">
                <div className="pain-field">
                  <span className="pain-field-label">It tells you</span>
                  <p className="pain-shows">{s.shows}</p>
                </div>
                <div className="pain-field pain-field--gap">
                  <span className="pain-field-label">It doesn&apos;t tell you</span>
                  <p className="pain-gap">{s.gap}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="pain-punch">
          By the time you&apos;ve checked all five, the market has closed.
        </p>
      </div>

      <style>{`
        .pain-section { padding: 112px 0 72px; }

        .pain-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.88fr) minmax(0, 1.12fr);
          grid-template-areas:
            "copy tabs"
            "punch tabs";
          grid-template-rows: auto 1fr;
          column-gap: 72px;
        }
        .pain-copy { grid-area: copy; }
        .pain-tabs { grid-area: tabs; align-self: center; }
        .pain-punch { grid-area: punch; }

        .pain-head {
          margin-top: 18px;
          color: #ffffff;
          font-size: clamp(2rem, 3.4vw, 3rem);
          font-weight: 700;
          letter-spacing: -0.025em;
          line-height: 1.1;
        }
        .pain-lede {
          margin-top: 20px;
          max-width: 40ch;
          font-size: 1rem;
          line-height: 1.7;
          color: rgba(239, 233, 221, 0.66);
        }
        .pain-punch {
          margin-top: 28px;
          padding-top: 20px;
          border-top: 1px solid rgba(239, 233, 221, 0.12);
          max-width: 34ch;
          font-family: var(--mono);
          font-size: 0.78rem;
          line-height: 1.7;
          letter-spacing: 0.01em;
          color: var(--amber);
        }

        /* ── Tab widget ── */
        .pain-tabs {
          position: relative;
          margin-top: 4px;
          border: 1px solid rgba(239, 233, 221, 0.12);
          border-radius: 10px;
          background: rgba(239, 233, 221, 0.035);
          overflow: hidden;
        }
        .pain-radio {
          position: absolute;
          width: 1px;
          height: 1px;
          opacity: 0;
        }
        .pain-tabbar {
          display: flex;
          overflow-x: auto;
          border-bottom: 1px solid rgba(239, 233, 221, 0.12);
          background: rgba(0, 0, 0, 0.12);
          scrollbar-width: none;
        }
        .pain-tabbar::-webkit-scrollbar { display: none; }
        .pain-tab {
          flex: 1 0 auto;
          padding: 15px 18px;
          font-family: var(--mono);
          font-size: 0.66rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          white-space: nowrap;
          text-align: center;
          color: rgba(239, 233, 221, 0.40);
          cursor: pointer;
          transition: color 0.18s var(--ease-out), box-shadow 0.18s var(--ease-out);
          border-right: 1px solid rgba(239, 233, 221, 0.08);
        }
        .pain-tab:last-child { border-right: none; }
        .pain-tab:hover { color: rgba(239, 233, 221, 0.78); }

        /* Panels stack in one grid cell so the box height never jumps */
        .pain-panels { display: grid; padding: 34px 32px 32px; }
        .pain-panel {
          grid-area: 1 / 1;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.22s var(--ease-out);
        }
        .pain-field + .pain-field { margin-top: 26px; }
        .pain-field-label {
          display: block;
          font-family: var(--mono);
          font-size: 0.56rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(239, 233, 221, 0.32);
        }
        .pain-shows {
          margin-top: 10px;
          font-size: clamp(1.35rem, 2.2vw, 1.85rem);
          font-weight: 600;
          letter-spacing: -0.02em;
          line-height: 1.25;
          color: #ffffff;
        }
        .pain-field--gap { padding-top: 24px; border-top: 1px solid rgba(239, 233, 221, 0.1); }
        .pain-gap {
          margin-top: 10px;
          font-size: clamp(1.05rem, 1.5vw, 1.25rem);
          font-weight: 400;
          line-height: 1.45;
          color: rgba(239, 233, 221, 0.52);
        }
${tabRules}

        @media (max-width: 980px) {
          .pain-grid {
            grid-template-columns: 1fr;
            grid-template-rows: auto;
            grid-template-areas: "copy" "tabs" "punch";
          }
          .pain-copy { margin-bottom: 38px; }
          .pain-tabs { margin-bottom: 32px; }
          .pain-punch { max-width: none; margin-top: 0; }
        }
        @media (max-width: 600px) {
          .pain-section { padding: 76px 0 72px; }
          .pain-tab { flex: 0 0 auto; padding: 14px 16px; }
          /* strip scrolls sideways — fade the trailing edge so that reads */
          .pain-tabbar {
            -webkit-mask-image: linear-gradient(90deg, #000 70%, rgba(0, 0, 0, 0.12));
            mask-image: linear-gradient(90deg, #000 70%, rgba(0, 0, 0, 0.12));
          }
          .pain-panels { padding: 26px 22px 24px; }
          .pain-field + .pain-field { margin-top: 22px; }
        }
      `}</style>
    </section>
  );
}
