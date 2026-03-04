import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { sampleProperties, islands } from '@/lib/sampleProperties';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bed, Bath, Maximize } from 'lucide-react';
import { motion } from 'framer-motion';

const Properties = () => {
  const { lang, t } = useLanguage();
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [islandFilter, setIslandFilter] = useState<string>('all');
  const [propTypeFilter, setPropTypeFilter] = useState<string>('all');

  const filtered = sampleProperties.filter(p => {
    if (typeFilter !== 'all' && p.type !== typeFilter) return false;
    if (islandFilter !== 'all' && p.island !== islandFilter) return false;
    if (propTypeFilter !== 'all' && p.property_type !== propTypeFilter) return false;
    return true;
  });

  const formatPrice = (price: number, type: 'sale' | 'rent') => {
    const formatted = new Intl.NumberFormat('pt-CV', { style: 'currency', currency: 'CVE', minimumFractionDigits: 0 }).format(price);
    return type === 'rent' ? `${formatted}${t('props.price.month')}` : formatted;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
            {t('props.title')}
          </h1>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-10">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[160px] bg-card border-border font-body">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('props.filter.all')}</SelectItem>
                <SelectItem value="sale">{t('props.filter.sale')}</SelectItem>
                <SelectItem value="rent">{t('props.filter.rent')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={islandFilter} onValueChange={setIslandFilter}>
              <SelectTrigger className="w-[160px] bg-card border-border font-body">
                <SelectValue placeholder={t('props.filter.island')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('props.filter.all')}</SelectItem>
                {islands.map(island => (
                  <SelectItem key={island} value={island}>{island}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={propTypeFilter} onValueChange={setPropTypeFilter}>
              <SelectTrigger className="w-[160px] bg-card border-border font-body">
                <SelectValue placeholder={t('props.filter.type')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('props.filter.all')}</SelectItem>
                <SelectItem value="apartment">{t('props.type.apartment')}</SelectItem>
                <SelectItem value="house">{t('props.type.house')}</SelectItem>
                <SelectItem value="land">{t('props.type.land')}</SelectItem>
                <SelectItem value="commercial">{t('props.type.commercial')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <p className="text-muted-foreground font-body text-center py-12">{t('props.noResults')}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((prop, i) => (
                <motion.div
                  key={prop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
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
                    <div className="p-5">
                      <p className="text-xs text-primary font-body uppercase tracking-wider mb-1">
                        {prop.type === 'sale' ? t('props.filter.sale') : t('props.filter.rent')} · {prop.island}
                      </p>
                      <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                        {lang === 'pt' ? prop.title_pt : prop.title_en}
                      </h3>
                      <p className="text-xl font-bold text-primary font-body mb-3">
                        {formatPrice(prop.price, prop.type)}
                      </p>
                      <div className="flex gap-4 text-sm text-muted-foreground font-body">
                        {prop.bedrooms > 0 && (
                          <span className="flex items-center gap-1"><Bed className="h-4 w-4" />{prop.bedrooms}</span>
                        )}
                        {prop.bathrooms > 0 && (
                          <span className="flex items-center gap-1"><Bath className="h-4 w-4" />{prop.bathrooms}</span>
                        )}
                        <span className="flex items-center gap-1"><Maximize className="h-4 w-4" />{prop.area}m²</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Properties;
