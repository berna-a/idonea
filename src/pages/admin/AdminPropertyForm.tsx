import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { islands } from '@/lib/sampleProperties';
import { ArrowLeft, X, Save, Send, Upload, Loader2, Star, Trash2 } from 'lucide-react';

const generateRef = () => {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `IDN-${yy}${mm}${dd}-${rand}`;
};

const Section = ({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) => (
  <Card className="p-6 bg-card border-border">
    <div className="mb-5">
      <h3 className="text-base font-medium text-foreground">{title}</h3>
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
    </div>
    <div className="space-y-4">{children}</div>
  </Card>
);

const Field = ({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) => (
  <div className="space-y-1.5">
    <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
    {children}
    {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
  </div>
);

type ImageRow = { storageId: Id<'_storage'>; sortOrder: number; url: string | null };

const AdminPropertyForm = () => {
  const { id } = useParams<{ id: string }>();
  const mode = id ? 'edit' : 'create';
  const navigate = useNavigate();
  const { toast } = useToast();

  const existing = useQuery(api.admin.getByIdAdmin, mode === 'edit' ? { id: id as Id<'properties'> } : 'skip');
  const createProperty = useMutation(api.admin.createProperty);
  const updateProperty = useMutation(api.admin.updateProperty);
  const generateUploadUrl = useMutation(api.properties.generateUploadUrl);

  const [loaded, setLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [titlePt, setTitlePt] = useState('');
  const [transactionType, setTransactionType] = useState<'sale' | 'rent'>('sale');
  const [propertyType, setPropertyType] = useState<'apartment' | 'house' | 'land' | 'commercial'>('apartment');
  const [island, setIsland] = useState('Santiago');
  const [cityOrZone, setCityOrZone] = useState('');
  const [shortLocation, setShortLocation] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState<'CVE' | 'EUR'>('CVE');
  const [area, setArea] = useState('');
  const [bedrooms, setBedrooms] = useState('0');
  const [bathrooms, setBathrooms] = useState('0');
  const [parking, setParking] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [description, setDescription] = useState('');
  const [editorial, setEditorial] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isIdoneaSelection, setIsIdoneaSelection] = useState(false);
  const [isInvestment, setIsInvestment] = useState(false);
  const [isOwnUse, setIsOwnUse] = useState(false);
  const [isSecondHome, setIsSecondHome] = useState(false);
  const [status, setStatus] = useState<'active' | 'inactive' | 'sold'>('inactive');
  const [images, setImages] = useState<ImageRow[]>([]);
  const [ref, setRef] = useState('');

  if (mode === 'edit' && existing && !loaded) {
    setLoaded(true);
    setTitlePt(existing.title_pt);
    setTransactionType(existing.transaction_type);
    setPropertyType(existing.property_type);
    setIsland(existing.island);
    setCityOrZone(existing.city_or_zone);
    setShortLocation(existing.short_location ?? '');
    setPrice(String(existing.price));
    setCurrency(existing.currency);
    setArea(existing.area ? String(existing.area) : '');
    setBedrooms(String(existing.bedrooms));
    setBathrooms(String(existing.bathrooms));
    setParking(existing.parking ?? '');
    setLatitude(existing.coordinates ? String(existing.coordinates.lat) : '');
    setLongitude(existing.coordinates ? String(existing.coordinates.lng) : '');
    setDescription(existing.description_pt ?? '');
    setEditorial(existing.editorial_pt ?? '');
    setIsFeatured(existing.is_featured);
    setIsIdoneaSelection(existing.is_idonea_selection);
    setIsInvestment(existing.is_investment);
    setIsOwnUse(existing.is_own_use);
    setIsSecondHome(existing.is_second_home);
    setStatus(existing.status);
    setImages(existing.images);
    setRef(existing.ref);
  }

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (files.length === 0) return;
    setUploading(true);
    try {
      for (const file of files) {
        const uploadUrl = await generateUploadUrl();
        const res = await fetch(uploadUrl, {
          method: 'POST',
          headers: { 'Content-Type': file.type },
          body: file,
        });
        if (!res.ok) throw new Error('Falha no upload');
        const { storageId } = await res.json();
        setImages((prev) => [...prev, { storageId, sortOrder: prev.length, url: URL.createObjectURL(file) }]);
      }
    } catch {
      toast({ title: 'Erro no upload', description: 'Uma ou mais imagens falharam.', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (storageId: Id<'_storage'>) => {
    setImages((prev) => prev.filter((i) => i.storageId !== storageId).map((i, idx) => ({ ...i, sortOrder: idx })));
  };

  const moveMain = (storageId: Id<'_storage'>) => {
    setImages((prev) => {
      const target = prev.find((i) => i.storageId === storageId);
      if (!target) return prev;
      const rest = prev.filter((i) => i.storageId !== storageId);
      return [target, ...rest].map((i, idx) => ({ ...i, sortOrder: idx }));
    });
  };

  const validate = (asActive: boolean): string | null => {
    if (!titlePt.trim()) return 'O título é obrigatório.';
    if (!island.trim()) return 'A ilha é obrigatória.';
    if (!cityOrZone.trim()) return 'A zona/cidade é obrigatória.';
    if (!price || isNaN(Number(price))) return 'O preço deve ser um número válido.';
    if (latitude.trim() && isNaN(Number(latitude))) return 'Latitude inválida.';
    if (longitude.trim() && isNaN(Number(longitude))) return 'Longitude inválida.';
    if (asActive && images.length === 0) return 'Para publicar, adicione pelo menos uma imagem.';
    return null;
  };

  const buildPayload = () => ({
    ref: ref || generateRef(),
    title_pt: titlePt.trim(),
    title_en: titlePt.trim(),
    description_pt: description.trim() || undefined,
    description_en: description.trim() || undefined,
    editorial_pt: editorial.trim() || undefined,
    editorial_en: editorial.trim() || undefined,
    transaction_type: transactionType,
    property_type: propertyType,
    island: island.trim(),
    city_or_zone: cityOrZone.trim(),
    short_location: shortLocation.trim() || undefined,
    coordinates: latitude.trim() && longitude.trim() ? { lat: Number(latitude), lng: Number(longitude) } : undefined,
    price: Number(price),
    currency,
    area: area ? Number(area) : undefined,
    bedrooms: Number(bedrooms) || 0,
    bathrooms: Number(bathrooms) || 0,
    parking: parking.trim() || undefined,
    is_featured: isFeatured,
    is_idonea_selection: isIdoneaSelection,
    is_investment: isInvestment,
    is_own_use: isOwnUse,
    is_second_home: isSecondHome,
    images: images.map(({ storageId, sortOrder }) => ({ storageId, sortOrder })),
  });

  const submitCreate = async (publishStatus: 'active' | 'inactive') => {
    const err = validate(publishStatus === 'active');
    if (err) {
      toast({ title: 'Verifique o formulário', description: err, variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      await createProperty({ ...buildPayload(), status: publishStatus });
      toast({ title: publishStatus === 'active' ? 'Imóvel publicado' : 'Rascunho guardado' });
      navigate('/admin/properties');
    } catch (e) {
      toast({ title: 'Erro ao criar imóvel', description: e instanceof Error ? e.message : 'Erro desconhecido.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const submitEdit = async () => {
    if (!id) return;
    const err = validate(status === 'active');
    if (err) {
      toast({ title: 'Verifique o formulário', description: err, variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      await updateProperty({ id: id as Id<'properties'>, ...buildPayload(), status });
      toast({ title: 'Alterações guardadas' });
      navigate('/admin/properties');
    } catch (e) {
      toast({ title: 'Erro ao guardar', description: e instanceof Error ? e.message : 'Erro desconhecido.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (mode === 'edit' && existing === undefined) {
    return (
      <AdminLayout>
        <div className="text-center py-20 text-muted-foreground text-sm">A carregar imóvel…</div>
      </AdminLayout>
    );
  }
  if (mode === 'edit' && existing === null) {
    return (
      <AdminLayout>
        <div className="text-center py-20 text-muted-foreground text-sm">Imóvel não encontrado.</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
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
            {mode === 'edit' && ref && (
              <div className="mt-3 inline-flex items-center gap-2 px-2.5 py-1 bg-muted/40 border border-border rounded">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Ref.</span>
                <span className="font-mono text-xs text-foreground">{ref}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Section title="Informação base" description="Dados essenciais para identificação e localização.">
            <Field label="Título *">
              <Input value={titlePt} onChange={(e) => setTitlePt(e.target.value)} placeholder="Apartamento com vista mar" />
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
                <Select value={propertyType} onValueChange={(v) => setPropertyType(v as typeof propertyType)}>
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
                    {islands.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Zona / Cidade *">
                <Input value={cityOrZone} onChange={(e) => setCityOrZone(e.target.value)} placeholder="Praia" />
              </Field>
              <Field label="Localização curta" hint="Ex: Santa Maria, Sal">
                <Input value={shortLocation} onChange={(e) => setShortLocation(e.target.value)} />
              </Field>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <Field label="Preço *">
                <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="15000000" />
              </Field>
              <Field label="Moeda">
                <Select value={currency} onValueChange={(v) => setCurrency(v as 'CVE' | 'EUR')}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CVE">CVE</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
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

            <div className="grid grid-cols-2 gap-4">
              <Field label="Latitude" hint="Opcional — usado no mapa de pesquisa.">
                <Input value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="16.5972" />
              </Field>
              <Field label="Longitude">
                <Input value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="-22.9295" />
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

          {mode === 'edit' && (
            <Section title="Estado" description="Controla se o imóvel está visível no website.">
              <Field label="Estado do imóvel">
                <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
                  <SelectTrigger className="max-w-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Publicado</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                    <SelectItem value="sold">Vendido</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </Section>
          )}

          <Section title="Imagens" description="A primeira imagem é a principal. Carregue e reordene marcando outra como principal.">
            <label className="flex items-center justify-center gap-2 border border-dashed border-border rounded-md py-8 cursor-pointer hover:bg-muted/30 transition-colors">
              {uploading ? <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" /> : <Upload className="h-4 w-4 text-muted-foreground" />}
              <span className="text-sm text-muted-foreground">{uploading ? 'A carregar…' : 'Selecionar imagens'}</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelect} disabled={uploading} />
            </label>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {images.map((img, idx) => (
                  <div key={img.storageId} className="relative group border border-border rounded-md overflow-hidden bg-muted">
                    {img.url && <img src={img.url} alt="" className="w-full h-32 object-cover" />}
                    {idx === 0 && (
                      <div className="absolute top-1.5 left-1.5 bg-primary text-primary-foreground text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Star className="h-2.5 w-2.5" /> Principal
                      </div>
                    )}
                    <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                      {idx !== 0 && (
                        <Button size="sm" variant="secondary" className="h-7 px-2 text-[11px]" onClick={() => moveMain(img.storageId)}>
                          <Star className="h-3 w-3 mr-1" /> Principal
                        </Button>
                      )}
                      <Button size="sm" variant="destructive" className="h-7 w-7 p-0" onClick={() => removeImage(img.storageId)}>
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
                <Button variant="outline" onClick={() => submitCreate('inactive')} disabled={submitting}>
                  {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Guardar inativo
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

          {mode === 'edit' && <DangerZone id={id as Id<'properties'>} title={titlePt} onDeleted={() => navigate('/admin/properties')} />}
        </div>
      </div>
    </AdminLayout>
  );
};

const DangerZone = ({ id, title, onDeleted }: { id: Id<'properties'>; title: string; onDeleted: () => void }) => {
  const deleteProperty = useMutation(api.admin.deleteProperty);
  const { toast } = useToast();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteProperty({ id });
      toast({ title: 'Imóvel eliminado' });
      onDeleted();
    } catch (e) {
      toast({ title: 'Erro ao eliminar', description: e instanceof Error ? e.message : 'Erro desconhecido.', variant: 'destructive' });
      setDeleting(false);
    }
  };

  return (
    <Card className="p-6 bg-card border-destructive/30 mt-6">
      <h3 className="text-sm font-medium text-destructive mb-1">Eliminar imóvel</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Ação permanente — remove "{title || 'este imóvel'}" e as suas imagens. Não pode ser desfeita.
      </p>
      {confirming ? (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="destructive" onClick={handleDelete} disabled={deleting} className="gap-1.5">
            {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            Confirmar eliminação
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setConfirming(false)} disabled={deleting}>Cancelar</Button>
        </div>
      ) : (
        <Button size="sm" variant="outline" className="border-destructive/40 text-destructive hover:bg-destructive/10 gap-1.5" onClick={() => setConfirming(true)}>
          <Trash2 className="h-3.5 w-3.5" />
          Eliminar imóvel
        </Button>
      )}
    </Card>
  );
};

export default AdminPropertyForm;
