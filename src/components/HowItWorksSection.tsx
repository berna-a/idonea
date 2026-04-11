import { useLanguage } from '@/lib/i18n';
import { motion } from 'framer-motion';

const HowItWorksSection = () => {
  const { t } = useLanguage();

  const steps = [
    { num: '01', title: t('how.1.title'), desc: t('how.1.desc') },
    { num: '02', title: t('how.2.title'), desc: t('how.2.desc') },
    { num: '03', title: t('how.3.title'), desc: t('how.3.desc') },
    { num: '04', title: t('how.4.title'), desc: t('how.4.desc') },
    { num: '05', title: t('how.5.title'), desc: t('how.5.desc') },
  ];

  return (
    <section className="py-24 md:py-32 bg-secondary/40">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5">
            {t('how.title')}
          </h2>
          <p className="text-muted-foreground font-body text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {t('how.subtitle')}
          </p>
        </motion.div>

        {/* Steps – vertical timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-border/60" />

          <div className="space-y-10 md:space-y-12">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative flex items-start gap-6 md:gap-8"
              >
                {/* Number circle */}
                <div className="relative z-10 flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full bg-card border border-primary/30 flex items-center justify-center">
                  <span className="font-display text-sm md:text-base font-semibold text-primary">
                    {step.num}
                  </span>
                </div>

                {/* Content */}
                <div className="pt-1 md:pt-3">
                  <h3 className="font-display text-lg md:text-xl font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground font-body leading-relaxed max-w-lg">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
