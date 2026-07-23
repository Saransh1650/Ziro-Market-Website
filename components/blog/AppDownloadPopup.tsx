'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.ziro.market'
const APP_STORE_URL = 'https://apps.apple.com/in/app/ziro-market-stock-trends/id6761326539'

function AppleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3.18 23.59c.28.15.57.22.87.22.37 0 .74-.11 1.07-.32l16.59-9.59c.64-.37 1.04-1.05 1.04-1.79 0-.74-.4-1.42-1.04-1.79L5.12.73C4.49.36 3.72.33 3.06.65 2.41.97 2 1.64 2 2.38v19.24c0 .75.41 1.41 1.06 1.73.04.02.08.03.12.24z" />
    </svg>
  )
}

// A gentle, non-intrusive app-download ad for regional-language pages, aimed at
// readers who may be rural or not comfortable in English. It is NOT a modal that
// blocks the page: it slides up from the bottom as a small card, shows once,
// stays dismissible, and remembers the dismissal so it never nags.
//
// Trigger: whichever comes first — the reader has spent ~7s on the page, OR has
// scrolled past ~35% of it. That way an engaged reader sees it, a bouncing one
// is left alone. All copy is passed in already translated (see lib/regional ui).
export default function AppDownloadPopup({
  title,
  body,
  cta,
  dismiss,
  storageKey = 'ziro_regional_app_popup',
}: {
  title: string
  body: string
  cta: string
  dismiss: string
  storageKey?: string
}) {
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    // Respect a previous dismissal for 14 days so it never feels naggy.
    try {
      const until = Number(localStorage.getItem(storageKey) || 0)
      if (until && Date.now() < until) return
    } catch {
      // localStorage can throw in private mode; just show the popup.
    }

    let shown = false
    const reveal = () => {
      if (shown) return
      shown = true
      setOpen(true)
      cleanup()
    }
    const onScroll = () => {
      const scrolled = window.scrollY + window.innerHeight
      const total = document.documentElement.scrollHeight
      if (total > 0 && scrolled / total > 0.35) reveal()
    }
    const timer = window.setTimeout(reveal, 7000)
    window.addEventListener('scroll', onScroll, { passive: true })

    function cleanup() {
      window.clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
    }
    return cleanup
  }, [storageKey])

  const close = () => {
    setClosing(true)
    try {
      // Snooze for 14 days.
      localStorage.setItem(storageKey, String(Date.now() + 14 * 24 * 60 * 60 * 1000))
    } catch {
      // ignore
    }
    window.setTimeout(() => {
      setOpen(false)
      setClosing(false)
    }, 220)
  }

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-label={title}
      className={`regional-popup ${closing ? 'regional-popup-closing' : ''}`}
    >
      <div className="regional-popup-card">
        <button
          type="button"
          onClick={close}
          aria-label={dismiss}
          className="regional-popup-x"
        >
          ×
        </button>
        <div className="regional-popup-row">
          <Image
            src="/app_icon/ziro.png"
            alt="Ziro Market"
            width={48}
            height={48}
            className="regional-popup-icon"
          />
          <div className="regional-popup-text">
            <div className="regional-popup-title">{title}</div>
            <div className="regional-popup-body">{body}</div>
          </div>
        </div>
        <div className="regional-popup-actions">
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${cta} — Android`}
            className="regional-popup-cta"
          >
            <PlayIcon />
            Android
          </a>
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${cta} — iOS`}
            className="regional-popup-cta regional-popup-cta-ios"
          >
            <AppleIcon />
            iOS
          </a>
        </div>
      </div>

      <style>{`
        .regional-popup {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 600;
          display: flex;
          justify-content: center;
          padding: 0 14px calc(14px + env(safe-area-inset-bottom));
          pointer-events: none;
          animation: regional-popup-in 0.32s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .regional-popup-closing { animation: regional-popup-out 0.22s ease forwards; }
        .regional-popup-card {
          pointer-events: auto;
          position: relative;
          width: 100%;
          max-width: 440px;
          background: #ffffff;
          border: 1px solid rgba(11,59,46,0.14);
          border-radius: 16px;
          box-shadow: 0 12px 40px rgba(11,59,46,0.20);
          padding: 18px 18px 16px;
        }
        .regional-popup-x {
          position: absolute;
          top: 8px;
          right: 10px;
          width: 30px;
          height: 30px;
          border: none;
          background: transparent;
          color: rgba(11,59,46,0.45);
          font-size: 1.5rem;
          line-height: 1;
          cursor: pointer;
          border-radius: 8px;
        }
        .regional-popup-x:hover { background: rgba(11,59,46,0.06); color: #0b3b2e; }
        .regional-popup-row { display: flex; align-items: center; gap: 14px; padding-right: 24px; }
        .regional-popup-icon { border-radius: 12px; flex-shrink: 0; display: block; }
        .regional-popup-title { font-size: 1rem; font-weight: 700; color: #0b3b2e; line-height: 1.3; }
        .regional-popup-body { font-size: 0.86rem; color: rgba(11,59,46,0.66); line-height: 1.5; margin-top: 4px; }
        .regional-popup-actions { display: flex; align-items: center; gap: 10px; margin-top: 18px; }
        .regional-popup-cta {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #0b3b2e;
          color: #fff;
          font-weight: 700;
          font-size: 0.95rem;
          padding: 13px 16px;
          border-radius: 10px;
          text-decoration: none;
          border: 1px solid #0b3b2e;
          transition: background 0.15s, border-color 0.15s;
        }
        .regional-popup-cta:hover { background: #0a4d39; border-color: #0a4d39; }
        .regional-popup-cta-ios {
          background: transparent;
          border-color: rgba(11,59,46,0.22);
          color: #0b3b2e;
        }
        .regional-popup-cta-ios:hover { background: rgba(11,59,46,0.05); border-color: rgba(11,59,46,0.32); }
        @keyframes regional-popup-in {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes regional-popup-out {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(24px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .regional-popup, .regional-popup-closing { animation: none; }
        }
      `}</style>
    </div>
  )
}
