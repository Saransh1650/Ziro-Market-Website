export default function LaunchCTA() {
  return (
    <div id="download" style={{ textAlign: 'center' }}>
      <span className="section-num">№ 14 / DOWNLOAD</span>
      <h2 style={{ marginTop: 18 }}>
        Get <span className="amber">Ziro Market</span>.
      </h2>
      <p style={{ marginTop: 12, maxWidth: 480, margin: '12px auto 0' }}>
        Free. iOS and Android. Built for Indian markets.
      </p>
      <div style={{ marginTop: 32, display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href="https://apps.apple.com/in/app/ziromarket" className="btn btn-amber btn-lg">App Store →</a>
        <a href="https://play.google.com/store/apps/details?id=com.ziromarket" className="btn btn-ghost btn-lg">Play Store →</a>
      </div>
      <p className="caption" style={{ marginTop: 24 }}>Already have it? <a href="#" style={{ color: 'var(--text-1)', textDecoration: 'underline' }}>Sign in</a></p>
    </div>
  );
}
