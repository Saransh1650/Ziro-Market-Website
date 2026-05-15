import ScrollProgress from '@/components/ScrollProgress';
import ScrollRevealObserver from '@/components/ScrollRevealObserver';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import PainSection from '@/components/PainSection';
import Pivot from '@/components/Pivot';
import FeatureSplit from '@/components/FeatureSplit';
import ScreenshotMosaic from '@/components/ScreenshotMosaic';
import StatsStrip from '@/components/StatsStrip';
import Waitlist from '@/components/Waitlist';
import Footer from '@/components/Footer';

const features = [
  {
    num: '01',
    tag: 'MARKET MAP',
    headline: "See what's moving.\nBefore it's news.",
    body: 'Sector heatmap, top gainers, 52-week highs and lows, live indices — everything happening in the market, the moment it happens.',
    screenshot: '/screenshots/sc-1.png',
    screenshotAlt: 'Market heatmap',
    reverse: false,
  },
  {
    num: '02',
    tag: 'PORTFOLIO',
    headline: "Your money.\nTracked properly.",
    body: 'Portfolio NAV vs Nifty, full P&L breakdown, analytics that explain exactly how your holdings are performing.',
    screenshot: '/screenshots/sc-3.png',
    screenshotAlt: 'Portfolio view',
    reverse: true,
  },
  {
    num: '03',
    tag: 'DISCOVERY',
    headline: "Every sector.\nEvery story.",
    body: 'Sector news, commodity prices, MF overlap, stock correlation — everything you need to understand the bigger picture.',
    screenshot: '/screenshots/sc-2.png',
    screenshotAlt: 'Discovery and sectors',
    reverse: false,
  },
  {
    num: '04',
    tag: 'WATCHLIST',
    headline: "Your watchlist,\nfinally useful.",
    body: 'Live prices, mini-charts, comparison across multiple lists. Know exactly how your picks are doing at a glance.',
    screenshot: '/screenshots/sc-3.png',
    screenshotAlt: 'Watchlist',
    reverse: true,
  },
];

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <ScrollRevealObserver />
      <Navbar />
      <Hero />
      <Marquee />
      <PainSection />
      <Pivot />
      {features.map((f, idx) => (
        <FeatureSplit key={idx} {...f} />
      ))}
      <ScreenshotMosaic />
      <StatsStrip />
      <Waitlist />
      <Footer />
    </>
  );
}
