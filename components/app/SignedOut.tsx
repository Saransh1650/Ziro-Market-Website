/** Shared invitation for the surfaces that need an account. */
export default function SignedOut({ title, detail, next }: { title: string; detail: string; next: string }) {
  return (
    <div className="zw-empty">
      <span className="badge" aria-hidden="true">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="10" width="16" height="10" rx="2.5" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
      </span>
      {/* The page heading, not just styled text: these surfaces render
          this instead of their own content when signed out, so without
          it the page has no h1 at all. */}
      <h1 className="zw-section">{title}</h1>
      <p className="zw-sub" style={{ maxWidth: '44ch' }}>{detail}</p>
      <a className="zw-btn" href={`/app/login?next=${encodeURIComponent(next)}`}>Sign in to continue</a>
    </div>
  );
}
