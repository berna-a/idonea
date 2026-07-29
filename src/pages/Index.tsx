import { ReactLenis } from 'lenis/react';
import Header from '@/components/Header';
import Seo from '@/components/Seo';
import { useLanguage } from '@/lib/i18n';
import HomeHero from '@/components/HomeHero';
import TrustBar from '@/components/TrustBar';
import PainPointsSection from '@/components/PainPointsSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import InvestmentSection from '@/components/InvestmentSection';
import HomeVault from '@/components/HomeVault';
import DiasporaSection from '@/components/DiasporaSection';
import ContactSection from '@/components/ContactSection';
import ClosingCTA from '@/components/ClosingCTA';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

const Index = () => {
  const { t } = useLanguage();
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.4, wheelMultiplier: 1 }}>
      <div className="min-h-screen bg-background">
        <Seo title={t('seo.home.title')} description={t('seo.home.description')} />
        <Header />
        <main>
          <HomeHero />
          <TrustBar />
          <PainPointsSection />
          <HowItWorksSection />
          <InvestmentSection />
          <HomeVault />
          <DiasporaSection />
          <ContactSection />
          <ClosingCTA />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </ReactLenis>
  );
};

export default Index;
