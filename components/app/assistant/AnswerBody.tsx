import Link from 'next/link';
import { tokenize } from '@/lib/assistant/richText';

/**
 * Answer text → React nodes. The tokenizer only ever yields `stock:` and
 * `https:` links, so no server string can become a `javascript:` URL, and
 * nothing is injected as HTML.
 */
export function AnswerBody({ text }: { text: string }) {
  return (
    <>
      {tokenize(text).map((t, i) => {
        switch (t.kind) {
          case 'bold':
            return <strong key={i}>{t.text}</strong>;
          case 'stock':
            return (
              <Link key={i} href={`/stocks/${encodeURIComponent(t.symbol)}`} prefetch={false}>
                {t.label}
              </Link>
            );
          case 'link':
            return (
              <a key={i} href={t.url} target="_blank" rel="noopener noreferrer nofollow">
                {t.label}
              </a>
            );
          default:
            return <span key={i}>{t.text}</span>;
        }
      })}
    </>
  );
}
