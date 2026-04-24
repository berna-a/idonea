import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-bg.jpg';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[90vh] flex items-end overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-background/15" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 pb-20 md:pb-28 pt-32">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-primary font-body text-sm tracking-[0.2em] uppercase mb-6"
          >
            {t('hero.eyebrow')}
          </motion.p>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-normal text-foreground leading-[1.1] tracking-tight"
          >
            {t('hero.headline')}
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-6 text-lg md:text-xl text-muted-foreground font-body max-w-2xl leading-relaxed"
          >
            {t('hero.subheadline')}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <Button asChild size="lg" className="font-body text-base px-8">
              <Link to="/properties">{t('hero.cta.properties')}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="font-body text-base px-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Link to="/contact">{t('hero.cta.consultation')}</Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="font-body text-base px-8 text-muted-foreground hover:text-primary">
              <Link to="/sell">{t('hero.cta.sell')}</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
