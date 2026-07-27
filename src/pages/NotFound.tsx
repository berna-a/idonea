import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Seo title={t('seo.notfound.title')} description={t('seo.notfound.description')} />
      <Header />
      <div className="flex-1 flex items-center justify-center text-center px-4 pt-16">
        <div>
          <p className="font-display text-6xl text-primary mb-4">404</p>
          <p className="text-xl text-muted-foreground font-body mb-8">{t('seo.notfound.description')}</p>
          <Button asChild className="font-body">
            <Link to="/">{t('nav.home')}</Link>
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
