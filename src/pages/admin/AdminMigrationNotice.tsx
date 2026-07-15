import { Link } from 'react-router-dom';

/**
 * Placeholder for /admin/* while the old Supabase-based admin panel
 * (auth + property CRUD) is pending its Convex rebuild.
 * See legacy-supabase-admin/README.md for the old code and next steps.
 */
const AdminMigrationNotice = () => (
  <div className="min-h-screen bg-background flex items-center justify-center text-center px-4">
    <div className="max-w-md">
      <p className="font-display text-2xl text-foreground mb-4">Admin em migração</p>
      <p className="text-muted-foreground font-body mb-8">
        O painel administrativo está a ser reconstruído sobre Convex. O código anterior (Supabase) está preservado em <code className="text-primary">legacy-supabase-admin/</code> à espera de uma decisão sobre o novo sistema de autenticação.
      </p>
      <Link to="/" className="text-primary underline underline-offset-4 font-body">
        Voltar ao site
      </Link>
    </div>
  </div>
);

export default AdminMigrationNotice;
