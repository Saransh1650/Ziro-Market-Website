import ScrollProgress from '@/components/ScrollProgress';
import CursorGlow from '@/components/CursorGlow';
import Navbar from '@/components/Navbar';
import TickerStrip from '@/components/TickerStrip';
import Hero from '@/components/Hero';
import MarketSignals from '@/components/MarketSignals';
import SectorHeatmap from '@/components/SectorHeatmap';
import WatchlistIntelligence from '@/components/WatchlistIntelligence';
import StockChatRooms from '@/components/StockChatRooms';
import HowItWorks from '@/components/HowItWorks';
import FutureSection from '@/components/FutureSection';
import Waitlist from '@/components/Waitlist';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <TickerStrip />
      <Navbar />
      <Hero />
      <MarketSignals />
      <SectorHeatmap />
      <WatchlistIntelligence />
      <StockChatRooms />
      <HowItWorks />
      <FutureSection />
      <Waitlist />
      <Footer />
    </main>
  );
}
