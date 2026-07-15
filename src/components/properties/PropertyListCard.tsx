import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Maximize, MapPin, ImageOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n';
import { useCurrency } from '@/lib/currency';
import type { Property, PropertyTag } from '@/lib/sampleProperties';

interface PropertyListCardProps {
  prop: Property;
  index: number;
  isHovered: boolean;
  onHover: (id: string | null) => void;
}

const PropertyListCard = forwardRef<HTMLDivElement, PropertyListCardProps>(
  ({ prop, index, isHovered, onHover }, ref) => {
    const { t } = useLanguage();
    const { formatPrice: formatCurrency } = useCurrency();
    const formatPrice = (price: number, type: 'sale' | 'rent') =>
      formatCurrency(price, type === 'rent' ? t('props.price.month') : '');
    const tagLabel = (tag: PropertyTag) => t(`detail.tag.${tag}`);
    const mainTag = prop.tags[0];

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: Math.min(index, 8) * 0.05, duration: 0.6 }}
        onMouseEnter={() => onHover(prop.id)}
        onMouseLeave={() => onHover(null)}
        className={`rounded-xl transition-shadow duration-300 ${isHovered ? 'ring-1 ring-primary/50' : ''}`}
      >
        <Link to={`/properties/${prop.id}`} className="group block">
          {/* Image */}
          <div className="aspect-[4/3] overflow-hidden relative bg-muted rounded-lg mb-5">
            {prop.image ? (
              <img
                src={prop.image}
                alt={prop.title_pt}
                className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[900ms] ease-out"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <ImageOff className="h-10 w-10" strokeWidth={1.5} />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {mainTag && (
              <span className="absolute top-4 left-4 text-[10px] tracking-[0.18em] uppercase font-body px-3 py-1.5 rounded-full bg-background/85 backdrop-blur-md text-primary border border-primary/25">
                {tagLabel(mainTag)}
              </span>
            )}

            <span className="absolute top-4 right-4 text-[10px] tracking-[0.18em] uppercase font-body px-2.5 py-1 rounded-full bg-background/70 backdrop-blur-md text-muted-foreground border border-border/40">
              {prop.type === 'sale' ? t('props.filter.sale') : t('props.filter.rent')}
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

            <div className="flex items-end justify-between pt-5 border-t border-border/40 transition-transform duration-700 ease-out group-hover:-translate-y-1">
              <p className="text-xl md:text-2xl text-primary font-display tabular-nums">
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
  }
);

PropertyListCard.displayName = 'PropertyListCard';

export default PropertyListCard;
