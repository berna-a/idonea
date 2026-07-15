import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Facebook, Mail, Phone } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { islandsContent } from '@/lib/islandsContent';
import { guidesContent } from '@/lib/guidesContent';
import logo from '@/assets/logo.png';

const Footer = () => {
  const { t, lang } = useLanguage();

  return (
    <footer className="bg-secondary border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center">
              <img src={logo} alt="Idónea" className="h-10 w-auto object-contain" />
            </div>
            <p className="text-sm text-muted-foreground font-body">
              {t('footer.company')}
            </p>
          </div>

          {/* Islands */}
          <div className="flex flex-col gap-3">
            <h4 className="font-display text-sm font-semibold text-foreground uppercase tracking-wider">
              {t('nav.islands')}
            </h4>
            {islandsContent.map((island) => (
              <Link
                key={island.slug}
                to={`/ilhas/${island.slug}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors font-body"
              >
                {lang === 'pt' ? island.dbName : island.name_en}
              </Link>
            ))}
          </div>

          {/* Guides */}
          <div className="flex flex-col gap-3">
            <h4 className="font-display text-sm font-semibold text-foreground uppercase tracking-wider">
              {lang === 'pt' ? 'Guias' : 'Guides'}
            </h4>
            {guidesContent.map((g) => (
              <Link
                key={g.slug}
                to={`/guias/${g.slug}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors font-body"
              >
                {lang === 'pt' ? g.title_pt : g.title_en}
              </Link>
            ))}
          </div>

          {/* Contact + Social */}
          <div className="flex flex-col gap-3">
            <h4 className="font-display text-sm font-semibold text-foreground uppercase tracking-wider">{t('nav.contact')}</h4>
            <a href="mailto:contacto@idoneaimobiliaria.cv" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-body">
              <Mail className="h-4 w-4" /> contacto@idoneaimobiliaria.cv
            </a>
            <a href="tel:+2389808947" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-body">
              <Phone className="h-4 w-4" /> +238 980 8947
            </a>
            <a href="tel:+2389242197" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-body">
              <Phone className="h-4 w-4" /> +238 924 2197
            </a>
            <div className="flex gap-4 mt-1">
              <a href="https://www.instagram.com/idoneaimobiliaria/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/company/id%C3%B4nea-media%C3%A7%C3%A3o-imobili%C3%A1ria/about/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=100077429785704" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground font-body">
            © {new Date().getFullYear()} {t('footer.company')}. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
