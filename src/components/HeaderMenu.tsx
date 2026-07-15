import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { X } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { islandsContent } from '@/lib/islandsContent';
import heroBg from '@/assets/hero-bg.webp';

interface HeaderMenuProps {
  open: boolean;
  onClose: () => void;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};

const linkVariants = {
  hidden: { clipPath: 'inset(0 0 100% 0)', y: 24 },
  visible: {
    clipPath: 'inset(0 0 0% 0)',
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/**
 * Full-screen cinematic nav takeover — "The Threshold", migrated from
 * /preview-radical (approved 15-07-2026) with real routes/i18n, replacing
 * the desktop link row + mobile Sheet drawer in Header.tsx.
 */
const HeaderMenu = ({ open, onClose }: HeaderMenuProps) => {
  const { lang, t } = useLanguage();
  const lenis = useLenis();

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
  }, [open, lenis]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const links = [
    { label: t('nav.properties'), to: '/properties' },
    { label: t('nav.investment'), to: '/investment' },
    { label: t('nav.sell'), to: '/sell' },
    { label: t('nav.about'), to: '/about' },
    { label: t('nav.contact'), to: '/contact' },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] bg-background overflow-y-auto"
        >
          <div className="absolute inset-0 pointer-events-none">
            <img src={heroBg} alt="" className="w-full h-full object-cover opacity-[0.08]" />
          </div>

          <button
            onClick={onClose}
            aria-label={lang === 'pt' ? 'Fechar menu' : 'Close menu'}
            className="absolute top-6 right-6 md:top-8 md:right-10 z-10 text-foreground/80 hover:text-primary transition-colors"
          >
            <X className="h-7 w-7" strokeWidth={1.25} />
          </button>

          <motion.nav
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative min-h-full flex flex-col items-start justify-center gap-1 md:gap-2 px-6 md:px-16 py-28"
          >
            {links.map((link) => (
              <div key={link.to} className="overflow-hidden">
                <motion.div variants={linkVariants}>
                  <Link
                    to={link.to}
                    onClick={onClose}
                    className="block font-display text-[13vw] md:text-[6.5vw] leading-[1.02] text-foreground/90 hover:text-primary transition-colors tracking-tight"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              </div>
            ))}

            <div className="overflow-hidden mt-6 md:mt-8">
              <motion.div variants={linkVariants} className="flex flex-wrap gap-x-8 gap-y-3">
                <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground font-body self-center">
                  {t('nav.islands')}
                </span>
                {islandsContent.map((island) => (
                  <Link
                    key={island.slug}
                    to={`/ilhas/${island.slug}`}
                    onClick={onClose}
                    className="text-sm md:text-base font-body text-foreground/70 hover:text-primary transition-colors underline underline-offset-4 decoration-border hover:decoration-primary"
                  >
                    {lang === 'pt' ? island.dbName : island.name_en}
                  </Link>
                ))}
              </motion.div>
            </div>

            <div className="overflow-hidden mt-10 md:mt-12">
              <motion.div variants={linkVariants}>
                <Link
                  to="/contact"
                  onClick={onClose}
                  className="inline-flex items-center bg-primary text-primary-foreground font-body text-sm tracking-wide px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
                >
                  {t('nav.cta')}
                </Link>
              </motion.div>
            </div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HeaderMenu;
