import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import Header from '@/components/Header';
import Seo from '@/components/Seo';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useLanguage } from '@/lib/i18n';
import { islands } from '@/lib/sampleProperties';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Sell = () => {
  const { t, lang } = useLanguage();
  const pt = lang === 'pt';
  const createLead = useMutation(api.leads.create);

  const [form, setForm] = useState({
    name: '', email: '', phone: '', island: '', zone: '', propertyType: '', website: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const typeOptions = pt
    ? [['apartment', 'Apartamento'], ['house', 'Moradia'], ['land', 'Terreno'], ['commercial', 'Comercial']]
    : [['apartment', 'Apartment'], ['house', 'House'], ['land', 'Land'], ['commercial', 'Commercial']];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !EMAIL_RE.test(form.email.trim())) {
      toast.error(pt ? 'Indique o seu nome e um email válido.' : 'Please enter your name and a valid email.');
      return;
    }
    const typeLabel = typeOptions.find(([v]) => v === form.propertyType)?.[1] ?? (pt ? 'imóvel' : 'property');
    const where = [form.zone.trim(), form.island].filter(Boolean).join(', ');
    const message = pt
      ? `Pedido de avaliação gratuita — ${typeLabel}${where ? ` em ${where}` : ''}.`
      : `Free valuation request — ${typeLabel}${where ? ` in ${where}` : ''}.`;
    setSubmitting(true);
    try {
      await createLead({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        interest: 'sell',
        message,
        source: 'avaliacao',
        honeypot: form.website,
      });
      setDone(true);
    } catch {
      toast.error(pt ? 'Não foi possível enviar. Tente de novo ou fale connosco por WhatsApp.' : 'Could not send. Please try again or reach us on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const headline = pt
    ? 'O seu imóvel não precisa de mais anúncios. Precisa do comprador certo.'
    : 'Your property doesn\'t need more listings. It needs the right buyer.';
  const subtitle = pt
    ? 'Avaliação rigorosa. Compradores qualificados, cá e na diáspora. Venda acompanhada até à escritura.'
    : 'Rigorous valuation. Qualified buyers, here and across the diaspora. A sale supported through to the deed.';
  const body = pt
    ? 'Espalhar um imóvel por dez portais não é estratégia — é ruído. Na IDÓNEA, avaliamos com rigor, preparamos o dossier completo e apresentamos o seu imóvel a compradores qualificados, em Cabo Verde e na diáspora. Menos curiosos à porta, mais propostas sérias. E quando a proposta chega, negociamos consigo e ficamos ao seu lado até à escritura.'
    : 'Spreading a property across ten portals isn\'t strategy — it\'s noise. At IDÓNEA, we value it rigorously, prepare the full dossier and present your property to qualified buyers, in Cape Verde and across the diaspora. Fewer time-wasters at the door, more serious offers. And when the offer comes, we negotiate with you and stay by your side to the deed.';

  return (
    <div className="min-h-screen bg-background">
      <Seo title={t('seo.sell.title')} description={t('seo.sell.description')} />
      <Header />
      <main className="pt-16">
        <section className="py-20 md:py-28 border-b border-border/40">
          <div className="container mx-auto px-4 max-w-5xl grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85 }}
            >
              <p className="text-eyebrow mb-4">{pt ? 'Vender com a IDÓNEA' : 'Sell with IDÓNEA'}</p>
              <h1 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] leading-tight text-foreground mb-5">
                {headline}
              </h1>
              <p className="text-muted-foreground font-body text-base md:text-lg leading-relaxed">
                {subtitle}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.1 }}
              className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 md:p-8 shadow-xl shadow-black/10"
            >
              {done ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" strokeWidth={1.5} />
                  <h2 className="font-display text-2xl text-foreground mb-2">
                    {pt ? 'Pedido recebido.' : 'Request received.'}
                  </h2>
                  <p className="text-muted-foreground font-body text-sm">
                    {pt ? 'Entramos em contacto em menos de 24 horas com os próximos passos.' : 'We will be in touch within 24 hours with the next steps.'}
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="font-display text-xl md:text-2xl text-foreground mb-1">
                    {pt ? 'Peça uma avaliação gratuita' : 'Request a free valuation'}
                  </h2>
                  <p className="text-muted-foreground font-body text-sm mb-6">
                    {pt ? 'Sem compromisso. Resposta em menos de 24 horas.' : 'No commitment. Response within 24 hours.'}
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
                      value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })}
                      className="hidden"
                    />
                    <Input
                      placeholder={pt ? 'Nome' : 'Name'} value={form.name} required maxLength={100}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="bg-card border-border font-body"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        type="email" placeholder="Email" value={form.email} required maxLength={255}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="bg-card border-border font-body"
                      />
                      <Input
                        type="tel" placeholder={pt ? 'Telefone / WhatsApp' : 'Phone / WhatsApp'} value={form.phone} maxLength={40}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="bg-card border-border font-body"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Select value={form.island} onValueChange={(v) => setForm({ ...form, island: v })}>
                        <SelectTrigger className="bg-card border-border font-body">
                          <SelectValue placeholder={pt ? 'Ilha' : 'Island'} />
                        </SelectTrigger>
                        <SelectContent>
                          {islands.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Select value={form.propertyType} onValueChange={(v) => setForm({ ...form, propertyType: v })}>
                        <SelectTrigger className="bg-card border-border font-body">
                          <SelectValue placeholder={pt ? 'Tipo de imóvel' : 'Property type'} />
                        </SelectTrigger>
                        <SelectContent>
                          {typeOptions.map(([v, label]) => <SelectItem key={v} value={v}>{label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <Input
                      placeholder={pt ? 'Zona / Cidade (opcional)' : 'Area / City (optional)'} value={form.zone} maxLength={100}
                      onChange={(e) => setForm({ ...form, zone: e.target.value })}
                      className="bg-card border-border font-body"
                    />
                    <Button type="submit" size="lg" className="w-full font-body" disabled={submitting}>
                      {submitting ? (pt ? 'A enviar…' : 'Sending…') : (pt ? 'Pedir Avaliação Gratuita' : 'Request Free Valuation')}
                    </Button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-foreground/90 font-body text-lg md:text-xl leading-relaxed"
            >
              {body}
            </motion.p>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Sell;
