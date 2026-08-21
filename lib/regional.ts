import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Category, PostType, FaqItem } from './blog'

// Regional-language blog posts live in content/regional/<lang>/<slug>.mdx.
// They mirror the English posts in content/blog but are written natively in the
// target language (never machine-translated). They are intentionally kept OUT of
// the main /blog listing and /blog sitemap, and have their own route + sitemap.

const REGIONAL_DIR = path.join(process.cwd(), 'content', 'regional')

export interface RegionalPostMeta {
  title: string
  seoTitle?: string
  slug: string
  lang: string
  date: string
  datePublished?: string
  category: Category
  type?: PostType
  excerpt: string
  eli5: string
  tags: string[]
  primaryKeyword?: string
  secondaryKeywords?: string[]
  faq?: FaqItem[]
  // English label used on the social/OG card so it renders with the default
  // Latin font (avoids missing-glyph "tofu" boxes for non-Latin scripts).
  ogTitle?: string
  // Slug of the English original this page is the regional counterpart of, used
  // for the hreflang alternate and the "read in English" link.
  enSlug?: string
}

// UI strings shown in the page chrome (breadcrumb, CTA, popup). Defined per
// language so every visible word on a regional page is in that language, not
// just the article body. New languages add an entry here.
export interface LangConfig {
  code: string
  name: string // endonym, e.g. हिन्दी
  englishName: string
  locale: string // BCP-47, used for date formatting + html lang
  ui: {
    home: string
    learn: string
    alsoRead: string
    updatedOn: string
    readInEnglish: string
    eli5Label: string
    eli5Desc: string
    faqTitle: string
    // App-download popup (the gentle ad)
    popupTitle: string
    popupBody: string
    popupCta: string
    popupDismiss: string
    // Footer download CTA
    ctaKicker: string
    ctaTitle: string
    ctaBody: string
    ctaButtonAndroid: string
    ctaButtonIos: string
  }
}

export const LANGUAGES: Record<string, LangConfig> = {
  hi: {
    code: 'hi',
    name: 'हिन्दी',
    englishName: 'Hindi',
    locale: 'hi-IN',
    ui: {
      home: 'होम',
      learn: 'जानकारी',
      alsoRead: 'यह भी पढ़ें',
      updatedOn: 'अपडेट किया गया',
      readInEnglish: 'अंग्रेज़ी में पढ़ें',
      eli5Label: 'बहुत आसान भाषा में',
      eli5Desc: 'सबसे सरल समझ, कोई जानकारी पहले से ज़रूरी नहीं',
      faqTitle: 'अक्सर पूछे जाने वाले सवाल',
      popupTitle: 'Ziro Market ऐप डाउनलोड करें',
      popupBody:
        'सोना, चाँदी और शेयर बाज़ार के दाम अपनी भाषा में देखें। ऐप पूरी तरह मुफ़्त है।',
      popupCta: 'मुफ़्त ऐप डाउनलोड करें',
      popupDismiss: 'अभी नहीं',
      ctaKicker: 'ऐप पाएँ',
      ctaTitle: 'सब कुछ एक जगह, अपनी भाषा में',
      ctaBody:
        'सोना, चाँदी और बाज़ार के भाव हर दिन अपने फ़ोन पर देखें। मुफ़्त, आसान और हिन्दी में।',
      ctaButtonAndroid: 'Android पर डाउनलोड करें',
      ctaButtonIos: 'iPhone पर डाउनलोड करें',
    },
  },
  ta: {
    code: 'ta',
    name: 'தமிழ்',
    englishName: 'Tamil',
    locale: 'ta-IN',
    ui: {
      home: 'முகப்பு',
      learn: 'தகவல்',
      alsoRead: 'இதையும் படியுங்கள்',
      updatedOn: 'புதுப்பிக்கப்பட்டது',
      readInEnglish: 'ஆங்கிலத்தில் படிக்க',
      eli5Label: 'மிக எளிய மொழியில்',
      eli5Desc: 'முன் அறிவு எதுவும் தேவையில்லை, மிகவும் எளிய விளக்கம்',
      faqTitle: 'அடிக்கடி கேட்கப்படும் கேள்விகள்',
      popupTitle: 'Ziro Market செயலியைப் பதிவிறக்குங்கள்',
      popupBody:
        'தங்கம், வெள்ளி மற்றும் பங்குச் சந்தை விலைகளை உங்கள் மொழியில் பாருங்கள். செயலி முழுவதும் இலவசம்.',
      popupCta: 'இலவசமாகப் பதிவிறக்குங்கள்',
      popupDismiss: 'இப்போது வேண்டாம்',
      ctaKicker: 'செயலியைப் பெறுங்கள்',
      ctaTitle: 'எல்லாம் ஒரே இடத்தில், உங்கள் மொழியில்',
      ctaBody:
        'தங்கம், வெள்ளி, சந்தை விலைகளை தினமும் உங்கள் கைபேசியில் பாருங்கள். இலவசம், எளிமை, தமிழில்.',
      ctaButtonAndroid: 'Android இல் பதிவிறக்குங்கள்',
      ctaButtonIos: 'iPhone இல் பதிவிறக்குங்கள்',
    },
  },
  te: {
    code: 'te',
    name: 'తెలుగు',
    englishName: 'Telugu',
    locale: 'te-IN',
    ui: {
      home: 'హోమ్',
      learn: 'సమాచారం',
      alsoRead: 'ఇది కూడా చదవండి',
      updatedOn: 'నవీకరించిన తేదీ',
      readInEnglish: 'ఇంగ్లీషులో చదవండి',
      eli5Label: 'చాలా సులభమైన భాషలో',
      eli5Desc: 'ముందు ఏ అవగాహన అవసరం లేదు, అత్యంత సులభమైన వివరణ',
      faqTitle: 'తరచుగా అడిగే ప్రశ్నలు',
      popupTitle: 'Ziro Market యాప్‌ను డౌన్‌లోడ్ చేసుకోండి',
      popupBody:
        'బంగారం, వెండి, స్టాక్ మార్కెట్ ధరలను మీ భాషలో చూడండి. యాప్ పూర్తిగా ఉచితం.',
      popupCta: 'ఉచితంగా డౌన్‌లోడ్ చేసుకోండి',
      popupDismiss: 'ఇప్పుడు వద్దు',
      ctaKicker: 'యాప్ పొందండి',
      ctaTitle: 'అన్నీ ఒకే చోట, మీ భాషలో',
      ctaBody:
        'బంగారం, వెండి, మార్కెట్ ధరలను ప్రతిరోజూ మీ ఫోన్‌లో చూడండి. ఉచితం, సులభం, తెలుగులో.',
      ctaButtonAndroid: 'Android లో డౌన్‌లోడ్ చేసుకోండి',
      ctaButtonIos: 'iPhone లో డౌన్‌లోడ్ చేసుకోండి',
    },
  },
}

