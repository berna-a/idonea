import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageCircle, Mail, Phone, Home, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(20).optional(),
  interest: z.string().optional(),
  message: z.string().trim().min(1).max(2000),
});

const ContactSection = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const propertyCtx = useMemo(() => {
    const ref = searchParams.get('ref');
    if (!ref) return null;
    return {
      ref,
      title: searchParams.get('title') ?? '',
      location: searchParams.get('location') ?? '',
      type: searchParams.get('type') as 'sale' | 'rent' | null,
      intent: (searchParams.get('intent') as 'visit' | 'info' | 'dossier') ?? 'info',
      url: searchParams.get('url') ?? '',
    };
  }, [searchParams]);

  const [form, setForm] = useState({ name: '', email: '', phone: '', interest: '', message: '', website: '' });
  const [submitting, setSubmitting] = useState(false);
  const createLead = useMutation(api.leads.create);

  useEffect(() => {
    if (!propertyCtx) return;
    const intentText = propertyCtx.intent === 'visit'
      ? `Gostaria de agendar uma visita ao imóvel ${propertyCtx.ref} — ${propertyCtx.title}.`
      : propertyCtx.intent === 'dossier'
      ? `Gostaria de receber o dossier completo do imóvel ${propertyCtx.ref} — ${propertyCtx.title} (documentação, custos de compra e estimativa de rendimento).`
      : `Gostaria de receber mais informação sobre o imóvel ${propertyCtx.ref} — ${propertyCtx.title}.`;
    const locationLine = propertyCtx.location ? `\nLocalização: ${propertyCtx.location}` : '';
    setForm(f => ({
      ...f,
      message: f.message || `${intentText}${locationLine}\n\n`,
      interest: f.interest || (propertyCtx.type === 'rent' ? 'rent' : 'buy'),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyCtx?.ref, propertyCtx?.intent]);

  const clearPropertyCtx = () => {
    const next = new URLSearchParams(searchParams);
    ['ref', 'title', 'location', 'type', 'intent', 'url'].forEach(k => next.delete(k));
    setSearchParams(next, { replace: true });
    setForm(f => ({ ...f, message: '', interest: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      toast.error('Por favor preencha todos os campos obrigatórios.');
      return;
    }
    setSubmitting(true);
    try {
      await createLead({
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone || undefined,
        interest: result.data.interest || undefined,
        message: result.data.message,
        property_ref: propertyCtx?.ref,
        property_title: propertyCtx?.title || undefined,
        intent: propertyCtx?.intent,
        source: propertyCtx ? 'property-enquiry' : 'contact-form',
        honeypot: form.website,
      });
      toast.success('Mensagem enviada. Respondemos no mesmo dia útil.');
      setForm({ name: '', email: '', phone: '', interest: '', message: '', website: '' });
    } catch {
      toast.error('Não foi possível enviar. Tente novamente ou fale connosco por WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappUrl = useMemo(() => {
    const base = 'https://wa.me/2389808947';
    if (!propertyCtx) return base;
    const lines = [
      'Olá IDÓNEA,',
      propertyCtx.intent === 'visit'
        ? `gostaria de agendar uma visita ao imóvel ${propertyCtx.ref} — ${propertyCtx.title}`
        : propertyCtx.intent === 'dossier'
        ? `gostaria de receber o dossier do imóvel ${propertyCtx.ref} — ${propertyCtx.title}`
        : `gostaria de receber mais informação sobre o imóvel ${propertyCtx.ref} — ${propertyCtx.title}`,
      propertyCtx.location ? `(${propertyCtx.location})` : '',
      propertyCtx.url,
    ].filter(Boolean);
    return `${base}?text=${encodeURIComponent(lines.join('\n'))}`;
  }, [propertyCtx]);

  return (
    <section id="contacto" className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85 }}
          >
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-2">
              {t('contact.title')}
            </h2>
            <p className="text-muted-foreground font-body mb-8">{t('contact.subtitle')}</p>

            {propertyCtx && (
              <div className="mb-6 rounded-xl border border-primary/25 bg-primary/[0.04] p-4 flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center flex-shrink-0">
                  <Home className="h-4 w-4 text-primary" strokeWidth={1.75} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-eyebrow mb-1">
                    {propertyCtx.intent === 'visit' ? 'Pedido de visita' : propertyCtx.intent === 'dossier' ? 'Pedido de dossier' : 'Pedido de informação'} · {propertyCtx.ref}
                  </p>
                  <p className="font-display text-foreground font-semibold truncate">{propertyCtx.title}</p>
                  {propertyCtx.location && (
                    <p className="text-xs text-muted-foreground font-body mt-0.5">{propertyCtx.location}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={clearPropertyCtx}
                  aria-label="Remover contexto do imóvel"
                  className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot: hidden from users, bots fill it → we drop the submission server-side */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                className="hidden"
                aria-hidden="true"
              />
              <Input
                placeholder={t('contact.name')}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-card border-border font-body"
                maxLength={100}
                required
              />
              <Input
                type="email"
                placeholder={t('contact.email')}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="bg-card border-border font-body"
                maxLength={255}
                required
              />
              <Input
                type="tel"
                placeholder={t('contact.phone')}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="bg-card border-border font-body"
                maxLength={20}
              />
              <Select value={form.interest} onValueChange={(v) => setForm({ ...form, interest: v })}>
                <SelectTrigger className="bg-card border-border font-body">
                  <SelectValue placeholder={t('contact.interest')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">{t('contact.interest.buy')}</SelectItem>
                  <SelectItem value="rent">{t('contact.interest.rent')}</SelectItem>
                  <SelectItem value="invest">{t('contact.interest.invest')}</SelectItem>
                  <SelectItem value="sell">{t('contact.interest.sell')}</SelectItem>
                </SelectContent>
              </Select>
              <Textarea
                placeholder={t('contact.message')}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="bg-card border-border font-body min-h-[120px]"
                maxLength={2000}
                required
              />
              <Button type="submit" size="lg" className="w-full font-body" disabled={submitting}>
                {submitting ? 'A enviar…' : t('contact.send')}
              </Button>
            </form>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85 }}
            className="flex flex-col justify-center gap-8"
          >
            <div>
              <p className="text-muted-foreground font-body mb-4">{t('contact.or')}</p>
              <Button asChild size="lg" variant="outline" className="w-full border-[hsl(142,70%,45%)] text-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,45%)] hover:text-white font-body">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  {t('contact.whatsapp')}
                </a>
              </Button>
            </div>

            <div className="space-y-4">
              <a href="mailto:contacto@idoneaimobiliaria.cv" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors font-body">
                <Mail className="h-5 w-5 text-primary" />
                contacto@idoneaimobiliaria.cv
              </a>
              <a href="mailto:comercial@idoneaimobiliaria.cv" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors font-body">
                <Mail className="h-5 w-5 text-primary" />
                comercial@idoneaimobiliaria.cv
              </a>
              <a href="tel:+2389808947" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors font-body">
                <Phone className="h-5 w-5 text-primary" />
                +238 980 8947 (Empresa)
              </a>
              <a href="tel:+2389242197" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors font-body">
                <Phone className="h-5 w-5 text-primary" />
                +238 924 2197 (Pessoal)
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
