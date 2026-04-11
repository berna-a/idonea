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
    'hero.eyebrow': 'Advisory Imobiliário em Cabo Verde',
    'hero.headline': 'Comprar, vender ou investir com total confiança.',
    'hero.subheadline': 'Curadoria imobiliária com acompanhamento dedicado em cada passo. Do primeiro contacto à escritura.',
    'hero.cta.properties': 'Ver Imóveis',
    'hero.cta.consultation': 'Agendar Consultoria',
    'hero.cta.sell': 'Quero Vender',

    // Differentiation
    'diff.title': 'Porque a IDÓNEA.',
    'diff.subtitle': 'Uma abordagem diferente à mediação imobiliária em Cabo Verde. Seletiva, transparente e dedicada.',
    'diff.1.title': 'Confiança',
    'diff.1.desc': 'Relações construídas com rigor, transparência e compromisso real com cada cliente.',
    'diff.2.title': 'Curadoria',
    'diff.2.desc': 'Selecionamos cada imóvel com critério. Apresentamos apenas o que genuinamente corresponde.',
    'diff.3.title': 'Processo Claro',
    'diff.3.desc': 'Cada etapa é definida, comunicada e conduzida com método. Do início à escritura.',
    'diff.4.title': 'Acompanhamento Completo',
    'diff.4.desc': 'Estamos presentes em cada momento. Documentação, visitas, negociação e fecho.',

    // How it works
    'how.title': 'O nosso método.',
    'how.subtitle': 'Um processo estruturado, transparente e acompanhado em cada etapa.',
    'how.1.title': 'Entendemos o objetivo',
    'how.1.desc': 'Ouvimos com atenção o que procura, o contexto e as suas prioridades.',
    'how.2.title': 'Selecionamos as oportunidades certas',
    'how.2.desc': 'Identificamos imóveis com critério, alinhados com o seu perfil e expectativas.',
    'how.3.title': 'Organizamos visitas ou video-tours',
    'how.3.desc': 'Presencialmente ou à distância, acompanhamos cada visita com detalhe.',
    'how.4.title': 'Conduzimos negociação e documentação',
    'how.4.desc': 'Gerimos cada etapa burocrática e legal com rigor e método.',
    'how.5.title': 'Fechamos com segurança',
    'how.5.desc': 'Garantimos um fecho tranquilo, com acompanhamento até à escritura.',

    // Investment
    'invest.title': 'Invista no seu país.',
    'invest.subtitle': 'Para emigrantes cabo-verdianos e investidores internacionais.',
    'invest.desc': 'Está na diáspora e quer construir algo em Cabo Verde? Encontramos o imóvel certo e tratamos de tudo à distância, com o mesmo cuidado que teria se estivesse cá. Apoiamos também investidores internacionais que procuram oportunidades no mercado cabo-verdiano.',
    'invest.cta': 'Saber Mais',

    // Featured
    'featured.title': 'Portefólio Selecionado',
    'featured.subtitle': 'Cada imóvel no nosso portefólio é escolhido com critério. Apresentamos apenas oportunidades que merecem a sua atenção.',
    'featured.viewAll': 'Ver Todos os Imóveis',
    'featured.bedrooms': 'quartos',
    'featured.bathrooms': 'casas de banho',

    // Diaspora
    'diaspora.eyebrow': 'Para a Diáspora',
    'diaspora.title': 'Comprar em Cabo Verde, mesmo à distância.',
    'diaspora.subtitle': 'Investir no seu país a partir do estrangeiro exige mais do que encontrar um bom imóvel. Exige processo, clareza e alguém local em quem confiar. Estamos cá por si.',
    'diaspora.point.1.title': 'Acompanhamento à distância',
    'diaspora.point.1.desc': 'Gerimos cada etapa no terreno, com comunicação regular e transparente.',
    'diaspora.point.2.title': 'Video-tours e shortlist personalizada',
    'diaspora.point.2.desc': 'Enviamos visitas em vídeo e uma seleção criteriosa, alinhada com o seu perfil.',
    'diaspora.point.3.title': 'Apoio documental completo',
    'diaspora.point.3.desc': 'Tratamos da documentação e articulamos com parceiros locais de confiança.',
    'diaspora.point.4.title': 'Comunicação clara até ao fecho',
    'diaspora.point.4.desc': 'Informamos em cada momento. Sem surpresas, sem dúvidas pendentes.',
    'diaspora.cta': 'Comprar à Distância',
    'diaspora.image.caption': 'O seu investimento em Cabo Verde, com acompanhamento real.',

    'social.title': 'O que dizem os nossos clientes.',
    'social.subtitle': 'Experiências reais de quem confiou na IDÓNEA para comprar, vender ou investir em Cabo Verde.',

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

    // Closing CTA
    'closing.title': 'Pronto para dar o próximo passo?',
    'closing.subtitle': 'Comprar, vender ou investir em Cabo Verde com mais clareza, critério e confiança. Estamos disponíveis para o acompanhar.',
    'closing.cta.consultation': 'Agendar Consultoria',
    'closing.cta.whatsapp': 'Falar no WhatsApp',
    'closing.cta.properties': 'Ver Imóveis',

    // Footer
    'footer.rights': 'Todos os direitos reservados.',
    'footer.company': 'Idônea Mediação Imobiliária',

    // Properties page
    'props.title': 'Imóveis Disponíveis',
    'props.hero.title': 'Portefólio Selecionado',
    'props.hero.subtitle': 'Cada imóvel no nosso portefólio é escolhido com critério. Apresentamos apenas oportunidades que merecem a sua atenção.',
    'props.filter.all': 'Todos',
    'props.filter.sale': 'Venda',
    'props.filter.rent': 'Arrendamento',
    'props.filter.island': 'Ilha',
    'props.filter.type': 'Tipologia',
    'props.filter.price': 'Preço',
    'props.filter.business': 'Negócio',
    'props.filter.goal': 'Objetivo',
    'props.filter.clear': 'Limpar filtros',
    'props.filter.results': 'imóveis',
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
    'props.noResults': 'Nenhum imóvel encontrado com os filtros selecionados.',
    'props.cta.title': 'Não encontrou o imóvel ideal?',
    'props.cta.subtitle': 'Conte-nos o que procura. Identificamos oportunidades alinhadas com o seu perfil, mesmo antes de chegarem ao portefólio.',

    // Property detail
    'detail.area': 'Área',
    'detail.idealFor': 'Ideal para',
    'detail.highlights': 'Porque este imóvel se destaca',
    'detail.similar': 'Imóveis Semelhantes',
    'detail.tag.selection': 'Seleção IDÓNEA',
    'detail.tag.investment': 'Investimento',
    'detail.tag.personal': 'Uso Próprio',
    'detail.tag.second-home': 'Segunda Residência',
    'detail.tag.rental': 'Arrendamento',
    'detail.cta.visit': 'Agendar Visita',
    'detail.cta.info': 'Pedir Informação',
    'detail.cta.response': 'Resposta em menos de 24 horas.',
    'detail.process.title': 'Acompanhamento IDÓNEA',
    'detail.process.subtitle': 'Do primeiro contacto à escritura, estamos consigo.',
    'detail.process.1': 'Esclarecimento inicial',
    'detail.process.2': 'Visita ou video-tour',
    'detail.process.3': 'Apoio documental',
    'detail.process.4': 'Negociação',
    'detail.process.5': 'Fecho seguro',
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
    'hero.eyebrow': 'Real Estate Advisory in Cape Verde',
    'hero.headline': 'Buy, sell or invest with complete confidence.',
    'hero.subheadline': 'Curated real estate with dedicated support at every step. From first contact to completion.',
    'hero.cta.properties': 'View Properties',
    'hero.cta.consultation': 'Book a Consultation',
    'hero.cta.sell': 'Sell My Property',

    // Differentiation
    'diff.title': 'Why IDÓNEA.',
    'diff.subtitle': 'A different approach to real estate advisory in Cape Verde. Selective, transparent and dedicated.',
    'diff.1.title': 'Trust',
    'diff.1.desc': 'Relationships built on rigour, transparency and a genuine commitment to every client.',
    'diff.2.title': 'Curation',
    'diff.2.desc': 'We select each property with care. We only present what truly fits your needs.',
    'diff.3.title': 'Clear Process',
    'diff.3.desc': 'Every step is defined, communicated and managed with method. From start to completion.',
    'diff.4.title': 'Complete Support',
    'diff.4.desc': 'We are present at every stage. Documentation, viewings, negotiation and closing.',

    // How it works
    'how.title': 'Our method.',
    'how.subtitle': 'A structured, transparent process with support at every stage.',
    'how.1.title': 'We understand your goal',
    'how.1.desc': 'We listen carefully to what you need, your context and priorities.',
    'how.2.title': 'We select the right opportunities',
    'how.2.desc': 'We identify properties with care, aligned with your profile and expectations.',
    'how.3.title': 'We arrange viewings or video tours',
    'how.3.desc': 'In person or remotely, we accompany every viewing with attention to detail.',
    'how.4.title': 'We manage negotiation and documentation',
    'how.4.desc': 'We handle every bureaucratic and legal step with rigour and method.',
    'how.5.title': 'We close with confidence',
    'how.5.desc': 'We ensure a smooth completion, with support through to the final deed.',

    // Investment
    'invest.title': 'Invest in Cape Verde.',
    'invest.subtitle': 'A growing market with real opportunity.',
    'invest.desc': 'Cape Verde offers a stable economy, growing tourism and a favourable investment climate. We help international buyers navigate the local market, find the right property and handle everything remotely.',
    'invest.cta': 'Learn More',

    // Featured
    'featured.title': 'Selected Portfolio',
    'featured.subtitle': 'Every property in our portfolio is chosen with care. We present only opportunities that deserve your attention.',
    'featured.viewAll': 'View All Properties',
    'featured.bedrooms': 'bedrooms',
    'featured.bathrooms': 'bathrooms',

    // Diaspora
    'diaspora.eyebrow': 'For the Diaspora',
    'diaspora.title': 'Buy in Cape Verde, from anywhere.',
    'diaspora.subtitle': 'Investing in your country from abroad requires more than finding the right property. It requires process, clarity and someone local you can trust. We are here for you.',
    'diaspora.point.1.title': 'Remote support',
    'diaspora.point.1.desc': 'We manage every step on the ground, with regular and transparent communication.',
    'diaspora.point.2.title': 'Video tours and curated shortlist',
    'diaspora.point.2.desc': 'We send video viewings and a carefully selected shortlist, aligned with your profile.',
    'diaspora.point.3.title': 'Full documentation support',
    'diaspora.point.3.desc': 'We handle paperwork and coordinate with trusted local partners.',
    'diaspora.point.4.title': 'Clear communication to completion',
    'diaspora.point.4.desc': 'We keep you informed at every stage. No surprises, no loose ends.',
    'diaspora.cta': 'Buy Remotely',
    'diaspora.image.caption': 'Your investment in Cape Verde, with real support.',
    'social.title': 'What our clients say.',
    'social.subtitle': 'Real experiences from those who trusted IDÓNEA to buy, sell or invest in Cape Verde.',

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
    // Closing CTA
    'closing.title': 'Ready to take the next step?',
    'closing.subtitle': 'Buy, sell or invest in Cape Verde with more clarity, care and confidence. We are here to support you.',
    'closing.cta.consultation': 'Book a Consultation',
    'closing.cta.whatsapp': 'Chat on WhatsApp',
    'closing.cta.properties': 'View Properties',

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

    // Property detail
    'detail.area': 'Area',
    'detail.idealFor': 'Ideal for',
    'detail.highlights': 'Why this property stands out',
    'detail.similar': 'Similar Properties',
    'detail.tag.selection': 'IDÓNEA Selection',
    'detail.tag.investment': 'Investment',
    'detail.tag.personal': 'Personal Use',
    'detail.tag.second-home': 'Second Home',
    'detail.tag.rental': 'Rental',
    'detail.cta.visit': 'Book a Viewing',
    'detail.cta.info': 'Request Information',
    'detail.cta.response': 'Response within 24 hours.',
    'detail.process.title': 'IDÓNEA Support',
    'detail.process.subtitle': 'From first contact to completion, we are with you.',
    'detail.process.1': 'Initial consultation',
    'detail.process.2': 'Viewing or video tour',
    'detail.process.3': 'Documentation support',
    'detail.process.4': 'Negotiation',
    'detail.process.5': 'Secure closing',
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
