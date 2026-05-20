import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/hero/Hero';
import Marquee from '@/components/hero/Marquee';
import PainSection from '@/components/pain/PainSection';
import Pivot from '@/components/pivot/Pivot';
import FeatureBlock from '@/components/features/FeatureBlock';
import HeatmapViz from '@/components/features/viz/HeatmapViz';
import NavVsNiftyViz from '@/components/features/viz/NavVsNiftyViz';
import SectorTiles from '@/components/features/viz/SectorTiles';
import WatchlistRows from '@/components/features/viz/WatchlistRows';
import EventsGrid from '@/components/features/viz/EventsGrid';
import PaperTradeMock from '@/components/features/viz/PaperTradeMock';
import StatsStrip from '@/components/stats/StatsStrip';
import BuiltForIndia from '@/components/builtFor/BuiltForIndia';
import Waitlist from '@/components/waitlist/Waitlist';

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Marquee />
      <PainSection />
      <Pivot />

      <FeatureBlock
        num="06" tag="MARKET MAP"
        headlineTop="11 sectors." headlineHighlight="One look."
        body="Sector heatmap, top gainers, 52-week highs and lows, live indices — everything happening in the market, the moment it happens."
        bullets={['Live colour-coded sector grid', 'Top gainers & losers, one tap away']}
        viz={<HeatmapViz />}
      />
      <FeatureBlock
        num="07" tag="PORTFOLIO" reverse
        headlineTop="Your money." headlineHighlight="Tracked properly."
        body="Portfolio NAV vs Nifty, full P&L breakdown, analytics that explain exactly how your holdings are performing."
        bullets={['NAV-vs-NIFTY benchmarking', 'Realised + unrealised P&L']}
        viz={<NavVsNiftyViz />}
      />
      <FeatureBlock
        num="08" tag="DISCOVERY"
        headlineTop="Every sector." headlineHighlight="Every story."
        body="Sector news, commodity prices, MF overlap, stock correlation — everything you need to understand the bigger picture."
        bullets={['Commodities: crude, gold, silver, copper', 'MF holding overlap + correlation']}
        viz={<SectorTiles />}
      />
      <FeatureBlock
        num="09" tag="WATCHLIST" reverse
        headlineTop="Your picks," headlineHighlight="finally useful."
        body="Live prices, mini-charts, comparison across multiple lists. Know exactly how your picks are doing at a glance."
        bullets={['Multiple lists, side-by-side', 'Live sparklines + change %']}
        viz={<WatchlistRows />}
      />
      <FeatureBlock
        num="10" tag="TOMORROW"
        headlineTop="Know what's coming." headlineHighlight="Tomorrow."
        body="Earnings, results, ex-dividend dates, RBI policy days — the events that move prices, before they move."
        bullets={['Weekly events calendar', 'Filter by your watchlist']}
        viz={<EventsGrid />}
      />
      <FeatureBlock
        num="11" tag="PAPER TRADE" reverse
        headlineTop="Practice without" headlineHighlight="the pain."
        body="Try out trades, options strategies and position sizing with no real money. Reset every week."
        bullets={['Equities + F&O paper book', 'Resets weekly so you stay honest']}
        viz={<PaperTradeMock />}
      />

      <StatsStrip />
      <BuiltForIndia />
      <Waitlist />
      <Footer />
    </>
  );
}
