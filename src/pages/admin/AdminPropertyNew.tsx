import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import PropertyForm from '@/components/admin/PropertyForm';

const AdminPropertyNew = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();

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
      <PropertyForm mode="create" userId={user.id} />
    </AdminLayout>
  );
};

export default AdminPropertyNew;
