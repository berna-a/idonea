import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { motion } from 'framer-motion';

const Sell = () => {
  const { t, lang } = useLanguage();

  const headline = lang === 'pt'
    ? 'Vender o seu imóvel com a confiança certa.'
    : 'Sell your property with the right partner.';
  const subtitle = lang === 'pt'
    ? 'Avaliação rigorosa, exposição seletiva e acompanhamento completo.'
    : 'Rigorous valuation, selective exposure and full support.';
  const body = lang === 'pt'
    ? 'Na IDÓNEA, cada imóvel é tratado com cuidado e estratégia. Fazemos uma avaliação justa, posicionamos o seu imóvel perante compradores qualificados e acompanhamos todo o processo até à conclusão.'
    : 'At IDÓNEA, every property is handled with care and strategy. We provide a fair valuation, position your property to qualified buyers and support you through the entire process to completion.';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <section className="py-24">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Home className="h-12 w-12 text-primary mx-auto mb-6" />
              <h1 className="font-display text-4xl md:text-5xl text-foreground mb-6">
                {headline}
              </h1>
              <p className="font-display text-lg text-primary mb-6">
                {subtitle}
              </p>
              <p className="text-muted-foreground font-body leading-relaxed mb-10">
                {body}
              </p>
              <Button asChild size="lg" className="font-body">
                <Link to="/contact">{t('nav.cta')}</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Sell;
