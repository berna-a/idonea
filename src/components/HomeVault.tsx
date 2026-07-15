import { Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { motion } from 'framer-motion';
import { api } from '../../convex/_generated/api';
import { useLanguage } from '@/lib/i18n';
import { useCurrency } from '@/lib/currency';
import type { Property } from '@/lib/sampleProperties';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, ImageOff } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1] as const;
const EMPTY: Property[] = [];

/**
 * "The Vault" — editorial bento with a curtain-reveal anchor + skew "warp"
 * hover cards, migrated from /preview-radical (approved 15-07-2026) to
 * replace the FeaturedProperties grid on the real homepage.
 */
const HomeVault = () => {
  const { lang, t } = useLanguage();
  const { formatPrice } = useCurrency();
  const result = useQuery(api.properties.listFeatured, { limit: 4 });
  const featured = ((result as Property[] | undefined) ?? EMPTY);
  const isLoading = result === undefined;

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85 }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-5">
            {t('featured.title')}
          </h2>
          <p className="text-muted-foreground font-body text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {t('featured.subtitle')}
          </p>
        </motion.div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-14">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-card border border-border/50 rounded-xl overflow-hidden">
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-5 md:p-6 space-y-3">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && featured.length === 0 && (
          <div className="text-center py-12 mb-14">
            <p className="text-muted-foreground font-body text-sm">
              {lang === 'pt' ? 'Novos imóveis em curadoria. Volte em breve.' : 'New properties under curation. Check back soon.'}
            </p>
          </div>
        )}

        {!isLoading && featured.length > 0 && (
          <div className="flex flex-col gap-4 lg:grid lg:grid-cols-6 lg:auto-rows-[16vw] lg:gap-4 mb-14">
            {/* Anchor */}
            <Link
              to={`/properties/${featured[0].id}`}
              className="group relative block overflow-hidden bg-card rounded-xl aspect-[4/3] lg:aspect-auto lg:rounded-2xl"
              style={{ gridColumn: '1 / 5', gridRow: '1 / 3' }}
            >
              <motion.div
                initial={{ clipPath: 'inset(0 0 100% 0)' }}
                whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: EASE }}
                className="absolute inset-0"
              >
                {featured[0].image ? (
                  <img
                    src={featured[0].image}
                    alt={featured[0].title_pt}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[1200ms] ease-out"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <ImageOff className="h-10 w-10" strokeWidth={1.25} />
                  </div>
                )}
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <p className="text-[10px] md:text-xs tracking-[0.25em] uppercase text-primary font-body mb-3">
                  {featured[0].location}, {featured[0].island}
                </p>
                <h3 className="font-display text-[7vw] md:text-[2.6vw] leading-[0.98] text-foreground tracking-tight mb-4 -ml-0.5">
                  {featured[0].title_pt}
                </h3>
                <p className="text-lg md:text-2xl text-primary font-display tabular-nums">
                  {formatPrice(featured[0].price, featured[0].type === 'rent' ? t('props.price.month') : '')}
                </p>
              </div>
            </Link>

            {/* Secondary cells */}
            {featured.slice(1).map((prop, i) => {
              const gridStyle =
                i === 2
                  ? { gridColumn: '1 / 7', gridRow: '3 / 4' }
                  : { gridColumn: '5 / 7', gridRow: `${i + 1} / ${i + 2}` };
              return (
                <motion.div
                  key={prop.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.08 }}
                  style={gridStyle}
                >
                  <Link
                    to={`/properties/${prop.id}`}
                    className="group relative block overflow-hidden bg-card rounded-xl aspect-[16/10] lg:aspect-auto lg:h-full lg:rounded-2xl w-full"
                  >
                    <motion.div
                      whileHover={{ scale: 1.06, skewX: -2 }}
                      transition={{ duration: 0.6, ease: EASE }}
                      className="absolute inset-0"
                    >
                      {prop.image ? (
                        <img
                          src={prop.image}
                          alt={prop.title_pt}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <ImageOff className="h-8 w-8" strokeWidth={1.25} />
                        </div>
                      )}
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 bg-gradient-to-tr from-primary/50 via-primary/10 to-transparent mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
                      <p className="text-[10px] tracking-[0.2em] uppercase text-primary font-body mb-1.5">
                        {prop.location}, {prop.island}
                      </p>
                      <h4 className="font-display text-lg md:text-xl text-foreground mb-1 line-clamp-1">
                        {prop.title_pt}
                      </h4>
                      <p className="text-sm text-primary font-display tabular-nums">
                        {formatPrice(prop.price, prop.type === 'rent' ? t('props.price.month') : '')}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75 }}
          className="text-center"
        >
          <Button
            asChild
            variant="outline"
            className="font-body border-primary/60 text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 text-sm tracking-wide"
          >
            <Link to="/properties" className="inline-flex items-center gap-2">
              {t('featured.viewAll')}
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeVault;
