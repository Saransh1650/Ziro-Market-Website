import type { ReactNode } from "react";
import Image from "next/image";

/* ─── Card building blocks ─────────────────────────── */

function Kicker({ n, label }: { n: string; label: string }) {
  return (
    <span
      style={{
        display: "block",
        fontFamily: "var(--mono)",
        fontSize: "0.58rem",
        fontWeight: 600,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "var(--text-3)",
        marginBottom: 14,
      }}
    >
      {n} · {label}
    </span>
  );
}

/* Wide bento card (col-span 2): text left, phone right */
function WideCard({
  dark,
  n,
  label,
  headline,
  desc,
  imgSrc,
}: {
  dark?: boolean;
  n: string;
  label: string;
  headline: ReactNode;
  desc: string;
  imgSrc: string;
}) {
  return (
    <div className={`bc bc-wide ${dark ? "bc-dark" : "bc-light"}`}>
      <div className="bc-wide-copy">
        <Kicker n={n} label={label} />
        <p className="bc-headline">{headline}</p>
        <p className="bc-desc">{desc}</p>
      </div>
      <div className="bc-wide-phone">
        <Image
          src={imgSrc}
          alt={label}
          width={1419}
          height={2796}
          style={{
            width: "100%",
            height: "auto",
            objectFit: "contain",
            objectPosition: "center",
            display: "block",
          }}
        />
      </div>
    </div>
  );
}

