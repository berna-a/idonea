import { useState } from 'react';
import { useQuery } from 'convex/react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../convex/_generated/api';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { islands } from '@/lib/sampleProperties';
import {
  Plus, Pencil, Building2, Star, Award, TrendingUp, Home, Palmtree, ImageOff,
} from 'lucide-react';

const statusConfig: Record<string, { label: string; className: string; dot: string }> = {
  active: {
    label: 'Publicado',
    className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    dot: 'bg-emerald-400',
  },
  inactive: {
    label: 'Inativo',
    className: 'bg-muted/50 text-muted-foreground border-border',
    dot: 'bg-muted-foreground',
  },
  sold: {
    label: 'Vendido',
    className: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    dot: 'bg-blue-400',
  },
};

const transactionLabels: Record<string, string> = { sale: 'Venda', rent: 'Arrendamento' };

const flagDefs = [
  { key: 'is_featured', label: 'Destaque na homepage', icon: Star, color: 'text-amber-400' },
  { key: 'is_idonea_selection', label: 'Seleção IDÓNEA', icon: Award, color: 'text-primary' },
  { key: 'is_investment', label: 'Investimento', icon: TrendingUp, color: 'text-emerald-400' },
  { key: 'is_own_use', label: 'Uso Próprio', icon: Home, color: 'text-blue-400' },
  { key: 'is_second_home', label: 'Segunda Residência', icon: Palmtree, color: 'text-purple-400' },
] as const;

const formatPrice = (price: number, currency: string) =>
  new Intl.NumberFormat('pt-CV', { style: 'currency', currency, maximumFractionDigits: 0 }).format(price);

const formatDate = (ts: number) =>
  new Date(ts).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });

const AdminProperties = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('all');
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [islandFilter, setIslandFilter] = useState('all');

  const properties = useQuery(api.admin.listAll, {});
  const isLoading = properties === undefined;

  const filtered = (properties ?? []).filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (transactionFilter !== 'all' && p.transaction_type !== transactionFilter) return false;
    if (islandFilter !== 'all' && p.island !== islandFilter) return false;
    return true;
  });

  return (
    <AdminLayout>
      <TooltipProvider delayDuration={150}>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl font-light text-foreground mb-1">Imóveis</h2>
              <p className="text-sm text-muted-foreground">
                {filtered.length
                  ? `${filtered.length} ${filtered.length === 1 ? 'imóvel' : 'imóveis'} no portefólio`
                  : 'Gestão do portefólio de imóveis da IDÓNEA.'}
              </p>
            </div>
            <Button onClick={() => navigate('/admin/properties/new')} className="gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Imóvel
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px] bg-card border-border">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os estados</SelectItem>
                <SelectItem value="active">Publicado</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
                <SelectItem value="sold">Vendido</SelectItem>
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
                {islands.map((island) => (
                  <SelectItem key={island} value={island}>{island}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="text-center py-20 text-muted-foreground text-sm">A carregar imóveis…</div>
          ) : filtered.length === 0 ? (
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
                    <TableHead className="w-[120px]">Criado</TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((property) => {
                    const status = statusConfig[property.status] ?? statusConfig.inactive;
                    const thumbUrl = property.images[0]?.url ?? null;
                    const location = [property.island, property.city_or_zone].filter(Boolean).join(' · ');
                    const activeFlags = flagDefs.filter((f) => property[f.key]);

                    return (
                      <TableRow
                        key={property._id}
                        className="group cursor-pointer border-border"
                        onClick={() => navigate(`/admin/properties/${property._id}/edit`)}
                      >
                        <TableCell className="py-2.5">
                          <div className="w-14 h-14 rounded-md bg-muted overflow-hidden flex items-center justify-center border border-border/50">
                            {thumbUrl ? (
                              <img src={thumbUrl} alt={property.title_pt} className="w-full h-full object-cover" loading="lazy" />
                            ) : (
                              <ImageOff className="h-5 w-5 text-muted-foreground/50" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">{property.ref}</TableCell>
                        <TableCell className="max-w-[280px]">
                          <div className="font-medium text-foreground truncate">{property.title_pt}</div>
                          <div className="text-xs text-muted-foreground truncate mt-0.5">{location || '—'}</div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {transactionLabels[property.transaction_type]}
                        </TableCell>
                        <TableCell className="text-right font-medium text-foreground tabular-nums">
                          {formatPrice(property.price, property.currency)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[11px] gap-1.5 font-normal ${status.className}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                            {status.label}
                          </Badge>
                        </TableCell>
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
                                    <TooltipContent side="top" className="text-xs">{f.label}</TooltipContent>
                                  </Tooltip>
                                );
                              })}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground tabular-nums">
                          {formatDate(property._creationTime)}
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                            onClick={() => navigate(`/admin/properties/${property._id}/edit`)}
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
