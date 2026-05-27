import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

export const runtime = 'nodejs';
export const alt = 'Ziro Market — The Indian market, simplified.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const HEATMAP_COLORS = [
  '#1a6b3c', '#22c55e', '#16a34a', '#ef4444', '#1a6b3c',
  '#22c55e', '#b53030', '#1a6b3c', '#22c55e', '#ef4444',
  '#16a34a', '#1a6b3c', '#ef4444', '#22c55e', '#b53030',
  '#22c55e', '#1a6b3c', '#16a34a', '#ef4444', '#22c55e',
];

export default function Image() {
  const logoData = readFileSync(join(process.cwd(), 'public/app_icon/ziro.png'));
  const logoSrc = `data:image/png;base64,${logoData.toString('base64')}`;

  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%', background: '#0b3b2e' }}>

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, padding: '52px 40px 52px 64px' }}>

          {/* Logo row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src={logoSrc} width={38} height={38} style={{ borderRadius: 8 }} />
            <div style={{ display: 'flex', color: 'rgba(255,255,255,0.6)', fontSize: 17, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase' }}>
              Ziro Market
            </div>
          </div>

          {/* Headline block */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', color: '#e0a84c', fontSize: 15, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase' }}>
              The Indian Market, Simplified
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              <div style={{ display: 'flex', color: '#ffffff', fontSize: 54, fontWeight: 800, lineHeight: 1.1, letterSpacing: -2 }}>
                Track what's moving.
              </div>
              <div style={{ display: 'flex', color: '#ffffff', fontSize: 54, fontWeight: 800, lineHeight: 1.1, letterSpacing: -2 }}>
                Understand why.
              </div>
            </div>
          </div>

          {/* Pills */}
          <div style={{ display: 'flex', gap: 10 }}>
            {['NSE · BSE · MCX', '32 SECTORS', '5,000+ STOCKS'].map((label) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.16)',
                  borderRadius: 6,
                  padding: '8px 18px',
                  color: 'rgba(255,255,255,0.65)',
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: 1,
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Right: heatmap grid */}
        <div style={{ display: 'flex', flexWrap: 'wrap', width: 268, alignContent: 'center', padding: '52px 60px 52px 0', gap: 8, opacity: 0.78 }}>
          {HEATMAP_COLORS.map((color, i) => (
            <div key={i} style={{ display: 'flex', width: 44, height: 44, background: color, borderRadius: 8 }} />
          ))}
        </div>

      </div>
    ),
    { ...size },
  );
}
