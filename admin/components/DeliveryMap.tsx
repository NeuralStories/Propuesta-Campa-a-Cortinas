import React, { useMemo, useEffect, useRef, useState } from 'react';
import type { DatabaseOrder } from '../../services/supabase';

interface DeliveryMapProps {
  orders: DatabaseOrder[];
}

const MAP_BOUNDS = {
  minLat: 27.5,
  maxLat: 44.5,
  minLon: -18.5,
  maxLon: 5.5
};

const SPAIN_BOUNDS = {
  minLat: 35.5,
  maxLat: 43.9,
  minLon: -9.8,
  maxLon: 4.7
};

const CANARIAS_BOUNDS = {
  minLat: 27.4,
  maxLat: 29.6,
  minLon: -18.4,
  maxLon: -13.1
};

const ORIGIN = {
  lat: 39.6,
  lon: 2.7,
  label: 'EGEA'
};

const REGION_TARGETS: Record<string, { lat: number; lon: number; color: string; jitter: number }> = {
  balears: { lat: 39.6, lon: 2.9, color: '#10b981', jitter: 0.12 },
  peninsula: { lat: 40.4168, lon: -3.7038, color: '#f59e0b', jitter: 0.6 },
  canarias: { lat: 28.12, lon: -15.43, color: '#ef4444', jitter: 0.35 }
};

const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_ATTRIBUTION = '&copy; OpenStreetMap contributors';

const normalizeRegion = (region?: string) => {
  const value = (region || '').toLowerCase().trim();
  if (!value) return '';
  if (value.includes('balear')) return 'balears';
  if (value.includes('canar')) return 'canarias';
  if (value.includes('penin')) return 'peninsula';
  return '';
};

const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const buildOrderReference = (order: DatabaseOrder, fallbackIndex: number) => {
  const ref =
    order.reference_number ||
    order.metadata?.reference_number ||
    order.metadata?.referenceNumber ||
    '';
  if (ref && typeof ref === 'string') return ref;
  const timestamp = order.created_at ? new Date(order.created_at).getTime() : Date.now() + fallbackIndex;
  return `EG${String(timestamp).slice(-8)}`;
};

const withJitter = (baseLat: number, baseLon: number, seed: number, jitter: number) => {
  const latOffset = ((seed % 1000) / 1000 - 0.5) * jitter;
  const lonOffset = (((seed / 1000) % 1000) / 1000 - 0.5) * jitter;
  return { lat: baseLat + latOffset, lon: baseLon + lonOffset };
};

const buildArcPoints = (
  origin: { lat: number; lon: number },
  destination: { lat: number; lon: number }
) => {
  const lat1 = origin.lat;
  const lon1 = origin.lon;
  const lat2 = destination.lat;
  const lon2 = destination.lon;

  const midLat = (lat1 + lat2) / 2;
  const midLon = (lon1 + lon2) / 2;
  const dx = lon2 - lon1;
  const dy = lat2 - lat1;
  const distance = Math.hypot(dx, dy);
  const curve = Math.min(1.4, Math.max(0.6, distance * 0.6));
  const controlLat = midLat + dx * 0.2 * curve;
  const controlLon = midLon - dy * 0.2 * curve;

  const points: [number, number][] = [];
  const steps = 20;
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const lat =
      (1 - t) * (1 - t) * lat1 +
      2 * (1 - t) * t * controlLat +
      t * t * lat2;
    const lon =
      (1 - t) * (1 - t) * lon1 +
      2 * (1 - t) * t * controlLon +
      t * t * lon2;
    points.push([lat, lon]);
  }
  return points;
};

const loadLeaflet = () => {
  if ((window as any).L) return Promise.resolve();
  if (document.querySelector('script[data-leaflet]')) {
    return new Promise<void>((resolve) => {
      const check = () => {
        if ((window as any).L) resolve();
        else setTimeout(check, 50);
      };
      check();
    });
  }

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  link.setAttribute('data-leaflet', 'true');
  document.head.appendChild(link);

  const script = document.createElement('script');
  script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  script.async = true;
  script.setAttribute('data-leaflet', 'true');
  document.body.appendChild(script);

  return new Promise<void>((resolve) => {
    script.onload = () => resolve();
  });
};

