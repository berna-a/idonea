import { useParams, Link, Navigate } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { getGuideBySlug, guidesContent } from '@/lib/guidesContent';
import Header from '@/components/Header';
import Seo from '@/components/Seo';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageCircle, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const GuideLanding = () => {
  const { slug } = useParams();
  const { lang, t } = useLanguage();
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return <Navigate to="/diaspora" replace />;
  }

  const eyebrow = lang === 'pt' ? guide.eyebrow_pt : guide.eyebrow_en;
  const title = lang === 'pt' ? guide.title_pt : guide.title_en;
  const subtitle = lang === 'pt' ? guide.subtitle_pt : guide.subtitle_en;
  const seoTitle = lang === 'pt' ? guide.seoTitle_pt : guide.seoTitle_en;
  const seoDescription = lang === 'pt' ? guide.seoDescription_pt : guide.seoDescription_en;

  const otherGuides = guidesContent.filter((g) => g.slug !== guide.slug);
  const whatsappUrl = `https://wa.me/2389808947?text=${encodeURIComponent(
    lang === 'pt'
      ? `Olá IDÓNEA, li o guia "${guide.title_pt}" e tenho uma pergunta.`
      : `Hello IDÓNEA, I read the guide "${guide.title_en}" and I have a question.`
  )}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: seoTitle,
    description: seoDescription,
    author: { '@type': 'Organization', name: 'IDÓNEA' },
    publisher: { '@type': 'Organization', name: 'IDÓNEA' },
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo title={seoTitle} description={seoDescription} />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      <Header />
      <main className="pt-24 pb-24">
        {/* Hero */}
        <section className="relative py-16 md:py-20 border-b border-border/40 overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, hsl(var(--primary)) 0%, transparent 60%)' }}
            aria-hidden
          />
          <div className="relative container mx-auto px-4 max-w-3xl text-center">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85 }}>
              <p className="text-eyebrow mb-5">{eyebrow}</p>
              <h1 className="font-display text-3xl md:text-5xl text-foreground mb-6 leading-[1.1] tracking-tight">
                {title}
              </h1>
              <p className="text-muted-foreground font-body text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                {subtitle}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Body */}
        <div className="container mx-auto px-4 max-w-3xl pt-16">
          {guide.sections.map((section, i) => (
            <motion.section
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: Math.min(i, 3) * 0.05 }}
              className="mb-14"
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px w-10 bg-primary/40" />
                <h2 className="font-display text-xl md:text-2xl text-foreground">
                  {lang === 'pt' ? section.heading_pt : section.heading_en}
                </h2>
              </div>
              <p className="text-foreground/85 font-body leading-[1.85] text-[16px] whitespace-pre-line">
                {lang === 'pt' ? section.body_pt : section.body_en}
              </p>
            </motion.section>
          ))}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75 }}
            className="text-center bg-secondary/60 border border-border/50 rounded-2xl p-10 md:p-14 mb-20"
          >
            <div className="mx-auto h-px w-12 bg-primary/40 mb-6" />
            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4">
              {lang === 'pt' ? 'Tem uma pergunta sobre o seu caso?' : 'Have a question about your case?'}
            </h2>
            <p className="text-muted-foreground font-body text-sm md:text-base mb-10 max-w-lg mx-auto leading-relaxed">
              {lang === 'pt'
                ? 'Cada situação é diferente. Fale connosco e receba orientação aplicada ao seu objetivo.'
                : 'Every situation is different. Talk to us and get guidance applied to your goal.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="font-body">
                <Link to="/contact">
                  {t('nav.cta')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-[hsl(142,70%,45%)] text-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,45%)] hover:text-white font-body"
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </motion.div>

          {/* Other guides */}
          {otherGuides.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="h-4 w-4 text-primary/70" strokeWidth={1.75} />
                <h2 className="text-eyebrow">
                  {lang === 'pt' ? 'Outros guias' : 'Other guides'}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {otherGuides.map((g) => (
                  <Link
                    key={g.slug}
                    to={`/guias/${g.slug}`}
                    className="group block p-5 rounded-xl border border-border/60 bg-card/40 hover:border-primary/40 transition-colors"
                  >
                    <p className="font-display text-base text-foreground group-hover:text-primary transition-colors mb-1">
                      {lang === 'pt' ? g.title_pt : g.title_en}
                    </p>
                    <p className="text-sm text-muted-foreground font-body line-clamp-2">
                      {lang === 'pt' ? g.subtitle_pt : g.subtitle_en}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default GuideLanding;
