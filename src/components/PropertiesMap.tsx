import { useMemo } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Property } from '@/lib/sampleProperties';
import { useCurrency } from '@/lib/currency';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

/** Rough centre of Cabo Verde, used when no property has coordinates yet. */
const FALLBACK_VIEW = { longitude: -23.6, latitude: 15.8, zoom: 7.2 };

interface PropertiesMapProps {
  properties: Property[];
  hoveredId: string | null;
  onPinHover: (id: string | null) => void;
  onPinClick: (id: string) => void;
}

const PropertiesMap = ({ properties, hoveredId, onPinHover, onPinClick }: PropertiesMapProps) => {
  const { formatPrice } = useCurrency();

  const located = useMemo(
    () => properties.filter((p): p is Property & { coordinates: { lat: number; lng: number } } => !!p.coordinates),
    [properties]
  );

  const initialView = useMemo(() => {
    if (located.length === 0) return FALLBACK_VIEW;
    const avgLat = located.reduce((sum, p) => sum + p.coordinates.lat, 0) / located.length;
    const avgLng = located.reduce((sum, p) => sum + p.coordinates.lng, 0) / located.length;
    return { longitude: avgLng, latitude: avgLat, zoom: located.length === 1 ? 12 : 9 };
  }, [located]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-card border border-border/50 rounded-xl text-center p-8">
        <p className="text-muted-foreground font-body text-sm">
          Mapa indisponível — falta configurar <code className="text-primary">VITE_MAPBOX_TOKEN</code>.
        </p>
      </div>
    );
  }

  return (
    <Map
      mapboxAccessToken={MAPBOX_TOKEN}
      initialViewState={initialView}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      style={{ width: '100%', height: '100%', borderRadius: '0.75rem' }}
      reuseMaps
    >
      <NavigationControl position="top-right" showCompass={false} />
      {located.map((prop) => {
        const isHovered = hoveredId === prop.id;
        return (
          <Marker
            key={prop.id}
            longitude={prop.coordinates.lng}
            latitude={prop.coordinates.lat}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              onPinClick(prop.id);
            }}
          >
            <button
              type="button"
              onMouseEnter={() => onPinHover(prop.id)}
              onMouseLeave={() => onPinHover(null)}
              className="group relative flex flex-col items-center cursor-pointer"
              aria-label={prop.title_pt}
            >
              {isHovered && (
                <span className="mb-1.5 whitespace-nowrap rounded-full bg-background/95 backdrop-blur-sm border border-primary/30 px-3 py-1 text-[11px] font-body text-primary shadow-lg">
                  {formatPrice(prop.price, prop.type === 'rent' ? '/mês' : '')}
                </span>
              )}
              <span
                className={`block rounded-full border-2 border-background shadow-lg transition-all duration-200 ${
                  isHovered ? 'w-5 h-5 bg-primary' : 'w-3.5 h-3.5 bg-primary/80'
                }`}
              />
            </button>
          </Marker>
        );
      })}
    </Map>
  );
};

export default PropertiesMap;
