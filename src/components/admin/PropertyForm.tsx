import { forwardRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import {
  ArrowLeft, X, Save, Send, Upload, Loader2, ChevronUp, ChevronDown, Star, AlertTriangle,
  MapPin, ExternalLink, Lock,
} from 'lucide-react';

const ISLANDS = ['Santiago', 'Santo Antão', 'São Vicente', 'Sal', 'Boa Vista', 'Fogo', 'Brava', 'Maio', 'São Nicolau'];

export type PropertyFormMode = 'create' | 'edit';

export type ExistingImage = {
  id: string;
  url: string;
  is_main: boolean;
  sort_order: number;
};

export type PropertyInitialData = {
  id?: string;
  ref?: string | null;
  title?: string;
  transaction_type?: 'sale' | 'rent';
  property_type?: 'apartment' | 'house' | 'land' | 'commercial';
  island?: string;
  city_or_zone?: string;
  short_location?: string;
  price?: string;
  area?: string;
  bedrooms?: string;
  bathrooms?: string;
  parking?: string;
  neighborhood?: string;
  address_full?: string;
  map_url?: string;
  latitude?: string;
  longitude?: string;
  description?: string;
  editorial?: string;
  is_featured?: boolean;
  is_idonea_selection?: boolean;
  is_investment?: boolean;
  is_own_use?: boolean;
  is_second_home?: boolean;
  status?: 'draft' | 'active' | 'reserved' | 'sold' | 'archived';
  existingImages?: ExistingImage[];
};

type NewImageRow = { file: File; preview: string; is_main: boolean };

const Section = forwardRef<HTMLDivElement, { title: string; description?: string; children: React.ReactNode }>(
  ({ title, description, children }, ref) => (
    <Card ref={ref} className="p-6 bg-card border-border">
      <div className="mb-5">
        <h3 className="text-base font-medium text-foreground">{title}</h3>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </Card>
  ),
);
Section.displayName = 'Section';

const Field = ({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) => (
  <div className="space-y-1.5">
    <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
    {children}
    {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
  </div>
);

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
      setTimeout(() => resolve({ error: new Error(`Upload demorou mais de ${timeoutMs / 1000}s`) }), timeoutMs),
    ),
  ]);
};

interface PropertyFormProps {
  mode: PropertyFormMode;
  initial?: PropertyInitialData;
  userId: string;
}

