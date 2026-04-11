import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'pt' | 'en';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  pt: {
    // Nav
    'nav.home': 'Início',
    'nav.properties': 'Imóveis',
    'nav.investment': 'Investimento',
    'nav.diaspora': 'Para a Diáspora',
    'nav.sell': 'Vender o seu Imóvel',
    'nav.about': 'Sobre a IDÓNEA',
    'nav.contact': 'Contacto',
    'nav.cta': 'Agendar Consultoria',

    // Hero
    'hero.headline': 'O seu imóvel em Cabo Verde, com quem trata de tudo.',
    'hero.subheadline': 'Mediação imobiliária com rigor, dedicação e acompanhamento completo do início ao fim.',
    'hero.cta': 'Ver Imóveis',
    'hero.contact': 'Fale Connosco',

    // Pain Points
    'pain.title': 'O que nos distingue.',
    'pain.1.title': 'Clareza total',
    'pain.1.desc': 'Preços reais, condições claras e toda a informação disponível desde o primeiro contacto.',
    'pain.2.title': 'Processo simples',
    'pain.2.desc': 'Tratamos de toda a documentação e burocracia. O seu único trabalho é escolher o imóvel certo.',
    'pain.3.title': 'Acompanhamento dedicado',
    'pain.3.desc': 'Cada cliente tem atenção personalizada. Estamos consigo em cada passo, até à escritura.',

    // How it works
    'how.title': 'Como funciona.',
    'how.1.title': 'Diga-nos o que procura',
    'how.1.desc': 'Partilhe as suas preferências: localização, tipo de imóvel, orçamento.',
    'how.2.title': 'Apresentamos as opções certas',
    'how.2.desc': 'Selecionamos imóveis que correspondem genuinamente ao que precisa.',
    'how.3.title': 'Visitamos juntos',
    'how.3.desc': 'Acompanhamos cada visita e esclarecemos todas as suas dúvidas no local.',
    'how.4.title': 'Fechamos o negócio',
    'how.4.desc': 'Tratamos de toda a documentação legal até à escritura. Acompanhamento completo, do início ao fim.',

    // Investment
    'invest.title': 'Invista no seu país.',
    'invest.subtitle': 'Para emigrantes cabo-verdianos e investidores internacionais.',
    'invest.desc': 'Está na diáspora e quer construir algo em Cabo Verde? Encontramos o imóvel certo e tratamos de tudo à distância, com o mesmo cuidado que teria se estivesse cá. Apoiamos também investidores internacionais que procuram oportunidades no mercado cabo-verdiano.',
    'invest.cta': 'Saber Mais',

    // Featured
    'featured.title': 'Imóveis em Destaque',
    'featured.viewAll': 'Ver Todos',
    'featured.bedrooms': 'quartos',
    'featured.bathrooms': 'casas de banho',

    // Social Proof
    'social.title': 'O que dizem os nossos clientes.',

    // Contact
    'contact.title': 'Entre em contacto.',
    'contact.subtitle': 'Resposta em menos de 24 horas.',
    'contact.name': 'Nome',
    'contact.email': 'Email',
    'contact.phone': 'Telefone',
    'contact.interest': 'Interesse',
    'contact.interest.buy': 'Comprar',
    'contact.interest.rent': 'Arrendar',
    'contact.interest.invest': 'Investir',
    'contact.interest.sell': 'Vender',
    'contact.message': 'Mensagem',
    'contact.send': 'Enviar Mensagem',
    'contact.whatsapp': 'Falar por WhatsApp',
    'contact.or': 'ou',

    // Footer
    'footer.rights': 'Todos os direitos reservados.',
    'footer.company': 'Idônea Mediação Imobiliária',

    // Properties page
    'props.title': 'Imóveis Disponíveis',
    'props.filter.all': 'Todos',
    'props.filter.sale': 'Venda',
    'props.filter.rent': 'Arrendamento',
    'props.filter.island': 'Ilha',
    'props.filter.type': 'Tipo',
    'props.filter.price': 'Preço',
    'props.type.apartment': 'Apartamento',
    'props.type.house': 'Moradia',
    'props.type.land': 'Terreno',
    'props.type.commercial': 'Comercial',
    'props.contact': 'Contactar',
    'props.details': 'Ver Detalhes',
    'props.back': 'Voltar',
    'props.specs': 'Características',
    'props.location': 'Localização',
    'props.description': 'Descrição',
    'props.price.month': '/mês',
    'props.noResults': 'Nenhum imóvel encontrado.',
  },
  en: {
    // Nav
    'nav.home': 'Home',
    'nav.properties': 'Properties',
    'nav.investment': 'Investment',
    'nav.diaspora': 'For the Diaspora',
    'nav.sell': 'Sell Your Property',
    'nav.about': 'About IDÓNEA',
    'nav.contact': 'Contact',
    'nav.cta': 'Book a Consultation',

    // Hero
    'hero.headline': 'Your property in Cape Verde, handled with care.',
    'hero.subheadline': 'Real estate mediation with rigour, dedication and full support from start to finish.',
    'hero.cta': 'View Properties',
    'hero.contact': 'Contact Us',

    // Pain Points
    'pain.title': 'What sets us apart.',
    'pain.1.title': 'Complete clarity',
    'pain.1.desc': 'Real prices, clear conditions and all the information you need from the very first contact.',
    'pain.2.title': 'Simple process',
    'pain.2.desc': 'We handle all documentation and paperwork. Your only job is to choose the right property.',
    'pain.3.title': 'Dedicated support',
    'pain.3.desc': 'Every client receives personalised attention. We are with you at every step, through to completion.',

    // How it works
    'how.title': 'How it works.',
    'how.1.title': 'Tell us what you need',
    'how.1.desc': 'Share your preferences: location, property type, budget.',
    'how.2.title': 'We present the right options',
    'how.2.desc': 'We select properties that genuinely match what you are looking for.',
    'how.3.title': 'We visit together',
    'how.3.desc': 'We accompany every visit and answer all your questions on site.',
    'how.4.title': 'We close the deal',
    'how.4.desc': 'We handle all legal documentation through to completion. Full support, start to finish.',

    // Investment
    'invest.title': 'Invest in Cape Verde.',
    'invest.subtitle': 'A growing market with real opportunity.',
    'invest.desc': 'Cape Verde offers a stable economy, growing tourism and a favourable investment climate. We help international buyers navigate the local market, find the right property and handle everything remotely.',
    'invest.cta': 'Learn More',

    // Featured
    'featured.title': 'Featured Properties',
    'featured.viewAll': 'View All',
    'featured.bedrooms': 'bedrooms',
    'featured.bathrooms': 'bathrooms',

    // Social Proof
    'social.title': 'What our clients say.',

    // Contact
    'contact.title': 'Get in touch.',
    'contact.subtitle': 'Response within 24 hours.',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.interest': 'Interest',
    'contact.interest.buy': 'Buy',
    'contact.interest.rent': 'Rent',
    'contact.interest.invest': 'Invest',
    'contact.interest.sell': 'Sell',
    'contact.message': 'Message',
    'contact.send': 'Send Message',
    'contact.whatsapp': 'Chat on WhatsApp',
    'contact.or': 'or',

    // Footer
    'footer.rights': 'All rights reserved.',
    'footer.company': 'Idônea Mediação Imobiliária',

    // Properties page
    'props.title': 'Available Properties',
    'props.filter.all': 'All',
    'props.filter.sale': 'For Sale',
    'props.filter.rent': 'For Rent',
    'props.filter.island': 'Island',
    'props.filter.type': 'Type',
    'props.filter.price': 'Price',
    'props.type.apartment': 'Apartment',
    'props.type.house': 'House',
    'props.type.land': 'Land',
    'props.type.commercial': 'Commercial',
    'props.contact': 'Contact',
    'props.details': 'View Details',
    'props.back': 'Back',
    'props.specs': 'Specifications',
    'props.location': 'Location',
    'props.description': 'Description',
    'props.price.month': '/month',
    'props.noResults': 'No properties found.',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>('pt');

  const t = (key: string): string => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
