import { Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { motion } from 'framer-motion';
import { api } from '../../../convex/_generated/api';
import { useCurrency } from '@/lib/currency';
import type { Property } from '@/lib/sampleProperties';
import { ImageOff } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Editorial bento with a curtain-reveal anchor + skew "warp" hover cards — "The Vault".
 * Deliberately capped at 4 properties (1 anchor + 3 cells): this is a fixed bento
 * geometry for the prototype, not a general-purpose listing grid.
 */
const RadicalVault = () => {
  const { formatPrice } = useCurrency();
  const result = useQuery(api.properties.listActive, {});
  const properties = ((result ?? []) as Property[]).slice(0, 4);

  if (result === undefined) {
    return <div className="min-h-[60vh] bg-black" />;
  }

  if (properties.length === 0) {
    return (
      <section className="bg-black py-32 text-center">
        <p className="text-white/50 font-body">Sem imóveis no acervo.</p>
      </section>
    );
  }

  const [anchor, ...rest] = properties;

  return (
    <section className="relative bg-black py-24 md:py-40 px-4 md:px-10">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-14 md:mb-20 max-w-3xl"
      >
        <p className="text-eyebrow text-white/60 mb-4">O Acervo</p>
        <h2 className="font-display text-4xl md:text-6xl text-white leading-[1.05] tracking-tight">
          Cada imóvel, uma peça única.
        </h2>
      </motion.div>

      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-6 lg:auto-rows-[18vw] lg:gap-4">
        {/* Anchor */}
        <Link
          to={`/properties/${anchor.id}`}
          className="group relative block overflow-hidden bg-neutral-900 aspect-[4/3] lg:aspect-auto"
          style={{ gridColumn: '1 / 5', gridRow: '1 / 3' }}
        >
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: EASE }}
            className="absolute inset-0"
          >
            {anchor.image ? (
              <img
                src={anchor.image}
                alt={anchor.title_pt}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[1200ms] ease-out"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/30">
                <ImageOff className="h-12 w-12" strokeWidth={1.25} />
              </div>
            )}
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
            <p className="text-[10px] md:text-xs tracking-[0.25em] uppercase text-primary font-body mb-3">
              {anchor.location}, {anchor.island}
            </p>
            <h3 className="font-display text-[9vw] md:text-[3.2vw] leading-[0.95] text-white tracking-tight mb-4 -ml-1">
              {anchor.title_pt}
            </h3>
            <p className="text-lg md:text-2xl text-primary font-display tabular-nums">
              {formatPrice(anchor.price, anchor.type === 'rent' ? '/mês' : '')}
            </p>
          </div>
        </Link>

        {/* Secondary cells */}
        {rest.map((prop, i) => {
          const gridStyle =
            i === 2
              ? { gridColumn: '1 / 7', gridRow: '3 / 4' }
              : { gridColumn: '5 / 7', gridRow: `${i + 1} / ${i + 2}` };
          return (
            <motion.div
              key={prop.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.08 }}
              style={gridStyle}
              className="relative"
            >
              <Link
                to={`/properties/${prop.id}`}
                className="group relative block overflow-hidden bg-neutral-900 aspect-[16/10] lg:aspect-auto lg:h-full w-full"
              >
                <motion.div
                  whileHover={{ scale: 1.06, skewX: -2 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="absolute inset-0"
                >
                  {prop.image ? (
                    <img
                      src={prop.image}
                      alt={prop.title_pt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/30">
                      <ImageOff className="h-8 w-8" strokeWidth={1.25} />
                    </div>
                  )}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 bg-gradient-to-tr from-primary/50 via-primary/10 to-transparent mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-primary font-body mb-1.5">
                    {prop.location}, {prop.island}
                  </p>
                  <h4 className="font-display text-lg md:text-xl text-white mb-1 line-clamp-1">
                    {prop.title_pt}
                  </h4>
                  <p className="text-sm text-primary font-display tabular-nums">
                    {formatPrice(prop.price, prop.type === 'rent' ? '/mês' : '')}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default RadicalVault;
