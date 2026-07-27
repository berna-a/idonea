import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Globe } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import logo from '@/assets/logo.svg';
import { Button } from '@/components/ui/button';
import HeaderMenu from '@/components/HeaderMenu';

const Header = () => {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-[10px] left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled
          ? 'bg-background/90 backdrop-blur-md border-b border-border'
          : 'bg-transparent border-b-0'
      }`}
    >
      <div className="container mx-auto px-4 h-[74px] flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Idónea" className="h-[46px] w-auto object-contain" />
        </Link>

        {/* Utility bar + menu trigger (nav lives in the full-screen HeaderMenu) */}
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
            className="flex items-center gap-1 sm:gap-1.5 text-sm text-foreground/90 hover:bg-primary/90 hover:text-foreground transition-colors border border-border/60 rounded-md px-2 sm:px-3 py-1.5 sm:py-2"
          >
            <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            {lang === 'pt' ? 'EN' : 'PT'}
          </button>
          <Button asChild size="sm" className="hidden md:inline-flex font-body">
            <Link to="/contact">{t('nav.cta')}</Link>
          </Button>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 text-foreground/90 hover:text-primary transition-colors"
            aria-label={t('nav.menu')}
          >
            <span className="hidden md:inline text-sm font-body tracking-wide">{t('nav.menu')}</span>
            <Menu className="h-6 w-6" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <HeaderMenu open={open} onClose={() => setOpen(false)} />
    </header>
  );
};

export default Header;
