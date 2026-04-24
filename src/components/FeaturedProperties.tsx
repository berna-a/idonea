import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/lib/i18n';
import { fetchFeaturedProperties } from '@/lib/propertyAdapter';
import type { Property } from '@/lib/sampleProperties';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Bed, Bath, Maximize, ArrowRight, ImageOff } from 'lucide-react';
import { motion } from 'framer-motion';

const FeaturedProperties = () => {
  const { lang, t } = useLanguage();

  const { data: featured = [], isLoading, isError } = useQuery({
    queryKey: ['featured-properties'],
    queryFn: () => fetchFeaturedProperties(3),
  });

  const formatPrice = (price: number, type: 'sale' | 'rent') => {
    const formatted = new Intl.NumberFormat('pt-CV', { style: 'currency', currency: 'CVE', minimumFractionDigits: 0 }).format(price);
    return type === 'rent' ? `${formatted}${t('props.price.month')}` : formatted;
  };

  const getTag = (prop: Property) => {
    if (prop.type === 'rent') return lang === 'pt' ? 'Arrendamento' : 'Rental';
    if (prop.property_type === 'land') return lang === 'pt' ? 'Investimento' : 'Investment';
    if (prop.tags.includes('selection')) return lang === 'pt' ? 'Seleção IDÓNEA' : 'IDÓNEA Selection';
    return lang === 'pt' ? 'Uso Próprio' : 'Own Use';
  };

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-5">
            {t('featured.title')}
          </h2>
          <p className="text-muted-foreground font-body text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {t('featured.subtitle')}
          </p>
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-14">
            {[0, 1, 2].map(i => (
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

        {/* Empty / error fallback */}
        {!isLoading && featured.length === 0 && (
          <div className="text-center py-12 mb-14">
            <p className="text-muted-foreground font-body text-sm">
              {isError
                ? (lang === 'pt' ? 'Não foi possível carregar o portefólio. Tente mais tarde.' : 'Could not load the portfolio. Please try again later.')
                : (lang === 'pt' ? 'Novos imóveis em curadoria. Volte em breve.' : 'New properties under curation. Check back soon.')}
            </p>
          </div>
        )}

        {/* Property Cards */}
        {!isLoading && featured.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-14">
            {featured.map((prop, i) => (
              <motion.div
                key={prop.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
              >
                <Link
                  to={`/properties/${prop.id}`}
                  className="group block bg-card border border-border/50 rounded-xl overflow-hidden hover:border-primary/40 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {prop.image ? (
                      <img
                        src={prop.image}
                        alt={prop.title_pt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <ImageOff className="h-8 w-8" strokeWidth={1.5} />
                      </div>
                    )}
                    <span className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm text-[11px] text-primary font-body font-medium uppercase tracking-wider px-3 py-1.5 rounded-full border border-primary/20">
                      {getTag(prop)}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5 md:p-6">
                    <p className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-2">
                      {prop.location}, {prop.island}
                    </p>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-3 line-clamp-1 group-hover:text-primary transition-colors duration-300">
                      {prop.title_pt}
                    </h3>
                    <p className="text-xl font-semibold text-primary font-display mb-4">
                      {formatPrice(prop.price, prop.type)}
                    </p>
                    <div className="flex items-center gap-5 text-xs text-muted-foreground font-body pt-4 border-t border-border/50">
                      {prop.bedrooms > 0 && (
                        <span className="flex items-center gap-1.5">
                          <Bed className="h-3.5 w-3.5" strokeWidth={1.5} />
                          {prop.bedrooms}
                        </span>
                      )}
                      {prop.bathrooms > 0 && (
                        <span className="flex items-center gap-1.5">
                          <Bath className="h-3.5 w-3.5" strokeWidth={1.5} />
                          {prop.bathrooms}
                        </span>
                      )}
                      {prop.area > 0 && (
                        <span className="flex items-center gap-1.5">
                          <Maximize className="h-3.5 w-3.5" strokeWidth={1.5} />
                          {prop.area}m²
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
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

export default FeaturedProperties;
