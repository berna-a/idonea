import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Plus, Pencil, Building2, Star, Award, TrendingUp, Home, Palmtree,
  AlertCircle, RefreshCw, ImageOff,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type AdminProperty = {
  id: string;
  ref: string | null;
  title_pt: string | null;
  island: string | null;
  city_or_zone: string | null;
  transaction_type: string | null;
  price: number | string | null;
  status: string | null;
  updated_at: string;
  is_featured: boolean | null;
  is_idonea_selection: boolean | null;
  is_investment: boolean | null;
  is_own_use: boolean | null;
  is_second_home: boolean | null;
  property_images: { url: string; is_main: boolean; sort_order: number }[] | null;
};

const statusConfig: Record<string, { label: string; className: string; dot: string }> = {
  draft: {
    label: 'Rascunho',
    className: 'bg-muted/50 text-muted-foreground border-border',
    dot: 'bg-muted-foreground',
  },
  active: {
    label: 'Publicado',
    className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    dot: 'bg-emerald-400',
  },
  reserved: {
    label: 'Reservado',
    className: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    dot: 'bg-amber-400',
  },
  sold: {
    label: 'Vendido',
    className: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    dot: 'bg-blue-400',
  },
  archived: {
    label: 'Arquivado',
    className: 'bg-red-500/10 text-red-400 border-red-500/30',
    dot: 'bg-red-400',
  },
};

const transactionLabels: Record<string, string> = {
  sale: 'Venda',
  rent: 'Arrendamento',
};

const ISLANDS = ['Santiago', 'Santo Antão', 'São Vicente', 'Sal', 'Boa Vista', 'Fogo', 'Brava', 'Maio', 'São Nicolau'];

const flagDefs = [
  { key: 'is_featured', label: 'Destaque na homepage', icon: Star, color: 'text-amber-400' },
  { key: 'is_idonea_selection', label: 'Seleção IDÓNEA', icon: Award, color: 'text-primary' },
  { key: 'is_investment', label: 'Investimento', icon: TrendingUp, color: 'text-emerald-400' },
  { key: 'is_own_use', label: 'Uso Próprio', icon: Home, color: 'text-blue-400' },
  { key: 'is_second_home', label: 'Segunda Residência', icon: Palmtree, color: 'text-purple-400' },
] as const;

const getMainImage = (images: AdminProperty['property_images']): string | null => {
  if (!images || images.length === 0) return null;
  const main = images.find((i) => i.is_main);
  if (main) return main.url;
  const sorted = [...images].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  return sorted[0]?.url ?? null;
};

