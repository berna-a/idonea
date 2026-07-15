import Header from '@/components/Header';
import Seo from '@/components/Seo';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useLanguage } from '@/lib/i18n';
import { guidesContent } from '@/lib/guidesContent';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Globe, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Diaspora = () => {
  const { t, lang } = useLanguage();

  const headline = lang === 'pt'
    ? 'Invista no seu país, mesmo à distância.'
    : 'Invest in Cape Verde, wherever you are.';
  const subtitle = lang === 'pt'
    ? 'Acompanhamento completo para cabo-verdianos na diáspora.'
    : 'Full support for Cape Verdeans abroad.';
  const body = lang === 'pt'
    ? 'Sabemos que comprar ou investir à distância exige confiança. Por isso, tratamos de todo o processo por si — desde a seleção do imóvel à escritura — com transparência total e comunicação regular em cada etapa.'
    : 'Buying or investing from abroad requires trust. We manage the entire process on your behalf — from property selection to completion — with full transparency and regular communication at every stage.';

  return (
    <div className="min-h-screen bg-background">
      <Seo title={t('seo.diaspora.title')} description={t('seo.diaspora.description')} />
      <Header />
      <main className="pt-16">
        <section className="py-24">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85 }}
            >
              <Globe className="h-12 w-12 text-primary mx-auto mb-6" />
              <h1 className="font-display text-4xl md:text-5xl text-foreground mb-6">
                {headline}
              </h1>
              <p className="font-display text-lg text-primary mb-6">
                {subtitle}
              </p>
              <p className="text-muted-foreground font-body leading-relaxed mb-10">
                {body}
              </p>
              <Button asChild size="lg" className="font-body">
                <Link to="/contact">{t('nav.cta')}</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Guides */}
        <section className="pb-24">
          <div className="container mx-auto px-4 max-w-5xl">
            <p className="text-eyebrow text-center mb-4">
              {lang === 'pt' ? 'Guias práticos' : 'Practical guides'}
            </p>
            <h2 className="font-display text-2xl md:text-3xl text-foreground text-center mb-12">
              {lang === 'pt' ? 'Tudo o que precisa de saber, sem sair de casa.' : 'Everything you need to know, without leaving home.'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {guidesContent.map((g) => (
                <Link
                  key={g.slug}
                  to={`/guias/${g.slug}`}
                  className="group block p-6 rounded-xl border border-border/60 bg-card/40 hover:border-primary/40 transition-colors"
                >
                  <p className="font-display text-lg text-foreground group-hover:text-primary transition-colors mb-2">
                    {lang === 'pt' ? g.title_pt : g.title_en}
                  </p>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4">
                    {lang === 'pt' ? g.subtitle_pt : g.subtitle_en}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs text-primary font-body">
                    {lang === 'pt' ? 'Ler guia' : 'Read guide'}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Diaspora;
