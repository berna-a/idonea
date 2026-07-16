import { MessageCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { islandsContent } from '@/lib/islandsContent';

const PHONE = '2389808947';

/**
 * Floating WhatsApp button, present on every page. The pre-filled message adapts
 * to the current route so each tap arrives as a warm, contextual lead. On the
 * property detail page the sticky bar already carries the specific property, so
 * here we keep a lighter, page-level message.
 */
const WhatsAppButton = () => {
  const { pathname } = useLocation();
  const { lang } = useLanguage();
  const pt = lang === 'pt';

  const greeting = pt ? 'Olá IDÓNEA,' : 'Hello IDÓNEA,';

  const context = (): string => {
    if (pathname.startsWith('/sell')) {
      return pt
        ? 'gostaria de pedir uma avaliação gratuita do meu imóvel.'
        : 'I would like to request a free valuation of my property.';
    }
    if (pathname.startsWith('/diaspora')) {
      return pt
        ? 'vivo no estrangeiro e gostaria de comprar em Cabo Verde.'
        : 'I live abroad and would like to buy in Cape Verde.';
    }
    if (pathname.startsWith('/investment')) {
      return pt
        ? 'tenho interesse em investir em Cabo Verde.'
        : 'I am interested in investing in Cape Verde.';
    }
    if (pathname.startsWith('/ilhas/')) {
      const slug = pathname.split('/')[2];
      const island = islandsContent.find((i) => i.slug === slug);
      const name = island ? (pt ? island.dbName : island.name_en) : (pt ? 'Cabo Verde' : 'Cape Verde');
      return pt
        ? `tenho interesse em imóveis em ${name}.`
        : `I am interested in properties in ${name}.`;
    }
    if (pathname.startsWith('/properties')) {
      return pt
        ? 'tenho interesse num imóvel do vosso portefólio.'
        : 'I am interested in a property from your portfolio.';
    }
    return pt
      ? 'gostaria de mais informações.'
      : 'I would like more information.';
  };

  const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(`${greeting} ${context()}`)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-white rounded-full p-4 shadow-lg transition-transform hover:scale-110"
      aria-label="WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
};

export default WhatsAppButton;
