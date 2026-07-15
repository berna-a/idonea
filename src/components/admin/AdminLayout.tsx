import { useAuthActions } from '@convex-dev/auth/react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Building2, LayoutDashboard } from 'lucide-react';
import logo from '@/assets/logo.png';

const navItems = [
  { label: 'Painel', path: '/admin', icon: LayoutDashboard },
  { label: 'Imóveis', path: '/admin/properties', icon: Building2 },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { signOut } = useAuthActions();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/admin" className="flex items-center gap-3">
            <img src={logo} alt="Idónea" className="h-8 w-auto object-contain" />
            <span className="text-xs text-muted-foreground tracking-wider uppercase border border-border px-2 py-0.5 rounded">Admin</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1 ml-4">
            {navItems.map((item) => {
              const isActive = item.path === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive
                      ? 'bg-secondary text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <Button variant="outline" size="sm" onClick={handleSignOut}>Sair</Button>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default AdminLayout;
