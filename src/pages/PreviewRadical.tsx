import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
import { motion } from 'framer-motion';
import RadicalMenu from '@/components/radical/RadicalMenu';
import RadicalHero from '@/components/radical/RadicalHero';
import RadicalVault from '@/components/radical/RadicalVault';
import { ArrowRight } from 'lucide-react';

/**
 * Experimental art-direction prototype ("The Threshold" + "The Vault").
 * Isolated from the real site: not in the sitemap, blocked in robots.txt,
 * not linked from any nav. Own noindex meta set directly (bypasses the
 * shared Seo.tsx on purpose — this page must never affect real SEO state).
 */
const PreviewRadical = () => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Protótipo Radical (não indexado) | IDÓNEA';
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => {
      document.title = prevTitle;
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.4, wheelMultiplier: 1 }}>
      <div className="bg-black min-h-screen">
        <RadicalMenu />
        <RadicalHero />
        <RadicalVault />

        {/* Closing — funnels back into the real, tested site */}
        <section className="relative bg-black py-24 md:py-32 px-6 text-center border-t border-white/10">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-eyebrow text-white/50 mb-5">Protótipo Experimental</p>
            <h2 className="font-display text-2xl md:text-4xl text-white mb-8 max-w-2xl mx-auto leading-snug">
              Este é um exercício de direcção de arte — não o site em produção.
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-body px-8 py-3 rounded-full hover:bg-primary/90 transition-colors"
              >
                Ver o site real
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/properties"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white font-body px-8 py-3 border border-white/20 rounded-full transition-colors"
              >
                Ver portefólio completo
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </ReactLenis>
  );
};

export default PreviewRadical;