export const DeliveryMap: React.FC<DeliveryMapProps> = ({ orders }) => {
  const mapRef = useRef<any>(null);
  const layerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [focusArea, setFocusArea] = useState<'all' | 'spain' | 'canarias'>('all');

  const orderPoints = useMemo(() => {
    const sorted = [...orders].sort((a, b) => {
      const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bTime - aTime;
    });

    return sorted
      .map((order, index) => {
        const regionKey = normalizeRegion(order.customer_info?.region || order.customer_info?.direccion);
        const region = (REGION_TARGETS as any)[regionKey];
        if (!region) return null;
        const label = buildOrderReference(order, index);
        const seed = hashString(`${label}-${order.customer_info?.direccion || ''}`);
        const destination = withJitter(region.lat, region.lon, seed, region.jitter);
        return {
          id: order.id || `${index}`,
          label,
          color: region.color,
          destination
        };
      })
      .filter(Boolean) as Array<{
      id: string;
      label: string;
      color: string;
      destination: { lat: number; lon: number };
    }>;
  }, [orders]);

  const visibleOrders = orderPoints.slice(0, 12);
  const hiddenCount = Math.max(orderPoints.length - visibleOrders.length, 0);

  useEffect(() => {
    let isMounted = true;
    loadLeaflet().then(() => {
      if (!isMounted || mapRef.current || !containerRef.current) return;
      const L = (window as any).L;
      if (!L) return;

      const map = L.map(containerRef.current, {
        zoomControl: false,
        attributionControl: true,
        maxBounds: [
          [MAP_BOUNDS.minLat, MAP_BOUNDS.minLon],
          [MAP_BOUNDS.maxLat, MAP_BOUNDS.maxLon]
        ],
        maxBoundsViscosity: 0.9
      });
      mapRef.current = map;

      L.tileLayer(TILE_URL, {
        attribution: TILE_ATTRIBUTION
      }).addTo(map);
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const bounds = L.latLngBounds(
        [MAP_BOUNDS.minLat, MAP_BOUNDS.minLon],
        [MAP_BOUNDS.maxLat, MAP_BOUNDS.maxLon]
      );
      map.fitBounds(bounds, { padding: [20, 20] });
      map.setMinZoom(4);
      map.setMaxZoom(8);

      layerRef.current = L.layerGroup().addTo(map);
      requestAnimationFrame(() => map.invalidateSize());
    });

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        layerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !layerRef.current) return;
    const L = (window as any).L;
    if (!L) return;
    layerRef.current.clearLayers();

    const originMarker = L.circleMarker([ORIGIN.lat, ORIGIN.lon], {
      radius: 7,
      color: '#1d4ed8',
      fillColor: '#2563eb',
      fillOpacity: 1,
      weight: 2
    }).addTo(layerRef.current);
    originMarker.bindTooltip(ORIGIN.label, {
      permanent: true,
      direction: 'top',
      offset: [0, -8]
    });

    visibleOrders.forEach((order) => {
      const arcPoints = buildArcPoints(ORIGIN, order.destination);
      L.polyline(arcPoints, {
        color: order.color,
        weight: 2,
        dashArray: '4 8',
        opacity: 0.9
      }).addTo(layerRef.current);

      const marker = L.circleMarker([order.destination.lat, order.destination.lon], {
        radius: 6,
        color: order.color,
        fillColor: order.color,
        fillOpacity: 1,
        weight: 2
      }).addTo(layerRef.current);

      marker.bindTooltip(order.label, {
        permanent: true,
        direction: 'right',
        offset: [8, 0],
        opacity: 0.9
      });
    });
  }, [visibleOrders]);

  useEffect(() => {
    if (!mapRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    const bounds = focusArea === 'spain'
      ? L.latLngBounds([SPAIN_BOUNDS.minLat, SPAIN_BOUNDS.minLon], [SPAIN_BOUNDS.maxLat, SPAIN_BOUNDS.maxLon])
      : focusArea === 'canarias'
      ? L.latLngBounds([CANARIAS_BOUNDS.minLat, CANARIAS_BOUNDS.minLon], [CANARIAS_BOUNDS.maxLat, CANARIAS_BOUNDS.maxLon])
      : L.latLngBounds([MAP_BOUNDS.minLat, MAP_BOUNDS.minLon], [MAP_BOUNDS.maxLat, MAP_BOUNDS.maxLon]);

    mapRef.current.fitBounds(bounds, { padding: [20, 20] });
  }, [focusArea]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all', label: 'España + Canarias' },
          { id: 'spain', label: 'España peninsular' },
          { id: 'canarias', label: 'Islas Canarias' }
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFocusArea(item.id as 'all' | 'spain' | 'canarias')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
              focusArea === item.id
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div ref={containerRef} className="relative w-full h-96 rounded-lg border border-gray-100 bg-gray-50 overflow-hidden" />

      {orderPoints.length === 0 && (
        <div className="text-sm text-gray-500 text-center">
          No hay pedidos con zona geografica para mostrar en el mapa.
        </div>
      )}
      {hiddenCount > 0 && (
        <div className="text-xs text-gray-500 text-center">
          Mostrando los ultimos {visibleOrders.length} pedidos. Hay {hiddenCount} adicionales ocultos.
        </div>
      )}
    </div>
  );
};

export default DeliveryMap;
