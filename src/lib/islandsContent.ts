export interface IslandContent {
  slug: string;
  /** Exact value stored in Convex `properties.island` — used to filter the live listing. */
  dbName: string;
  name_en: string;
  tagline_pt: string;
  tagline_en: string;
  intro_pt: string;
  intro_en: string;
  investmentCase_pt: string;
  investmentCase_en: string;
  highlights_pt: string[];
  highlights_en: string[];
  seoTitle_pt: string;
  seoDescription_pt: string;
  seoTitle_en: string;
  seoDescription_en: string;
}

export const islandsContent: IslandContent[] = [
  {
    slug: 'sal',
    dbName: 'Sal',
    name_en: 'Sal',
    tagline_pt: 'A ilha do turismo e do rendimento imediato.',
    tagline_en: 'The island of tourism and immediate yield.',
    intro_pt:
      'Sal é a porta de entrada turística de Cabo Verde — aeroporto internacional Amílcar Cabral, as praias de Santa Maria e uma economia inteiramente construída à volta do visitante estrangeiro. É a ilha mais procurada por quem quer comprar para arrendar a curto prazo desde o primeiro mês.',
    intro_en:
      "Sal is Cape Verde's tourism gateway — the Amílcar Cabral international airport, Santa Maria's beaches, and an economy built entirely around the international visitor. It's the island most sought after by buyers who want short-term rental income from month one.",
    investmentCase_pt:
      'Sal tem o mercado de arrendamento turístico mais maduro do arquipélago: ocupação elevada todo o ano, procura constante de voos diretos europeus, e uma base já estabelecida de compradores internacionais — o que significa liquidez de revenda mais rápida do que noutras ilhas. Windsurf e kitesurf de classe mundial atraem um público recorrente e fiel.',
    investmentCase_en:
      "Sal has the archipelago's most mature short-term rental market: high year-round occupancy, steady direct European flight demand, and an already-established base of international buyers — meaning faster resale liquidity than other islands. World-class windsurfing and kitesurfing bring back a loyal, recurring visitor base.",
    highlights_pt: [
      'Aeroporto internacional com voos diretos para a Europa',
      'Mercado de arrendamento de curta duração mais consolidado',
      'Santa Maria — praia e vida noturna de referência',
      'Maior concentração de compradores estrangeiros',
    ],
    highlights_en: [
      'International airport with direct European flights',
      'Most established short-term rental market',
      'Santa Maria — the benchmark beach and nightlife',
      'Highest concentration of foreign buyers',
    ],
    seoTitle_pt: 'Comprar Casa em Sal, Cabo Verde',
    seoDescription_pt:
      'Imóveis à venda e arrendamento em Sal, Cabo Verde — Santa Maria e arredores. O mercado com maior rendimento turístico do arquipélago. Curadoria IDÓNEA.',
    seoTitle_en: 'Buy Property in Sal, Cape Verde',
    seoDescription_en:
      "Properties for sale and rent in Sal, Cape Verde — Santa Maria and surroundings. The archipelago's highest-yield tourism market. Curated by IDÓNEA.",
  },
  {
    slug: 'santiago',
    dbName: 'Santiago',
    name_en: 'Santiago',
    tagline_pt: 'A ilha da capital — economia, estabilidade e escala.',
    tagline_en: 'The capital island — economy, stability and scale.',
    intro_pt:
      'Santiago é o centro económico e político de Cabo Verde: alberga a Praia, a capital, e concentra a maior população, os principais serviços, universidades e sede de empresas do país. É a tese de investimento mais próxima de uma capital em crescimento — não um resort.',
    intro_en:
      "Santiago is Cape Verde's economic and political centre: home to Praia, the capital, and the country's largest population, main services, universities and corporate headquarters. It's the investment case closest to a growing capital city — not a resort.",
    investmentCase_pt:
      'Enquanto Sal e Boa Vista vivem do turismo, Santiago vive de uma economia diversificada e residente — o que a torna menos sazonal e mais estável a longo prazo. Praia continua a atrair população interna e diáspora que regressa, sustentando procura estrutural de habitação, não só de arrendamento sazonal. Cidade Velha, património UNESCO, acrescenta valor cultural único.',
    investmentCase_en:
      "While Sal and Boa Vista run on tourism, Santiago runs on a diversified, resident economy — making it less seasonal and more stable long-term. Praia keeps attracting internal migration and returning diaspora, sustaining structural housing demand, not just seasonal rental. Cidade Velha, a UNESCO World Heritage site, adds unique cultural value.",
    highlights_pt: [
      'Praia — capital política e económica do país',
      'Maior população e economia mais diversificada',
      'Procura estrutural de habitação, não só sazonal',
      'Cidade Velha — património da UNESCO',
    ],
    highlights_en: [
      "Praia — the country's political and economic capital",
      'Largest population and most diversified economy',
      'Structural housing demand, not just seasonal',
      'Cidade Velha — UNESCO World Heritage Site',
    ],
    seoTitle_pt: 'Comprar Casa em Santiago (Praia), Cabo Verde',
    seoDescription_pt:
      'Imóveis à venda e arrendamento em Santiago, Cabo Verde — Praia e Plateau. O mercado mais estável e diversificado do país. Curadoria IDÓNEA.',
    seoTitle_en: 'Buy Property in Santiago (Praia), Cape Verde',
    seoDescription_en:
      "Properties for sale and rent in Santiago, Cape Verde — Praia and Plateau. The country's most stable and diversified market. Curated by IDÓNEA.",
  },
  {
    slug: 'sao-vicente',
    dbName: 'São Vicente',
    name_en: 'São Vicente',
    tagline_pt: 'Mindelo — a alma cultural do arquipélago.',
    tagline_en: 'Mindelo — the archipelago\'s cultural soul.',
    intro_pt:
      'São Vicente é a ilha de Mindelo: porto natural profundo, arquitectura colonial preservada, e o berço cultural e musical de Cabo Verde, terra de Cesária Évora. É a escolha de quem procura carácter e autenticidade, não apenas resort.',
    intro_en:
      "São Vicente is the island of Mindelo: a deep natural harbour, preserved colonial architecture, and the cultural and musical birthplace of Cape Verde, home of Cesária Évora. It's the choice for buyers seeking character and authenticity, not just resort living.",
    investmentCase_pt:
      'O turismo náutico e de veleiro está em franco crescimento em Mindelo, aproveitando o porto natural e a marina. A cidade atrai um perfil de comprador diferente — expatriados, criativos e diáspora com ligação afectiva à ilha — dispostos a pagar por moradias remodeladas com carácter, num mercado ainda com preços de entrada mais acessíveis do que Sal.',
    investmentCase_en:
      "Nautical and sailing tourism is growing steadily in Mindelo, leveraging the natural harbour and marina. The city attracts a different buyer profile — expats, creatives and diaspora with an emotional tie to the island — willing to pay for character-renovated homes, in a market still more accessible on entry price than Sal.",
    highlights_pt: [
      'Mindelo — capital cultural e musical de Cabo Verde',
      'Porto natural e marina, turismo náutico em crescimento',
      'Arquitectura colonial preservada, forte carácter local',
      'Preços de entrada mais acessíveis do que Sal',
    ],
    highlights_en: [
      "Mindelo — Cape Verde's cultural and musical capital",
      'Natural harbour and marina, growing nautical tourism',
      'Preserved colonial architecture, strong local character',
      'More accessible entry prices than Sal',
    ],
    seoTitle_pt: 'Comprar Casa em São Vicente (Mindelo), Cabo Verde',
    seoDescription_pt:
      'Imóveis à venda e arrendamento em São Vicente, Cabo Verde — Mindelo. Carácter, cultura e porto natural. Curadoria IDÓNEA.',
    seoTitle_en: 'Buy Property in São Vicente (Mindelo), Cape Verde',
    seoDescription_en:
      'Properties for sale and rent in São Vicente, Cape Verde — Mindelo. Character, culture and a natural harbour. Curated by IDÓNEA.',
  },
  {
    slug: 'boa-vista',
    dbName: 'Boa Vista',
    name_en: 'Boa Vista',
    tagline_pt: 'Dunas, praias intocadas e o próximo Sal.',
    tagline_en: 'Dunes, untouched beaches, and the next Sal.',
    intro_pt:
      'Boa Vista é a ilha das dunas do deserto e das praias intermináveis onde as tartarugas marinhas ainda desovam. O turismo cresce mais tarde do que em Sal, mas mais depressa — o que a torna a ilha da janela de entrada, com preços ainda abaixo do potencial de médio prazo.',
    intro_en:
      "Boa Vista is the island of desert dunes and endless beaches where sea turtles still nest. Tourism arrived later than in Sal, but is growing faster — making it the entry-window island, with prices still below its medium-term potential.",
    investmentCase_pt:
      'A tese de investimento em Boa Vista é clara: replica o percurso de Sal com uma década de atraso, e resorts internacionais já estão a apostar na ilha. Quem compra agora está a comprar antes da maturação do mercado — o mesmo padrão que fez os primeiros investidores em Sal beneficiarem de valorização acentuada. Praias de nidificação de tartarugas acrescentam um argumento de ecoturismo único no arquipélago.',
    investmentCase_en:
      "The investment case in Boa Vista is clear: it's tracing Sal's path a decade behind, and international resorts are already committing to the island. Buying now means buying ahead of market maturity — the same pattern that rewarded Sal's early investors with steep appreciation. Sea turtle nesting beaches add a unique eco-tourism angle in the archipelago.",
    highlights_pt: [
      'Dunas de deserto e praias entre as mais preservadas do mundo',
      'Turismo em crescimento acelerado, uma década atrás de Sal',
      'Nidificação de tartarugas marinhas — ecoturismo único',
      'Preços de entrada com maior potencial de valorização',
    ],
    highlights_en: [
      "Desert dunes and some of the world's most preserved beaches",
      "Fast-growing tourism, a decade behind Sal's curve",
      'Sea turtle nesting — a unique eco-tourism draw',
      'Entry prices with stronger appreciation potential',
    ],
    seoTitle_pt: 'Comprar Casa em Boa Vista, Cabo Verde',
    seoDescription_pt:
      'Imóveis à venda e arrendamento em Boa Vista, Cabo Verde. Dunas, praias intocadas e o próximo grande mercado turístico. Curadoria IDÓNEA.',
    seoTitle_en: 'Buy Property in Boa Vista, Cape Verde',
    seoDescription_en:
      "Properties for sale and rent in Boa Vista, Cape Verde. Dunes, untouched beaches and the archipelago's next big tourism market. Curated by IDÓNEA.",
  },
];

export const getIslandBySlug = (slug: string | undefined) =>
  islandsContent.find((i) => i.slug === slug);
