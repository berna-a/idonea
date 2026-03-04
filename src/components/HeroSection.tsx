import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-bg.jpg';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 text-center py-20">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground max-w-3xl mx-auto leading-tight"
        >
          {t('hero.headline')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-lg md:text-xl text-muted-foreground font-body max-w-2xl mx-auto"
        >
          {t('hero.subheadline')}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button asChild size="lg" className="font-body text-base">
            <Link to="/properties">{t('hero.cta')}</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="font-body text-base border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <a href="#contacto">{t('hero.contact')}</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
