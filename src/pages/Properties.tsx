import { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useLanguage } from '@/lib/i18n';
import { islands, PropertyTag, Property } from '@/lib/sampleProperties';
import Header from '@/components/Header';
import Seo from '@/components/Seo';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import PropertiesMap from '@/components/PropertiesMap';
import PropertyListCard from '@/components/properties/PropertyListCard';
import PropertiesFilterBar, { SortOption } from '@/components/properties/PropertiesFilterBar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, MessageCircle, List, MapIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RENT_PRICE_BOUNDS: [number, number] = [0, 1_000_000];
const SALE_PRICE_BOUNDS: [number, number] = [0, 150_000_000];
const EMPTY_PROPERTIES: Property[] = [];
const DESKTOP_BREAKPOINT = 1024; // matches Tailwind `lg`

/** Whether the split-panel (map always visible) layout should be used. */
const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= DESKTOP_BREAKPOINT);
  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    const onChange = () => setIsDesktop(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);
  return isDesktop;
};

const Properties = () => {
  const { t } = useLanguage();
  const isDesktop = useIsDesktop();
  const [searchParams, setSearchParams] = useSearchParams();
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const [typeFilter, setTypeFilter] = useState<string>(() => {
    const v = searchParams.get('type');
    return v === 'sale' || v === 'rent' ? v : 'all';
  });
  const [islandFilter, setIslandFilter] = useState<string>(() => {
    const v = searchParams.get('island');
    return v && islands.includes(v) ? v : 'all';
  });
  const [propTypeFilter, setPropTypeFilter] = useState<string>(() => searchParams.get('propertyType') ?? 'all');
  const [goalFilter, setGoalFilter] = useState<string>(() => searchParams.get('goal') ?? 'all');
  const [sort, setSort] = useState<SortOption>(() => {
    const v = searchParams.get('sort');
    return v === 'price-asc' || v === 'price-desc' ? v : 'newest';
  });

  const priceBounds = typeFilter === 'rent' ? RENT_PRICE_BOUNDS : SALE_PRICE_BOUNDS;
  const [priceRange, setPriceRange] = useState<[number, number]>(() => {
    const min = Number(searchParams.get('minPrice'));
    const max = Number(searchParams.get('maxPrice'));
    return [
      min > 0 ? min : priceBounds[0],
      max > 0 ? max : priceBounds[1],
    ];
  });

  // Keep the URL shareable — only write params that differ from defaults.
  useEffect(() => {
    const params = new URLSearchParams();
    if (islandFilter !== 'all') params.set('island', islandFilter);
    if (typeFilter !== 'all') params.set('type', typeFilter);
    if (propTypeFilter !== 'all') params.set('propertyType', propTypeFilter);
    if (goalFilter !== 'all') params.set('goal', goalFilter);
    if (priceRange[0] !== priceBounds[0]) params.set('minPrice', String(priceRange[0]));
    if (priceRange[1] !== priceBounds[1]) params.set('maxPrice', String(priceRange[1]));
    if (sort !== 'newest') params.set('sort', sort);
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [islandFilter, typeFilter, propTypeFilter, goalFilter, priceRange, sort]);

  const result = useQuery(api.properties.listActive, {});
  const properties = (result as Property[] | undefined) ?? EMPTY_PROPERTIES;
  const isLoading = result === undefined;

  const filtered = useMemo(() => {
    const list = properties.filter((p) => {
      if (typeFilter !== 'all' && p.type !== typeFilter) return false;
      if (islandFilter !== 'all' && p.island !== islandFilter) return false;
      if (propTypeFilter !== 'all' && p.property_type !== propTypeFilter) return false;
      if (goalFilter !== 'all' && !p.tags.includes(goalFilter as PropertyTag)) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      return true;
    });
    if (sort === 'price-asc') return [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') return [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [properties, typeFilter, islandFilter, propTypeFilter, goalFilter, priceRange, sort]);

  const clearFilters = () => {
    setTypeFilter('all');
    setIslandFilter('all');
    setPropTypeFilter('all');
    setGoalFilter('all');
    setPriceRange(priceBounds);
    setSort('newest');
  };

  const hasActiveFilters =
    typeFilter !== 'all' || islandFilter !== 'all' || propTypeFilter !== 'all' || goalFilter !== 'all' ||
    priceRange[0] !== priceBounds[0] || priceRange[1] !== priceBounds[1];

  const whatsappUrl = `https://wa.me/${encodeURIComponent('2389808947')}`;

  const handlePinClick = (id: string) => {
    setMobileView('list');
    cardRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const listContent = (
    <>
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="bg-card/40 border border-border/60 rounded-xl overflow-hidden">
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

      {!isLoading && (filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 px-6 border border-border/40 rounded-xl bg-card/30"
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
              <Button variant="outline" onClick={clearFilters} className="font-body">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {filtered.map((prop, i) => (
            <PropertyListCard
              key={prop.id}
              prop={prop}
              index={i}
              isHovered={hoveredId === prop.id}
              onHover={setHoveredId}
              ref={(el) => { cardRefs.current[prop.id] = el; }}
            />
          ))}
        </div>
      ))}
    </>
  );

  const mapContent = (
    <PropertiesMap
      properties={filtered}
      hoveredId={hoveredId}
      onPinHover={setHoveredId}
      onPinClick={handlePinClick}
    />
  );

  return (
    <div className="min-h-screen bg-background">
      <Seo title={t('seo.properties.title')} description={t('seo.properties.description')} />
      <Header />
      <main className="pt-20 pb-24">
        {/* Editorial Hero */}
        <section className="relative py-14 md:py-20 border-b border-border/40 overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, hsl(var(--primary)) 0%, transparent 60%)' }}
            aria-hidden
          />
          <div className="relative container mx-auto px-4 max-w-3xl text-center">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85 }}>
              <p className="text-eyebrow mb-5">
                {t('props.hero.eyebrow')}
              </p>
              <h1 className="font-display text-3xl md:text-5xl text-foreground mb-5 leading-[1.05] tracking-tight">
                {t('props.hero.title')}
              </h1>
              <p className="text-muted-foreground font-body text-base max-w-2xl mx-auto leading-relaxed">
                {t('props.hero.subtitle')}
              </p>
            </motion.div>
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-[1600px] pt-10">
          <PropertiesFilterBar
            islandFilter={islandFilter} setIslandFilter={setIslandFilter}
            typeFilter={typeFilter} setTypeFilter={setTypeFilter}
            propTypeFilter={propTypeFilter} setPropTypeFilter={setPropTypeFilter}
            goalFilter={goalFilter} setGoalFilter={setGoalFilter}
            priceRange={priceRange} setPriceRange={setPriceRange}
            priceBounds={priceBounds}
            sort={sort} setSort={setSort}
            resultsCount={filtered.length}
            hasActiveFilters={hasActiveFilters}
            onClear={clearFilters}
          />

          {isDesktop ? (
            /* Desktop: permanent split panel — list scrolls, map stays sticky */
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_560px] gap-10 items-start">
              <div>{listContent}</div>
              <div className="sticky top-24 h-[calc(100vh-140px)] rounded-xl overflow-hidden">
                {mapContent}
              </div>
            </div>
          ) : (
            <>
              {/* Mobile: pill toggle + single animated panel (only one map instance mounted) */}
              <div className="flex items-center justify-center mb-6">
                <div className="inline-flex rounded-full border border-border/60 bg-card/60 p-1">
                  {(['list', 'map'] as const).map((view) => (
                    <button
                      key={view}
                      onClick={() => setMobileView(view)}
                      className={`relative flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-body transition-colors ${
                        mobileView === view ? 'text-primary-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {mobileView === view && (
                        <motion.span layoutId="mobile-view-pill" className="absolute inset-0 bg-primary rounded-full" transition={{ type: 'spring', duration: 0.4 }} />
                      )}
                      <span className="relative flex items-center gap-1.5">
                        {view === 'list' ? <List className="h-3.5 w-3.5" /> : <MapIcon className="h-3.5 w-3.5" />}
                        {view === 'list' ? t('props.view.list') : t('props.view.map')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence initial={false}>
                {mobileView === 'list' ? (
                  <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                    {listContent}
                  </motion.div>
                ) : (
                  <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="h-[70vh] rounded-xl overflow-hidden">
                    {mapContent}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75 }}
            className="mt-20 md:mt-28 text-center bg-secondary/60 border border-border/50 rounded-2xl p-10 md:p-14"
          >
            <div className="mx-auto h-px w-12 bg-primary/40 mb-6" />
            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4">
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
