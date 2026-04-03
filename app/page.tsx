import ScrollProgress from '@/components/ScrollProgress';
import CursorGlow from '@/components/CursorGlow';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import AppExperience from '@/components/AppExperience';
import ChartExperience from '@/components/ChartExperience';
import StockChatRooms from '@/components/StockChatRooms';
import Waitlist from '@/components/Waitlist';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <CursorGlow />
      <Navbar />
      <Hero />
      <AppExperience />
      <ChartExperience />
      <StockChatRooms />
      <Waitlist />
      <Footer />
    </>
  );
}
