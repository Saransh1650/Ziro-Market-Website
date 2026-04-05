import ScrollProgress from '@/components/ScrollProgress';
import CursorGlow from '@/components/CursorGlow';
import Navbar from '@/components/Navbar';
import HeroNew from '@/components/HeroNew';
import FeatureSection from '@/components/FeatureSection';
import AppShowcase from '@/components/AppShowcase';
import Waitlist from '@/components/Waitlist';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <CursorGlow />
      <Navbar />
      <HeroNew />
      <FeatureSection />
      <AppShowcase />
      <Waitlist />
      <Footer />
    </>
  );
}