/* Tall bento card (col-span 1): text top, phone bottom-cropped */
function TallCard({
  dark,
  n,
  label,
  headline,
  desc,
  imgSrc,
}: {
  dark?: boolean;
  n: string;
  label: string;
  headline: ReactNode;
  desc: string;
  imgSrc: string;
}) {
  return (
    <div className={`bc bc-tall ${dark ? "bc-dark" : "bc-light"}`}>
      <div>
        <Kicker n={n} label={label} />
        <p className="bc-headline-sm">{headline}</p>
        <p className="bc-desc">{desc}</p>
      </div>
      <div className="bc-phone-wrap">
        <div className="bc-phone-inner">
          <Image
            src={imgSrc}
            alt={label}
            width={1419}
            height={2796}
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Section ─────────────────────────────────────── */

export default function FeaturesBento() {
  return (
    <section
      id="features"
      className="features-section"
      style={{ background: "#ffffff" }}
    >
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 52 }}>
          <span className="section-num">What's inside</span>
          <h2 style={{ marginTop: 16, maxWidth: 560 }}>
            Seven features. <em style={{ color: "var(--amber)" }}>One app.</em>
          </h2>
          <p
            style={{
              marginTop: 14,
              maxWidth: 480,
              fontSize: "1rem",
              lineHeight: 1.7,
            }}
          >
            Everything you need to stay on top of Indian markets, without
            switching apps.
          </p>
        </div>

        {/* Bento grid */}
        <div className="bento-grid">
          {/* Row 1: Market Map (wide) + News */}
          <WideCard
            dark
            n="01"
            label="Market Map"
            headline={
              <>
                32 sectors.
                <br />
                One look.
              </>
            }
            desc="See all of the Indian market in a single, colour-coded heatmap. Spot momentum in seconds, not minutes."
            imgSrc="/screenshots/1.png"
          />
          <TallCard
            n="02"
            label="Market News"
            headline={
              <>
                News connected
                <br />
                to movement.
              </>
            }
            desc="Headlines linked to the stocks and sectors they actually affect. Not just a feed."
            imgSrc="/screenshots/2.png"
          />

          {/* Row 2: Discover + Watchlist + Portfolio */}
          <TallCard
            dark
            n="03"
            label="Discover"
            headline={
              <>
                Stocks gaining
                <br />
                attention.
              </>
            }
            desc="Top movers, volume surges, 52-week breakouts. Large, Mid, Small Cap. Live."
            imgSrc="/screenshots/3.png"
          />
          <TallCard
            n="04"
            label="Watchlists"
            headline={
              <>
                Your picks,
                <br />
                finally useful.
              </>
            }
            desc="Multiple lists. Live prices. Relative performance vs Nifty, all in one glance."
            imgSrc="/screenshots/4.png"
          />
          <TallCard
            dark
            n="05"
            label="Portfolio"
            headline={
              <>
                Your money.
                <br />
                Tracked properly.
              </>
            }
            desc="Import from broker screenshot. Live P&L, health score, tax harvest, MF overlap. All of it."
            imgSrc="/screenshots/5.png"
          />

          {/* Row 3: Paper Trading (wide) + Commodities */}
          <WideCard
            dark
            n="06"
            label="Paper Trading"
            headline={
              <>
                Practice without
                <br />
                the risk.
              </>
            }
            desc="Real market prices, virtual money. Track positions and P&L just like a real account, without putting capital on the line."
            imgSrc="/screenshots/6.png"
          />
          <TallCard
            n="07"
            label="Commodities"
            headline={
              <>
                Gold, Silver,
                <br />
                Crude. Live.
              </>
            }
            desc="MCX futures alongside your equities. Historical charts. See how commodity swings connect to your sectors."
            imgSrc="/screenshots/7.png"
          />
        </div>
      </div>

      <style>{`
        /* ── Grid ──────────────────────────────── */
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        /* ── Base card ─────────────────────────── */
        .bc {
          border-radius: 20px;
          overflow: hidden;
          position: relative;
        }
        .bc-dark {
          background: #0b3b2e;
          background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 26px 26px;
        }
        .bc-light {
          background: #ffffff;
          border: 1px solid rgba(11,59,46,0.09);
        }

        /* ── Kicker colour via parent ──────────── */
        .bc-dark .section-num,
        .bc-dark span[style] { color: rgba(255,255,255,0.35) !important; }

        /* ── Wide card (2-col) ─────────────────── */
        .bc-wide {
          grid-column: span 2;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 0 56px;
          align-items: center;
          padding: 40px 44px;
          min-height: 400px;
        }
        .bc-wide-copy { display: flex; flex-direction: column; justify-content: center; }
        .bc-wide-phone {
          width: 220px;
          flex-shrink: 0;
          align-self: stretch;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        /* ── Tall card (1-col) ─────────────────── */
        .bc-tall {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          text-align: center;
          padding: 28px 24px 0;
          min-height: 520px;
        }
        .bc-phone-wrap {
          flex-shrink: 0;
          display: flex;
          justify-content: center;
          overflow: hidden;
          height: 340px;
          align-items: flex-start;
          margin-top: 20px;
          padding-top: 32px;
        }
        .bc-phone-inner {
          width: 185px;
          flex-shrink: 0;
        }

        /* ── Typography ────────────────────────── */
        .bc-headline {
          font-family: var(--sans);
          font-weight: 800;
          font-size: clamp(1.7rem, 2.6vw, 2.4rem);
          letter-spacing: -0.03em;
          line-height: 1.05;
          margin: 0 0 14px;
        }
        .bc-headline-sm {
          font-family: var(--sans);
          font-weight: 800;
          font-size: clamp(1.3rem, 1.9vw, 1.75rem);
          letter-spacing: -0.025em;
          line-height: 1.1;
          margin: 0 0 10px;
        }
        .bc-desc {
          font-family: var(--sans);
          font-size: 0.88rem;
          line-height: 1.65;
          margin: 0;
          max-width: 380px;
        }
        .bc-dark .bc-headline,
        .bc-dark .bc-headline-sm { color: #ffffff; }
        .bc-light .bc-headline,
        .bc-light .bc-headline-sm { color: #0b3b2e; }
        .bc-dark .bc-desc { color: rgba(255,255,255,0.48); }
        .bc-light .bc-desc { color: rgba(11,59,46,0.52); }

        /* ── Section padding — responsive ─────── */
        .features-section { padding: 100px 0 120px; }
        @media (max-width: 1024px) { .features-section { padding: 80px 0 96px; } }
        @media (max-width: 700px)  { .features-section { padding: 64px 0 80px; } }
        @media (max-width: 480px)  { .features-section { padding: 52px 0 64px; } }

        /* ── Responsive ────────────────────────── */
        @media (max-width: 1024px) {
          .bento-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .bc-wide { grid-column: span 2; }
          .bc-tall { min-height: 440px; }
          .bc-phone-wrap { height: 300px; }
          .bc-phone-inner { width: 168px; }
        }
        @media (max-width: 700px) {
          .bento-grid { grid-template-columns: 1fr; gap: 8px; }
          .bc-wide {
            grid-column: span 1;
            grid-template-columns: 1fr;
            padding: 28px 24px 28px;
            gap: 0;
            min-height: unset;
          }
          .bc-wide-phone {
            width: 200px;
            height: auto;
            overflow: visible;
            align-self: center;
            margin: 24px auto 0;
          }
          .bc-tall { min-height: 380px; }
          .bc-phone-wrap { height: 240px; }
          .bc-phone-inner { width: 155px; }
        }
        @media (max-width: 480px) {
          .bc-wide-phone { width: 175px; }
          .bc-tall { min-height: 340px; }
          .bc-phone-wrap { height: 210px; }
          .bc-phone-inner { width: 138px; }
        }
      `}</style>
    </section>
  );
}
