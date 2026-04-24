import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Globe, Video, FileCheck, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const DiasporaSection = () => {
  const { t } = useLanguage();

  const points = [
    { icon: Globe, key: 'diaspora.point.1' },
    { icon: Video, key: 'diaspora.point.2' },
    { icon: FileCheck, key: 'diaspora.point.3' },
    { icon: MessageCircle, key: 'diaspora.point.4' },
  ];

  return (
    <section id="diaspora" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* Left — Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary/70 font-body text-sm tracking-widest uppercase mb-4 block">
              {t('diaspora.eyebrow')}
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-5 leading-tight">
              {t('diaspora.title')}
            </h2>
            <p className="text-muted-foreground font-body leading-relaxed mb-10">
              {t('diaspora.subtitle')}
            </p>

            <div className="space-y-6 mb-10">
              {points.map((point, i) => (
                <motion.div
                  key={point.key}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.15 * i }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5">
                    <point.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-foreground mb-1">
                      {t(`${point.key}.title`)}
                    </h3>
                    <p className="text-muted-foreground font-body text-sm leading-relaxed">
                      {t(`${point.key}.desc`)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button asChild size="lg" className="font-body">
              <Link to="/diaspora">{t('diaspora.cta')}</Link>
            </Button>
          </motion.div>

          {/* Right — Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:block"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1528702748617-c64d49f918af?auto=format&fit=crop&w=800&q=80"
                alt="Cape Verde coastline"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <p className="font-display text-lg font-semibold text-foreground">
                  {t('diaspora.image.caption')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DiasporaSection;
