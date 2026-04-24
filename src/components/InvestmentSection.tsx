import { useLanguage } from '@/lib/i18n';
import { TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const InvestmentSection = () => {
  const { t } = useLanguage();

  return (
    <section id="investimento" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <TrendingUp className="h-12 w-12 text-primary mx-auto mb-6" />
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
            {t('invest.title')}
          </h2>
          <p className="font-display text-lg text-primary mb-6">
            {t('invest.subtitle')}
          </p>
          <p className="text-muted-foreground font-body leading-relaxed mb-8">
            {t('invest.desc')}
          </p>
          <Button asChild size="lg" className="font-body">
            <a href="#contacto">{t('invest.cta')}</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default InvestmentSection;
