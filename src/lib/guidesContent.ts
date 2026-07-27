export interface GuideSection {
  heading_pt: string;
  heading_en: string;
  body_pt: string;
  body_en: string;
}

export interface GuideContent {
  slug: string;
  eyebrow_pt: string;
  eyebrow_en: string;
  title_pt: string;
  title_en: string;
  subtitle_pt: string;
  subtitle_en: string;
  sections: GuideSection[];
  seoTitle_pt: string;
  seoDescription_pt: string;
  seoTitle_en: string;
  seoDescription_en: string;
}

export const guidesContent: GuideContent[] = [
  {
    slug: 'comprar-do-estrangeiro',
    eyebrow_pt: 'Guia · Diáspora',
    eyebrow_en: 'Guide · Diaspora',
    title_pt: 'Comprar em Cabo Verde a partir do estrangeiro',
    title_en: 'Buying in Cape Verde from abroad',
    subtitle_pt: 'O processo completo, passo a passo, sem precisar de viajar até à escritura.',
    subtitle_en: 'The complete process, step by step, without needing to travel until completion.',
    sections: [
      {
        heading_pt: 'Porque comprar à distância exige mais do que confiança',
        heading_en: 'Why buying remotely takes more than trust',
        body_pt:
          'Comprar um imóvel sem o visitar pessoalmente é, para a maioria, o maior obstáculo psicológico do processo. A solução não é "confiar cegamente" — é ter um processo estruturado, documentado e verificável em cada etapa, com alguém no terreno que responde por si. É esse o papel da IDÓNEA: substituir a sua presença física por um acompanhamento tão rigoroso que a distância deixa de ser um risco.',
        body_en:
          'Buying a property without visiting it in person is, for most people, the biggest psychological obstacle in the process. The solution isn\'t "blind trust" — it\'s a structured, documented and verifiable process at every stage, with someone on the ground who is accountable to you. That is IDÓNEA\'s role: to replace your physical presence with oversight rigorous enough that distance stops being a risk.',
      },
      {
        heading_pt: 'O processo, passo a passo',
        heading_en: 'The process, step by step',
        body_pt:
          '1. Consulta inicial — percebemos o seu objetivo (uso próprio, investimento, segunda residência), orçamento e prazo.\n2. Shortlist e video-tours — selecionamos imóveis alinhados com o seu perfil e organizamos visitas em vídeo, ao vivo ou gravadas, com todas as perguntas respondidas na hora.\n3. Devida diligência — verificamos a situação legal do imóvel (registo predial, ónus, licenças) antes de avançar.\n4. Procuração — emite uma procuração que nos permite agir em seu nome em Cabo Verde (ver secção seguinte).\n5. Transferência de fundos — coordenamos o processo bancário com transparência total sobre prazos e taxas.\n6. Escritura e registo — a escritura é outorgada com a procuração; o imóvel fica registado em seu nome sem que tenha de estar presente.',
        body_en:
          "1. Initial consultation — we understand your goal (personal use, investment, second home), budget and timeline.\n2. Shortlist and video tours — we select properties aligned with your profile and arrange live or recorded video viewings, with every question answered on the spot.\n3. Due diligence — we verify the property's legal standing (land registry, liens, permits) before proceeding.\n4. Power of attorney — you issue a power of attorney allowing us to act on your behalf in Cape Verde (see next section).\n5. Funds transfer — we coordinate the banking process with full transparency on timelines and fees.\n6. Completion and registration — the deed is signed under power of attorney; the property is registered in your name without you needing to be present.",
      },
      {
        heading_pt: 'A procuração — a ferramenta chave para comprar sem viajar',
        heading_en: 'Power of attorney — the key tool to buy without travelling',
        body_pt:
          'A procuração é um documento legal que autoriza uma pessoa de confiança (habitualmente um advogado local) a assinar a escritura e tratar de formalidades em seu nome. Pode ser emitida no consulado ou embaixada de Cabo Verde no país onde reside, ou junto de notário local com posterior apostilamento. Definimos consigo, com antecedência, exatamente o que a procuração autoriza — nunca é um cheque em branco.',
        body_en:
          'A power of attorney is a legal document authorising a trusted person (typically a local lawyer) to sign the deed and handle formalities on your behalf. It can be issued at the Cape Verdean consulate or embassy in your country of residence, or before a local notary with subsequent apostille. We define with you, in advance, exactly what the power of attorney authorises — it is never a blank cheque.',
      },
      {
        heading_pt: 'Documentos que vai precisar',
        heading_en: 'Documents you will need',
        body_pt:
          'Passaporte ou bilhete de identidade válido; NIF cabo-verdiano (número de identificação fiscal, necessário para qualquer compra — tratamos da sua emissão se ainda não o tiver); comprovativo de morada; comprovativo da origem dos fundos, exigido pelos bancos cabo-verdianos como parte das regras de prevenção de branqueamento de capitais.',
        body_en:
          'Valid passport or ID card; Cape Verdean tax number (NIF), required for any purchase — we handle its issuance if you don\'t yet have one; proof of address; proof of the source of funds, required by Cape Verdean banks as part of anti-money-laundering rules.',
      },
    ],
    seoTitle_pt: 'Comprar em Cabo Verde a Partir do Estrangeiro',
    seoDescription_pt:
      'Guia completo para a diáspora: como comprar um imóvel em Cabo Verde sem viajar — procuração, documentos e o processo passo a passo. Por IDÓNEA.',
    seoTitle_en: 'Buying Property in Cape Verde From Abroad',
    seoDescription_en:
      'Complete guide for the diaspora: how to buy property in Cape Verde without travelling — power of attorney, documents and the step-by-step process. By IDÓNEA.',
  },
  {
    slug: 'custos-e-impostos',
    eyebrow_pt: 'Guia · Investimento',
    eyebrow_en: 'Guide · Investment',
    title_pt: 'Custos e impostos na compra de imóvel em Cabo Verde',
    title_en: 'Costs and taxes when buying property in Cape Verde',
    subtitle_pt: 'O que preparar para além do preço de tabela — e porque cada caso é diferente.',
    subtitle_en: 'What to budget for beyond the listing price — and why every case differs.',
    sections: [
      {
        heading_pt: 'As categorias de custo a prever',
        heading_en: 'The cost categories to plan for',
        body_pt:
          'Além do preço de compra, uma transação imobiliária em Cabo Verde envolve tipicamente: imposto sobre a transmissão do imóvel, emolumentos notariais e de registo predial, honorários legais (se optar por advogado próprio, para além do acompanhamento IDÓNEA) e, após a compra, um imposto anual sobre o património. Estas categorias existem em praticamente qualquer mercado imobiliário — o que varia é o valor exato em cada uma.',
        body_en:
          'Beyond the purchase price, a real estate transaction in Cape Verde typically involves: a property transfer tax, notary and land registry fees, legal fees (if you choose your own lawyer in addition to IDÓNEA\'s support) and, after the purchase, an annual property tax. These categories exist in virtually every real estate market — what varies is the exact amount in each.',
      },
      {
        heading_pt: 'O que faz variar o valor exato',
        heading_en: 'What makes the exact amount vary',
        body_pt:
          'O tipo de imóvel (habitação, terreno, comercial), se é residente ou não residente fiscal, o valor da transação e a ilha onde compra podem alterar o cálculo. Por isso, qualquer número genérico publicado online — incluindo aqui — deve ser tratado como orientação, não como facto aplicável ao seu caso.',
        body_en:
          'The type of property (home, land, commercial), whether you are a tax resident or non-resident, the transaction value and the island where you buy can all change the calculation. For that reason, any generic figure published online — including here — should be treated as guidance, not as a fact applicable to your specific case.',
      },
      {
        heading_pt: 'Porque não publicamos uma tabela fixa de percentagens',
        heading_en: "Why we don't publish a fixed percentage table",
        body_pt:
          'Preferimos não arriscar induzi-lo em erro com números desatualizados ou incompletos. Em vez disso, preparamos para cada cliente sério um dossier com a estimativa de custos específica ao imóvel e perfil em causa, validada antes de avançar — para que decida com números reais, não com médias genéricas de um artigo.',
        body_en:
          "We prefer not to risk misleading you with outdated or incomplete figures. Instead, for every serious client we prepare a dossier with a cost estimate specific to the property and profile in question, validated before you proceed — so you decide with real numbers, not generic averages from an article.",
      },
      {
        heading_pt: 'Como preparamos o seu dossier de custos',
        heading_en: 'How we prepare your cost dossier',
        body_pt:
          'Ao pedir o dossier completo de um imóvel específico — disponível em cada ficha de imóvel do nosso portefólio — recebe uma estimativa detalhada de todos os custos de compra, para além do preço, aplicável ao seu caso concreto.',
        body_en:
          'When you request the full dossier for a specific property — available on every listing in our portfolio — you receive a detailed estimate of all purchase costs, beyond the price, applicable to your specific case.',
      },
    ],
    seoTitle_pt: 'Custos e Impostos na Compra de Imóvel em Cabo Verde',
    seoDescription_pt:
      'Guia de custos de compra de imóvel em Cabo Verde: imposto de transmissão, registo, honorários e imposto anual sobre o património. O que esperar, caso a caso.',
    seoTitle_en: 'Costs and Taxes When Buying Property in Cape Verde',
    seoDescription_en:
      'Guide to property purchase costs in Cape Verde: transfer tax, registration, fees and annual property tax. What to expect, case by case.',
  },
  {
    slug: 'roi-arrendamento-turistico',
    eyebrow_pt: 'Guia · Investimento',
    eyebrow_en: 'Guide · Investment',
    title_pt: 'Como avaliar o rendimento de um arrendamento turístico',
    title_en: 'How to evaluate short-term rental yield',
    subtitle_pt: 'O enquadramento que usamos para avaliar potencial, ilha a ilha.',
    subtitle_en: 'The framework we use to evaluate potential, island by island.',
    sections: [
      {
        heading_pt: 'A equação base do rendimento',
        heading_en: 'The base yield equation',
        body_pt:
          'Rendimento bruto = taxa de ocupação × tarifa média diária × 365 dias. Rendimento líquido = rendimento bruto menos custos operacionais (gestão, limpeza, comissões de plataforma, manutenção, licenciamento e vacância). É este segundo número — o líquido, não o bruto — que deve orientar qualquer decisão de investimento.',
        body_en:
          "Gross yield = occupancy rate × average daily rate × 365 days. Net yield = gross yield minus operating costs (management, cleaning, platform commissions, maintenance, licensing and vacancy). It's this second number — net, not gross — that should guide any investment decision.",
      },
      {
        heading_pt: 'O que muda de ilha para ilha',
        heading_en: 'What changes from island to island',
        body_pt:
          'Sal tem o mercado mais maduro: ocupação elevada e previsível, mas também mais concorrência e preços de entrada mais altos. Boa Vista está numa fase de crescimento — ocupação ainda a consolidar, mas com maior potencial de valorização do capital ao longo dos próximos anos. Santiago e São Vicente funcionam sobretudo com uma lógica diferente: arrendamento de média/longa duração para residentes e profissionais, com menor sazonalidade mas também menor tarifa diária.',
        body_en:
          'Sal has the most mature market: high, predictable occupancy, but also more competition and higher entry prices. Boa Vista is in a growth phase — occupancy still consolidating, but with greater capital appreciation potential over the coming years. Santiago and São Vicente work mostly under a different logic: medium/long-term rental to residents and professionals, with less seasonality but also a lower daily rate.',
      },
      {
        heading_pt: 'Custos que reduzem o rendimento bruto',
        heading_en: 'Costs that reduce gross yield',
        body_pt:
          'Gestão e limpeza entre estadias, comissões de plataformas de reserva (Airbnb, Booking), manutenção e reposição de equipamento, licenciamento de alojamento turístico onde aplicável, e períodos de vacância entre reservas — sobretudo fora da época alta europeia.',
        body_en:
          'Management and cleaning between stays, booking platform commissions (Airbnb, Booking), maintenance and equipment replacement, tourist accommodation licensing where applicable, and vacancy periods between bookings — especially outside the European high season.',
      },
      {
        heading_pt: 'Como avaliamos o potencial antes de recomendar um imóvel',
        heading_en: 'How we evaluate potential before recommending a property',
        body_pt:
          'Não recomendamos um imóvel de investimento sem estimar honestamente o seu rendimento líquido esperado, com base em dados de mercado da zona específica — não em médias genéricas do arquipélago. É essa análise que integra o dossier de qualquer imóvel identificado como oportunidade de investimento no nosso portefólio.',
        body_en:
          "We don't recommend an investment property without honestly estimating its expected net yield, based on market data for the specific area — not generic archipelago-wide averages. That analysis is part of the dossier for any property flagged as an investment opportunity in our portfolio.",
      },
    ],
    seoTitle_pt: 'ROI de Arrendamento Turístico em Cabo Verde',
    seoDescription_pt:
      'Como avaliar o rendimento de um imóvel para arrendamento turístico em Cabo Verde — ocupação, tarifas, custos e diferenças entre ilhas. Guia IDÓNEA.',
    seoTitle_en: 'Short-Term Rental ROI in Cape Verde',
    seoDescription_en:
      'How to evaluate short-term rental yield for property in Cape Verde — occupancy, rates, costs and differences between islands. IDÓNEA guide.',
  },
];

export const getGuideBySlug = (slug: string | undefined) =>
  guidesContent.find((g) => g.slug === slug);
