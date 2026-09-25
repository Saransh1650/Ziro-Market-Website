import type { Turn } from '@/lib/assistant/types';

function host(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/** Web sources the answer drew on. Only https links get here (see `parseReferences`). */
export function References({ items }: { items: Turn['references'] }) {
  if (items.length === 0) return null;
  return (
    <nav className="zw-ab-refs" aria-label="Sources">
      {items.slice(0, 6).map((r, i) => (
        <a key={i} href={r.url} target="_blank" rel="noopener noreferrer nofollow" title={r.title || r.url}>
          {r.title || host(r.url)}
          <span style={{ marginLeft: 6, color: 'var(--ab-ink-3)' }}>{host(r.url)}</span>
        </a>
      ))}
    </nav>
  );
}
