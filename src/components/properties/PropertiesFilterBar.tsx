import { SlidersHorizontal } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { useCurrency } from '@/lib/currency';
import { islands } from '@/lib/sampleProperties';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

export type SortOption = 'newest' | 'price-asc' | 'price-desc';

interface PropertiesFilterBarProps {
  islandFilter: string;
  setIslandFilter: (v: string) => void;
  typeFilter: string;
  setTypeFilter: (v: string) => void;
  propTypeFilter: string;
  setPropTypeFilter: (v: string) => void;
  goalFilter: string;
  setGoalFilter: (v: string) => void;
  priceRange: [number, number];
  setPriceRange: (v: [number, number]) => void;
  priceBounds: [number, number];
  sort: SortOption;
  setSort: (v: SortOption) => void;
  resultsCount: number;
  hasActiveFilters: boolean;
  onClear: () => void;
}

const PropertiesFilterBar = ({
  islandFilter, setIslandFilter,
  typeFilter, setTypeFilter,
  propTypeFilter, setPropTypeFilter,
  goalFilter, setGoalFilter,
  priceRange, setPriceRange,
  priceBounds,
  sort, setSort,
  resultsCount, hasActiveFilters, onClear,
}: PropertiesFilterBarProps) => {
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();

  const resultsLabel = resultsCount === 1 ? t('props.filter.results.one') : t('props.filter.results');

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground/80 font-body">
          <SlidersHorizontal className="h-3.5 w-3.5 text-primary/70" />
          {t('props.filter.label')}
        </div>
        <span className="text-xs text-muted-foreground font-body tabular-nums">
          <span className="text-foreground font-medium">{resultsCount}</span> {resultsLabel}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 md:gap-3 p-3 md:p-4 rounded-xl border border-border/60 bg-card/40 backdrop-blur-sm mb-4">
        <Select value={islandFilter} onValueChange={setIslandFilter}>
          <SelectTrigger className="w-full sm:w-[150px] h-10 bg-transparent border-border/60 font-body text-sm">
            <SelectValue placeholder={t('props.filter.island')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('props.filter.island')}</SelectItem>
            {islands.map((island) => (
              <SelectItem key={island} value={island}>{island}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[140px] h-10 bg-transparent border-border/60 font-body text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('props.filter.business')}</SelectItem>
            <SelectItem value="sale">{t('props.filter.sale')}</SelectItem>
            <SelectItem value="rent">{t('props.filter.rent')}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={propTypeFilter} onValueChange={setPropTypeFilter}>
          <SelectTrigger className="w-full sm:w-[150px] h-10 bg-transparent border-border/60 font-body text-sm">
            <SelectValue placeholder={t('props.filter.type')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('props.filter.type')}</SelectItem>
            <SelectItem value="apartment">{t('props.type.apartment')}</SelectItem>
            <SelectItem value="house">{t('props.type.house')}</SelectItem>
            <SelectItem value="land">{t('props.type.land')}</SelectItem>
            <SelectItem value="commercial">{t('props.type.commercial')}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={goalFilter} onValueChange={setGoalFilter}>
          <SelectTrigger className="w-full sm:w-[160px] h-10 bg-transparent border-border/60 font-body text-sm">
            <SelectValue placeholder={t('props.filter.goal')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('props.filter.goal')}</SelectItem>
            <SelectItem value="personal">{t('detail.tag.personal')}</SelectItem>
            <SelectItem value="investment">{t('detail.tag.investment')}</SelectItem>
            <SelectItem value="second-home">{t('detail.tag.second-home')}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
          <SelectTrigger className="w-full sm:w-[190px] h-10 bg-transparent border-border/60 font-body text-sm">
            <SelectValue placeholder={t('props.sort.label')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t('props.sort.newest')}</SelectItem>
            <SelectItem value="price-asc">{t('props.sort.priceAsc')}</SelectItem>
            <SelectItem value="price-desc">{t('props.sort.priceDesc')}</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="ml-auto text-xs text-muted-foreground hover:text-primary transition-colors font-body underline underline-offset-4 decoration-border hover:decoration-primary px-2"
          >
            {t('props.filter.clear')}
          </button>
        )}
      </div>

      {/* Price range */}
      <div className="p-4 rounded-xl border border-border/60 bg-card/40 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground/80 font-body">
            {t('props.filter.price')}
          </span>
          <span className="text-xs text-primary font-body tabular-nums">
            {formatPrice(priceRange[0])} — {formatPrice(priceRange[1])}
          </span>
        </div>
        <Slider
          min={priceBounds[0]}
          max={priceBounds[1]}
          step={(priceBounds[1] - priceBounds[0]) / 100}
          value={priceRange}
          onValueChange={(v) => setPriceRange(v as [number, number])}
          className="py-1"
        />
      </div>
    </div>
  );
};

export default PropertiesFilterBar;
