export default function DownloadCTA() {
  return (
    <section className="section section-dark" style={{ padding: '56px 0' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <span className="section-num">Get the app</span>
        <h2 style={{ marginTop: 18 }}>
          Track it all in <span className="amber">Ziro Market</span>.
        </h2>
        <p style={{ marginTop: 12, maxWidth: 480, margin: '12px auto 0' }}>
          Free. iOS and Android. Built for Indian markets.
        </p>
        <div style={{ marginTop: 32, display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="https://apps.apple.com/in/app/ziromarket"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-lg"
            aria-label="Download Ziro Market on the App Store"
          >
            App Store →
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.ziro.market"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-lg"
            aria-label="Download Ziro Market on Google Play"
          >
            Play Store →
          </a>
        </div>
      </div>
    </section>
  );
}
