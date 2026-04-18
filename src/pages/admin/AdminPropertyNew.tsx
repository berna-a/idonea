import { forwardRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Plus, X, Save, Send, Upload, Loader2, GripVertical, Star } from 'lucide-react';

const ISLANDS = ['Santiago', 'Santo Antão', 'São Vicente', 'Sal', 'Boa Vista', 'Fogo', 'Brava', 'Maio', 'São Nicolau'];

type FeatureRow = { key: string; value_pt: string; value_en: string; sort_order: number };
type HighlightRow = { title_pt: string; title_en: string; description_pt: string; description_en: string; sort_order: number };
type ImageRow = { file: File; preview: string; alt_pt: string; alt_en: string; is_main: boolean };

const Section = forwardRef<HTMLDivElement, { title: string; description?: string; children: React.ReactNode }>(
  ({ title, description, children }, ref) => (
    <Card ref={ref} className="p-6 bg-card border-border">
      <div className="mb-5">
        <h3 className="text-base font-medium text-foreground">{title}</h3>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </Card>
  )
);
Section.displayName = 'Section';

const Field = ({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) => (
  <div className="space-y-1.5">
    <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
    {children}
    {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
  </div>
);

const uploadWithTimeout = async (path: string, file: File, timeoutMs = 30000) => {
  return await Promise.race([
    supabase.storage.from('property-images').upload(path, file, { cacheControl: '3600', upsert: false }),
    new Promise<{ error: Error }>((resolve) =>
      setTimeout(() => resolve({ error: new Error(`Upload demorou mais de ${timeoutMs / 1000}s`) }), timeoutMs)
    ),
  ]);
};

const AdminPropertyNew = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  // Base info
  const [ref, setRef] = useState('');
  const [titlePt, setTitlePt] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [transactionType, setTransactionType] = useState<'sale' | 'rent'>('sale');
  const [propertyType, setPropertyType] = useState<'apartment' | 'house' | 'land' | 'commercial'>('apartment');
  const [island, setIsland] = useState('Santiago');
  const [cityOrZone, setCityOrZone] = useState('');
  const [shortLocation, setShortLocation] = useState('');
  const [price, setPrice] = useState('');
  const [area, setArea] = useState('');
  const [bedrooms, setBedrooms] = useState('0');
  const [bathrooms, setBathrooms] = useState('0');
  const [parking, setParking] = useState('');

  // Editorial
  const [descriptionPt, setDescriptionPt] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [editorialPt, setEditorialPt] = useState('');
  const [editorialEn, setEditorialEn] = useState('');

  // Ideal for
  const [idealForPt, setIdealForPt] = useState<string[]>([]);
  const [idealForEn, setIdealForEn] = useState<string[]>([]);
  const [newIdealPt, setNewIdealPt] = useState('');
  const [newIdealEn, setNewIdealEn] = useState('');

  // Flags
  const [isFeatured, setIsFeatured] = useState(false);
  const [isIdoneaSelection, setIsIdoneaSelection] = useState(false);
  const [isInvestment, setIsInvestment] = useState(false);
  const [isOwnUse, setIsOwnUse] = useState(false);
  const [isSecondHome, setIsSecondHome] = useState(false);

  // Features & highlights
  const [features, setFeatures] = useState<FeatureRow[]>([]);
  const [highlights, setHighlights] = useState<HighlightRow[]>([]);

  // Images
  const [images, setImages] = useState<ImageRow[]>([]);

  const addIdealPt = () => {
    if (!newIdealPt.trim()) return;
    setIdealForPt([...idealForPt, newIdealPt.trim()]);
    setNewIdealPt('');
  };
  const addIdealEn = () => {
    if (!newIdealEn.trim()) return;
    setIdealForEn([...idealForEn, newIdealEn.trim()]);
    setNewIdealEn('');
  };

  const addFeature = () => setFeatures([...features, { key: '', value_pt: '', value_en: '', sort_order: features.length }]);
  const updateFeature = (i: number, patch: Partial<FeatureRow>) =>
    setFeatures(features.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));
  const removeFeature = (i: number) => setFeatures(features.filter((_, idx) => idx !== i));

  const addHighlight = () =>
    setHighlights([...highlights, { title_pt: '', title_en: '', description_pt: '', description_en: '', sort_order: highlights.length }]);
  const updateHighlight = (i: number, patch: Partial<HighlightRow>) =>
    setHighlights(highlights.map((h, idx) => (idx === i ? { ...h, ...patch } : h)));
  const removeHighlight = (i: number) => setHighlights(highlights.filter((_, idx) => idx !== i));

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const next: ImageRow[] = files.map((file, idx) => ({
      file,
      preview: URL.createObjectURL(file),
      alt_pt: '',
      alt_en: '',
      is_main: images.length === 0 && idx === 0,
    }));
    setImages([...images, ...next]);
    e.target.value = '';
  };
  const setMainImage = (i: number) => setImages(images.map((img, idx) => ({ ...img, is_main: idx === i })));
  const removeImage = (i: number) => {
    URL.revokeObjectURL(images[i].preview);
    const filtered = images.filter((_, idx) => idx !== i);
    if (!filtered.some((img) => img.is_main) && filtered.length > 0) filtered[0].is_main = true;
    setImages(filtered);
  };
  const moveImage = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= images.length) return;
    const next = [...images];
    [next[i], next[j]] = [next[j], next[i]];
    setImages(next);
  };

  const validate = (asActive: boolean): string | null => {
    if (!ref.trim()) return 'A referência é obrigatória.';
    if (!titlePt.trim()) return 'O título PT é obrigatório.';
    if (!titleEn.trim()) return 'O título EN é obrigatório.';
    if (!island.trim()) return 'A ilha é obrigatória.';
    if (!cityOrZone.trim()) return 'A zona/cidade é obrigatória.';
    if (!price || isNaN(Number(price))) return 'O preço deve ser um número válido.';
    if (asActive && images.length === 0) return 'Para publicar, adicione pelo menos uma imagem.';
    return null;
  };

  const submit = async (status: 'draft' | 'active') => {
    const err = validate(status === 'active');
    if (err) {
      toast({ title: 'Verifique o formulário', description: err, variant: 'destructive' });
      return;
    }
    if (!user) {
      toast({ title: 'Sessão expirada', description: 'Por favor faça login novamente.', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    let propertyId: string | null = null;
    let stage = 'iniciar';

    try {
      stage = 'criar imóvel';
      console.log('[submit] 1/4 inserting property…');
      const { data: property, error: propError } = await supabase
        .from('properties')
        .insert({
          ref: ref.trim(),
          title_pt: titlePt.trim(),
          title_en: titleEn.trim(),
          description_pt: descriptionPt.trim() || null,
          description_en: descriptionEn.trim() || null,
          editorial_pt: editorialPt.trim() || null,
          editorial_en: editorialEn.trim() || null,
          transaction_type: transactionType,
          property_type: propertyType,
          island: island.trim(),
          city_or_zone: cityOrZone.trim(),
          short_location: shortLocation.trim() || null,
          price: Number(price),
          area: area ? Number(area) : null,
          bedrooms: Number(bedrooms) || 0,
          bathrooms: Number(bathrooms) || 0,
          parking: parking.trim() || null,
          status,
          is_featured: isFeatured,
          is_idonea_selection: isIdoneaSelection,
          is_investment: isInvestment,
          is_own_use: isOwnUse,
          is_second_home: isSecondHome,
          ideal_for_pt: idealForPt,
          ideal_for_en: idealForEn,
        })
        .select('id')
        .single();

      if (propError) throw propError;
      propertyId = property.id;
      console.log('[submit] property created:', propertyId);

      const validFeatures = features.filter((f) => f.key.trim() && f.value_pt.trim() && f.value_en.trim());
      if (validFeatures.length) {
        stage = 'gravar características';
        console.log('[submit] 2/4 inserting features:', validFeatures.length);
        const { error } = await supabase.from('property_features').insert(
          validFeatures.map((f, idx) => ({
            property_id: propertyId,
            key: f.key.trim(),
            value_pt: f.value_pt.trim(),
            value_en: f.value_en.trim(),
            sort_order: idx,
          }))
        );
        if (error) throw error;
      }

      const validHighlights = highlights.filter(
        (h) => h.title_pt.trim() && h.title_en.trim() && h.description_pt.trim() && h.description_en.trim()
      );
      if (validHighlights.length) {
        stage = 'gravar destaques';
        console.log('[submit] 3/4 inserting highlights:', validHighlights.length);
        const { error } = await supabase.from('property_highlights').insert(
          validHighlights.map((h, idx) => ({
            property_id: propertyId,
            title_pt: h.title_pt.trim(),
            title_en: h.title_en.trim(),
            description_pt: h.description_pt.trim(),
            description_en: h.description_en.trim(),
            sort_order: idx,
          }))
        );
        if (error) throw error;
      }

      // 4. Upload images — RESILIENT: continue on per-file failure
      const failedUploads: { index: number; reason: string }[] = [];
      const uploadedRows: { url: string; alt_pt: string | null; alt_en: string | null; is_main: boolean; sort_order: number }[] = [];

      if (images.length) {
        stage = 'carregar imagens';
        console.log('[submit] 4/4 uploading images:', images.length);
        for (let i = 0; i < images.length; i++) {
          const img = images[i];
          const ext = (img.file.name.split('.').pop() || 'jpg').toLowerCase();
          const path = `${propertyId}/${Date.now()}-${i}.${ext}`;
          console.log(`[submit] uploading image ${i + 1}/${images.length}…`);
          const { error: upErr } = await uploadWithTimeout(path, img.file);
          if (upErr) {
            console.error(`[submit] image ${i + 1} failed:`, upErr.message);
            failedUploads.push({ index: i + 1, reason: upErr.message });
            continue;
          }
          const { data: pub } = supabase.storage.from('property-images').getPublicUrl(path);
          uploadedRows.push({
            url: pub.publicUrl,
            alt_pt: img.alt_pt.trim() || null,
            alt_en: img.alt_en.trim() || null,
            is_main: img.is_main,
            sort_order: i,
          });
        }

        if (uploadedRows.length && !uploadedRows.some((r) => r.is_main)) {
          uploadedRows[0].is_main = true;
        }

        if (uploadedRows.length) {
          stage = 'gravar registos de imagens';
          console.log('[submit] inserting property_images rows:', uploadedRows.length);
          const { error: imgErr } = await supabase
            .from('property_images')
            .insert(uploadedRows.map((r) => ({ property_id: propertyId, ...r })));
          if (imgErr) {
            console.error('[submit] property_images insert failed:', imgErr.message);
            toast({
              title: 'Imóvel criado, mas registos de imagens falharam',
              description: imgErr.message,
              variant: 'destructive',
            });
          }
        }
      }

      if (failedUploads.length > 0) {
        toast({
          title: 'Imóvel criado com avisos',
          description: `${uploadedRows.length}/${images.length} imagens carregadas. Falharam: ${failedUploads.map((f) => `#${f.index}`).join(', ')}.`,
        });
      } else {
        toast({
          title: status === 'active' ? 'Imóvel publicado' : 'Rascunho guardado',
          description: `${titlePt} foi guardado com sucesso.`,
        });
      }

      navigate('/admin/properties');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Erro desconhecido.';
      console.error(`[submit] failed at stage "${stage}":`, e);
      toast({
        title: `Erro ao ${stage}`,
        description: propertyId
          ? `Imóvel criado (id ${propertyId.slice(0, 8)}…), mas falhou: ${message}`
          : message,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <AdminLayout>
        <div className="text-center py-20 text-muted-foreground text-sm">A carregar…</div>
      </AdminLayout>
    );
  }

  if (!user || !isAdmin) {
    return (
      <AdminLayout>
        <div className="text-center py-20 text-muted-foreground text-sm">Acesso restrito.</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate('/admin/properties')}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Voltar à lista
            </button>
            <h2 className="text-xl font-light text-foreground">Adicionar Imóvel</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Preencha os campos do novo imóvel. Pode guardar como rascunho a qualquer momento.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* 1. Base info */}
          <Section title="Informação base" description="Dados essenciais para identificação e localização.">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Referência *">
                <Input value={ref} onChange={(e) => setRef(e.target.value)} placeholder="IDN-001" />
              </Field>
              <Field label="Tipo de negócio *">
                <Select value={transactionType} onValueChange={(v) => setTransactionType(v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">Venda</SelectItem>
                    <SelectItem value="rent">Arrendamento</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Tipo de imóvel *">
                <Select value={propertyType} onValueChange={(v) => setPropertyType(v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartamento</SelectItem>
                    <SelectItem value="house">Moradia</SelectItem>
                    <SelectItem value="land">Terreno</SelectItem>
                    <SelectItem value="commercial">Comercial</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Título PT *">
                <Input value={titlePt} onChange={(e) => setTitlePt(e.target.value)} placeholder="Apartamento com vista mar" />
              </Field>
              <Field label="Título EN *">
                <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} placeholder="Sea-view apartment" />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Ilha *">
                <Select value={island} onValueChange={setIsland}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ISLANDS.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Zona / Cidade *">
                <Input value={cityOrZone} onChange={(e) => setCityOrZone(e.target.value)} placeholder="Praia" />
              </Field>
              <Field label="Localização curta" hint="Ex: Achada Santo António">
                <Input value={shortLocation} onChange={(e) => setShortLocation(e.target.value)} />
              </Field>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Field label="Preço (CVE) *">
                <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="15000000" />
              </Field>
              <Field label="Área (m²)">
                <Input type="number" value={area} onChange={(e) => setArea(e.target.value)} placeholder="120" />
              </Field>
              <Field label="Quartos">
                <Input type="number" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} />
              </Field>
              <Field label="Casas de banho">
                <Input type="number" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} />
              </Field>
              <Field label="Estacionamento">
                <Input value={parking} onChange={(e) => setParking(e.target.value)} placeholder="2 lugares" />
              </Field>
            </div>
          </Section>

          {/* 2. Editorial */}
          <Section title="Conteúdo editorial" description="Textos descritivos em português e inglês.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Descrição PT">
                <Textarea rows={4} value={descriptionPt} onChange={(e) => setDescriptionPt(e.target.value)} />
              </Field>
              <Field label="Descrição EN">
                <Textarea rows={4} value={descriptionEn} onChange={(e) => setDescriptionEn(e.target.value)} />
              </Field>
              <Field label="Editorial PT" hint="Texto longo, narrativo">
                <Textarea rows={6} value={editorialPt} onChange={(e) => setEditorialPt(e.target.value)} />
              </Field>
              <Field label="Editorial EN" hint="Long-form narrative">
                <Textarea rows={6} value={editorialEn} onChange={(e) => setEditorialEn(e.target.value)} />
              </Field>
            </div>
          </Section>

          {/* 3. Ideal for */}
          <Section title="Ideal para" description="Públicos-alvo a destacar.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Ideal para (PT)</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newIdealPt}
                    onChange={(e) => setNewIdealPt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addIdealPt())}
                    placeholder="Famílias, investidores…"
                  />
                  <Button type="button" variant="outline" size="icon" onClick={addIdealPt}><Plus className="h-4 w-4" /></Button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {idealForPt.map((tag, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 bg-secondary text-foreground text-xs px-2.5 py-1 rounded">
                      {tag}
                      <button onClick={() => setIdealForPt(idealForPt.filter((_, idx) => idx !== i))}>
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Ideal for (EN)</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newIdealEn}
                    onChange={(e) => setNewIdealEn(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addIdealEn())}
                    placeholder="Families, investors…"
                  />
                  <Button type="button" variant="outline" size="icon" onClick={addIdealEn}><Plus className="h-4 w-4" /></Button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {idealForEn.map((tag, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 bg-secondary text-foreground text-xs px-2.5 py-1 rounded">
                      {tag}
                      <button onClick={() => setIdealForEn(idealForEn.filter((_, idx) => idx !== i))}>
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* 4. Flags */}
          <Section title="Flags editoriais" description="Marcações manuais para destacar o imóvel.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { v: isFeatured, set: setIsFeatured, label: 'Destaque na homepage' },
                { v: isIdoneaSelection, set: setIsIdoneaSelection, label: 'Seleção IDÓNEA' },
                { v: isInvestment, set: setIsInvestment, label: 'Investimento' },
                { v: isOwnUse, set: setIsOwnUse, label: 'Uso próprio' },
                { v: isSecondHome, set: setIsSecondHome, label: 'Segunda residência' },
              ].map((f) => (
                <label key={f.label} className="flex items-center gap-2.5 px-3 py-2.5 border border-border rounded-md cursor-pointer hover:bg-secondary/30 transition-colors">
                  <Checkbox checked={f.v} onCheckedChange={(c) => f.set(Boolean(c))} />
                  <span className="text-sm text-foreground">{f.label}</span>
                </label>
              ))}
            </div>
          </Section>

          {/* 5. Features */}
          <Section title="Características" description="Características técnicas (ex: orientação, ano, certificação).">
            {features.length === 0 && <p className="text-xs text-muted-foreground">Sem características adicionadas.</p>}
            <div className="space-y-3">
              {features.map((f, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-start">
                  <Input className="col-span-3" placeholder="Chave (ex: floor)" value={f.key} onChange={(e) => updateFeature(i, { key: e.target.value })} />
                  <Input className="col-span-4" placeholder="Valor PT" value={f.value_pt} onChange={(e) => updateFeature(i, { value_pt: e.target.value })} />
                  <Input className="col-span-4" placeholder="Value EN" value={f.value_en} onChange={(e) => updateFeature(i, { value_en: e.target.value })} />
                  <Button variant="ghost" size="icon" className="col-span-1" onClick={() => removeFeature(i)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addFeature} className="gap-2">
              <Plus className="h-3.5 w-3.5" /> Adicionar característica
            </Button>
          </Section>

          {/* 6. Highlights */}
          <Section title="Destaques editoriais" description="Pontos fortes do imóvel, descritos em PT e EN.">
            {highlights.length === 0 && <p className="text-xs text-muted-foreground">Sem destaques adicionados.</p>}
            <div className="space-y-4">
              {highlights.map((h, i) => (
                <div key={i} className="border border-border rounded-md p-4 space-y-3 bg-background/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Destaque #{i + 1}</span>
                    <Button variant="ghost" size="icon" onClick={() => removeHighlight(i)}><X className="h-4 w-4" /></Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input placeholder="Título PT" value={h.title_pt} onChange={(e) => updateHighlight(i, { title_pt: e.target.value })} />
                    <Input placeholder="Title EN" value={h.title_en} onChange={(e) => updateHighlight(i, { title_en: e.target.value })} />
                    <Textarea rows={2} placeholder="Descrição PT" value={h.description_pt} onChange={(e) => updateHighlight(i, { description_pt: e.target.value })} />
                    <Textarea rows={2} placeholder="Description EN" value={h.description_en} onChange={(e) => updateHighlight(i, { description_en: e.target.value })} />
                  </div>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addHighlight} className="gap-2">
              <Plus className="h-3.5 w-3.5" /> Adicionar destaque
            </Button>
          </Section>

          {/* 7. Images */}
          <Section title="Imagens" description="A imagem principal aparece em primeiro lugar. Marque qual quer destacar.">
            <div className="border border-dashed border-border rounded-md p-6 text-center">
              <input type="file" id="img-upload" multiple accept="image/*" className="hidden" onChange={handleImageSelect} />
              <label htmlFor="img-upload" className="cursor-pointer inline-flex flex-col items-center gap-2">
                <Upload className="h-6 w-6 text-muted-foreground" />
                <span className="text-sm text-foreground">Clique para escolher imagens</span>
                <span className="text-xs text-muted-foreground">JPG, PNG ou WEBP</span>
              </label>
            </div>

            {images.length > 0 && (
              <div className="space-y-2">
                {images.map((img, i) => (
                  <div key={i} className="flex gap-3 items-center border border-border rounded-md p-2 bg-background/50">
                    <div className="flex flex-col">
                      <button onClick={() => moveImage(i, -1)} disabled={i === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-30 text-xs">▲</button>
                      <GripVertical className="h-3 w-3 text-muted-foreground" />
                      <button onClick={() => moveImage(i, 1)} disabled={i === images.length - 1} className="text-muted-foreground hover:text-foreground disabled:opacity-30 text-xs">▼</button>
                    </div>
                    <img src={img.preview} alt="" className="h-16 w-20 object-cover rounded" />
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <Input placeholder="Alt PT" value={img.alt_pt} onChange={(e) => setImages(images.map((im, idx) => idx === i ? { ...im, alt_pt: e.target.value } : im))} className="h-8 text-xs" />
                      <Input placeholder="Alt EN" value={img.alt_en} onChange={(e) => setImages(images.map((im, idx) => idx === i ? { ...im, alt_en: e.target.value } : im))} className="h-8 text-xs" />
                    </div>
                    <Button
                      type="button"
                      variant={img.is_main ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setMainImage(i)}
                      className="gap-1.5"
                    >
                      <Star className={`h-3.5 w-3.5 ${img.is_main ? 'fill-current' : ''}`} />
                      {img.is_main ? 'Principal' : 'Definir'}
                    </Button>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeImage(i)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => navigate('/admin/properties')} disabled={submitting}>
              Cancelar
            </Button>
            <Button variant="outline" onClick={() => submit('draft')} disabled={submitting} className="gap-2">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Guardar rascunho
            </Button>
            <Button onClick={() => submit('active')} disabled={submitting} className="gap-2">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Publicar
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPropertyNew;
