import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-light tracking-wide text-foreground">IDÓNEA</h1>
          <span className="text-xs text-muted-foreground tracking-wider uppercase border border-border px-2 py-0.5 rounded">Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{user?.email}</span>
          <Button variant="outline" size="sm" onClick={handleSignOut}>Sair</Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-light text-foreground mb-2">Painel de Gestão</h2>
            <p className="text-muted-foreground text-sm">Gestão de imóveis e conteúdo do website da IDÓNEA.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-border rounded-lg p-6 space-y-3 hover:border-primary/30 transition-colors">
              <h3 className="text-foreground font-medium">Imóveis</h3>
              <p className="text-sm text-muted-foreground">Gerir o portefólio de imóveis, editar fichas, estados e destaques.</p>
              <Button variant="outline" size="sm" disabled>Em breve</Button>
            </div>

            <div className="border border-border rounded-lg p-6 space-y-3 hover:border-primary/30 transition-colors">
              <h3 className="text-foreground font-medium">Imagens</h3>
              <p className="text-sm text-muted-foreground">Galeria de imagens dos imóveis, upload e organização.</p>
              <Button variant="outline" size="sm" disabled>Em breve</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
