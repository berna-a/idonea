import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import PainPointsSection from '@/components/PainPointsSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import InvestmentSection from '@/components/InvestmentSection';
import FeaturedProperties from '@/components/FeaturedProperties';
import DiasporaSection from '@/components/DiasporaSection';
import SocialProofSection from '@/components/SocialProofSection';
import ContactSection from '@/components/ContactSection';
import ClosingCTA from '@/components/ClosingCTA';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <HeroSection />
        <PainPointsSection />
        <HowItWorksSection />
        <InvestmentSection />
        <FeaturedProperties />
        <DiasporaSection />
        <SocialProofSection />
        <ContactSection />
        <ClosingCTA />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
