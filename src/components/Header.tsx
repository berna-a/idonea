import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Globe } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import logo from '@/assets/logo.png';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const Header = () => {
  const { lang, setLang, t } = useLanguage();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { label: t('nav.properties'), href: '/properties' },
    { label: t('nav.investment'), href: '/investment' },
    { label: t('nav.sell'), href: '/sell' },
    { label: t('nav.about'), href: '/about' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const handleNavClick = () => {
    setOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Idônea" className="h-14 w-auto object-contain" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-body transition-colors ${
                isActive(link.href)
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Button asChild size="sm" className="font-body text-sm ml-1">
            <Link to="/contact">{t('nav.cta')}</Link>
          </Button>
          <button
            onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors border border-border rounded-md px-2.5 py-1.5"
          >
            <Globe className="h-3.5 w-3.5" />
            {lang === 'pt' ? 'EN' : 'PT'}
          </button>
        </nav>

        {/* Mobile Nav */}
        <div className="flex lg:hidden items-center gap-3">
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
              <SheetTitle className="text-foreground sr-only">Menu</SheetTitle>
              <nav className="flex flex-col gap-5 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={handleNavClick}
                    className={`text-base font-body transition-colors ${
                      isActive(link.href)
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-primary'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Button asChild className="font-body mt-4 w-full">
                  <Link to="/contact" onClick={handleNavClick}>
                    {t('nav.cta')}
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
