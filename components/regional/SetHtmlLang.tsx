'use client'

import { useEffect } from 'react'

// The root layout's <html lang="en"> is fixed at build time (Next's App
// Router only lets the root layout render <html>, and making it read the
// request path would force every page on the site into dynamic rendering).
// This patches the served attribute for the regional locale once the page
// mounts, so real users, screen readers, and JS-executing crawlers see the
// correct language instead of a hardcoded "en" on Hindi content.
export default function SetHtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    const html = document.documentElement
    const previous = html.lang
    html.lang = lang
    return () => {
      html.lang = previous
    }
  }, [lang])

  return null
}
