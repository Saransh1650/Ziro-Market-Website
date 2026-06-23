import type { LangConfig } from '@/lib/regional'

// Localized version of components/blog/DownloadCTA. Same dark band, same layout,
// but every word comes from the language's ui dictionary so it reads natively.
export default function RegionalDownloadCTA({ ui }: { ui: LangConfig['ui'] }) {
  return (
    <section className="section section-dark" style={{ padding: '56px 0' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <span className="section-num">{ui.ctaKicker}</span>
        <h2 style={{ marginTop: 18 }}>
          <span className="amber">Ziro Market</span>
        </h2>
        <h2 style={{ marginTop: 6, fontSize: '1.4rem' }}>{ui.ctaTitle}</h2>
        <p style={{ marginTop: 12, maxWidth: 480, margin: '12px auto 0' }}>{ui.ctaBody}</p>
        <div style={{ marginTop: 32, display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="https://play.google.com/store/apps/details?id=com.ziro.market"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-lg"
          >
            {ui.ctaButtonAndroid} →
          </a>
          <a
            href="https://apps.apple.com/in/app/ziromarket"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-lg"
          >
            {ui.ctaButtonIos} →
          </a>
        </div>
      </div>
    </section>
  )
}
