export interface Property {
  id: string;
  title_pt: string;
  title_en: string;
  description_pt: string;
  description_en: string;
  type: 'sale' | 'rent';
  property_type: 'apartment' | 'house' | 'land' | 'commercial';
  price: number;
  island: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  images: string[];
  featured: boolean;
}

export const sampleProperties: Property[] = [
  {
    id: '1',
    title_pt: 'Apartamento T3 com Vista Mar',
    title_en: '3-Bedroom Apartment with Sea View',
    description_pt: 'Apartamento moderno com vista privilegiada para o mar. Acabamentos de qualidade, cozinha equipada, varanda ampla. Localizado numa zona tranquila com fácil acesso a serviços.',
    description_en: 'Modern apartment with privileged sea view. Quality finishes, equipped kitchen, spacious balcony. Located in a quiet area with easy access to services.',
    type: 'sale',
    property_type: 'apartment',
    price: 12500000,
    island: 'Santiago',
    location: 'Praia',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
    featured: true,
  },
  {
    id: '2',
    title_pt: 'Moradia T4 em Condomínio',
    title_en: '4-Bedroom Villa in Gated Community',
    description_pt: 'Moradia espaçosa em condomínio fechado com piscina e jardim. Quatro quartos, sala ampla, garagem para dois carros. Segurança 24 horas.',
    description_en: 'Spacious villa in gated community with pool and garden. Four bedrooms, large living room, two-car garage. 24-hour security.',
    type: 'sale',
    property_type: 'house',
    price: 25000000,
    island: 'Santiago',
    location: 'Praia',
    bedrooms: 4,
    bathrooms: 3,
    area: 250,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'],
    featured: true,
  },
  {
    id: '3',
    title_pt: 'Apartamento T2 para Arrendamento',
    title_en: '2-Bedroom Apartment for Rent',
    description_pt: 'Apartamento mobilado em zona central. Dois quartos, cozinha equipada, ar condicionado. Ideal para profissionais ou casais.',
    description_en: 'Furnished apartment in central area. Two bedrooms, equipped kitchen, air conditioning. Ideal for professionals or couples.',
    type: 'rent',
    property_type: 'apartment',
    price: 45000,
    island: 'Santiago',
    location: 'Praia',
    bedrooms: 2,
    bathrooms: 1,
    area: 85,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
    featured: true,
  },
  {
    id: '4',
    title_pt: 'Terreno com Vista Mar',
    title_en: 'Land with Sea View',
    description_pt: 'Terreno de 500m² com vista mar. Zona em crescimento, ideal para construção de moradia ou investimento. Documentação em ordem.',
    description_en: '500m² land with sea view. Growing area, ideal for house construction or investment. Documentation in order.',
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
  },
  {
    id: '5',
    title_pt: 'Moradia T3 em São Vicente',
    title_en: '3-Bedroom House in São Vicente',
    description_pt: 'Moradia com três quartos em zona residencial tranquila. Quintal amplo, garagem, próximo de escolas e comércio.',
    description_en: 'Three-bedroom house in quiet residential area. Large yard, garage, close to schools and shops.',
    type: 'sale',
    property_type: 'house',
    price: 8500000,
    island: 'São Vicente',
    location: 'Mindelo',
    bedrooms: 3,
    bathrooms: 2,
    area: 160,
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
    images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'],
    featured: true,
  },
  {
    id: '6',
    title_pt: 'Espaço Comercial no Centro',
    title_en: 'Commercial Space in City Center',
    description_pt: 'Espaço comercial de 200m² no centro da Praia. Ideal para loja, escritório ou restaurante. Localização com grande movimento.',
    description_en: '200m² commercial space in Praia city center. Ideal for shop, office, or restaurant. High-traffic location.',
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
  },
];

export const islands = ['Santiago', 'Sal', 'São Vicente', 'Boa Vista', 'Santo Antão', 'Fogo', 'Maio', 'São Nicolau', 'Brava'];
