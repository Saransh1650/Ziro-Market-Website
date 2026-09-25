/** Shared invitation for the surfaces that need an account. */
export default function SignedOut({ title, detail, next }: { title: string; detail: string; next: string }) {
  return (
    <div
      style={{
        display: 'grid', placeContent: 'center', justifyItems: 'center',
        gap: 'var(--s-3)', minHeight: '60dvh', textAlign: 'center', padding: 'var(--s-5)',
      }}
    >
      {/* The page heading, not just styled text: these surfaces render
          this instead of their own content when signed out, so without
          it the page has no h1 at all. */}
      <h1 className="zw-section">{title}</h1>
      <p className="zw-sub" style={{ maxWidth: '44ch' }}>{detail}</p>
      <a className="zw-chip" href={`/app/login?next=${encodeURIComponent(next)}`}>Sign in</a>
    </div>
  );
}
