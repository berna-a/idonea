import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ClosingCTA = () => {
  const { t } = useLanguage();
  const whatsappUrl = `https://wa.me/${encodeURIComponent('2389808947')}`;

  return (
    <section className="py-24 bg-secondary border-t border-border/40">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-5 leading-tight">
            {t('closing.title')}
          </h2>
          <p className="text-muted-foreground font-body leading-relaxed mb-10 max-w-lg mx-auto">
            {t('closing.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Button asChild size="lg" className="font-body w-full sm:w-auto">
              <Link to="/contact">
                {t('closing.cta.consultation')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="font-body w-full sm:w-auto border-[hsl(142,70%,45%)] text-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,45%)] hover:text-white"
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                {t('closing.cta.whatsapp')}
              </a>
            </Button>
          </div>

          <Link
            to="/properties"
            className="text-sm text-muted-foreground hover:text-primary transition-colors font-body underline underline-offset-4"
          >
            {t('closing.cta.properties')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ClosingCTA;
