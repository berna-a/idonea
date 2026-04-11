import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { sampleProperties } from '@/lib/sampleProperties';
import { Button } from '@/components/ui/button';
import { Bed, Bath, Maximize, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const FeaturedProperties = () => {
  const { lang, t } = useLanguage();
  const featured = sampleProperties.filter(p => p.featured).slice(0, 3);

  const formatPrice = (price: number, type: 'sale' | 'rent') => {
    const formatted = new Intl.NumberFormat('pt-CV', { style: 'currency', currency: 'CVE', minimumFractionDigits: 0 }).format(price);
    return type === 'rent' ? `${formatted}${t('props.price.month')}` : formatted;
  };

  const getTag = (prop: typeof sampleProperties[0]) => {
    if (prop.type === 'rent') return lang === 'pt' ? 'Arrendamento' : 'Rental';
    if (prop.property_type === 'land') return lang === 'pt' ? 'Investimento' : 'Investment';
    if (prop.price >= 15000000) return lang === 'pt' ? 'Seleção IDÓNEA' : 'IDÓNEA Selection';
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
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5">
            {t('featured.title')}
          </h2>
          <p className="text-muted-foreground font-body text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {t('featured.subtitle')}
          </p>
        </motion.div>

        {/* Property Cards – 3 columns */}
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
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={prop.image}
                    alt={lang === 'pt' ? prop.title_pt : prop.title_en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  {/* Tag */}
                  <span className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm text-[11px] text-primary font-body font-medium uppercase tracking-wider px-3 py-1.5 rounded-full border border-primary/20">
                    {getTag(prop)}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 md:p-6">
                  {/* Location */}
                  <p className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-2">
                    {prop.location}, {prop.island}
                  </p>

                  {/* Title */}
                  <h3 className="font-display text-lg font-semibold text-foreground mb-3 line-clamp-1 group-hover:text-primary transition-colors duration-300">
                    {lang === 'pt' ? prop.title_pt : prop.title_en}
                  </h3>

                  {/* Price */}
                  <p className="text-xl font-semibold text-primary font-display mb-4">
                    {formatPrice(prop.price, prop.type)}
                  </p>

                  {/* Specs */}
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
                    <span className="flex items-center gap-1.5">
                      <Maximize className="h-3.5 w-3.5" strokeWidth={1.5} />
                      {prop.area}m²
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

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
