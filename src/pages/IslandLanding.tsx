import { useParams, Link, Navigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useLanguage } from '@/lib/i18n';
import { getIslandBySlug } from '@/lib/islandsContent';
import type { Property } from '@/lib/sampleProperties';
import Header from '@/components/Header';
import Seo from '@/components/Seo';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import PropertyListCard from '@/components/properties/PropertyListCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, CheckCircle2, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const EMPTY_PROPERTIES: Property[] = [];

const IslandLanding = () => {
  const { slug } = useParams();
  const { lang, t } = useLanguage();
  const content = getIslandBySlug(slug);

  const result = useQuery(api.properties.listActive, {});
  const allProperties = (result as Property[] | undefined) ?? EMPTY_PROPERTIES;
  const isLoading = result === undefined;

  if (!content) {
    return <Navigate to="/properties" replace />;
  }

  const properties = allProperties.filter((p) => p.island === content.dbName);
  const whatsappUrl = `https://wa.me/2389808947?text=${encodeURIComponent(
    lang === 'pt'
      ? `Olá IDÓNEA, tenho interesse em imóveis em ${content.dbName}.`
      : `Hello IDÓNEA, I'm interested in properties in ${content.name_en}.`
  )}`;

  const tagline = lang === 'pt' ? content.tagline_pt : content.tagline_en;
  const intro = lang === 'pt' ? content.intro_pt : content.intro_en;
  const investmentCase = lang === 'pt' ? content.investmentCase_pt : content.investmentCase_en;
  const highlights = lang === 'pt' ? content.highlights_pt : content.highlights_en;
  const seoTitle = lang === 'pt' ? content.seoTitle_pt : content.seoTitle_en;
  const seoDescription = lang === 'pt' ? content.seoDescription_pt : content.seoDescription_en;
  const islandName = lang === 'pt' ? content.dbName : content.name_en;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: seoTitle,
    description: seoDescription,
    about: { '@type': 'Place', name: `${content.dbName}, Cabo Verde` },
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo title={seoTitle} description={seoDescription} />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      <Header />
      <main className="pt-24 pb-24">
        {/* Hero */}
        <section className="relative py-16 md:py-24 border-b border-border/40 overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, hsl(var(--primary)) 0%, transparent 60%)' }}
            aria-hidden
          />
          <div className="relative container mx-auto px-4 max-w-3xl text-center">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85 }}>
              <p className="text-eyebrow mb-5">
                {lang === 'pt' ? 'Ilhas · Cabo Verde' : 'Islands · Cape Verde'}
              </p>
              <h1 className="font-display text-4xl md:text-6xl text-foreground mb-6 leading-[1.05] tracking-tight">
                {islandName}
              </h1>
              <p className="text-primary font-display text-xl md:text-2xl mb-6">{tagline}</p>
              <p className="text-muted-foreground font-body text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                {intro}
              </p>
            </motion.div>
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-6xl pt-16">
          {/* Investment case */}
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20"
          >
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-10 bg-primary/40" />
                <h2 className="text-eyebrow">
                  {lang === 'pt' ? 'Porque investir aqui' : 'Why invest here'}
                </h2>
              </div>
              <p className="text-foreground/85 font-body leading-[1.85] text-[16px]">{investmentCase}</p>
            </div>
            <div className="bg-card border border-border/60 rounded-2xl p-7 space-y-4 h-fit">
              <h3 className="font-display text-lg text-foreground mb-2">
                {lang === 'pt' ? `Destaques de ${content.dbName}` : `${content.name_en} highlights`}
              </h3>
              {highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-3 text-[15px] text-foreground/80 font-body">
                  <CheckCircle2 className="h-4 w-4 text-primary/70 flex-shrink-0 mt-0.5" strokeWidth={1.75} />
                  {h}
                </div>
              ))}
            </div>
          </motion.section>

          {/* Live properties */}
          <section className="mb-20">
            <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="h-px w-10 bg-primary/40" />
                  <span className="text-eyebrow">
                    {lang === 'pt' ? 'Portefólio' : 'Portfolio'}
                  </span>
                </div>
                <h2 className="font-display text-3xl md:text-4xl text-foreground tracking-tight">
                  {lang === 'pt' ? `Imóveis em ${content.dbName}` : `Properties in ${content.name_en}`}
                </h2>
              </div>
              <Button asChild variant="outline" className="font-body">
                <Link to={`/properties?island=${encodeURIComponent(content.dbName)}`}>
                  {lang === 'pt' ? 'Ver todos com filtros' : 'View all with filters'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="bg-card/40 border border-border/60 rounded-xl overflow-hidden">
                    <Skeleton className="aspect-[4/3] w-full" />
                    <div className="p-7 space-y-3">
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-5 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && properties.length === 0 && (
              <div className="text-center py-16 border border-border/40 rounded-xl bg-card/30">
                <p className="text-muted-foreground font-body text-sm">
                  {lang === 'pt'
                    ? `Novos imóveis em ${content.dbName} em curadoria. Fale connosco — apresentamos oportunidades ainda não publicadas.`
                    : `New properties in ${content.name_en} under curation. Talk to us — we present opportunities not yet listed.`}
                </p>
              </div>
            )}

            {!isLoading && properties.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {properties.map((prop, i) => (
                  <PropertyListCard key={prop.id} prop={prop} index={i} isHovered={false} onHover={() => {}} />
                ))}
              </div>
            )}
          </section>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75 }}
            className="text-center bg-secondary/60 border border-border/50 rounded-2xl p-10 md:p-14"
          >
            <div className="mx-auto h-px w-12 bg-primary/40 mb-6" />
            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4">
              {lang === 'pt' ? `Procura algo em ${content.dbName}?` : `Looking for something in ${content.name_en}?`}
            </h2>
            <p className="text-muted-foreground font-body text-sm md:text-base mb-10 max-w-lg mx-auto leading-relaxed">
              {lang === 'pt'
                ? 'Conte-nos o seu objetivo. Apresentamos oportunidades alinhadas com o seu perfil, incluindo imóveis ainda não publicados.'
                : "Tell us your goal. We present opportunities aligned with your profile, including properties not yet listed."}
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
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default IslandLanding;
