import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Investment = () => {
  const { t } = useLanguage();

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
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-6" />
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                {t('invest.title')}
              </h1>
              <p className="font-display text-lg text-primary mb-6">
                {t('invest.subtitle')}
              </p>
              <p className="text-muted-foreground font-body leading-relaxed mb-10">
                {t('invest.desc')}
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

export default Investment;
