import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '@/lib/i18n';
import { islands } from '@/lib/sampleProperties';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import heroBg from '@/assets/hero-bg.webp';
import { Search } from 'lucide-react';

const WORDS = [
  { text: 'CABO', drift: -60 },
  { text: 'VERDE', drift: 90 },
  { text: 'É SEU.', drift: -40 },
] as const;

/**
 * Homepage hero: a scroll-scrubbed cinematic opening (adapted from the
 * /preview-radical prototype, approved 15-07-2026) followed by the real,
 * functional search widget — the opening is "wow", the landing is usable.
 */
const HomeHero = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [island, setIsland] = useState('all');
  const [type, setType] = useState('all');
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.7], [0.35, 0.85]);
  const wordsOpacity = useTransform(scrollYProgress, [0, 0.15, 0.75, 1], [0, 1, 1, 0]);
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const wordX0 = useTransform(scrollYProgress, [0, 1], [0, WORDS[0].drift]);
  const wordX1 = useTransform(scrollYProgress, [0, 1], [0, WORDS[1].drift]);
  const wordX2 = useTransform(scrollYProgress, [0, 1], [0, WORDS[2].drift]);
  const wordXs = [wordX0, wordX1, wordX2];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (island !== 'all') params.set('island', island);
    if (type !== 'all') params.set('type', type);
    navigate(params.toString() ? `/properties?${params.toString()}` : '/properties');
  };

  return (
    <>
      {/* Scroll-scrubbed narrative opening */}
      <div ref={containerRef} className="relative h-[180vh]">
        <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center bg-background">
          <motion.img
            src={heroBg}
            alt=""
            style={{ scale: imageScale }}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <motion.div className="absolute inset-0 bg-background" style={{ opacity: overlayOpacity }} />

          <motion.p style={{ opacity: wordsOpacity }} className="text-eyebrow absolute top-[26%] left-1/2 -translate-x-1/2">
            {t('hero.eyebrow')}
          </motion.p>

          <motion.div style={{ opacity: wordsOpacity }} className="relative flex flex-col items-center gap-0 px-6 text-center">
            {WORDS.map((w, i) => (
              <motion.span
                key={w.text}
                style={{ x: wordXs[i] }}
                className="font-display text-[16vw] md:text-[9vw] leading-[0.92] text-foreground tracking-tight"
              >
                {w.text}
              </motion.span>
            ))}
          </motion.div>

          <motion.div
            style={{ opacity: indicatorOpacity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-body">Scroll</span>
            <span className="w-px h-10 bg-border" />
          </motion.div>
        </div>
      </div>

      {/* Functional landing — search widget */}
      <section className="relative bg-background py-20 md:py-28 border-b border-border/40">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85 }}
            className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-5"
          >
            {t('hero.headline')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, delay: 0.05 }}
            className="text-muted-foreground font-body text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
          >
            {t('hero.subheadline')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-2 md:gap-3 p-3 rounded-xl border border-border/60 bg-card/50 backdrop-blur-md max-w-2xl mx-auto"
          >
            <Select value={island} onValueChange={setIsland}>
              <SelectTrigger className="w-full sm:w-[180px] h-11 bg-transparent border-border/60 font-body text-sm">
                <SelectValue placeholder={t('hero.search.island')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('hero.search.island.all')}</SelectItem>
                {islands.map((i) => (
                  <SelectItem key={i} value={i}>{i}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-full sm:w-[180px] h-11 bg-transparent border-border/60 font-body text-sm">
                <SelectValue placeholder={t('hero.search.type')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('hero.search.type.all')}</SelectItem>
                <SelectItem value="sale">{t('props.filter.sale')}</SelectItem>
                <SelectItem value="rent">{t('props.filter.rent')}</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleSearch} size="lg" className="font-body h-11 gap-2 sm:flex-1">
              <Search className="h-4 w-4" strokeWidth={1.75} />
              {t('hero.search.submit')}
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.2 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-body"
          >
            <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors underline underline-offset-4 decoration-border hover:decoration-primary">
              {t('hero.cta.consultation')}
            </Link>
            <Link to="/sell" className="text-muted-foreground hover:text-primary transition-colors underline underline-offset-4 decoration-border hover:decoration-primary">
              {t('hero.cta.sell')}
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HomeHero;
