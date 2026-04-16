import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Building2, Star, Award, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const statusConfig: Record<string, { label: string; className: string }> = {
  draft: { label: 'Rascunho', className: 'bg-muted text-muted-foreground border-muted' },
  active: { label: 'Publicado', className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  reserved: { label: 'Reservado', className: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  sold: { label: 'Vendido', className: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  archived: { label: 'Arquivado', className: 'bg-red-500/15 text-red-400 border-red-500/30' },
};

const transactionLabels: Record<string, string> = {
  sale: 'Venda',
  rent: 'Arrendamento',
};

const ISLANDS = ['Santiago', 'Santo Antão', 'São Vicente', 'Sal', 'Boa Vista', 'Fogo', 'Brava', 'Maio', 'São Nicolau'];

const AdminProperties = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [transactionFilter, setTransactionFilter] = useState<string>('all');
  const [islandFilter, setIslandFilter] = useState<string>('all');

  const { data: properties, isLoading } = useQuery({
    queryKey: ['admin-properties', statusFilter, transactionFilter, islandFilter],
    queryFn: async () => {
      let query = supabase
        .from('properties')
        .select(`
          id, ref, title_pt, island, city_or_zone, transaction_type, property_type,
          price, status, is_featured, is_idonea_selection, is_investment, updated_at,
          property_images(url, is_main)
        `)
        .order('updated_at', { ascending: false });

      if (statusFilter !== 'all') query = query.eq('status', statusFilter);
      if (transactionFilter !== 'all') query = query.eq('transaction_type', transactionFilter);
      if (islandFilter !== 'all') query = query.eq('island', islandFilter);

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('pt-CV', { style: 'currency', currency: 'CVE', maximumFractionDigits: 0 }).format(price);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });

  const getMainImage = (images: { url: string; is_main: boolean }[] | null) => {
    if (!images || images.length === 0) return null;
    return images.find((img) => img.is_main)?.url || images[0]?.url;
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl font-light text-foreground mb-1">Imóveis</h2>
            <p className="text-sm text-muted-foreground">
              Gestão do portefólio de imóveis da IDÓNEA.
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
        {isLoading ? (
          <div className="text-center py-20 text-muted-foreground text-sm">A carregar imóveis…</div>
        ) : !properties || properties.length === 0 ? (
          <EmptyState onAdd={() => navigate('/admin/properties/new')} />
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[60px]"></TableHead>
                  <TableHead>Ref.</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Negócio</TableHead>
                  <TableHead className="text-right">Preço</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[80px]">Flags</TableHead>
                  <TableHead>Atualizado</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((property) => {
                  const mainImage = getMainImage(property.property_images as any);
                  const status = statusConfig[property.status] || statusConfig.draft;
                  return (
                    <TableRow key={property.id} className="group">
                      <TableCell className="py-2">
                        {mainImage ? (
                          <img
                            src={mainImage}
                            alt=""
                            className="w-10 h-10 rounded object-cover bg-muted"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{property.ref}</TableCell>
                      <TableCell className="font-medium text-foreground max-w-[200px] truncate">
                        {property.title_pt}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {property.island} · {property.city_or_zone}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {transactionLabels[property.transaction_type] || property.transaction_type}
                      </TableCell>
                      <TableCell className="text-right font-medium text-foreground">
                        {formatPrice(Number(property.price))}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[11px] ${status.className}`}>
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {property.is_featured && (
                            <span title="Destaque"><Star className="h-3.5 w-3.5 text-primary" /></span>
                          )}
                          {property.is_idonea_selection && (
                            <span title="Seleção IDÓNEA"><Award className="h-3.5 w-3.5 text-primary" /></span>
                          )}
                          {property.is_investment && (
                            <span title="Investimento"><TrendingUp className="h-3.5 w-3.5 text-primary" /></span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(property.updated_at)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => navigate(`/admin/properties/${property.id}/edit`)}
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
