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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bed, Bath, Maximize, MapPin, MessageCircle, ArrowRight, ImageOff } from 'lucide-react';
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

  const filtered = properties.filter(p => {
    if (typeFilter !== 'all' && p.type !== typeFilter) return false;
    if (islandFilter !== 'all' && p.island !== islandFilter) return false;
    if (propTypeFilter !== 'all' && p.property_type !== propTypeFilter) return false;
    if (goalFilter !== 'all' && !p.tags.includes(goalFilter as PropertyTag)) return false;
    return true;
  });

  const formatPrice = (price: number, type: 'sale' | 'rent') => {
    const formatted = new Intl.NumberFormat('pt-CV', { style: 'currency', currency: 'CVE', minimumFractionDigits: 0 }).format(price);
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

  const hasActiveFilters = typeFilter !== 'all' || islandFilter !== 'all' || propTypeFilter !== 'all' || goalFilter !== 'all';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-20">
        {/* Hero */}
        <section className="py-16 md:py-20 border-b border-border/40">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
                {t('props.hero.title')}
              </h1>
              <p className="text-muted-foreground font-body max-w-xl mx-auto leading-relaxed">
                {t('props.hero.subtitle')}
              </p>
            </motion.div>
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-6xl pt-10">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-wrap items-center gap-3 mb-10"
          >
            <Select value={islandFilter} onValueChange={setIslandFilter}>
              <SelectTrigger className="w-[150px] bg-card border-border font-body text-sm">
                <SelectValue placeholder={t('props.filter.island')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('props.filter.island')}</SelectItem>
                {islands.map(island => (
                  <SelectItem key={island} value={island}>{island}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px] bg-card border-border font-body text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('props.filter.business')}</SelectItem>
                <SelectItem value="sale">{t('props.filter.sale')}</SelectItem>
                <SelectItem value="rent">{t('props.filter.rent')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={propTypeFilter} onValueChange={setPropTypeFilter}>
              <SelectTrigger className="w-[150px] bg-card border-border font-body text-sm">
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
              <SelectTrigger className="w-[165px] bg-card border-border font-body text-sm">
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
                className="text-xs text-muted-foreground hover:text-primary transition-colors font-body underline underline-offset-4"
              >
                {t('props.filter.clear')}
              </button>
            )}

            <span className="ml-auto text-xs text-muted-foreground font-body">
              {filtered.length} {t('props.filter.results')}
            </span>
          </motion.div>

          {/* Loading */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="bg-card border border-border rounded-xl overflow-hidden">
                  <Skeleton className="aspect-[16/10] w-full" />
                  <div className="p-6 space-y-3">
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
            <div className="text-center py-20">
              <p className="text-muted-foreground font-body mb-6">
                Não foi possível carregar os imóveis. Por favor, tente novamente.
              </p>
            </div>
          )}

          {/* Empty / Grid */}
          {!isLoading && !isError && (
            filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground font-body mb-6">{t('props.noResults')}</p>
                <Button asChild variant="outline" className="font-body">
                  <Link to="/contact">{t('nav.cta')}</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filtered.map((prop, i) => {
                  const mainTag = prop.tags[0];
                  return (
                    <motion.div
                      key={prop.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.4 }}
                    >
                      <Link
                        to={`/properties/${prop.id}`}
                        className="group block bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-colors"
                      >
                        <div className="aspect-[16/10] overflow-hidden relative bg-muted">
                          {prop.image ? (
                            <img
                              src={prop.image}
                              alt={prop.title_pt}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              <ImageOff className="h-10 w-10" strokeWidth={1.5} />
                            </div>
                          )}
                          {mainTag && (
                            <span className="absolute top-4 left-4 text-[11px] font-body px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm text-primary border border-primary/20">
                              {tagLabel(mainTag)}
                            </span>
                          )}
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground font-body mb-2">
                            <MapPin className="h-3.5 w-3.5 text-primary/70" />
                            {prop.location}, {prop.island}
                            <span className="text-border">·</span>
                            <span className="uppercase tracking-wider text-primary/70">
                              {prop.type === 'sale' ? t('props.filter.sale') : t('props.filter.rent')}
                            </span>
                          </div>
                          <h3 className="font-display text-lg font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                            {prop.title_pt}
                          </h3>
                          <p className="text-xs text-muted-foreground/60 font-body mb-3">{prop.ref}</p>
                          <div className="flex items-end justify-between">
                            <p className="text-xl font-bold text-primary font-display">
                              {formatPrice(prop.price, prop.type)}
                            </p>
                            <div className="flex gap-3 text-xs text-muted-foreground font-body">
                              {prop.bedrooms > 0 && (
                                <span className="flex items-center gap-1"><Bed className="h-3.5 w-3.5" />{prop.bedrooms}</span>
                              )}
                              {prop.bathrooms > 0 && (
                                <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" />{prop.bathrooms}</span>
                              )}
                              {prop.area > 0 && (
                                <span className="flex items-center gap-1"><Maximize className="h-3.5 w-3.5" />{prop.area}m²</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )
          )}

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-20 text-center bg-secondary border border-border/40 rounded-xl p-10"
          >
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-3">
              {t('props.cta.title')}
            </h2>
            <p className="text-muted-foreground font-body text-sm mb-8 max-w-md mx-auto">
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
