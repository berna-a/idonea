import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/components/admin/AdminLayout';
import { Building2, Image } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-light text-foreground mb-2">Painel de Gestão</h2>
            <p className="text-muted-foreground text-sm">Gestão de imóveis e conteúdo do website da IDÓNEA.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className="border border-border rounded-lg p-6 space-y-3 hover:border-primary/30 transition-colors cursor-pointer"
              onClick={() => navigate('/admin/properties')}
            >
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-primary" />
                <h3 className="text-foreground font-medium">Imóveis</h3>
              </div>
              <p className="text-sm text-muted-foreground">Gerir o portefólio de imóveis, editar fichas, estados e destaques.</p>
              <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); navigate('/admin/properties'); }}>
                Gerir Imóveis
              </Button>
            </div>

            <div className="border border-border rounded-lg p-6 space-y-3 opacity-60">
              <div className="flex items-center gap-3">
                <Image className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-foreground font-medium">Imagens</h3>
              </div>
              <p className="text-sm text-muted-foreground">Galeria de imagens dos imóveis, upload e organização.</p>
              <Button variant="outline" size="sm" disabled>Em breve</Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
