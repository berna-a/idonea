import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/lib/i18n';
import { islands, PropertyTag } from '@/lib/sampleProperties';
import { fetchActiveProperties } from '@/lib/propertyAdapter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Bed,
  Bath,
  Maximize,
  MapPin,
  MessageCircle,
  ArrowRight,
  ImageOff,
  SlidersHorizontal,
} from 'lucide-react';
import { motion } from 'framer-motion';

const Properties = () => {
  const { t } = useLanguage();
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [islandFilter, setIslandFilter] = useState<string>('all');
  const [propTypeFilter, setPropTypeFilter] = useState<string>('all');
  const [goalFilter, setGoalFilter] = useState<string>('all');

  const { data: properties = [], isLoading, isError } = useQuery({
    queryKey: ['public-properties'],
    queryFn: fetchActiveProperties,
  });

  const filtered = properties.filter((p) => {
    if (typeFilter !== 'all' && p.type !== typeFilter) return false;
    if (islandFilter !== 'all' && p.island !== islandFilter) return false;
    if (propTypeFilter !== 'all' && p.property_type !== propTypeFilter) return false;
    if (goalFilter !== 'all' && !p.tags.includes(goalFilter as PropertyTag)) return false;
    return true;
  });

  const formatPrice = (price: number, type: 'sale' | 'rent') => {
    const formatted = new Intl.NumberFormat('pt-CV', {
      style: 'currency',
      currency: 'CVE',
      minimumFractionDigits: 0,
    }).format(price);
    return type === 'rent' ? `${formatted}${t('props.price.month')}` : formatted;
  };

  const tagLabel = (tag: PropertyTag) => t(`detail.tag.${tag}`);
  const whatsappUrl = `https://wa.me/${encodeURIComponent('2389808947')}`;

  const clearFilters = () => {
    setTypeFilter('all');
    setIslandFilter('all');
    setPropTypeFilter('all');
    setGoalFilter('all');
  };

  const hasActiveFilters =
    typeFilter !== 'all' ||
    islandFilter !== 'all' ||
    propTypeFilter !== 'all' ||
    goalFilter !== 'all';

  const resultsLabel =
    filtered.length === 1
      ? t('props.filter.results.one')
      : t('props.filter.results');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-24">
        {/* Editorial Hero */}
        <section className="relative py-20 md:py-28 border-b border-border/40 overflow-hidden">
          {/* subtle gold radial accent */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              background:
                'radial-gradient(ellipse at 50% 0%, hsl(var(--primary)) 0%, transparent 60%)',
            }}
            aria-hidden
          />
          <div className="relative container mx-auto px-4 max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-[11px] tracking-[0.25em] uppercase text-primary/80 font-body mb-6">
                {t('props.hero.eyebrow')}
              </p>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6 leading-[1.05] tracking-tight">
                {t('props.hero.title')}
              </h1>
              <div className="mx-auto h-px w-16 bg-primary/40 mb-6" />
              <p className="text-muted-foreground font-body text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                {t('props.hero.subtitle')}
              </p>
            </motion.div>
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-6xl pt-12 md:pt-16">
          {/* Filters bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground/80 font-body">
                <SlidersHorizontal className="h-3.5 w-3.5 text-primary/70" />
                {t('props.filter.label')}
              </div>
              <span className="text-xs text-muted-foreground font-body tabular-nums">
                <span className="text-foreground font-medium">{filtered.length}</span>{' '}
                {resultsLabel}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 md:gap-3 p-3 md:p-4 rounded-xl border border-border/60 bg-card/40 backdrop-blur-sm">
              <Select value={islandFilter} onValueChange={setIslandFilter}>
                <SelectTrigger className="w-full sm:w-[160px] h-10 bg-transparent border-border/60 font-body text-sm">
                  <SelectValue placeholder={t('props.filter.island')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('props.filter.island')}</SelectItem>
                  {islands.map((island) => (
                    <SelectItem key={island} value={island}>
                      {island}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[150px] h-10 bg-transparent border-border/60 font-body text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('props.filter.business')}</SelectItem>
                  <SelectItem value="sale">{t('props.filter.sale')}</SelectItem>
                  <SelectItem value="rent">{t('props.filter.rent')}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={propTypeFilter} onValueChange={setPropTypeFilter}>
                <SelectTrigger className="w-full sm:w-[160px] h-10 bg-transparent border-border/60 font-body text-sm">
                  <SelectValue placeholder={t('props.filter.type')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('props.filter.type')}</SelectItem>
                  <SelectItem value="apartment">{t('props.type.apartment')}</SelectItem>
                  <SelectItem value="house">{t('props.type.house')}</SelectItem>
                  <SelectItem value="land">{t('props.type.land')}</SelectItem>
                  <SelectItem value="commercial">{t('props.type.commercial')}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={goalFilter} onValueChange={setGoalFilter}>
                <SelectTrigger className="w-full sm:w-[170px] h-10 bg-transparent border-border/60 font-body text-sm">
                  <SelectValue placeholder={t('props.filter.goal')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('props.filter.goal')}</SelectItem>
                  <SelectItem value="personal">{t('detail.tag.personal')}</SelectItem>
                  <SelectItem value="investment">{t('detail.tag.investment')}</SelectItem>
                  <SelectItem value="second-home">{t('detail.tag.second-home')}</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="ml-auto text-xs text-muted-foreground hover:text-primary transition-colors font-body underline underline-offset-4 decoration-border hover:decoration-primary px-2"
                >
                  {t('props.filter.clear')}
                </button>
              )}
            </div>
          </motion.div>

          {/* Loading */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-card/40 border border-border/60 rounded-xl overflow-hidden"
                >
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="p-7 space-y-3">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-6 w-28" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {!isLoading && isError && (
            <div className="text-center py-24 border border-border/40 rounded-xl bg-card/30">
              <p className="text-muted-foreground font-body mb-6">
                Não foi possível carregar os imóveis. Por favor, tente novamente.
              </p>
            </div>
          )}

          {/* Empty / Grid */}
          {!isLoading && !isError &&
            (filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20 md:py-24 px-6 border border-border/40 rounded-xl bg-card/30"
              >
                <div className="mx-auto h-px w-12 bg-primary/40 mb-6" />
                <h3 className="font-display text-xl md:text-2xl text-foreground mb-3">
                  {t('props.noResults.title')}
                </h3>
                <p className="text-muted-foreground font-body text-sm max-w-md mx-auto mb-8 leading-relaxed">
                  {t('props.noResults')}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="font-body"
                    >
                      {t('props.filter.clear')}
                    </Button>
                  )}
                  <Button asChild className="font-body">
                    <Link to="/contact">
                      {t('props.noResults.cta')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                {filtered.map((prop, i) => {
                  const mainTag = prop.tags[0];
                  return (
                    <motion.div
                      key={prop.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                    >
                      <Link
                        to={`/properties/${prop.id}`}
                        className="group block"
                      >
                        {/* Image */}
                        <div className="aspect-[4/3] overflow-hidden relative bg-muted rounded-lg mb-5">
                          {prop.image ? (
                            <img
                              src={prop.image}
                              alt={prop.title_pt}
                              className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[900ms] ease-out"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              <ImageOff className="h-10 w-10" strokeWidth={1.5} />
                            </div>
                          )}
                          {/* subtle bottom gradient for legibility on hover */}
                          <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                          {mainTag && (
                            <span className="absolute top-4 left-4 text-[10px] tracking-[0.18em] uppercase font-body px-3 py-1.5 rounded-full bg-background/85 backdrop-blur-md text-primary border border-primary/25">
                              {tagLabel(mainTag)}
                            </span>
                          )}

                          <span className="absolute top-4 right-4 text-[10px] tracking-[0.18em] uppercase font-body px-2.5 py-1 rounded-full bg-background/70 backdrop-blur-md text-muted-foreground border border-border/40">
                            {prop.type === 'sale'
                              ? t('props.filter.sale')
                              : t('props.filter.rent')}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="px-1">
                          <div className="flex items-center gap-1.5 text-[11px] tracking-[0.15em] uppercase text-muted-foreground/70 font-body mb-3">
                            <MapPin className="h-3 w-3 text-primary/70" />
                            <span>{prop.location}</span>
                            <span className="text-border">·</span>
                            <span>{prop.island}</span>
                          </div>

                          <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors duration-300">
                            {prop.title_pt}
                          </h3>

                          <p className="text-[11px] text-muted-foreground/50 font-body tracking-wider mb-5">
                            REF · {prop.ref}
                          </p>

                          <div className="flex items-end justify-between pt-5 border-t border-border/40">
                            <p className="text-xl md:text-2xl font-bold text-primary font-display tabular-nums">
                              {formatPrice(prop.price, prop.type)}
                            </p>
                            <div className="flex gap-4 text-xs text-muted-foreground font-body pb-1">
                              {prop.bedrooms > 0 && (
                                <span className="flex items-center gap-1.5">
                                  <Bed className="h-3.5 w-3.5 text-primary/60" />
                                  {prop.bedrooms}
                                </span>
                              )}
                              {prop.bathrooms > 0 && (
                                <span className="flex items-center gap-1.5">
                                  <Bath className="h-3.5 w-3.5 text-primary/60" />
                                  {prop.bathrooms}
                                </span>
                              )}
                              {prop.area > 0 && (
                                <span className="flex items-center gap-1.5">
                                  <Maximize className="h-3.5 w-3.5 text-primary/60" />
                                  {prop.area}m²
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            ))}

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-24 md:mt-32 text-center bg-secondary/60 border border-border/50 rounded-2xl p-10 md:p-14"
          >
            <div className="mx-auto h-px w-12 bg-primary/40 mb-6" />
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              {t('props.cta.title')}
            </h2>
            <p className="text-muted-foreground font-body text-sm md:text-base mb-10 max-w-lg mx-auto leading-relaxed">
              {t('props.cta.subtitle')}
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

export default Properties;
