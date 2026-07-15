import { useEffect, useRef, useState } from 'react';
import { Loader2, MapPin, Search, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export type AddressSuggestion = {
  id: string;
  place_name: string;
  text: string;
  longitude: number;
  latitude: number;
  neighborhood?: string | null;
};

export type AddressSelection = {
  address_full: string;
  latitude: number;
  longitude: number;
  map_url: string;
  neighborhood: string | null;
};

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (selection: AddressSelection) => void;
  placeholder?: string;
  /** Country bias (ISO 3166-1 alpha-2). Default 'cv' for Cabo Verde. */
  country?: string;
}

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

/**
 * Build a Google Maps URL from coordinates.
 * Coordinates are more reliable than free-text labels for opening the
 * exact location on web, iOS and Android.
 */
const buildMapUrl = (lat: number, lng: number) => {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
};

const extractNeighborhood = (feature: any): string | null => {
  // Mapbox feature.context = [{ id: 'neighborhood.x', text: '...' }, ...]
  if (!feature?.context || !Array.isArray(feature.context)) return null;
  const hood = feature.context.find((c: any) => typeof c?.id === 'string' && c.id.startsWith('neighborhood'));
  if (hood?.text) return hood.text as string;
  const locality = feature.context.find((c: any) => typeof c?.id === 'string' && c.id.startsWith('locality'));
  if (locality?.text) return locality.text as string;
  return null;
};

const AddressAutocomplete = ({
  value,
  onChange,
  onSelect,
  placeholder = 'Comece a escrever a morada…',
  country = 'cv',
}: AddressAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<Array<{ raw: any; s: AddressSuggestion }>>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeIdx, setActiveIdx] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSelectedRef = useRef<string>('');

  // Close on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => {
    // Don't re-search a value we just selected
    if (value === lastSelectedRef.current) return;

    if (!MAPBOX_TOKEN) return;
    const q = value.trim();
    if (q.length < 3) {
      setSuggestions([]);
      setOpen(false);
      setError(null);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const url = new URL(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json`,
        );
        url.searchParams.set('access_token', MAPBOX_TOKEN);
        url.searchParams.set('autocomplete', 'true');
        url.searchParams.set('limit', '6');
        url.searchParams.set('language', 'pt');
        if (country) url.searchParams.set('country', country);

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error(`Mapbox ${res.status}`);
        const data = await res.json();
        const feats = (data?.features ?? []) as any[];
        const mapped = feats.map((f) => ({
          raw: f,
          s: {
            id: String(f.id),
            place_name: String(f.place_name ?? ''),
            text: String(f.text ?? ''),
            longitude: Number(f.center?.[0] ?? 0),
            latitude: Number(f.center?.[1] ?? 0),
            neighborhood: extractNeighborhood(f),
          } as AddressSuggestion,
        }));
        setSuggestions(mapped);
        setOpen(mapped.length > 0);
        setActiveIdx(-1);
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Erro de pesquisa';
        setError(msg);
        setSuggestions([]);
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, country]);

  const handlePick = (item: { raw: any; s: AddressSuggestion }) => {
    const { s } = item;
    lastSelectedRef.current = s.place_name;
    onChange(s.place_name);
    onSelect({
      address_full: s.place_name,
      latitude: s.latitude,
      longitude: s.longitude,
      map_url: buildMapUrl(s.latitude, s.longitude),
      neighborhood: s.neighborhood,
    });
    setOpen(false);
    setSuggestions([]);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault();
      handlePick(suggestions[activeIdx]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  if (!MAPBOX_TOKEN) {
    return (
      <div className="space-y-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        <div className="flex items-start gap-2 text-[11px] text-muted-foreground">
          <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>
            Autocomplete inativo — falta configurar <code className="font-mono text-foreground">VITE_MAPBOX_TOKEN</code> nas
            variáveis de ambiente. A morada pode ser introduzida manualmente.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <Input
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            // typing again invalidates "lastSelected"
            if (e.target.value !== lastSelectedRef.current) lastSelectedRef.current = '';
          }}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="pl-9 pr-9"
          autoComplete="off"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground animate-spin" />
        )}
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-lg overflow-hidden">
          {error && (
            <div className="flex items-start gap-2 px-3 py-2.5 text-xs text-destructive">
              <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <span>Falha na pesquisa: {error}</span>
            </div>
          )}
          {!error && suggestions.length === 0 && !loading && (
            <div className="px-3 py-2.5 text-xs text-muted-foreground">Sem sugestões.</div>
          )}
          {!error && suggestions.length > 0 && (
            <ul className="max-h-72 overflow-y-auto">
              {suggestions.map((item, i) => (
                <li key={item.s.id}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIdx(i)}
                    onMouseDown={(e) => {
                      // mousedown so we beat input blur
                      e.preventDefault();
                      handlePick(item);
                    }}
                    className={cn(
                      'w-full text-left px-3 py-2.5 flex items-start gap-2.5 text-sm transition-colors',
                      i === activeIdx ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50',
                    )}
                  >
                    <MapPin className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-foreground truncate">{item.s.text}</div>
                      <div className="text-xs text-muted-foreground truncate">{item.s.place_name}</div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;
