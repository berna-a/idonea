import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { useLanguage } from '@/lib/i18n';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

/** Swipeable property gallery (Embla, via the shadcn Carousel primitive) with thumbnail strip. */
const PropertyGallery = ({ images, title }: PropertyGalleryProps) => {
  const { t } = useLanguage();
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);
  const hasImages = images.some(Boolean);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setActiveIndex(api.selectedScrollSnap());
    onSelect();
    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  const scrollTo = useCallback((index: number) => api?.scrollTo(index), [api]);

  if (!hasImages) {
    return (
      <div className="relative rounded-2xl overflow-hidden mb-12 aspect-[16/9] max-h-[640px] bg-card ring-1 ring-border/40 shadow-2xl shadow-black/40 flex items-center justify-center text-muted-foreground">
        <ImageOff className="h-12 w-12" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.85 }}
        className="relative rounded-2xl overflow-hidden mb-4 aspect-[16/9] max-h-[640px] bg-card ring-1 ring-border/40 shadow-2xl shadow-black/40"
      >
        <Carousel setApi={setApi} opts={{ loop: images.length > 1 }} className="h-full">
          <CarouselContent className="h-full -ml-0">
            {images.map((img, i) => (
              <CarouselItem key={i} className="h-full pl-0">
                <motion.img
                  src={img}
                  alt={`${title} — ${i + 1}`}
                  className="w-full h-full object-cover"
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  fetchpriority={i === 0 ? 'high' : undefined}
                  initial={false}
                  animate={{ opacity: i === activeIndex ? 1 : 0.6, scale: 1.05 }}
                  transition={{
                    opacity: { duration: 0.9, ease: 'easeOut' },
                    scale: { duration: 24, ease: 'linear', repeat: Infinity, repeatType: 'mirror' },
                  }}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/60 to-transparent pointer-events-none" />

        {images.length > 1 && (
          <>
            <button
              onClick={() => api?.scrollPrev()}
              aria-label="Previous image"
              className="absolute left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-background/60 backdrop-blur-md ring-1 ring-border/40 flex items-center justify-center hover:bg-background/90 hover:ring-primary/40 transition-all"
            >
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </button>
            <button
              onClick={() => api?.scrollNext()}
              aria-label="Next image"
              className="absolute right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-background/60 backdrop-blur-md ring-1 ring-border/40 flex items-center justify-center hover:bg-background/90 hover:ring-primary/40 transition-all"
            >
              <ChevronRight className="h-5 w-5 text-foreground" />
            </button>
            <div className="absolute top-5 right-5 px-3 py-1.5 rounded-full bg-background/60 backdrop-blur-md ring-1 ring-border/40 text-xs font-body text-foreground/90 tabular-nums">
              {activeIndex + 1} {t('detail.gallery.counter')} {images.length}
            </div>
          </>
        )}
      </motion.div>

      {images.length > 1 ? (
        <div className="flex gap-2 mb-12 overflow-x-auto pb-1 scrollbar-thin">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`relative flex-shrink-0 w-20 h-16 md:w-24 md:h-20 rounded-lg overflow-hidden ring-1 transition-all ${
                i === activeIndex ? 'ring-2 ring-primary opacity-100' : 'ring-border/40 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      ) : (
        <div className="mb-12" />
      )}
    </>
  );
};

export default PropertyGallery;
