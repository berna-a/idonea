import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import PropertyForm, { PropertyInitialData, ExistingImage } from '@/components/admin/PropertyForm';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';

const AdminPropertyEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-property-edit', id],
    enabled: !!id && !authLoading && !!user && isAdmin,
    retry: false,
    queryFn: async (): Promise<PropertyInitialData | null> => {
      const { data: property, error: pErr } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id!)
        .maybeSingle();
      if (pErr) throw pErr;
      if (!property) return null;

      const { data: imgs, error: iErr } = await supabase
        .from('property_images')
        .select('id, url, is_main, sort_order')
        .eq('property_id', id!)
        .order('sort_order', { ascending: true });
      if (iErr) throw iErr;

      const existingImages: ExistingImage[] = (imgs ?? []).map((r) => ({
        id: r.id as string,
        url: r.url as string,
        is_main: !!r.is_main,
        sort_order: Number(r.sort_order ?? 0),
      }));

      return {
        id: property.id as string,
        ref: (property.ref as string | null) ?? null,
        title: (property.title_pt as string | null) ?? '',
        transaction_type: (property.transaction_type as 'sale' | 'rent') ?? 'sale',
        property_type: (property.property_type as 'apartment' | 'house' | 'land' | 'commercial') ?? 'apartment',
        island: (property.island as string | null) ?? 'Santiago',
        city_or_zone: (property.city_or_zone as string | null) ?? '',
        short_location: (property.short_location as string | null) ?? '',
        price: property.price != null ? String(property.price) : '',
        area: property.area != null ? String(property.area) : '',
        bedrooms: property.bedrooms != null ? String(property.bedrooms) : '0',
        bathrooms: property.bathrooms != null ? String(property.bathrooms) : '0',
        parking: (property.parking as string | null) ?? '',
        neighborhood: (property.neighborhood as string | null) ?? '',
        address_full: (property.address_full as string | null) ?? '',
        map_url: (property.map_url as string | null) ?? '',
        latitude: property.latitude != null ? String(property.latitude) : '',
        longitude: property.longitude != null ? String(property.longitude) : '',
        description: (property.description_pt as string | null) ?? '',
        editorial: (property.editorial_pt as string | null) ?? '',
        is_featured: !!property.is_featured,
        is_idonea_selection: !!property.is_idonea_selection,
        is_investment: !!property.is_investment,
        is_own_use: !!property.is_own_use,
        is_second_home: !!property.is_second_home,
        status: (property.status as PropertyInitialData['status']) ?? 'draft',
        existingImages,
      };
    },
  });

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

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto px-6 py-20 text-center text-muted-foreground text-sm">
          A carregar imóvel…
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="max-w-2xl mx-auto px-6 py-20 border border-destructive/30 rounded-lg flex flex-col items-center text-center mt-10">
          <AlertCircle className="h-8 w-8 text-destructive mb-4" />
          <h3 className="text-foreground font-medium mb-2">Erro ao carregar imóvel</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            {(error as Error).message || 'Ocorreu um erro inesperado.'}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refetch()} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Tentar novamente
            </Button>
            <Button variant="ghost" onClick={() => navigate('/admin/properties')} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar à lista
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!data) {
    return (
      <AdminLayout>
        <div className="max-w-2xl mx-auto px-6 py-20 border border-border rounded-lg flex flex-col items-center text-center mt-10">
          <AlertCircle className="h-8 w-8 text-muted-foreground mb-4" />
          <h3 className="text-foreground font-medium mb-2">Imóvel não encontrado</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            O imóvel pedido não existe ou foi removido.
          </p>
          <Button onClick={() => navigate('/admin/properties')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar à lista
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PropertyForm mode="edit" userId={user.id} initial={data} />
    </AdminLayout>
  );
};

export default AdminPropertyEdit;
