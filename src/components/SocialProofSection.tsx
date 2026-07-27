import { useLanguage } from '@/lib/i18n';
import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Ana M.',
    context_pt: 'Compradora na diáspora',
    context_en: 'Diaspora buyer',
    text_pt: 'Vivo em Lisboa e comprei um apartamento na Praia sem precisar de viajar. A equipa tratou da documentação, organizou video-tours e manteve-me informada em cada passo. Senti que tinha alguém de confiança no terreno.',
    text_en: 'I live in Lisbon and bought an apartment in Praia without travelling. The team handled documentation, organised video tours and kept me informed at every step. I felt I had someone trustworthy on the ground.',
  },
  {
    name: 'Carlos S.',
    context_pt: 'Comprador local',
    context_en: 'Local buyer',
    text_pt: 'O que mais me impressionou foi a clareza do processo. Desde o primeiro contacto à escritura, soube sempre o que esperar. Sem pressões, sem surpresas.',
    text_en: 'What impressed me most was the clarity of the process. From first contact to completion, I always knew what to expect. No pressure, no surprises.',
  },
  {
    name: 'Marie D.',
    context_pt: 'Investidora internacional',
    context_en: 'International investor',
    text_pt: 'Investir em Cabo Verde parecia complexo à distância. A IDÓNEA apresentou-me uma seleção criteriosa, acompanhou a negociação e geriu toda a parte legal com rigor. Um serviço discreto e muito profissional.',
    text_en: 'Investing in Cape Verde seemed complex from abroad. IDÓNEA presented a carefully curated selection, managed the negotiation and handled all legal aspects with rigour. A discreet and highly professional service.',
  },
];

const SocialProofSection = () => {
  const { lang, t } = useLanguage();

  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
            {t('social.title')}
          </h2>
          <p className="text-muted-foreground font-body max-w-xl mx-auto">
            {t('social.subtitle')}
          </p>
        </motion.div>

        <div className="space-y-10">
          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.75 }}
              className="relative bg-card/50 border border-border/60 rounded-xl p-8 md:p-10"
            >
              <Quote className="absolute top-6 right-8 w-8 h-8 text-primary/15" />
              <p className="text-muted-foreground font-body leading-relaxed text-[15px] mb-6">
                "{lang === 'pt' ? item.text_pt : item.text_en}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-display text-sm">
                    {item.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground font-display">{item.name}</p>
                  <p className="text-xs text-muted-foreground font-body">
                    {lang === 'pt' ? item.context_pt : item.context_en}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
