import { Shield, Gem, ListChecks, UserCheck } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { motion } from 'framer-motion';

const PainPointsSection = () => {
  const { t } = useLanguage();

  const pillars = [
    { icon: Shield, title: t('diff.1.title'), desc: t('diff.1.desc') },
    { icon: Gem, title: t('diff.2.title'), desc: t('diff.2.desc') },
    { icon: ListChecks, title: t('diff.3.title'), desc: t('diff.3.desc') },
    { icon: UserCheck, title: t('diff.4.title'), desc: t('diff.4.desc') },
  ];

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85 }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-5">
            {t('diff.title')}
          </h2>
          <p className="text-muted-foreground font-body text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {t('diff.subtitle')}
          </p>
        </motion.div>

        {/* 4 Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {pillars.map((pillar, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.75 }}
              className="group relative bg-card border border-border/50 rounded-xl p-8 md:p-10 text-center hover:border-primary/30 transition-colors duration-300"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-6">
                <pillar.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                {pillar.title}
              </h3>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">
                {pillar.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PainPointsSection;
