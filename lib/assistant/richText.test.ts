import { describe, expect, it } from 'vitest';
import { tokenize } from './richText';

describe('tokenize', () => {
  it('parses bold and stock links inside prose', () => {
    expect(tokenize('The PE is **22.1×**, and [Reliance](stock:RELIANCE) looks fair.')).toEqual([
      { kind: 'text', text: 'The PE is ' },
      { kind: 'bold', text: '22.1×' },
      { kind: 'text', text: ', and ' },
      { kind: 'stock', label: 'Reliance', symbol: 'RELIANCE' },
      { kind: 'text', text: ' looks fair.' },
    ]);
  });

  it('accepts symbols with & . -', () => {
    expect(tokenize('[M&M](stock:M&M) and [BAJAJ-AUTO](stock:BAJAJ-AUTO)')).toEqual([
      { kind: 'stock', label: 'M&M', symbol: 'M&M' },
      { kind: 'text', text: ' and ' },
      { kind: 'stock', label: 'BAJAJ-AUTO', symbol: 'BAJAJ-AUTO' },
    ]);
  });

  it('turns https links and bare urls into links, stripping trailing punctuation', () => {
    expect(tokenize('See [the filing](https://example.com/a) or https://example.com/b.')).toEqual([
      { kind: 'text', text: 'See ' },
      { kind: 'link', label: 'the filing', url: 'https://example.com/a' },
      { kind: 'text', text: ' or ' },
      { kind: 'link', label: 'https://example.com/b', url: 'https://example.com/b' },
      { kind: 'text', text: '.' },
    ]);
  });

  it('never links javascript:, data: or http: schemes', () => {
    for (const bad of ['[x](javascript:alert(1))', '[x](data:text/html,hi)', '[x](http://example.com)', '[x](stock:reliance)']) {
      const tokens = tokenize(bad);
      expect(tokens.every((t) => t.kind === 'text'), bad).toBe(true);
    }
  });

  it('leaves an unclosed ** as plain text while a stream is still arriving', () => {
    expect(tokenize('The stock looks **cheap')).toEqual([{ kind: 'text', text: 'The stock looks **cheap' }]);
    expect(tokenize('half [Rel')).toEqual([{ kind: 'text', text: 'half [Rel' }]);
  });

  it('handles empty input and plain text', () => {
    expect(tokenize('')).toEqual([]);
    expect(tokenize('just words')).toEqual([{ kind: 'text', text: 'just words' }]);
  });

  it('keeps Devanagari intact', () => {
    expect(tokenize('**रिलायंस** मज़बूत है')).toEqual([
      { kind: 'bold', text: 'रिलायंस' },
      { kind: 'text', text: ' मज़बूत है' },
    ]);
  });
});