const AdminProperties = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [transactionFilter, setTransactionFilter] = useState<string>('all');
  const [islandFilter, setIslandFilter] = useState<string>('all');

  const { data: properties, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-properties', statusFilter, transactionFilter, islandFilter, user?.id],
    queryFn: async () => {
      let query = supabase
        .from('properties')
        .select(`
          id, ref, title_pt, island, city_or_zone, transaction_type, price, status, updated_at,
          is_featured, is_idonea_selection, is_investment, is_own_use, is_second_home,
          property_images ( url, is_main, sort_order )
        `)
        .order('updated_at', { ascending: false });

      if (statusFilter !== 'all') query = query.eq('status', statusFilter);
      if (transactionFilter !== 'all') query = query.eq('transaction_type', transactionFilter);
      if (islandFilter !== 'all') query = query.eq('island', islandFilter);

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as AdminProperty[];
    },
    enabled: !authLoading && !!user,
    retry: false,
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('pt-CV', { style: 'currency', currency: 'CVE', maximumFractionDigits: 0 }).format(price);

  const formatDate = (date?: string | null) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <AdminLayout>
      <TooltipProvider delayDuration={150}>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl font-light text-foreground mb-1">Imóveis</h2>
              <p className="text-sm text-muted-foreground">
                {properties?.length
                  ? `${properties.length} ${properties.length === 1 ? 'imóvel' : 'imóveis'} no portefólio`
                  : 'Gestão do portefólio de imóveis da IDÓNEA.'}
              </p>
            </div>
            <Button onClick={() => navigate('/admin/properties/new')} className="gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Imóvel
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px] bg-card border-border">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os estados</SelectItem>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="active">Publicado</SelectItem>
                <SelectItem value="reserved">Reservado</SelectItem>
                <SelectItem value="sold">Vendido</SelectItem>
                <SelectItem value="archived">Arquivado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={transactionFilter} onValueChange={setTransactionFilter}>
              <SelectTrigger className="w-[160px] bg-card border-border">
                <SelectValue placeholder="Negócio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="sale">Venda</SelectItem>
                <SelectItem value="rent">Arrendamento</SelectItem>
              </SelectContent>
            </Select>

            <Select value={islandFilter} onValueChange={setIslandFilter}>
              <SelectTrigger className="w-[160px] bg-card border-border">
                <SelectValue placeholder="Ilha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as ilhas</SelectItem>
                {ISLANDS.map((island) => (
                  <SelectItem key={island} value={island}>{island}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          {(authLoading || isLoading) ? (
            <div className="text-center py-20 text-muted-foreground text-sm">A carregar imóveis…</div>
          ) : error ? (
            <div className="border border-destructive/30 rounded-lg py-16 flex flex-col items-center justify-center text-center">
              <AlertCircle className="h-8 w-8 text-destructive mb-4" />
              <h3 className="text-foreground font-medium mb-2">Erro ao carregar imóveis</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                {(error as Error).message || 'Ocorreu um erro inesperado. Verifique as permissões ou tente novamente.'}
              </p>
              <Button variant="outline" onClick={() => refetch()} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Tentar novamente
              </Button>
            </div>
          ) : !properties || properties.length === 0 ? (
            <EmptyState onAdd={() => navigate('/admin/properties/new')} />
          ) : (
            <div className="border border-border rounded-lg overflow-hidden bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border">
                    <TableHead className="w-[80px]"></TableHead>
                    <TableHead className="w-[110px]">Ref.</TableHead>
                    <TableHead>Imóvel</TableHead>
                    <TableHead>Negócio</TableHead>
                    <TableHead className="text-right">Preço</TableHead>
                    <TableHead className="w-[120px]">Estado</TableHead>
                    <TableHead className="w-[140px]">Flags</TableHead>
                    <TableHead className="w-[120px]">Atualizado</TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map((property) => {
                    const status = statusConfig[property.status || 'draft'] || statusConfig.draft;
                    const thumbUrl = getMainImage(property.property_images);
                    const location = [property.island, property.city_or_zone].filter(Boolean).join(' · ');
                    const activeFlags = flagDefs.filter((f) => property[f.key as keyof AdminProperty]);

                    return (
                      <TableRow
                        key={property.id}
                        className="group cursor-pointer border-border"
                        onClick={() => navigate(`/admin/properties/${property.id}/edit`)}
                      >
                        {/* Thumbnail */}
                        <TableCell className="py-2.5">
                          <div className="w-14 h-14 rounded-md bg-muted overflow-hidden flex items-center justify-center border border-border/50">
                            {thumbUrl ? (
                              <img
                                src={thumbUrl}
                                alt={property.title_pt || 'Imóvel'}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <ImageOff className="h-5 w-5 text-muted-foreground/50" />
                            )}
                          </div>
                        </TableCell>

                        {/* Ref */}
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {property.ref || '—'}
                        </TableCell>

                        {/* Title + location */}
                        <TableCell className="max-w-[280px]">
                          <div className="font-medium text-foreground truncate">
                            {property.title_pt || 'Sem título'}
                          </div>
                          <div className="text-xs text-muted-foreground truncate mt-0.5">
                            {location || 'Localização não definida'}
                          </div>
                        </TableCell>

                        {/* Transaction */}
                        <TableCell className="text-sm text-muted-foreground">
                          {transactionLabels[property.transaction_type || ''] || property.transaction_type || '—'}
                        </TableCell>

                        {/* Price */}
                        <TableCell className="text-right font-medium text-foreground tabular-nums">
                          {property.price ? formatPrice(Number(property.price)) : (
                            <span className="text-muted-foreground font-normal">Sob consulta</span>
                          )}
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-[11px] gap-1.5 font-normal ${status.className}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                            {status.label}
                          </Badge>
                        </TableCell>

                        {/* Flags */}
                        <TableCell>
                          {activeFlags.length === 0 ? (
                            <span className="text-xs text-muted-foreground/40">—</span>
                          ) : (
                            <div className="flex gap-1.5">
                              {activeFlags.map((f) => {
                                const Icon = f.icon;
                                return (
                                  <Tooltip key={f.key}>
                                    <TooltipTrigger asChild>
                                      <span className={`inline-flex ${f.color}`}>
                                        <Icon className="h-3.5 w-3.5" />
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="text-xs">
                                      {f.label}
                                    </TooltipContent>
                                  </Tooltip>
                                );
                              })}
                            </div>
                          )}
                        </TableCell>

                        {/* Updated */}
                        <TableCell className="text-xs text-muted-foreground tabular-nums">
                          {formatDate(property.updated_at)}
                        </TableCell>

                        {/* Edit */}
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                            onClick={() => navigate(`/admin/properties/${property.id}/edit`)}
                            aria-label="Editar imóvel"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </TooltipProvider>
    </AdminLayout>
  );
};

const EmptyState = ({ onAdd }: { onAdd: () => void }) => (
  <div className="border border-dashed border-border rounded-lg py-20 flex flex-col items-center justify-center text-center">
    <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-5">
      <Building2 className="h-6 w-6 text-muted-foreground" />
    </div>
    <h3 className="text-foreground font-medium mb-2">Nenhum imóvel registado</h3>
    <p className="text-sm text-muted-foreground mb-6 max-w-sm">
      Comece por adicionar o primeiro imóvel ao portefólio da IDÓNEA.
    </p>
    <Button onClick={onAdd} className="gap-2">
      <Plus className="h-4 w-4" />
      Adicionar Primeiro Imóvel
    </Button>
  </div>
);

export default AdminProperties;
