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
    'nav.about': 'Sobre',
    'nav.contact': 'Contacto',
    'nav.investment': 'Investimento',

    // Hero
    'hero.headline': 'Encontre o imóvel certo em Cabo Verde.',
    'hero.subheadline': 'Mediação imobiliária com transparência. Sem surpresas. Sem promessas vazias.',
    'hero.cta': 'Ver Imóveis',
    'hero.contact': 'Fale Connosco',

    // Pain Points
    'pain.title': 'Sabemos o que o preocupa.',
    'pain.1.title': 'Falta de transparência',
    'pain.1.desc': 'Muitas imobiliárias escondem informações. Nós mostramos tudo desde o início. Preços reais, condições claras.',
    'pain.2.title': 'Processos complicados',
    'pain.2.desc': 'Burocracia e papelada podem atrasar semanas. Tratamos de toda a documentação por si.',
    'pain.3.title': 'Desconfiança no mercado',
    'pain.3.desc': 'Ouvir histórias de negócios que correram mal é comum. Trabalhamos com contratos claros e acompanhamento completo.',

    // How it works
    'how.title': 'Como funciona.',
    'how.1.title': 'Diga-nos o que procura',
    'how.1.desc': 'Partilhe as suas preferências: localização, tipo de imóvel, orçamento.',
    'how.2.title': 'Apresentamos opções reais',
    'how.2.desc': 'Selecionamos imóveis que correspondem ao que precisa. Sem perder o seu tempo.',
    'how.3.title': 'Visitamos juntos',
    'how.3.desc': 'Acompanhamos cada visita. Esclarecemos todas as suas dúvidas no local.',
    'how.4.title': 'Fechamos o negócio',
    'how.4.desc': 'Tratamos de toda a documentação legal até à escritura. Acompanhamento do início ao fim.',

    // Investment
    'invest.title': 'Invista no seu país.',
    'invest.subtitle': 'Para emigrantes cabo-verdianos e investidores internacionais.',
    'invest.desc': 'Está na diáspora e quer investir em Cabo Verde? Ajudamos a encontrar o imóvel certo, tratamos de tudo à distância. Também apoiamos investidores estrangeiros que procuram oportunidades no mercado imobiliário cabo-verdiano.',
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
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.investment': 'Investment',

    // Hero
    'hero.headline': 'Find the right property in Cape Verde.',
    'hero.subheadline': 'Real estate mediation with transparency. No surprises. No empty promises.',
    'hero.cta': 'View Properties',
    'hero.contact': 'Contact Us',

    // Pain Points
    'pain.title': 'We understand your concerns.',
    'pain.1.title': 'Lack of transparency',
    'pain.1.desc': 'Many agencies hide information. We show everything upfront. Real prices, clear conditions.',
    'pain.2.title': 'Complicated processes',
    'pain.2.desc': 'Bureaucracy and paperwork can delay things for weeks. We handle all documentation for you.',
    'pain.3.title': 'Market distrust',
    'pain.3.desc': 'Stories of deals gone wrong are common. We work with clear contracts and full support throughout.',

    // How it works
    'how.title': 'How it works.',
    'how.1.title': 'Tell us what you need',
    'how.1.desc': 'Share your preferences: location, property type, budget.',
    'how.2.title': 'We present real options',
    'how.2.desc': 'We select properties that match your needs. No time wasted.',
    'how.3.title': 'We visit together',
    'how.3.desc': 'We accompany every visit. We answer all your questions on site.',
    'how.4.title': 'We close the deal',
    'how.4.desc': 'We handle all legal documentation through to completion. Support from start to finish.',

    // Investment
    'invest.title': 'Invest in Cape Verde.',
    'invest.subtitle': 'For international investors seeking opportunity.',
    'invest.desc': 'Cape Verde offers a stable economy, growing tourism, and a favourable investment climate. We help international buyers navigate the local market, find the right property, and handle everything remotely.',
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
