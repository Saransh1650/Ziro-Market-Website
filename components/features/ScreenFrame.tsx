import type { ReactNode } from 'react';

type Tab = 'home' | 'watchlist' | 'market' | 'portfolio' | 'more';

const TABS: { id: Tab; label: string; icon: ReactNode }[] = [
  {
    id: 'home', label: 'Home',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: 'watchlist', label: 'Watch',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
  },
  {
    id: 'market', label: 'Market',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    id: 'portfolio', label: 'Folio',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    id: 'more', label: 'More',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="19" r="1" fill="currentColor" />
      </svg>
    ),
  },
];

export default function ScreenFrame({ children, activeTab }: { children: ReactNode; activeTab: Tab }) {
  return (
    <div style={{ position: 'relative', display: 'inline-block', width: '100%', maxWidth: 300 }}>
      {/* Ambient glow */}
      <div aria-hidden style={{
        position: 'absolute', inset: '-30px -20px',
        background: 'radial-gradient(ellipse at 50% 55%, rgba(245,158,11,0.07) 0%, transparent 65%)',
        pointerEvents: 'none', borderRadius: 60,
      }} />

      {/* Phone shell */}
      <div style={{
        width: '100%', aspectRatio: '9/19',
        background: '#0C0C0C',
        border: '1.5px solid #252525',
        borderRadius: 40,
        padding: '12px 9px 9px',
        position: 'relative',
        boxShadow: '0 48px 96px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Dynamic island */}
        <div style={{
          width: 84, height: 24,
          background: '#000', borderRadius: 14,
          margin: '0 auto 8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          flexShrink: 0,
        }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#1C1C1C' }} />
          <div style={{ width: 18, height: 7, borderRadius: 4, background: '#1C1C1C' }} />
        </div>

        {/* Screen area */}
        <div style={{
          flex: 1,
          background: '#070707',
          borderRadius: 28,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Status bar */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '8px 12px 4px', flexShrink: 0,
          }}>
            <span style={{ fontSize: '0.55rem', fontFamily: 'var(--mono)', color: '#505050', fontWeight: 600 }}>9:41</span>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              {[3, 4, 5, 7].map(h => (
                <div key={h} style={{ width: 2.5, height: h, background: '#505050', borderRadius: 1 }} />
              ))}
              <div style={{ width: 12, height: 6, border: '1px solid #505050', borderRadius: 2, marginLeft: 2, position: 'relative' }}>
                <div style={{ position: 'absolute', left: 1, top: 1, bottom: 1, width: '70%', background: '#22C55E', borderRadius: 1 }} />
              </div>
            </div>
          </div>

          {/* Content slot */}
          <div style={{ flex: 1, overflow: 'hidden', padding: '0 10px' }}>
            {children}
          </div>

          {/* Tab bar */}
          <div style={{
            display: 'flex', borderTop: '1px solid #141414',
            background: '#080808', flexShrink: 0,
          }}>
            {TABS.map((t) => {
              const active = t.id === activeTab;
              return (
                <div key={t.id} style={{
                  flex: 1, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  padding: '7px 0 10px',
                  color: active ? 'var(--amber)' : '#3A3A3A',
                  gap: 2,
                }}>
                  <div style={{ transform: 'scale(0.65)', transformOrigin: 'center center', height: 20, width: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{t.icon}</div>
                  <span style={{ fontSize: '0.38rem', fontFamily: 'var(--mono)', letterSpacing: '0.04em', fontWeight: active ? 700 : 500 }}>{t.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Home indicator */}
        <div style={{ width: 80, height: 3, background: '#2A2A2A', borderRadius: 2, margin: '6px auto 0' }} />
      </div>
    </div>
  );
}
