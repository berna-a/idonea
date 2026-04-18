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
import { ArrowLeft, X, Save, Send, Upload, Loader2, ChevronUp, ChevronDown, Star, AlertTriangle } from 'lucide-react';

const ISLANDS = ['Santiago', 'Santo Antão', 'São Vicente', 'Sal', 'Boa Vista', 'Fogo', 'Brava', 'Maio', 'São Nicolau'];

type ImageRow = { file: File; preview: string; is_main: boolean };

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

// Generate readable, unique reference: IDN-YYMMDD-XXXX
const generateRef = () => {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `IDN-${yy}${mm}${dd}-${rand}`;
};

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
  const [title, setTitle] = useState('');
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
  const [description, setDescription] = useState('');
  const [editorial, setEditorial] = useState('');

  // Flags
  const [isFeatured, setIsFeatured] = useState(false);
  const [isIdoneaSelection, setIsIdoneaSelection] = useState(false);
  const [isInvestment, setIsInvestment] = useState(false);
  const [isOwnUse, setIsOwnUse] = useState(false);
  const [isSecondHome, setIsSecondHome] = useState(false);

  // Images
  const [images, setImages] = useState<ImageRow[]>([]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const next: ImageRow[] = files.map((file, idx) => ({
      file,
      preview: URL.createObjectURL(file),
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
    if (!title.trim()) return 'O título é obrigatório.';
    if (!island.trim()) return 'A ilha é obrigatória.';
    if (!cityOrZone.trim()) return 'A zona/cidade é obrigatória.';
    if (!price || isNaN(Number(price))) return 'O preço deve ser um número válido.';
    if (asActive && images.length === 0) return 'Para publicar, adicione pelo menos uma imagem.';
    return null;
  };

  const submit = async (publishStatus: 'draft' | 'active') => {
    const err = validate(publishStatus === 'active');
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
      const autoRef = generateRef();
      const titleClean = title.trim();
      const descClean = description.trim() || null;
      const editClean = editorial.trim() || null;

      console.log('[submit] inserting property with ref:', autoRef);
      const { data: property, error: propError } = await supabase
        .from('properties')
        .insert({
          ref: autoRef,
          // PT fields (only those edited in admin)
          title_pt: titleClean,
          // EN fallback to PT to satisfy schema NOT NULL
          title_en: titleClean,
          description_pt: descClean,
          description_en: descClean,
          editorial_pt: editClean,
          editorial_en: editClean,
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
          status: publishStatus,
          is_featured: isFeatured,
          is_idonea_selection: isIdoneaSelection,
          is_investment: isInvestment,
          is_own_use: isOwnUse,
          is_second_home: isSecondHome,
          ideal_for_pt: [],
          ideal_for_en: [],
        })
        .select('id')
        .single();

      if (propError) throw propError;
      propertyId = property.id;
      console.log('[submit] property created:', propertyId);

      // Upload images — resilient: continue on per-file failure
      const failedUploads: { index: number; reason: string }[] = [];
      const uploadedRows: { url: string; is_main: boolean; sort_order: number }[] = [];

      if (images.length) {
        stage = 'carregar imagens';
        for (let i = 0; i < images.length; i++) {
          const img = images[i];
          const ext = (img.file.name.split('.').pop() || 'jpg').toLowerCase();
          const path = `${propertyId}/${Date.now()}-${i}.${ext}`;
          const { error: upErr } = await uploadWithTimeout(path, img.file);
          if (upErr) {
            console.error(`[submit] image ${i + 1} failed:`, upErr.message);
            failedUploads.push({ index: i + 1, reason: upErr.message });
            continue;
          }
          const { data: pub } = supabase.storage.from('property-images').getPublicUrl(path);
          uploadedRows.push({ url: pub.publicUrl, is_main: img.is_main, sort_order: i });
        }

        if (uploadedRows.length && !uploadedRows.some((r) => r.is_main)) {
          uploadedRows[0].is_main = true;
        }

        if (uploadedRows.length) {
          stage = 'gravar registos de imagens';
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

      // Safety: if publishing and ALL image uploads failed, downgrade to draft
      let finalStatus: 'draft' | 'active' = publishStatus;
      if (publishStatus === 'active' && images.length > 0 && uploadedRows.length === 0) {
        stage = 'reverter para rascunho';
        const { error: downgradeErr } = await supabase
          .from('properties')
          .update({ status: 'draft' })
          .eq('id', propertyId);
        if (!downgradeErr) finalStatus = 'draft';
        toast({
          title: 'Publicação revertida para rascunho',
          description: 'Nenhuma imagem foi carregada com sucesso. O imóvel foi guardado como rascunho para evitar publicação sem imagens.',
          variant: 'destructive',
        });
      } else if (failedUploads.length > 0) {
        toast({
          title: 'Imóvel criado com avisos',
          description: `${uploadedRows.length}/${images.length} imagens carregadas. Falharam: ${failedUploads.map((f) => `#${f.index}`).join(', ')}.`,
        });
      } else {
        toast({
          title: finalStatus === 'active' ? 'Imóvel publicado' : 'Rascunho guardado',
          description: `${titleClean} (${autoRef}) foi guardado com sucesso.`,
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
              A referência é gerada automaticamente. Pode guardar como rascunho a qualquer momento.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* 1. Base info */}
          <Section title="Informação base" description="Dados essenciais para identificação e localização.">
            <Field label="Título *">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Apartamento com vista mar" />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* 2. Conteúdo */}
          <Section title="Conteúdo" description="Descrição e texto editorial em Português.">
            <Field label="Descrição">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Descrição do imóvel…"
              />
            </Field>
            <Field label="Editorial" hint="Texto narrativo, mais cuidado, para a página do imóvel.">
              <Textarea
                value={editorial}
                onChange={(e) => setEditorial(e.target.value)}
                rows={5}
                placeholder="Texto editorial…"
              />
            </Field>
          </Section>

          {/* 3. Flags editoriais */}
          <Section title="Destaques editoriais" description="Marcações manuais que controlam onde o imóvel aparece.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { v: isFeatured, set: setIsFeatured, label: 'Destaque na homepage' },
                { v: isIdoneaSelection, set: setIsIdoneaSelection, label: 'Seleção IDÓNEA' },
                { v: isInvestment, set: setIsInvestment, label: 'Investimento' },
                { v: isOwnUse, set: setIsOwnUse, label: 'Uso Próprio' },
                { v: isSecondHome, set: setIsSecondHome, label: 'Segunda Residência' },
              ].map((f) => (
                <label key={f.label} className="flex items-center gap-2.5 cursor-pointer text-sm text-foreground">
                  <Checkbox checked={f.v} onCheckedChange={(c) => f.set(!!c)} />
                  {f.label}
                </label>
              ))}
            </div>
          </Section>

          {/* 4. Aviso publicação */}
          <Card className="p-4 bg-muted/20 border-border flex gap-3">
            <AlertTriangle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              O estado é definido pelos botões abaixo: <span className="text-foreground">Guardar rascunho</span> cria como rascunho, <span className="text-foreground">Publicar</span> torna o imóvel ativo. Outros estados (reservado, vendido, arquivado) serão geridos mais tarde na edição do imóvel.
            </p>
          </Card>

          {/* 5. Imagens */}
          <Section title="Imagens" description="Carregue a imagem principal e galeria. Pode definir qual é a principal.">
            <label className="flex items-center justify-center gap-2 border border-dashed border-border rounded-md py-8 cursor-pointer hover:bg-muted/30 transition-colors">
              <Upload className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Selecionar imagens</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelect} />
            </label>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative group border border-border rounded-md overflow-hidden bg-muted">
                    <img src={img.preview} alt="" className="w-full h-32 object-cover" />
                    {img.is_main && (
                      <div className="absolute top-1.5 left-1.5 bg-primary text-primary-foreground text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Star className="h-2.5 w-2.5" /> Principal
                      </div>
                    )}
                    <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                      {!img.is_main && (
                        <Button size="sm" variant="secondary" className="h-7 px-2 text-[11px]" onClick={() => setMainImage(i)}>
                          <Star className="h-3 w-3 mr-1" /> Principal
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={() => moveImage(i, -1)} disabled={i === 0}>
                        <ChevronUp className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={() => moveImage(i, 1)} disabled={i === images.length - 1}>
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="destructive" className="h-7 w-7 p-0" onClick={() => removeImage(i)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* Actions */}
          <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => navigate('/admin/properties')} disabled={submitting}>
              Cancelar
            </Button>
            <Button variant="outline" onClick={() => submit('draft')} disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Guardar rascunho
            </Button>
            <Button onClick={() => submit('active')} disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              Publicar
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPropertyNew;
