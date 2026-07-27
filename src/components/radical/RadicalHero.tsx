import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import heroBg from '@/assets/hero-bg.webp';

const WORDS = [
  { text: 'CABO', drift: -60 },
  { text: 'VERDE', drift: 90 },
  { text: 'É SEU.', drift: -40 },
] as const;

/** Scroll-scrubbed narrative hero — "The Threshold". ~220vh scroll range, pinned viewport. */
const RadicalHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.35]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.7], [0.35, 0.85]);
  const wordsOpacity = useTransform(scrollYProgress, [0, 0.15, 0.75, 1], [0, 1, 1, 0]);
  const subOpacity = useTransform(scrollYProgress, [0, 0.1, 0.3], [0, 1, 0]);
  const subY = useTransform(scrollYProgress, [0, 0.3], [0, -40]);
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  // Rules of Hooks: WORDS has a fixed length, so these are unrolled explicitly
  // rather than called inside a .map() callback.
  const wordX0 = useTransform(scrollYProgress, [0, 1], [0, WORDS[0].drift]);
  const wordX1 = useTransform(scrollYProgress, [0, 1], [0, WORDS[1].drift]);
  const wordX2 = useTransform(scrollYProgress, [0, 1], [0, WORDS[2].drift]);
  const wordXs = [wordX0, wordX1, wordX2];

  return (
    <div ref={containerRef} className="relative h-[220vh]">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center bg-black">
        <motion.img
          src={heroBg}
          alt=""
          style={{ scale: imageScale }}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <motion.div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }} />

        <motion.p
          style={{ opacity: subOpacity, y: subY }}
          className="absolute top-[28%] left-1/2 -translate-x-1/2 text-eyebrow text-white/70"
        >
          Advisory Imobiliário · Cabo Verde
        </motion.p>

        <motion.div
          style={{ opacity: wordsOpacity }}
          className="relative flex flex-col items-center gap-0 px-6 text-center"
        >
          {WORDS.map((w, i) => (
            <motion.span
              key={w.text}
              style={{ x: wordXs[i] }}
              className="font-display text-[16vw] md:text-[9vw] leading-[0.92] text-white tracking-tight"
            >
              {w.text}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          style={{ opacity: indicatorOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/60 font-body">Scroll</span>
          <span className="w-px h-10 bg-white/40" />
        </motion.div>
      </div>
    </div>
  );
};

export default RadicalHero;
