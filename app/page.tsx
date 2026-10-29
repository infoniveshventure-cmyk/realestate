import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import HeroVideo from '@/components/sections/HeroVideo';
import FeaturedProjects from '@/components/sections/FeaturedProjects';

export default function Home() {
  return (
    <main className="relative bg-[#FFFBF7] min-h-screen">
      <Header />
      <HeroVideo />
      <FeaturedProjects />
      <Footer />
    </main>
  );
}
