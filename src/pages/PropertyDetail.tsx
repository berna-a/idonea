import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { sampleProperties, PropertyTag } from '@/lib/sampleProperties';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Bed, Bath, Maximize, MapPin, MessageCircle,
  ChevronLeft, ChevronRight, Star, Users, Shield, FileCheck, Handshake, CheckCircle2,
  CalendarCheck, Phone,
} from 'lucide-react';

const PropertyDetail = () => {
  const { id } = useParams();
  const { lang, t } = useLanguage();
  const property = sampleProperties.find(p => p.id === id);
  const [activeImage, setActiveImage] = useState(0);

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 container mx-auto px-4 text-center">
          <p className="text-muted-foreground font-body">Property not found.</p>
          <Button asChild variant="outline" className="mt-4 font-body">
            <Link to="/properties">{t('props.back')}</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const title = lang === 'pt' ? property.title_pt : property.title_en;
  const editorial = lang === 'pt' ? property.editorial_pt : property.editorial_en;
  const idealFor = lang === 'pt' ? property.idealFor_pt : property.idealFor_en;

  const formatPrice = (price: number, type: 'sale' | 'rent') => {
    const formatted = new Intl.NumberFormat('pt-CV', { style: 'currency', currency: 'CVE', minimumFractionDigits: 0 }).format(price);
    return type === 'rent' ? `${formatted}${t('props.price.month')}` : formatted;
  };

  const tagLabel = (tag: PropertyTag) => t(`detail.tag.${tag}`);

  const whatsappMsg = encodeURIComponent(lang === 'pt'
    ? `Olá, tenho interesse no imóvel ${property.ref}: ${title}`
    : `Hello, I'm interested in property ${property.ref}: ${title}`);
  const whatsappUrl = `https://wa.me/2389808947?text=${whatsappMsg}`;

  const images = property.images.length > 0 ? property.images : [property.image];

  const prevImage = () => setActiveImage(i => (i === 0 ? images.length - 1 : i - 1));
  const nextImage = () => setActiveImage(i => (i === images.length - 1 ? 0 : i + 1));

  const similar = sampleProperties
    .filter(p => p.id !== property.id && (p.island === property.island || p.type === property.type))
    .slice(0, 3);

  const processSteps = [
    { icon: Phone, key: 'detail.process.1' },
    { icon: CalendarCheck, key: 'detail.process.2' },
    { icon: FileCheck, key: 'detail.process.3' },
    { icon: Handshake, key: 'detail.process.4' },
    { icon: Shield, key: 'detail.process.5' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-20">
        <div className="container mx-auto px-4">
          {/* Back */}
          <Link to="/properties" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-body mb-6 text-sm">
            <ArrowLeft className="h-4 w-4" /> {t('props.back')}
          </Link>

          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative rounded-xl overflow-hidden mb-10 aspect-[16/9] max-h-[560px] bg-card"
          >
            <img
              src={images[activeImage]}
              alt={title}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/70 backdrop-blur-sm flex items-center justify-center hover:bg-background/90 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-foreground" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/70 backdrop-blur-sm flex items-center justify-center hover:bg-background/90 transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-foreground" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-2 h-2 rounded-full transition-colors ${i === activeImage ? 'bg-primary' : 'bg-foreground/30'}`}
                    />
                  ))}
                </div>
              </>
            )}
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="absolute bottom-4 right-4 hidden md:flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-12 rounded-md overflow-hidden border-2 transition-colors ${i === activeImage ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-xs text-primary font-body uppercase tracking-widest">
                    {property.type === 'sale' ? t('props.filter.sale') : t('props.filter.rent')}
                  </span>
                  <span className="text-xs text-muted-foreground font-body">·</span>
                  <span className="text-xs text-muted-foreground font-body">{property.ref}</span>
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">{title}</h1>
                <div className="flex items-center gap-2 text-muted-foreground font-body text-sm mb-4">
                  <MapPin className="h-4 w-4 text-primary" />
                  {property.location}, {property.island}
                </div>
                <p className="text-2xl font-bold text-primary font-display lg:hidden mb-4">
                  {formatPrice(property.price, property.type)}
                </p>
                {/* Tags */}
                {property.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {property.tags.map(tag => (
                      <span key={tag} className="text-xs font-body px-3 py-1 rounded-full border border-primary/30 text-primary/80">
                        {tagLabel(tag)}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Editorial Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <p className="text-muted-foreground font-body leading-relaxed text-[15px]">{editorial}</p>
              </motion.div>

              {/* Ideal For */}
              {idealFor.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                >
                  <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    {t('detail.idealFor')}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {idealFor.map((item, i) => (
                      <span key={i} className="text-sm font-body px-4 py-2 rounded-lg bg-card border border-border text-muted-foreground">
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Specs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">{t('props.specs')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {property.bedrooms > 0 && (
                    <div className="bg-card border border-border rounded-lg p-4 text-center">
                      <Bed className="h-5 w-5 text-primary mx-auto mb-2" />
                      <p className="text-lg font-semibold text-foreground font-body">{property.bedrooms}</p>
                      <p className="text-xs text-muted-foreground font-body">{t('featured.bedrooms')}</p>
                    </div>
                  )}
                  {property.bathrooms > 0 && (
                    <div className="bg-card border border-border rounded-lg p-4 text-center">
                      <Bath className="h-5 w-5 text-primary mx-auto mb-2" />
                      <p className="text-lg font-semibold text-foreground font-body">{property.bathrooms}</p>
                      <p className="text-xs text-muted-foreground font-body">{t('featured.bathrooms')}</p>
                    </div>
                  )}
                  <div className="bg-card border border-border rounded-lg p-4 text-center">
                    <Maximize className="h-5 w-5 text-primary mx-auto mb-2" />
                    <p className="text-lg font-semibold text-foreground font-body">{property.area}m²</p>
                    <p className="text-xs text-muted-foreground font-body">{t('detail.area')}</p>
                  </div>
                </div>

                {/* Extra features */}
                {property.features.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {property.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                        <CheckCircle2 className="h-4 w-4 text-primary/70 flex-shrink-0" />
                        {lang === 'pt' ? f.value_pt : f.value_en}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Highlights */}
              {property.highlights.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                >
                  <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    {t('detail.highlights')}
                  </h2>
                  <div className="space-y-4">
                    {property.highlights.map((h, i) => (
                      <div key={i} className="bg-card/50 border border-border/60 rounded-lg p-5">
                        <h3 className="font-display text-sm font-semibold text-foreground mb-1">
                          {lang === 'pt' ? h.title_pt : h.title_en}
                        </h3>
                        <p className="text-sm text-muted-foreground font-body">
                          {lang === 'pt' ? h.desc_pt : h.desc_en}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Process / Trust */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-secondary border border-border/40 rounded-xl p-8"
              >
                <h2 className="font-display text-lg font-semibold text-foreground mb-2">{t('detail.process.title')}</h2>
                <p className="text-sm text-muted-foreground font-body mb-6">{t('detail.process.subtitle')}</p>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                  {processSteps.map((step, i) => (
                    <div key={i} className="text-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                        <step.icon className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-xs text-muted-foreground font-body leading-tight">{t(step.key)}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-card border border-border rounded-xl p-6 sticky top-24 space-y-5">
                <p className="text-2xl font-bold text-primary font-display hidden lg:block">
                  {formatPrice(property.price, property.type)}
                </p>
                <div className="space-y-3">
                  <Button asChild size="lg" className="w-full font-body">
                    <Link to="/contact">{t('detail.cta.visit')}</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="w-full font-body">
                    <Link to="/contact">{t('detail.cta.info')}</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="w-full border-[hsl(142,70%,45%)] text-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,45%)] hover:text-white font-body"
                  >
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      WhatsApp
                    </a>
                  </Button>
                </div>
                <div className="pt-3 border-t border-border/50">
                  <p className="text-xs text-muted-foreground font-body text-center">
                    {t('detail.cta.response')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Properties */}
          {similar.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-20"
            >
              <h2 className="font-display text-2xl font-bold text-foreground mb-8">{t('detail.similar')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {similar.map(p => {
                  const pTitle = lang === 'pt' ? p.title_pt : p.title_en;
                  return (
                    <Link key={p.id} to={`/properties/${p.id}`} className="group">
                      <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-colors">
                        <div className="aspect-[4/3] overflow-hidden">
                          <img src={p.image} alt={pTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        </div>
                        <div className="p-5">
                          <p className="text-xs text-primary/70 font-body uppercase tracking-wider mb-1">
                            {p.type === 'sale' ? t('props.filter.sale') : t('props.filter.rent')}
                          </p>
                          <h3 className="font-display text-sm font-semibold text-foreground mb-1 line-clamp-1">{pTitle}</h3>
                          <p className="text-xs text-muted-foreground font-body mb-2">{p.location}, {p.island}</p>
                          <p className="text-sm font-bold text-primary font-display">
                            {formatPrice(p.price, p.type)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default PropertyDetail;
