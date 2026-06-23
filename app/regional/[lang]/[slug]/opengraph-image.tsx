import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'
import { LANGUAGES, getRegionalPost } from '@/lib/regional'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Ziro Market'

const PALETTE = ['#1a6b3c', '#22c55e', '#16a34a', '#ef4444', '#b53030', '#e0a84c']

function hash(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// The headline is rendered from the post's Latin `ogTitle`, not the native-script
// title, so the default OG font has every glyph (no tofu boxes). The native page
// content still lives in the HTML for users and search engines.
export default async function Image({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  const cfg = LANGUAGES[lang]
  const post = cfg ? getRegionalPost(lang, slug) : null

  const logoData = readFileSync(join(process.cwd(), 'public/app_icon/ziro.png'))
  const logoSrc = `data:image/png;base64,${logoData.toString('base64')}`

  const rawTitle = post?.ogTitle ?? 'Markets, explained in your language.'
  const title = rawTitle.length > 130 ? `${rawTitle.slice(0, 127)}…` : rawTitle
  const len = title.length
  const fontSize = len > 110 ? 38 : len > 85 ? 44 : len > 55 ? 52 : 60
  const langLabel = cfg ? cfg.englishName.toUpperCase() : 'REGIONAL'

  const rand = mulberry32(hash(`${lang}-${slug}` || 'ziro'))
  const cells = Array.from({ length: 20 }, () => PALETTE[Math.floor(rand() * PALETTE.length)])

  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%', background: '#0b3b2e' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, padding: '52px 40px 52px 64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src={logoSrc} width={38} height={38} style={{ borderRadius: 8 }} />
            <div style={{ display: 'flex', color: 'rgba(255,255,255,0.6)', fontSize: 17, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase' }}>
              Ziro Market
            </div>
            <div style={{ display: 'flex', marginLeft: 4, paddingLeft: 14, borderLeft: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.42)', fontSize: 15, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase' }}>
              {langLabel}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', color: '#e0a84c', fontSize: 15, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase' }}>
              {langLabel} Guide
            </div>
            <div style={{ display: 'flex', color: '#ffffff', fontSize, fontWeight: 800, lineHeight: 1.12, letterSpacing: -1.5 }}>
              {title}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', width: 8, height: 8, borderRadius: 8, background: '#e0a84c' }} />
            <div style={{ display: 'flex', color: 'rgba(255,255,255,0.55)', fontSize: 16, fontWeight: 600, letterSpacing: 1 }}>
              ziromarket.com
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', width: 268, alignContent: 'center', padding: '52px 60px 52px 0', gap: 8, opacity: 0.72 }}>
          {cells.map((color, i) => (
            <div key={i} style={{ display: 'flex', width: 44, height: 44, background: color, borderRadius: 8 }} />
          ))}
        </div>
      </div>
    ),
    { ...size },
  )
}
