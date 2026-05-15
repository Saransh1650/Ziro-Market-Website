import ScrollProgress from '@/components/ScrollProgress';
import ScrollRevealObserver from '@/components/ScrollRevealObserver';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Waitlist from '@/components/Waitlist';
import Footer from '@/components/Footer';
function PainSection() { return <section style={{ background: '#0a0a0a', padding: '80px 48px', color: '#fff' }}>Pain section placeholder</section>; }
function Pivot() { return <section style={{ background: '#0a0a0a', padding: '80px 48px', color: '#fff', textAlign: 'center', borderTop: '1px solid #222' }}>Pivot placeholder</section>; }
function FeatureSplit({ num }: { num: string }) { return <section style={{ background: '#0a0a0a', padding: '80px 48px', color: '#fff', borderTop: '1px solid #222' }}>Feature {num} placeholder</section>; }
function ScreenshotMosaic() { return <section style={{ background: '#0a0a0a', padding: '60px 0', borderTop: '1px solid #222', color: '#fff' }}>Mosaic placeholder</section>; }
function StatsStrip() { return <section style={{ background: '#111', padding: '40px 48px', color: '#fff', borderTop: '1px solid #222' }}>Stats placeholder</section>; }

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
      <FeatureSplit num="01" />
      <FeatureSplit num="02" />
      <FeatureSplit num="03" />
      <FeatureSplit num="04" />
      <ScreenshotMosaic />
      <StatsStrip />
      <Waitlist />
      <Footer />
    </>
  );
}
