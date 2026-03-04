import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import logo from '@/assets/logo.png';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

const Header = () => {
  const { lang, setLang, t } = useLanguage();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.properties'), href: '/properties' },
    { label: t('nav.investment'), href: '/#investimento' },
    { label: t('nav.contact'), href: '/#contacto' },
  ];

  const handleNavClick = (href: string) => {
    setOpen(false);
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '');
      if (location.pathname === '/') {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Idônea" className="h-10 w-10 object-contain" />
          <span className="font-display text-lg font-semibold tracking-tight text-foreground">
            IDÔNEA
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => handleNavClick(link.href)}
              className="text-sm font-body text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors border border-border rounded-md px-3 py-1.5"
          >
            <Globe className="h-3.5 w-3.5" />
            {lang === 'pt' ? 'EN' : 'PT'}
          </button>
        </nav>

        {/* Mobile Nav */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
            className="flex items-center gap-1 text-sm text-muted-foreground border border-border rounded-md px-2 py-1"
          >
            <Globe className="h-3.5 w-3.5" />
            {lang === 'pt' ? 'EN' : 'PT'}
          </button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="text-foreground">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background border-border">
              <SheetTitle className="text-foreground">Menu</SheetTitle>
              <nav className="flex flex-col gap-6 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="text-lg font-body text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
