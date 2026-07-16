import Header from '@/components/Header';
import Seo from '@/components/Seo';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useLanguage } from '@/lib/i18n';
import { guidesContent } from '@/lib/guidesContent';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Video, FileCheck, ShieldCheck, MessageCircle, Eye, PlayCircle, FileSignature, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import heroBg from '@/assets/hero-bg.webp';

const WA = 'https://wa.me/2389808947?text=';

const Diaspora = () => {
  const { t, lang } = useLanguage();
  const pt = lang === 'pt';

  const waUrl = WA + encodeURIComponent(
    pt ? 'Olá IDÓNEA, vivo no estrangeiro e gostaria de comprar em Cabo Verde.'
       : 'Hello IDÓNEA, I live abroad and would like to buy in Cape Verde.'
  );

  const fears = pt ? [
    { icon: Eye, q: 'Como confio sem ver?', a: 'Enviamos vídeo real de cada visita, em detalhe e sem filtros. E fazemos video-tours ao vivo, para percorrer o imóvel consigo e responder a tudo na hora.' },
    { icon: FileCheck, q: 'E toda a papelada?', a: 'Tratamos de tudo no terreno — NIF, procuração, contratos e escritura — com juristas locais de confiança. Não precisa de viajar.' },
    { icon: ShieldCheck, q: 'E se algo correr mal?', a: 'Verificamos cada imóvel juridicamente antes de o mostrar. Acompanhamos cada etapa e mantemo-lo informado, sempre. Sem surpresas.' },
  ] : [
    { icon: Eye, q: 'How do I trust without seeing?', a: 'We send real video of every viewing, in detail and unfiltered. And we run live video tours, so you walk through the property with us and ask anything on the spot.' },
    { icon: FileCheck, q: 'And all the paperwork?', a: 'We handle everything on the ground — tax number, power of attorney, contracts and the deed — with trusted local lawyers. You don\'t need to travel.' },
    { icon: ShieldCheck, q: 'What if something goes wrong?', a: 'We legally verify every property before showing it. We follow each step and keep you informed, always. No surprises.' },
  ];

  const points = [1, 2, 3, 4].map((n) => ({
    title: t(`diaspora.point.${n}.title`),
    desc: t(`diaspora.point.${n}.desc`),
    icon: [Eye, PlayCircle, FileSignature, BadgeCheck][n - 1],
  }));

  const steps = pt ? [
    ['Conversa inicial', 'Ouvimos o que procura, o orçamento e o prazo.'],
    ['Seleção e video-tour', 'Enviamos uma shortlist criteriosa e visitas em vídeo, ao vivo ou gravadas.'],
    ['Verificação jurídica', 'Confirmamos a situação legal e documental do imóvel escolhido.'],
    ['Procuração', 'Se não puder estar presente, tratamos da representação legal por si.'],
    ['Transferência e sinal', 'Orientamos o pagamento e a transferência de fundos, com segurança.'],
    ['Escritura', 'Fechamos o negócio e entregamos-lhe a casa. À distância, se preciso for.'],
  ] : [
    ['Initial conversation', 'We listen to what you\'re looking for, the budget and the timeline.'],
    ['Selection and video tour', 'We send a curated shortlist and video viewings, live or recorded.'],
    ['Legal verification', 'We confirm the legal and documentary standing of the chosen property.'],
    ['Power of attorney', 'If you can\'t be present, we handle legal representation for you.'],
    ['Transfer and deposit', 'We guide payment and the transfer of funds, securely.'],
    ['Deed', 'We close the deal and hand you the home. Remotely, if needed.'],
  ];

  const faqs = pt ? [
    ['Preciso de ir a Cabo Verde para comprar?', 'Não. Com procuração, podemos representá-lo em todo o processo, incluindo a escritura.'],
    ['Como obtenho o NIF cabo-verdiano?', 'Tratamos do pedido por si — é um passo simples e necessário para comprar.'],
    ['Como funciona a transferência de dinheiro?', 'Orientamos cada passo e articulamos com as entidades locais. Nunca há um cheque em branco.'],
    ['Quanto tempo demora o processo?', 'Depende do imóvel, mas uma compra típica fecha em semanas, não meses, quando a documentação está em ordem.'],
    ['Quais são os vossos honorários?', 'Falamos disso com total transparência logo na primeira conversa. Sem custos escondidos.'],
  ] : [
    ['Do I need to travel to Cape Verde to buy?', 'No. With power of attorney, we can represent you throughout the process, including the deed.'],
    ['How do I get a Cape Verdean tax number?', 'We handle the request for you — a simple, necessary step to buy.'],
    ['How does the money transfer work?', 'We guide every step and coordinate with local institutions. There is never a blank cheque.'],
    ['How long does the process take?', 'It depends on the property, but a typical purchase closes in weeks, not months, when the paperwork is in order.'],
    ['What are your fees?', 'We discuss this with full transparency in the first conversation. No hidden costs.'],
  ];

  return (
    <div className="min-h-screen bg-background">
      <Seo title={t('seo.diaspora.title')} description={t('seo.diaspora.description')} />
      <Header />
      <main>
        {/* Hero */}
        <section className="relative min-h-[80vh] flex items-center overflow-hidden">
          <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/50" />
          <div className="relative container mx-auto px-4 max-w-3xl text-center pt-24 pb-16">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
              <p className="text-eyebrow mb-5">{t('diaspora.eyebrow')}</p>
              <h1 className="font-display text-4xl md:text-6xl leading-[1.05] text-foreground mb-6">
                {pt ? 'Comprar na sua terra, sem sair da sua vida.' : 'Buy in your homeland, without leaving your life.'}
              </h1>
              <p className="text-muted-foreground font-body text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
                {pt ? 'Da primeira conversa à escritura, sem precisar de viajar.' : 'From the first conversation to the deed, without having to travel.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg" className="font-body">
                  <Link to="/contact">{t('nav.cta')}</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="font-body border-[hsl(142,70%,45%)] text-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,45%)] hover:text-white">
                  <a href={waUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    {t('contact.whatsapp')}
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* The 3 fears, answered */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="font-display text-3xl md:text-4xl text-foreground text-center mb-4">
              {pt ? 'Comprar à distância levanta perguntas. Respondemos a todas.' : 'Buying from afar raises questions. We answer them all.'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
              {fears.map((f, i) => (
                <motion.div
                  key={f.q}
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.08 }}
                  className="rounded-2xl border border-border/60 bg-card/40 p-7"
                >
                  <f.icon className="h-7 w-7 text-primary mb-5" strokeWidth={1.5} />
                  <h3 className="font-display text-xl text-foreground mb-3">{f.q}</h3>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed">{f.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How we work with you (the 4 points) */}
        <section className="py-20 md:py-28 bg-card/30 border-y border-border/40">
          <div className="container mx-auto px-4 max-w-5xl">
            <p className="text-eyebrow text-center mb-4">{pt ? 'Como trabalhamos consigo' : 'How we work with you'}</p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground text-center mb-4 max-w-3xl mx-auto leading-tight">
              {t('diaspora.title')}
            </h2>
            <p className="text-muted-foreground font-body text-center max-w-2xl mx-auto leading-relaxed mb-14">
              {t('diaspora.subtitle')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
              {points.map((p) => (
                <div key={p.title} className="flex gap-4">
                  <div className="w-11 h-11 rounded-full bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center flex-shrink-0">
                    <p.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-foreground mb-1">{p.title}</h3>
                    <p className="text-muted-foreground font-body text-sm leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The process in 6 steps */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="font-display text-3xl md:text-4xl text-foreground text-center mb-14">
              {pt ? 'O processo, do início ao fim.' : 'The process, from start to finish.'}
            </h2>
            <ol className="relative border-l border-border/60 ml-4 space-y-10">
              {steps.map(([title, desc], i) => (
                <motion.li
                  key={title}
                  initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className="ml-8"
                >
                  <span className="absolute -left-[13px] flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-body font-semibold">
                    {i + 1}
                  </span>
                  <h3 className="font-display text-lg text-foreground mb-1">{title}</h3>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed">{desc}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* Practical guides */}
        <section className="py-20 md:py-24 bg-card/30 border-y border-border/40">
          <div className="container mx-auto px-4 max-w-5xl">
            <p className="text-eyebrow text-center mb-4">{pt ? 'Guias práticos' : 'Practical guides'}</p>
            <h2 className="font-display text-2xl md:text-3xl text-foreground text-center mb-12">
              {pt ? 'Tudo o que precisa de saber, sem sair de casa.' : 'Everything you need to know, without leaving home.'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {guidesContent.map((g) => (
                <Link
                  key={g.slug}
                  to={`/guias/${g.slug}`}
                  className="group block p-6 rounded-xl border border-border/60 bg-card/40 hover:border-primary/40 transition-colors"
                >
                  <p className="font-display text-lg text-foreground group-hover:text-primary transition-colors mb-2">
                    {pt ? g.title_pt : g.title_en}
                  </p>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4">
                    {pt ? g.subtitle_pt : g.subtitle_en}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs text-primary font-body">
                    {pt ? 'Ler o guia' : 'Read the guide'}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="font-display text-3xl md:text-4xl text-foreground text-center mb-14">
              {pt ? 'Perguntas frequentes' : 'Frequently asked questions'}
            </h2>
            <div className="divide-y divide-border/50">
              {faqs.map(([q, a]) => (
                <div key={q} className="py-6">
                  <h3 className="font-display text-lg text-foreground mb-2">{q}</h3>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 md:py-28 bg-card/30 border-t border-border/40">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-5">
              {pt ? 'A sua casa em Cabo Verde começa numa conversa.' : 'Your home in Cape Verde starts with a conversation.'}
            </h2>
            <p className="text-muted-foreground font-body text-lg mb-10 leading-relaxed">
              {t('closing.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="font-body">
                <Link to="/contact">{t('nav.cta')}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-body border-[hsl(142,70%,45%)] text-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,45%)] hover:text-white">
                <a href={waUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  {t('contact.whatsapp')}
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Diaspora;
