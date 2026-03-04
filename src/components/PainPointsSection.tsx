import { ShieldAlert, FileWarning, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { motion } from 'framer-motion';

const PainPointsSection = () => {
  const { t } = useLanguage();

  const points = [
    { icon: ShieldAlert, title: t('pain.1.title'), desc: t('pain.1.desc') },
    { icon: FileWarning, title: t('pain.2.title'), desc: t('pain.2.desc') },
    { icon: AlertTriangle, title: t('pain.3.title'), desc: t('pain.3.desc') },
  ];

  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
          {t('pain.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {points.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="bg-card border border-border rounded-lg p-8 text-center"
            >
              <point.icon className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">{point.title}</h3>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">{point.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PainPointsSection;
