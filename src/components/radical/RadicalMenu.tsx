import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import logo from '@/assets/logo.svg';
import heroBg from '@/assets/hero-bg.webp';

const LINKS = [
  { label: 'IMÓVEIS', to: '/properties' },
  { label: 'ILHAS', to: '/ilhas/sal' },
  { label: 'INVESTIR', to: '/investment' },
  { label: 'SOBRE', to: '/about' },
  { label: 'CONTACTO', to: '/contact' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
};

const linkVariants = {
  hidden: { clipPath: 'inset(0 0 100% 0)', y: 30 },
  visible: {
    clipPath: 'inset(0 0 0% 0)',
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/** Full-screen cinematic nav takeover — "The Threshold". */
const RadicalMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed top-0 inset-x-0 z-[60] flex items-center justify-between px-6 md:px-10 py-6 mix-blend-difference">
        <Link to="/preview-radical" className="flex items-center">
          <img src={logo} alt="Idónea" className="h-8 w-auto object-contain invert" />
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="text-white font-body text-xs tracking-[0.3em] uppercase"
        >
          Menu
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[70] bg-black overflow-hidden"
          >
            <div className="absolute inset-0">
              <img src={heroBg} alt="" className="w-full h-full object-cover opacity-[0.15]" />
              <div
                className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                }}
              />
            </div>

            <button
              onClick={() => setOpen(false)}
              aria-label="Fechar menu"
              className="absolute top-6 right-6 md:top-10 md:right-10 z-10 text-white/80 hover:text-white transition-colors"
            >
              <X className="h-7 w-7" strokeWidth={1.25} />
            </button>

            <motion.nav
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="relative h-full flex flex-col items-start justify-center gap-2 md:gap-3 px-6 md:px-16"
            >
              {LINKS.map((link) => (
                <div key={link.to} className="overflow-hidden">
                  <motion.div variants={linkVariants}>
                    <Link
                      to={link.to}
                      onClick={() => setOpen(false)}
                      className="font-display text-[15vw] md:text-[8vw] leading-[0.95] text-white/90 hover:text-primary transition-colors tracking-tight"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                </div>
              ))}
              <div className="overflow-hidden mt-8">
                <motion.div variants={linkVariants}>
                  <Link
                    to="/"
                    className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground hover:text-primary transition-colors"
                  >
                    ← Voltar ao site
                  </Link>
                </motion.div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RadicalMenu;