export function getLanguages(): string[] {
  if (!fs.existsSync(REGIONAL_DIR)) return []
  return fs
    .readdirSync(REGIONAL_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && LANGUAGES[d.name])
    .map((d) => d.name)
}

function langDir(lang: string): string {
  return path.join(REGIONAL_DIR, lang)
}

export function getRegionalSlugs(lang: string): string[] {
  const dir = langDir(lang)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
}

export function getRegionalPost(lang: string, slug: string): (RegionalPostMeta & { content: string }) | null {
  const filePath = path.join(langDir(lang), `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  if (!data.title || !data.date) {
    throw new Error(`regional/${lang}/${slug}.mdx is missing required frontmatter (title, date)`)
  }
  return { ...(data as Omit<RegionalPostMeta, 'slug' | 'lang'>), slug, lang, content }
}

export function getRegionalPostsForLang(lang: string): RegionalPostMeta[] {
  return getRegionalSlugs(lang)
    .map((slug) => {
      const raw = fs.readFileSync(path.join(langDir(lang), `${slug}.mdx`), 'utf8')
      const { data } = matter(raw)
      return { ...(data as Omit<RegionalPostMeta, 'slug' | 'lang'>), slug, lang }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// All (lang, slug) pairs across every language, for generateStaticParams + sitemap.
export function getAllRegionalParams(): { lang: string; slug: string }[] {
  return getLanguages().flatMap((lang) =>
    getRegionalSlugs(lang).map((slug) => ({ lang, slug })),
  )
}

// Reverse lookup for hreflang reciprocity: given an English post's slug, find
// every regional page whose `enSlug` points back to it, so the English page
// can declare a matching `alternate` instead of only being pointed at.
export function getRegionalCounterparts(enSlug: string): { lang: string; slug: string }[] {
  return getLanguages().flatMap((lang) =>
    getRegionalPostsForLang(lang)
      .filter((post) => post.enSlug === enSlug)
      .map((post) => ({ lang, slug: post.slug })),
  )
}
