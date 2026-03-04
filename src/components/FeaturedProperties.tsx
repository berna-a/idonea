import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { sampleProperties } from '@/lib/sampleProperties';
import { Button } from '@/components/ui/button';
import { Bed, Bath, Maximize } from 'lucide-react';
import { motion } from 'framer-motion';

const FeaturedProperties = () => {
  const { lang, t } = useLanguage();
  const featured = sampleProperties.filter(p => p.featured).slice(0, 4);

  const formatPrice = (price: number, type: 'sale' | 'rent') => {
    const formatted = new Intl.NumberFormat('pt-CV', { style: 'currency', currency: 'CVE', minimumFractionDigits: 0 }).format(price);
    return type === 'rent' ? `${formatted}${t('props.price.month')}` : formatted;
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            {t('featured.title')}
          </h2>
          <Button asChild variant="outline" className="font-body border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link to="/properties">{t('featured.viewAll')}</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((prop, i) => (
            <motion.div
              key={prop.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link to={`/properties/${prop.id}`} className="group block bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={prop.image}
                    alt={lang === 'pt' ? prop.title_pt : prop.title_en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs text-primary font-body uppercase tracking-wider mb-1">
                    {prop.type === 'sale' ? t('props.filter.sale') : t('props.filter.rent')} · {prop.island}
                  </p>
                  <h3 className="font-display text-base font-semibold text-foreground mb-2 line-clamp-1">
                    {lang === 'pt' ? prop.title_pt : prop.title_en}
                  </h3>
                  <p className="text-lg font-semibold text-primary font-body mb-3">
                    {formatPrice(prop.price, prop.type)}
                  </p>
                  <div className="flex gap-4 text-xs text-muted-foreground font-body">
                    {prop.bedrooms > 0 && (
                      <span className="flex items-center gap-1"><Bed className="h-3.5 w-3.5" />{prop.bedrooms}</span>
                    )}
                    {prop.bathrooms > 0 && (
                      <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" />{prop.bathrooms}</span>
                    )}
                    <span className="flex items-center gap-1"><Maximize className="h-3.5 w-3.5" />{prop.area}m²</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
