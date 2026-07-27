export interface PropertyFeature {
  key: string;
  value_pt: string;
  value_en: string;
}

export interface PropertyHighlight {
  title_pt: string;
  title_en: string;
  desc_pt: string;
  desc_en: string;
}

export type PropertyTag = 'selection' | 'investment' | 'personal' | 'second-home' | 'rental';

export interface Property {
  id: string;
  ref: string;
  title_pt: string;
  title_en: string;
  description_pt: string;
  description_en: string;
  editorial_pt: string;
  editorial_en: string;
  type: 'sale' | 'rent';
  property_type: 'apartment' | 'house' | 'land' | 'commercial';
  price: number;
  island: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  coordinates: { lat: number; lng: number } | null;
  image: string;
  images: string[];
  featured: boolean;
  tags: PropertyTag[];
  idealFor_pt: string[];
  idealFor_en: string[];
  features: PropertyFeature[];
  highlights: PropertyHighlight[];
}

export const sampleProperties: Property[] = [
  {
    id: '1',
    ref: 'IDN-001',
    title_pt: 'Apartamento T3 com Vista Mar',
    title_en: '3-Bedroom Apartment with Sea View',
    description_pt: 'Apartamento moderno com vista privilegiada para o mar. Acabamentos de qualidade, cozinha equipada, varanda ampla. Localizado numa zona tranquila com fácil acesso a serviços.',
    description_en: 'Modern apartment with privileged sea view. Quality finishes, equipped kitchen, spacious balcony. Located in a quiet area with easy access to services.',
    editorial_pt: 'Uma posição elevada com vista aberta sobre o Atlântico, acabamentos contemporâneos e uma varanda generosa que prolonga a sala para o exterior. Numa zona consolidada da Praia, com acesso fácil a escolas, comércio e serviços — equilibra conforto quotidiano com qualidade de vida real.',
    editorial_en: 'An elevated position with open Atlantic views, contemporary finishes and a generous balcony extending the living space outdoors. In an established area of Praia with easy access to schools, shops and services — balancing everyday comfort with real quality of life.',
    type: 'sale',
    property_type: 'apartment',
    price: 12500000,
    island: 'Santiago',
    location: 'Praia',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    ],
    featured: true,
    tags: ['selection', 'personal'],
    idealFor_pt: ['Uso próprio', 'Famílias', 'Comprador na diáspora'],
    idealFor_en: ['Personal use', 'Families', 'Diaspora buyer'],
    features: [
      { key: 'parking', value_pt: '1 lugar', value_en: '1 space' },
      { key: 'balcony', value_pt: 'Varanda ampla', value_en: 'Large balcony' },
      { key: 'view', value_pt: 'Vista mar', value_en: 'Sea view' },
      { key: 'ac', value_pt: 'Ar condicionado', value_en: 'Air conditioning' },
    ],
    highlights: [
      { title_pt: 'Vista panorâmica', title_en: 'Panoramic views', desc_pt: 'Posição elevada com vista aberta sobre o Atlântico.', desc_en: 'Elevated position with open Atlantic views.' },
      { title_pt: 'Zona consolidada', title_en: 'Established area', desc_pt: 'Comércio, escolas e serviços a poucos minutos.', desc_en: 'Shops, schools and services within minutes.' },
      { title_pt: 'Acabamentos contemporâneos', title_en: 'Contemporary finishes', desc_pt: 'Materiais de qualidade e atenção ao detalhe.', desc_en: 'Quality materials with attention to detail.' },
    ],
  },
  {
    id: '2',
    ref: 'IDN-002',
    title_pt: 'Moradia T4 em Condomínio',
    title_en: '4-Bedroom Villa in Gated Community',
    description_pt: 'Moradia espaçosa em condomínio fechado com piscina e jardim. Quatro quartos, sala ampla, garagem para dois carros. Segurança 24 horas.',
    description_en: 'Spacious villa in gated community with pool and garden. Four bedrooms, large living room, two-car garage. 24-hour security.',
    editorial_pt: 'Privacidade, espaço e segurança num dos condomínios mais bem posicionados da Praia. Quatro suítes, jardim privativo, piscina do condomínio e segurança permanente — uma moradia pensada para quem valoriza qualidade de vida sem abdicar de conveniência.',
    editorial_en: 'Privacy, space and security in one of Praia\'s best-positioned gated communities. Four en-suite bedrooms, private garden, communal pool and round-the-clock security — a home designed for those who value quality of life without compromising convenience.',
    type: 'sale',
    property_type: 'house',
    price: 25000000,
    island: 'Santiago',
    location: 'Praia',
    bedrooms: 4,
    bathrooms: 3,
    area: 250,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    ],
    featured: true,
    tags: ['selection', 'investment'],
    idealFor_pt: ['Famílias', 'Investimento premium', 'Segunda residência'],
    idealFor_en: ['Families', 'Premium investment', 'Second home'],
    features: [
      { key: 'parking', value_pt: 'Garagem 2 carros', value_en: '2-car garage' },
      { key: 'pool', value_pt: 'Piscina condomínio', value_en: 'Communal pool' },
      { key: 'garden', value_pt: 'Jardim privativo', value_en: 'Private garden' },
      { key: 'security', value_pt: 'Segurança 24h', value_en: '24h security' },
    ],
    highlights: [
      { title_pt: 'Condomínio de referência', title_en: 'Premium gated community', desc_pt: 'Um dos endereços mais valorizados da Praia.', desc_en: 'One of Praia\'s most valued addresses.' },
      { title_pt: 'Espaço e privacidade', title_en: 'Space and privacy', desc_pt: 'Jardim privativo e áreas generosas em toda a casa.', desc_en: 'Private garden and generous spaces throughout.' },
      { title_pt: 'Potencial de valorização', title_en: 'Growth potential', desc_pt: 'Zona em forte crescimento e procura constante.', desc_en: 'High-growth area with consistent demand.' },
    ],
  },
  {
    id: '3',
    ref: 'IDN-003',
    title_pt: 'Apartamento T2 para Arrendamento',
    title_en: '2-Bedroom Apartment for Rent',
    description_pt: 'Apartamento mobilado em zona central. Dois quartos, cozinha equipada, ar condicionado. Ideal para profissionais ou casais.',
    description_en: 'Furnished apartment in central area. Two bedrooms, equipped kitchen, air conditioning. Ideal for professionals or couples.',
    editorial_pt: 'Mobilado com bom gosto e pronto a habitar, este T2 no centro da Praia oferece praticidade sem sacrificar conforto. Ar condicionado, cozinha totalmente equipada e uma localização que coloca tudo a poucos minutos.',
    editorial_en: 'Tastefully furnished and ready to move in, this two-bedroom apartment in central Praia offers practicality without sacrificing comfort. Air conditioning, fully equipped kitchen and a location that puts everything within minutes.',
    type: 'rent',
    property_type: 'apartment',
    price: 45000,
    island: 'Santiago',
    location: 'Praia',
    bedrooms: 2,
    bathrooms: 1,
    area: 85,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800',
    ],
    featured: true,
    tags: ['rental'],
    idealFor_pt: ['Profissionais', 'Casais', 'Estadias médias'],
    idealFor_en: ['Professionals', 'Couples', 'Medium-term stays'],
    features: [
      { key: 'furnished', value_pt: 'Mobilado', value_en: 'Furnished' },
      { key: 'ac', value_pt: 'Ar condicionado', value_en: 'Air conditioning' },
    ],
    highlights: [
      { title_pt: 'Localização central', title_en: 'Central location', desc_pt: 'No coração da Praia, perto de tudo.', desc_en: 'In the heart of Praia, close to everything.' },
      { title_pt: 'Pronto a habitar', title_en: 'Move-in ready', desc_pt: 'Totalmente mobilado e equipado.', desc_en: 'Fully furnished and equipped.' },
    ],
  },
  {
    id: '4',
    ref: 'IDN-004',
    title_pt: 'Terreno com Vista Mar',
    title_en: 'Land with Sea View',
    description_pt: 'Terreno de 500m² com vista mar. Zona em crescimento, ideal para construção de moradia ou investimento. Documentação em ordem.',
    description_en: '500m² land with sea view. Growing area, ideal for house construction or investment. Documentation in order.',
    editorial_pt: 'Quinhentos metros quadrados com orientação privilegiada e vista aberta sobre o mar em Santa Maria. Documentação regularizada e localização numa zona de forte crescimento turístico — uma oportunidade clara para construir ou investir com horizonte.',
    editorial_en: 'Five hundred square metres with a privileged orientation and open sea views in Santa Maria. Documentation in order and located in a strong tourism growth zone — a clear opportunity to build or invest with vision.',
    type: 'sale',
    property_type: 'land',
    price: 5000000,
    island: 'Sal',
    location: 'Santa Maria',
    bedrooms: 0,
    bathrooms: 0,
    area: 500,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'],
    featured: false,
    tags: ['investment'],
    idealFor_pt: ['Investimento', 'Construção própria'],
    idealFor_en: ['Investment', 'Custom build'],
    features: [
      { key: 'view', value_pt: 'Vista mar', value_en: 'Sea view' },
      { key: 'docs', value_pt: 'Documentação em ordem', value_en: 'Documentation in order' },
    ],
    highlights: [
      { title_pt: 'Zona turística em crescimento', title_en: 'Growing tourism zone', desc_pt: 'Santa Maria é o principal destino turístico de Cabo Verde.', desc_en: 'Santa Maria is Cape Verde\'s primary tourism destination.' },
      { title_pt: 'Vista mar aberta', title_en: 'Open sea views', desc_pt: 'Orientação que maximiza a exposição solar e as vistas.', desc_en: 'Orientation that maximises sun exposure and views.' },
    ],
  },
  {
    id: '5',
    ref: 'IDN-005',
    title_pt: 'Moradia T3 em São Vicente',
    title_en: '3-Bedroom House in São Vicente',
    description_pt: 'Moradia com três quartos em zona residencial tranquila. Quintal amplo, garagem, próximo de escolas e comércio.',
    description_en: 'Three-bedroom house in quiet residential area. Large yard, garage, close to schools and shops.',
    editorial_pt: 'Uma moradia de três quartos numa das zonas residenciais mais tranquilas de Mindelo. Quintal generoso, garagem e proximidade a escolas e comércio — o equilíbrio certo entre sossego e conveniência numa das cidades mais carismáticas de Cabo Verde.',
    editorial_en: 'A three-bedroom house in one of Mindelo\'s quietest residential areas. Generous yard, garage and proximity to schools and shops — the right balance between tranquillity and convenience in one of Cape Verde\'s most charismatic cities.',
    type: 'sale',
    property_type: 'house',
    price: 8500000,
    island: 'São Vicente',
    location: 'Mindelo',
    bedrooms: 3,
    bathrooms: 2,
    area: 160,
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    ],
    featured: true,
    tags: ['selection', 'personal', 'second-home'],
    idealFor_pt: ['Uso próprio', 'Segunda residência', 'Comprador na diáspora'],
    idealFor_en: ['Personal use', 'Second home', 'Diaspora buyer'],
    features: [
      { key: 'parking', value_pt: 'Garagem', value_en: 'Garage' },
      { key: 'garden', value_pt: 'Quintal amplo', value_en: 'Large yard' },
    ],
    highlights: [
      { title_pt: 'Mindelo — cidade cultural', title_en: 'Mindelo — cultural city', desc_pt: 'Uma das cidades mais vibrantes e carismáticas do arquipélago.', desc_en: 'One of the archipelago\'s most vibrant and charismatic cities.' },
      { title_pt: 'Zona residencial tranquila', title_en: 'Quiet residential area', desc_pt: 'Sossego e proximidade a serviços essenciais.', desc_en: 'Tranquillity with proximity to essential services.' },
      { title_pt: 'Espaço exterior', title_en: 'Outdoor space', desc_pt: 'Quintal generoso para jardim ou lazer.', desc_en: 'Generous yard for garden or leisure.' },
    ],
  },
  {
    id: '6',
    ref: 'IDN-006',
    title_pt: 'Espaço Comercial no Centro',
    title_en: 'Commercial Space in City Center',
    description_pt: 'Espaço comercial de 200m² no centro da Praia. Ideal para loja, escritório ou restaurante. Localização com grande movimento.',
    description_en: '200m² commercial space in Praia city center. Ideal for shop, office, or restaurant. High-traffic location.',
    editorial_pt: 'Duzentos metros quadrados no centro nevrálgico da Praia, com fachada para rua de grande movimento. Um espaço versátil para comércio, escritório ou restauração — numa localização onde visibilidade e fluxo se encontram.',
    editorial_en: 'Two hundred square metres in the nerve centre of Praia, with street-facing frontage on a high-traffic road. A versatile space for retail, office or hospitality — in a location where visibility and footfall meet.',
    type: 'rent',
    property_type: 'commercial',
    price: 85000,
    island: 'Santiago',
    location: 'Praia',
    bedrooms: 0,
    bathrooms: 1,
    area: 200,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
    featured: false,
    tags: ['investment'],
    idealFor_pt: ['Negócio próprio', 'Investidor'],
    idealFor_en: ['Own business', 'Investor'],
    features: [
      { key: 'frontage', value_pt: 'Fachada para rua', value_en: 'Street frontage' },
    ],
    highlights: [
      { title_pt: 'Localização premium', title_en: 'Premium location', desc_pt: 'Centro da Praia com grande visibilidade.', desc_en: 'Praia city centre with high visibility.' },
      { title_pt: 'Espaço versátil', title_en: 'Versatile space', desc_pt: 'Adaptável a diferentes tipos de negócio.', desc_en: 'Adaptable to different business types.' },
    ],
  },
];

export const islands = ['Santiago', 'Sal', 'São Vicente', 'Boa Vista', 'Santo Antão', 'Fogo', 'Maio', 'São Nicolau', 'Brava'];
