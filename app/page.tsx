import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/hero/Hero';
import Marquee from '@/components/hero/Marquee';
import PainSection from '@/components/pain/PainSection';
import Pivot from '@/components/pivot/Pivot';
import FeaturesBento from '@/components/features/FeaturesBento';
import StatsStrip from '@/components/stats/StatsStrip';
import BuiltForIndia from '@/components/builtFor/BuiltForIndia';
import WhoItsFor from '@/components/whoItsFor/WhoItsFor';

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Ziro Market',
  url: 'https://ziromarket.com',
  logo: 'https://ziromarket.com/favicon/android-chrome-192x192.png',
  sameAs: ['https://twitter.com/ziromarket'],
  description: "Track what's moving in Indian markets, understand why it's moving. Live heatmaps, portfolio analytics, sector intelligence and smart watchlists built for India.",
}

const softwareAppJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Ziro Market',
  operatingSystem: 'iOS, Android',
  applicationCategory: 'FinanceApplication',
  description: 'Indian stock market tracker with live heatmaps, portfolio analytics, sector intelligence, and smart watchlists.',
  url: 'https://ziromarket.com',
  author: { '@type': 'Organization', name: 'Ziro Market' },
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  screenshot: 'https://ziromarket.com/screenshots/3D_mockup.png',
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
      />
      <Nav />
      <Hero />
      <Marquee />
      <PainSection />
      <Pivot />
      <FeaturesBento />
      <StatsStrip />
      <BuiltForIndia />
      <WhoItsFor />
      <Footer />
    </>
  );
}
