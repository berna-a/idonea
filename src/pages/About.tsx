import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  const { t, lang } = useLanguage();

  const headline = lang === 'pt'
    ? 'Sobre a IDÓNEA'
    : 'About IDÓNEA';
  const subtitle = lang === 'pt'
    ? 'Advisory imobiliário premium em Cabo Verde.'
    : 'Premium real estate advisory in Cape Verde.';
  const body = lang === 'pt'
    ? 'A IDÓNEA é uma empresa de mediação imobiliária focada em rigor, curadoria e acompanhamento completo. Trabalhamos com um número seletivo de imóveis e clientes, garantindo atenção dedicada em cada processo — desde a avaliação inicial até à escritura.'
    : 'IDÓNEA is a real estate advisory firm focused on rigour, curation and full-process support. We work with a selective number of properties and clients, ensuring dedicated attention at every stage — from initial assessment to completion.';

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
              <Shield className="h-12 w-12 text-primary mx-auto mb-6" />
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

export default About;
