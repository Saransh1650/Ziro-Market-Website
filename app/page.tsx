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
import Waitlist from '@/components/waitlist/Waitlist';

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Marquee />
      <PainSection />
      <Pivot />
      <FeaturesBento />
      <StatsStrip />
      <BuiltForIndia />
      <WhoItsFor />
      <Waitlist />
      <Footer />
    </>
  );
}
