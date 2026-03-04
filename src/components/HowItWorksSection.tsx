import { useLanguage } from '@/lib/i18n';
import { motion } from 'framer-motion';

const HowItWorksSection = () => {
  const { t } = useLanguage();

  const steps = [
    { num: '01', title: t('how.1.title'), desc: t('how.1.desc') },
    { num: '02', title: t('how.2.title'), desc: t('how.2.desc') },
    { num: '03', title: t('how.3.title'), desc: t('how.3.desc') },
    { num: '04', title: t('how.4.title'), desc: t('how.4.desc') },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-16">
          {t('how.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative"
            >
              <span className="font-display text-5xl font-bold text-primary/20">{step.num}</span>
              <h3 className="font-display text-lg font-semibold text-foreground mt-2 mb-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
