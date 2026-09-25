// Google truncates snippets around 155-160 characters. Long excerpts are cut at
// the last sentence end that fits, else the last word, so the snippet never
// stops mid-word.
const MAX = 158

export function metaDescription(text: string, max = MAX): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const window = clean.slice(0, max)
  const sentenceEnd = Math.max(window.lastIndexOf('. '), window.lastIndexOf('? '), window.lastIndexOf('! '))
  if (sentenceEnd >= 100) return window.slice(0, sentenceEnd + 1)
  const wordEnd = window.lastIndexOf(' ')
  return `${window.slice(0, wordEnd).replace(/[,;:\-–—]$/, '')}…`
}
