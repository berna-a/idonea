import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { sampleProperties } from '@/lib/sampleProperties';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bed, Bath, Maximize, MapPin, MessageCircle } from 'lucide-react';

const PropertyDetail = () => {
  const { id } = useParams();
  const { lang, t } = useLanguage();
  const property = sampleProperties.find(p => p.id === id);

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
  const description = lang === 'pt' ? property.description_pt : property.description_en;

  const formatPrice = (price: number, type: 'sale' | 'rent') => {
    const formatted = new Intl.NumberFormat('pt-CV', { style: 'currency', currency: 'CVE', minimumFractionDigits: 0 }).format(price);
    return type === 'rent' ? `${formatted}${t('props.price.month')}` : formatted;
  };

  const whatsappMsg = encodeURIComponent(`Olá, tenho interesse no imóvel: ${title}`);
  const whatsappUrl = `https://wa.me/2389808947?text=${whatsappMsg}`;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <Link to="/properties" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-body mb-6">
            <ArrowLeft className="h-4 w-4" /> {t('props.back')}
          </Link>

          {/* Image */}
          <div className="rounded-lg overflow-hidden mb-8 aspect-[16/9] max-h-[500px]">
            <img src={property.image} alt={title} className="w-full h-full object-cover" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2">
              <p className="text-sm text-primary font-body uppercase tracking-wider mb-2">
                {property.type === 'sale' ? t('props.filter.sale') : t('props.filter.rent')}
              </p>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">{title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground font-body mb-6">
                <MapPin className="h-4 w-4 text-primary" />
                {property.location}, {property.island}
              </div>

              <h2 className="font-display text-xl font-semibold text-foreground mb-3">{t('props.description')}</h2>
              <p className="text-muted-foreground font-body leading-relaxed mb-8">{description}</p>

              <h2 className="font-display text-xl font-semibold text-foreground mb-4">{t('props.specs')}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                  <p className="text-xs text-muted-foreground font-body">Área</p>
                </div>
              </div>
            </div>

            {/* Sidebar CTA */}
            <div>
              <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                <p className="text-2xl font-bold text-primary font-body mb-6">
                  {formatPrice(property.price, property.type)}
                </p>
                <div className="space-y-3">
                  <Button asChild size="lg" className="w-full font-body">
                    <a href="#contacto">{t('props.contact')}</a>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="w-full border-[hsl(142,70%,45%)] text-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,45%)] hover:text-white font-body">
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default PropertyDetail;
