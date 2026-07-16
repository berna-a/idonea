import Header from '@/components/Header';
import Seo from '@/components/Seo';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ShieldCheck, Gem, Handshake, MessageCircle, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const WA = 'https://wa.me/2389808947?text=';

const About = () => {
  const { t, lang } = useLanguage();
  const pt = lang === 'pt';

  const principles = pt ? [
    { icon: ShieldCheck, title: 'Rigor', desc: 'Cada imóvel é verificado juridicamente antes de chegar a si. Sem atalhos.' },
    { icon: Gem, title: 'Curadoria', desc: 'Não trabalhamos por volume. Apresentamos apenas o que genuinamente corresponde.' },
    { icon: Handshake, title: 'Acompanhamento', desc: 'Do primeiro contacto à escritura, estamos ao seu lado em cada etapa.' },
  ] : [
    { icon: ShieldCheck, title: 'Rigour', desc: 'Every property is legally verified before it reaches you. No shortcuts.' },
    { icon: Gem, title: 'Curation', desc: 'We don\'t work by volume. We present only what genuinely fits.' },
    { icon: Handshake, title: 'Support', desc: 'From first contact to the deed, we are by your side at every step.' },
  ];

  const founderBio = pt
    ? 'A IDÓNEA nasceu de uma convicção simples: quem procura casa em Cabo Verde — sobretudo à distância — merece rigor, transparência e alguém em quem confiar, do primeiro contacto à escritura. Khary conduz pessoalmente cada relação, com a exigência que dá o nome à marca.'
    : 'IDÓNEA was born from a simple conviction: those looking for a home in Cape Verde — especially from afar — deserve rigour, transparency and someone they can trust, from first contact to the deed. Khary personally leads every relationship, with the exacting standard that gives the brand its name.';

  const waUrl = WA + encodeURIComponent(pt
    ? 'Olá IDÓNEA, gostaria de falar convosco.'
    : 'Hello IDÓNEA, I would like to talk to you.');

  return (
    <div className="min-h-screen bg-background">
      <Seo title={t('seo.about.title')} description={t('seo.about.description')} />
      <Header />
      <main className="pt-16">
        {/* Intro */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85 }}>
              <p className="text-eyebrow mb-5">{pt ? 'Sobre nós' : 'About us'}</p>
              <h1 className="font-display text-4xl md:text-5xl text-foreground mb-6 leading-tight">
                {pt ? 'O nome é a promessa.' : 'The name is the promise.'}
              </h1>
              <p className="text-muted-foreground font-body text-lg leading-relaxed">
                {pt
                  ? 'Idóneo: digno de confiança, adequado ao fim a que se destina. É essa a exigência que trazemos à mediação imobiliária em Cabo Verde — seletiva, transparente e dedicada.'
                  : 'Idóneo: trustworthy, fit for its purpose. That is the standard we bring to real estate in Cape Verde — selective, transparent and dedicated.'}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Principles */}
        <section className="py-16 md:py-20 bg-card/30 border-y border-border/40">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {principles.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.08 }}
                >
                  <p.icon className="h-7 w-7 text-primary mb-4" strokeWidth={1.5} />
                  <h3 className="font-display text-xl text-foreground mb-2">{p.title}</h3>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed">{p.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Founder */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4 max-w-4xl">
            <p className="text-eyebrow text-center mb-12">{pt ? 'Quem está por trás' : 'Who is behind it'}</p>
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,240px)_1fr] gap-8 md:gap-12 items-center">
              <div className="flex justify-center md:justify-start">
                {/* Placeholder monogram — swap for <img src={kharyPhoto} …/> once the photo file is added */}
                <div className="w-44 h-44 md:w-56 md:h-56 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20 flex items-center justify-center">
                  <span className="font-display text-6xl text-primary/70">K</span>
                </div>
              </div>
              <div>
                <h2 className="font-display text-2xl md:text-3xl text-foreground mb-1">Khary Hopffer Varela</h2>
                <p className="text-primary font-body text-sm uppercase tracking-[0.15em] mb-5">
                  {pt ? 'Fundadora' : 'Founder'}
                </p>
                <p className="text-muted-foreground font-body leading-relaxed mb-6">{founderBio}</p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild variant="outline" className="font-body border-[hsl(142,70%,45%)] text-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,45%)] hover:text-white">
                    <a href={waUrl} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {t('contact.whatsapp')}
                    </a>
                  </Button>
                  <Button asChild variant="ghost" className="font-body text-muted-foreground hover:text-primary">
                    <a href="tel:+2389808947">
                      <Phone className="h-4 w-4 mr-2" />
                      +238 980 8947
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-24 bg-card/30 border-t border-border/40">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-5">
              {pt ? 'Falemos do que procura.' : 'Let\'s talk about what you\'re looking for.'}
            </h2>
            <p className="text-muted-foreground font-body text-lg mb-10 leading-relaxed">
              {t('closing.subtitle')}
            </p>
            <Button asChild size="lg" className="font-body">
              <Link to="/contact">{t('nav.cta')}</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default About;
