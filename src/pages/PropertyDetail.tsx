import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/lib/i18n';
import { PropertyTag } from '@/lib/sampleProperties';
import { fetchPropertyById, fetchSimilarProperties } from '@/lib/propertyAdapter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Bed, Bath, Maximize, MapPin, MessageCircle,
  ChevronLeft, ChevronRight, Users, Shield, FileCheck, Handshake, CheckCircle2,
  CalendarCheck, Phone, ImageOff,
} from 'lucide-react';

const PropertyDetail = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const [activeImage, setActiveImage] = useState(0);

  const { data: property, isLoading, isError } = useQuery({
    queryKey: ['public-property', id],
    queryFn: () => fetchPropertyById(id!),
    enabled: !!id,
  });

  const { data: similar = [] } = useQuery({
    queryKey: ['public-property-similar', property?.id],
    queryFn: () => fetchSimilarProperties(property!.id, property!.island, property!.type, 3),
    enabled: !!property,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-24">
          <div className="container mx-auto px-4 max-w-7xl">
            <Skeleton className="h-4 w-24 mb-8" />
            <Skeleton className="aspect-[16/9] max-h-[640px] w-full rounded-2xl mb-12" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-40 w-full" />
              </div>
              <Skeleton className="h-80 w-full rounded-2xl" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 container mx-auto px-4 text-center min-h-[50vh] flex flex-col items-center justify-center">
          <p className="text-muted-foreground font-body mb-6">
            {isError ? 'Não foi possível carregar este imóvel.' : 'Imóvel não encontrado.'}
          </p>
          <Button asChild variant="outline" className="font-body">
            <Link to="/properties">{t('props.back')}</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const title = property.title_pt;
  const editorial = property.editorial_pt;
  const idealFor = property.idealFor_pt;

  const formatPrice = (price: number, type: 'sale' | 'rent') => {
    const formatted = new Intl.NumberFormat('pt-CV', { style: 'currency', currency: 'CVE', minimumFractionDigits: 0 }).format(price);
    return type === 'rent' ? `${formatted}${t('props.price.month')}` : formatted;
  };

  const tagLabel = (tag: PropertyTag) => t(`detail.tag.${tag}`);

  // ---- Contextual CTAs ----
  const propertyUrl = typeof window !== 'undefined' ? window.location.href : '';
  const transactionLabel = property.type === 'sale' ? 'venda' : 'arrendamento';

  const buildWhatsappUrl = (intent: 'visit' | 'info' | 'generic') => {
    const lines: string[] = ['Olá IDÓNEA,'];
    if (intent === 'visit') {
      lines.push(`gostaria de agendar uma visita ao imóvel ${property.ref} — ${title}`);
    } else if (intent === 'info') {
      lines.push(`gostaria de receber mais informação sobre o imóvel ${property.ref} — ${title}`);
    } else {
      lines.push(`tenho interesse no imóvel ${property.ref} — ${title}`);
    }
    lines.push(`(${property.location}, ${property.island} · ${transactionLabel})`);
    if (propertyUrl) lines.push(propertyUrl);
    return `https://wa.me/2389808947?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  const buildContactUrl = (intent: 'visit' | 'info') => {
    const params = new URLSearchParams({
      ref: property.ref,
      title,
      location: `${property.location}, ${property.island}`,
      type: property.type,
      intent,
      url: propertyUrl,
    });
    return `/contact?${params.toString()}`;
  };

  const images = property.images.length > 0 ? property.images : [property.image];
  const hasImages = images.some(Boolean);

  const prevImage = () => setActiveImage(i => (i === 0 ? images.length - 1 : i - 1));
  const nextImage = () => setActiveImage(i => (i === images.length - 1 ? 0 : i + 1));

  const processSteps = [
    { icon: Phone, key: 'detail.process.1' },
    { icon: CalendarCheck, key: 'detail.process.2' },
    { icon: FileCheck, key: 'detail.process.3' },
    { icon: Handshake, key: 'detail.process.4' },
    { icon: Shield, key: 'detail.process.5' },
  ];

  const specs = [
    property.bedrooms > 0 && { icon: Bed, value: property.bedrooms, label: t('featured.bedrooms') },
    property.bathrooms > 0 && { icon: Bath, value: property.bathrooms, label: t('featured.bathrooms') },
    property.area > 0 && { icon: Maximize, value: `${property.area}m²`, label: t('detail.area') },
  ].filter(Boolean) as { icon: typeof Bed; value: string | number; label: string }[];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-24">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Back */}
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-body mb-8 text-sm tracking-wide"
          >
            <ArrowLeft className="h-4 w-4" /> {t('props.back')}
          </Link>

          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden mb-4 aspect-[16/9] max-h-[640px] bg-card ring-1 ring-border/40 shadow-2xl shadow-black/40"
          >
            {hasImages ? (
              <img
                src={images[activeImage]}
                alt={title}
                className="w-full h-full object-cover transition-opacity duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <ImageOff className="h-12 w-12" strokeWidth={1.5} />
              </div>
            )}

            {/* Subtle gradient at bottom for legibility */}
            {hasImages && (
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/60 to-transparent pointer-events-none" />
            )}

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  aria-label="Previous image"
                  className="absolute left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-background/60 backdrop-blur-md ring-1 ring-border/40 flex items-center justify-center hover:bg-background/90 hover:ring-primary/40 transition-all"
                >
                  <ChevronLeft className="h-5 w-5 text-foreground" />
                </button>
                <button
                  onClick={nextImage}
                  aria-label="Next image"
                  className="absolute right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-background/60 backdrop-blur-md ring-1 ring-border/40 flex items-center justify-center hover:bg-background/90 hover:ring-primary/40 transition-all"
                >
                  <ChevronRight className="h-5 w-5 text-foreground" />
                </button>
                {/* Counter */}
                <div className="absolute top-5 right-5 px-3 py-1.5 rounded-full bg-background/60 backdrop-blur-md ring-1 ring-border/40 text-xs font-body text-foreground/90 tabular-nums">
                  {activeImage + 1} {t('detail.gallery.counter')} {images.length}
                </div>
              </>
            )}
          </motion.div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="flex gap-2 mb-12 overflow-x-auto pb-1 scrollbar-thin">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative flex-shrink-0 w-20 h-16 md:w-24 md:h-20 rounded-lg overflow-hidden ring-1 transition-all ${
                    i === activeImage
                      ? 'ring-2 ring-primary opacity-100'
                      : 'ring-border/40 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {!images.length || images.length <= 1 ? <div className="mb-12" /> : null}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-16">
              {/* Header */}
              <motion.header
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[11px] text-primary font-body uppercase tracking-[0.2em]">
                    {property.type === 'sale' ? t('props.filter.sale') : t('props.filter.rent')}
                  </span>
                  <span className="h-px w-8 bg-border" />
                  <span className="text-[11px] text-muted-foreground font-body uppercase tracking-[0.2em] tabular-nums">
                    {property.ref}
                  </span>
                </div>

                <h1 className="font-display text-4xl md:text-5xl text-foreground leading-[1.1] mb-5 tracking-tight">
                  {title}
                </h1>

                <div className="flex items-center gap-2 text-muted-foreground font-body text-[15px] mb-6">
                  <MapPin className="h-4 w-4 text-primary" strokeWidth={1.75} />
                  <span>{property.location}, {property.island}</span>
                </div>

                {/* Mobile price */}
                <p className="text-3xl text-primary font-display lg:hidden mb-6 tabular-nums">
                  {formatPrice(property.price, property.type)}
                </p>

                {property.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {property.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-[11px] font-body uppercase tracking-wider px-3 py-1.5 rounded-full border border-primary/25 bg-primary/[0.04] text-primary/90"
                      >
                        {tagLabel(tag)}
                      </span>
                    ))}
                  </div>
                )}
              </motion.header>

              {/* Specs strip */}
              {specs.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="flex items-stretch gap-0 border-y border-border/50 divide-x divide-border/50"
                >
                  {specs.map((spec, i) => (
                    <div key={i} className="flex-1 py-6 px-4 text-center first:pl-0 last:pr-0">
                      <spec.icon className="h-5 w-5 text-primary mx-auto mb-2.5" strokeWidth={1.5} />
                      <p className="text-2xl font-display font-semibold text-foreground tabular-nums">
                        {spec.value}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-body uppercase tracking-wider mt-1">
                        {spec.label}
                      </p>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Editorial */}
              {editorial && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <span className="h-px w-10 bg-primary/40" />
                    <h2 className="font-body text-[11px] uppercase tracking-[0.25em] text-primary/80">
                      {t('detail.editorial.title')}
                    </h2>
                  </div>
                  <p className="text-foreground/85 font-body leading-[1.85] text-[16px] whitespace-pre-line max-w-prose">
                    {editorial}
                  </p>
                </motion.section>
              )}

              {/* Ideal For */}
              {idealFor.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <span className="h-px w-10 bg-primary/40" />
                    <h2 className="font-body text-[11px] uppercase tracking-[0.25em] text-primary/80">
                      {t('detail.idealFor')}
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {idealFor.map((item, i) => (
                      <span
                        key={i}
                        className="text-sm font-body px-4 py-2 rounded-full bg-card border border-border/60 text-foreground/80"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Features */}
              {property.features.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <span className="h-px w-10 bg-primary/40" />
                    <h2 className="font-body text-[11px] uppercase tracking-[0.25em] text-primary/80">
                      {t('detail.specs.title')}
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                    {property.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-3 text-[15px] text-foreground/80 font-body py-2 border-b border-border/30">
                        <CheckCircle2 className="h-4 w-4 text-primary/70 flex-shrink-0" strokeWidth={1.75} />
                        {f.value_pt}
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Process */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="relative bg-secondary/60 border border-border/40 rounded-2xl p-8 md:p-10 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="h-5 w-5 text-primary" strokeWidth={1.5} />
                    <h2 className="font-display text-xl font-semibold text-foreground">
                      {t('detail.process.title')}
                    </h2>
                  </div>
                  <p className="text-sm text-muted-foreground font-body mb-8 max-w-xl">
                    {t('detail.process.subtitle')}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
                    {processSteps.map((step, i) => (
                      <div key={i} className="text-center">
                        <div className="w-11 h-11 rounded-full bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center mx-auto mb-3">
                          <step.icon className="h-[18px] w-[18px] text-primary" strokeWidth={1.75} />
                        </div>
                        <p className="text-[13px] text-foreground/75 font-body leading-tight">
                          {t(step.key)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.section>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="bg-card border border-border/60 rounded-2xl p-7 sticky top-24 space-y-6 shadow-xl shadow-black/20">
                <div className="hidden lg:block">
                  <p className="text-[11px] text-muted-foreground font-body uppercase tracking-[0.2em] mb-2">
                    {property.type === 'sale' ? t('props.filter.sale') : t('props.filter.rent')}
                  </p>
                  <p className="text-3xl text-primary font-display tabular-nums leading-tight">
                    {formatPrice(property.price, property.type)}
                  </p>
                </div>

                <div className="hidden lg:block h-px bg-border/50" />

                <div className="space-y-2.5">
                  <Button asChild size="lg" className="w-full font-body h-12">
                    <Link to={buildContactUrl('visit')}>{t('detail.cta.visit')}</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="w-full font-body h-12">
                    <Link to={buildContactUrl('info')}>{t('detail.cta.info')}</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="w-full border-[hsl(142,70%,45%)]/60 text-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,45%)] hover:text-white hover:border-[hsl(142,70%,45%)] font-body h-12"
                  >
                    <a href={buildWhatsappUrl('info')} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-[18px] w-[18px] mr-2" strokeWidth={1.75} />
                      WhatsApp
                    </a>
                  </Button>
                </div>

                <div className="pt-4 border-t border-border/50 space-y-2">
                  <div className="flex items-center justify-center gap-2 text-xs text-foreground/70 font-body">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary/70" strokeWidth={2} />
                    {t('detail.cta.response')}
                  </div>
                  <p className="text-[11px] text-muted-foreground font-body text-center leading-relaxed">
                    {t('detail.cta.advisor')}
                  </p>
                </div>
              </div>
            </aside>
          </div>

          {/* Similar */}
          {similar.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-28 pt-16 border-t border-border/40"
            >
              <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="h-px w-10 bg-primary/40" />
                    <span className="font-body text-[11px] uppercase tracking-[0.25em] text-primary/80">
                      {t('detail.similar')}
                    </span>
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl text-foreground tracking-tight">
                    {t('detail.similar')}
                  </h2>
                  <p className="text-muted-foreground font-body text-sm mt-2 max-w-md">
                    {t('detail.similar.subtitle')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {similar.map(p => (
                  <Link key={p.id} to={`/properties/${p.id}`} className="group">
                    <article className="bg-card border border-border/60 rounded-xl overflow-hidden hover:border-primary/40 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5">
                      <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.title_pt}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[900ms] ease-out"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <ImageOff className="h-8 w-8" strokeWidth={1.5} />
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <p className="text-[10px] text-primary/80 font-body uppercase tracking-[0.2em] mb-2">
                          {p.type === 'sale' ? t('props.filter.sale') : t('props.filter.rent')}
                        </p>
                        <h3 className="font-display text-base font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                          {p.title_pt}
                        </h3>
                        <p className="text-xs text-muted-foreground font-body mb-3">
                          {p.location}, {p.island}
                        </p>
                        <p className="text-base text-primary font-display tabular-nums">
                          {formatPrice(p.price, p.type)}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default PropertyDetail;
