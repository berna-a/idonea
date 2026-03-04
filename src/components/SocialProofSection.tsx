import { useLanguage } from '@/lib/i18n';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Ana M.',
    location: 'Lisboa, Portugal',
    text_pt: 'Comprei o meu apartamento em Praia sem precisar de viajar. A equipa tratou de tudo com profissionalismo.',
    text_en: 'I bought my apartment in Praia without needing to travel. The team handled everything professionally.',
  },
  {
    name: 'Carlos S.',
    location: 'Praia, Santiago',
    text_pt: 'Processo rápido e transparente. Recomendo a quem procura um serviço sério.',
    text_en: 'Fast and transparent process. I recommend it to anyone looking for serious service.',
  },
  {
    name: 'Marie D.',
    location: 'Paris, France',
    text_pt: 'Investir em Cabo Verde parecia complicado. A Idônea tornou tudo simples.',
    text_en: 'Investing in Cape Verde seemed complicated. Idônea made everything simple.',
  },
];

const SocialProofSection = () => {
  const { lang, t } = useLanguage();

  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
          {t('social.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-card border border-border rounded-lg p-6"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4 italic">
                "{lang === 'pt' ? item.text_pt : item.text_en}"
              </p>
              <div>
                <p className="text-sm font-semibold text-foreground font-body">{item.name}</p>
                <p className="text-xs text-muted-foreground font-body">{item.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
