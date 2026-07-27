import { ShieldCheck, Clock, Globe2, FileCheck2 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { motion } from 'framer-motion';

const TrustBar = () => {
  const { t } = useLanguage();

  const signals = [
    { icon: ShieldCheck, label: t('trust.1') },
    { icon: Clock, label: t('trust.2') },
    { icon: Globe2, label: t('trust.3') },
    { icon: FileCheck2, label: t('trust.4') },
  ];

  return (
    <section className="relative border-b border-border/40 bg-card/30">
      <div className="container mx-auto px-4 max-w-6xl py-8 md:py-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          {signals.map((signal, i) => (
            <div key={i} className="flex items-center gap-3 justify-center md:justify-start">
              <signal.icon className="h-5 w-5 text-primary flex-shrink-0" strokeWidth={1.5} />
              <p className="text-xs md:text-[13px] text-foreground/80 font-body leading-tight">
                {signal.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustBar;