const PropertyForm = ({ mode, initial }: PropertyFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState(initial?.title ?? '');
  const [transactionType, setTransactionType] = useState<'sale' | 'rent'>(initial?.transaction_type ?? 'sale');
  const [propertyType, setPropertyType] = useState<'apartment' | 'house' | 'land' | 'commercial'>(
    initial?.property_type ?? 'apartment',
  );
  const [island, setIsland] = useState(initial?.island ?? 'Santiago');
  const [cityOrZone, setCityOrZone] = useState(initial?.city_or_zone ?? '');
  const [shortLocation, setShortLocation] = useState(initial?.short_location ?? '');
  const [price, setPrice] = useState(initial?.price ?? '');
  const [area, setArea] = useState(initial?.area ?? '');
  const [bedrooms, setBedrooms] = useState(initial?.bedrooms ?? '0');
  const [bathrooms, setBathrooms] = useState(initial?.bathrooms ?? '0');
  const [parking, setParking] = useState(initial?.parking ?? '');

  const [neighborhood, setNeighborhood] = useState(initial?.neighborhood ?? '');
  const [addressFull, setAddressFull] = useState(initial?.address_full ?? '');
  const [mapUrl, setMapUrl] = useState(initial?.map_url ?? '');
  const [latitude, setLatitude] = useState(initial?.latitude ?? '');
  const [longitude, setLongitude] = useState(initial?.longitude ?? '');

  const [description, setDescription] = useState(initial?.description ?? '');
  const [editorial, setEditorial] = useState(initial?.editorial ?? '');

  const [isFeatured, setIsFeatured] = useState(initial?.is_featured ?? false);
  const [isIdoneaSelection, setIsIdoneaSelection] = useState(initial?.is_idonea_selection ?? false);
  const [isInvestment, setIsInvestment] = useState(initial?.is_investment ?? false);
  const [isOwnUse, setIsOwnUse] = useState(initial?.is_own_use ?? false);
  const [isSecondHome, setIsSecondHome] = useState(initial?.is_second_home ?? false);

  const [status, setStatus] = useState<'draft' | 'active' | 'reserved' | 'sold' | 'archived'>(
    initial?.status ?? 'draft',
  );

  const [existingImages, setExistingImages] = useState<ExistingImage[]>(initial?.existingImages ?? []);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);

  const [newImages, setNewImages] = useState<NewImageRow[]>([]);

  const totalImageCount = existingImages.length + newImages.length;
  const hasMain = existingImages.some((i) => i.is_main) || newImages.some((i) => i.is_main);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const next: NewImageRow[] = files.map((file, idx) => ({
      file,
      preview: URL.createObjectURL(file),
      is_main: !hasMain && idx === 0,
    }));
    setNewImages([...newImages, ...next]);
    e.target.value = '';
  };

  const setMainExisting = (id: string) => {
    setExistingImages(existingImages.map((img) => ({ ...img, is_main: img.id === id })));
    setNewImages(newImages.map((img) => ({ ...img, is_main: false })));
  };
  const setMainNew = (i: number) => {
    setNewImages(newImages.map((img, idx) => ({ ...img, is_main: idx === i })));
    setExistingImages(existingImages.map((img) => ({ ...img, is_main: false })));
  };

  const removeExisting = (id: string) => {
    const img = existingImages.find((x) => x.id === id);
    const filtered = existingImages.filter((x) => x.id !== id);
    setExistingImages(filtered);
    setRemovedImageIds([...removedImageIds, id]);
    if (img?.is_main) {
      if (filtered.length > 0) {
        filtered[0].is_main = true;
        setExistingImages([...filtered]);
      } else if (newImages.length > 0) {
        const next = [...newImages];
        next[0].is_main = true;
        setNewImages(next);
      }
    }
  };

  const removeNew = (i: number) => {
    URL.revokeObjectURL(newImages[i].preview);
    const wasMain = newImages[i].is_main;
    const filtered = newImages.filter((_, idx) => idx !== i);
    setNewImages(filtered);
    if (wasMain) {
      if (filtered.length > 0) {
        filtered[0].is_main = true;
        setNewImages([...filtered]);
      } else if (existingImages.length > 0) {
        const next = [...existingImages];
        next[0].is_main = true;
        setExistingImages(next);
      }
    }
  };

  const moveNewImage = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= newImages.length) return;
    const next = [...newImages];
    [next[i], next[j]] = [next[j], next[i]];
    setNewImages(next);
  };

  const validate = (asActive: boolean): string | null => {
    if (!title.trim()) return 'O título é obrigatório.';
    if (!island.trim()) return 'A ilha é obrigatória.';
    if (!cityOrZone.trim()) return 'A zona/cidade é obrigatória.';
    if (!price || isNaN(Number(price))) return 'O preço deve ser um número válido.';
    if (mapUrl.trim() && !/^https?:\/\//i.test(mapUrl.trim())) {
      return 'O link de mapa deve começar por http:// ou https://';
    }
    if (latitude.trim() && isNaN(Number(latitude))) return 'Latitude inválida.';
    if (longitude.trim() && isNaN(Number(longitude))) return 'Longitude inválida.';
    if (asActive && totalImageCount === 0) return 'Para publicar, adicione pelo menos uma imagem.';
    return null;
  };

  const locationPayload = () => ({
    neighborhood: neighborhood.trim() || null,
    address_full: addressFull.trim() || null,
    map_url: mapUrl.trim() || null,
    latitude: latitude.trim() ? Number(latitude) : null,
    longitude: longitude.trim() ? Number(longitude) : null,
  });

  const submitCreate = async (publishStatus: 'draft' | 'active') => {
    const err = validate(publishStatus === 'active');
    if (err) {
      toast({ title: 'Verifique o formulário', description: err, variant: 'destructive' });
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

      const { data: property, error: propError } = await supabase
        .from('properties')
        .insert({
          ref: autoRef,
          title_pt: titleClean,
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

      const failedUploads: number[] = [];
      const uploadedRows: { url: string; is_main: boolean; sort_order: number }[] = [];

      if (newImages.length) {
        stage = 'carregar imagens';
        for (let i = 0; i < newImages.length; i++) {
          const img = newImages[i];
          const ext = (img.file.name.split('.').pop() || 'jpg').toLowerCase();
          const path = `${propertyId}/${Date.now()}-${i}.${ext}`;
          const { error: upErr } = await uploadWithTimeout(path, img.file);
          if (upErr) {
            failedUploads.push(i + 1);
            continue;
          }
          const { data: pub } = supabase.storage.from('property-images').getPublicUrl(path);
          uploadedRows.push({ url: pub.publicUrl, is_main: img.is_main, sort_order: i });
        }

        if (uploadedRows.length && !uploadedRows.some((r) => r.is_main)) uploadedRows[0].is_main = true;

        if (uploadedRows.length) {
          stage = 'gravar registos de imagens';
          const { error: imgErr } = await supabase
            .from('property_images')
            .insert(uploadedRows.map((r) => ({ property_id: propertyId, ...r })));
          if (imgErr) {
            toast({ title: 'Imóvel criado, registos de imagens falharam', description: imgErr.message, variant: 'destructive' });
          }
        }
      }

      let finalStatus: 'draft' | 'active' = publishStatus;
      if (publishStatus === 'active' && newImages.length > 0 && uploadedRows.length === 0) {
        stage = 'reverter para rascunho';
        const { error: downgradeErr } = await supabase.from('properties').update({ status: 'draft' }).eq('id', propertyId);
        if (!downgradeErr) finalStatus = 'draft';
        toast({
          title: 'Publicação revertida para rascunho',
          description: 'Nenhuma imagem foi carregada com sucesso. O imóvel foi guardado como rascunho.',
          variant: 'destructive',
        });
      } else if (failedUploads.length > 0) {
        toast({
          title: 'Imóvel criado com avisos',
          description: `${uploadedRows.length}/${newImages.length} imagens carregadas. Falharam: ${failedUploads.map((n) => `#${n}`).join(', ')}.`,
        });
      } else {
        toast({
          title: finalStatus === 'active' ? 'Imóvel publicado' : 'Rascunho guardado',
          description: `${titleClean} (${autoRef}) foi guardado.`,
        });
      }

      navigate('/admin/properties');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Erro desconhecido.';
      console.error(`[create] failed at "${stage}":`, e);
      toast({
        title: `Erro ao ${stage}`,
        description: propertyId ? `Imóvel criado (${propertyId.slice(0, 8)}…), mas falhou: ${message}` : message,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const submitEdit = async () => {
    if (!initial?.id) return;
    const err = validate(status === 'active');
    if (err) {
      toast({ title: 'Verifique o formulário', description: err, variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    let stage = 'iniciar';

    try {
      const titleClean = title.trim();
      const descClean = description.trim() || null;
      const editClean = editorial.trim() || null;

      stage = 'atualizar imóvel';
      const { error: updErr } = await supabase
        .from('properties')
        .update({
          title_pt: titleClean,
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
          status,
          is_featured: isFeatured,
          is_idonea_selection: isIdoneaSelection,
          is_investment: isInvestment,
          is_own_use: isOwnUse,
          is_second_home: isSecondHome,
        })
        .eq('id', initial.id);

      if (updErr) throw updErr;

      if (removedImageIds.length) {
        stage = 'remover imagens';
        const { error: delErr } = await supabase.from('property_images').delete().in('id', removedImageIds);
        if (delErr) console.warn('[edit] failed to delete image rows:', delErr.message);
      }

      stage = 'atualizar imagens existentes';
      for (const img of existingImages) {
        await supabase
          .from('property_images')
          .update({ is_main: img.is_main, sort_order: img.sort_order })
          .eq('id', img.id);
      }

      const failedUploads: number[] = [];
      const uploadedRows: { url: string; is_main: boolean; sort_order: number }[] = [];

      if (newImages.length) {
        stage = 'carregar novas imagens';
        const startOrder = existingImages.length;
        for (let i = 0; i < newImages.length; i++) {
          const img = newImages[i];
          const ext = (img.file.name.split('.').pop() || 'jpg').toLowerCase();
          const path = `${initial.id}/${Date.now()}-${i}.${ext}`;
          const { error: upErr } = await uploadWithTimeout(path, img.file);
          if (upErr) {
            failedUploads.push(i + 1);
            continue;
          }
          const { data: pub } = supabase.storage.from('property-images').getPublicUrl(path);
          uploadedRows.push({ url: pub.publicUrl, is_main: img.is_main, sort_order: startOrder + i });
        }

        if (uploadedRows.length) {
          stage = 'gravar registos de novas imagens';
          const { error: imgErr } = await supabase
            .from('property_images')
            .insert(uploadedRows.map((r) => ({ property_id: initial.id, ...r })));
          if (imgErr) {
            toast({ title: 'Algumas imagens não foram registadas', description: imgErr.message, variant: 'destructive' });
          }
        }
      }

      const finalImageCount = existingImages.length + uploadedRows.length;
      if (status === 'active' && finalImageCount === 0) {
        await supabase.from('properties').update({ status: 'draft' }).eq('id', initial.id);
        toast({
          title: 'Estado revertido para rascunho',
          description: 'Não restam imagens. O imóvel foi guardado como rascunho.',
          variant: 'destructive',
        });
      } else if (failedUploads.length > 0) {
        toast({
          title: 'Alterações guardadas com avisos',
          description: `Falharam imagens: ${failedUploads.map((n) => `#${n}`).join(', ')}.`,
        });
      } else {
        toast({ title: 'Alterações guardadas', description: `${titleClean} foi atualizado com sucesso.` });
      }

      navigate('/admin/properties');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Erro desconhecido.';
      console.error(`[edit] failed at "${stage}":`, e);
      toast({ title: `Erro ao ${stage}`, description: message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => navigate('/admin/properties')}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Voltar à lista
          </button>
          <h2 className="text-xl font-light text-foreground">
            {mode === 'create' ? 'Adicionar Imóvel' : 'Editar Imóvel'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === 'create'
              ? 'A referência é gerada automaticamente. Pode guardar como rascunho a qualquer momento.'
              : 'Atualize os dados do imóvel. As alterações refletem-se no website após guardar.'}
          </p>
          {mode === 'edit' && initial?.ref && (
            <div className="mt-3 inline-flex items-center gap-2 px-2.5 py-1 bg-muted/40 border border-border rounded">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Ref.</span>
              <span className="font-mono text-xs text-foreground">{initial.ref}</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <Section title="Informação base" description="Dados essenciais para identificação e localização.">
          <Field label="Título *">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Apartamento com vista mar" />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Tipo de negócio *">
              <Select value={transactionType} onValueChange={(v) => setTransactionType(v as 'sale' | 'rent')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">Venda</SelectItem>
                  <SelectItem value="rent">Arrendamento</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Tipo de imóvel *">
              <Select
                value={propertyType}
                onValueChange={(v) => setPropertyType(v as 'apartment' | 'house' | 'land' | 'commercial')}
              >
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

        <Section title="Conteúdo" description="Descrição e texto editorial em Português.">
          <Field label="Descrição">
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Descrição do imóvel…" />
          </Field>
          <Field label="Editorial" hint="Texto narrativo, mais cuidado, para a página do imóvel.">
            <Textarea value={editorial} onChange={(e) => setEditorial(e.target.value)} rows={5} placeholder="Texto editorial…" />
          </Field>
        </Section>

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

        {mode === 'edit' ? (
          <Section title="Estado" description="Controla se o imóvel está visível no website.">
            <Field label="Estado do imóvel">
              <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
                <SelectTrigger className="max-w-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Rascunho</SelectItem>
                  <SelectItem value="active">Publicado</SelectItem>
                  <SelectItem value="reserved">Reservado</SelectItem>
                  <SelectItem value="sold">Vendido</SelectItem>
                  <SelectItem value="archived">Arquivado</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </Section>
        ) : (
          <Card className="p-4 bg-muted/20 border-border flex gap-3">
            <AlertTriangle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              O estado é definido pelos botões abaixo: <span className="text-foreground">Guardar rascunho</span> cria como rascunho, <span className="text-foreground">Publicar</span> torna o imóvel ativo. Outros estados (reservado, vendido, arquivado) são geridos na edição.
            </p>
          </Card>
        )}

        <Section title="Imagens" description="Carregue a imagem principal e galeria. Pode definir qual é a principal.">
          <label className="flex items-center justify-center gap-2 border border-dashed border-border rounded-md py-8 cursor-pointer hover:bg-muted/30 transition-colors">
            <Upload className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Selecionar imagens</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelect} />
          </label>

          {(existingImages.length > 0 || newImages.length > 0) && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {existingImages.map((img) => (
                <div key={img.id} className="relative group border border-border rounded-md overflow-hidden bg-muted">
                  <img src={img.url} alt="" className="w-full h-32 object-cover" />
                  {img.is_main && (
                    <div className="absolute top-1.5 left-1.5 bg-primary text-primary-foreground text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded flex items-center gap-1">
                      <Star className="h-2.5 w-2.5" /> Principal
                    </div>
                  )}
                  <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                    {!img.is_main && (
                      <Button size="sm" variant="secondary" className="h-7 px-2 text-[11px]" onClick={() => setMainExisting(img.id)}>
                        <Star className="h-3 w-3 mr-1" /> Principal
                      </Button>
                    )}
                    <Button size="sm" variant="destructive" className="h-7 w-7 p-0" onClick={() => removeExisting(img.id)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              {newImages.map((img, i) => (
                <div key={`new-${i}`} className="relative group border-2 border-dashed border-primary/40 rounded-md overflow-hidden bg-muted">
                  <img src={img.preview} alt="" className="w-full h-32 object-cover" />
                  <div className="absolute top-1.5 right-1.5 bg-primary/80 text-primary-foreground text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded">
                    Nova
                  </div>
                  {img.is_main && (
                    <div className="absolute top-1.5 left-1.5 bg-primary text-primary-foreground text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded flex items-center gap-1">
                      <Star className="h-2.5 w-2.5" /> Principal
                    </div>
                  )}
                  <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                    {!img.is_main && (
                      <Button size="sm" variant="secondary" className="h-7 px-2 text-[11px]" onClick={() => setMainNew(i)}>
                        <Star className="h-3 w-3 mr-1" /> Principal
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={() => moveNewImage(i, -1)} disabled={i === 0}>
                      <ChevronUp className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={() => moveNewImage(i, 1)} disabled={i === newImages.length - 1}>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="destructive" className="h-7 w-7 p-0" onClick={() => removeNew(i)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={() => navigate('/admin/properties')} disabled={submitting}>
            Cancelar
          </Button>
          {mode === 'create' ? (
            <>
              <Button variant="outline" onClick={() => submitCreate('draft')} disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Guardar rascunho
              </Button>
              <Button onClick={() => submitCreate('active')} disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                Publicar
              </Button>
            </>
          ) : (
            <Button onClick={submitEdit} disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Guardar alterações
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyForm;
