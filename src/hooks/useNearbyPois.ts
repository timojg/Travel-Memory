import { useEffect, useRef, useState } from 'react';
import type { LatLngBounds } from 'leaflet';
import { fetchOverpass, type Poi } from '../data/overpass';

const MIN_ZOOM = 13;
const DEBOUNCE_MS = 600;
const PAD_RATIO = 0.5;

export type PoiStatus = 'idle' | 'loading' | 'ready' | 'error' | 'zoomed-out';

interface Params {
  enabled: boolean;
  bounds: LatLngBounds | null;
  zoom: number;
}

function isAbortError(err: unknown): boolean {
  return err instanceof DOMException && err.name === 'AbortError';
}

export function useNearbyPois({ enabled, bounds, zoom }: Params) {
  const [pois, setPois] = useState<Poi[]>([]);
  const [status, setStatus] = useState<PoiStatus>('idle');

  const lastFetchRef = useRef<{ paddedBounds: LatLngBounds; zoomBucket: number } | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || !bounds) {
      setStatus('idle');
      setPois([]);
      lastFetchRef.current = null;
      return;
    }

    if (zoom < MIN_ZOOM) {
      setStatus('zoomed-out');
      setPois([]);
      lastFetchRef.current = null;
      return;
    }

    const zoomBucket = Math.round(zoom);
    const last = lastFetchRef.current;
    if (last && last.zoomBucket === zoomBucket && last.paddedBounds.contains(bounds)) {
      return;
    }

    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const paddedBounds = bounds.pad(PAD_RATIO);
      setStatus('loading');

      fetchOverpass(
        {
          south: paddedBounds.getSouth(),
          west: paddedBounds.getWest(),
          north: paddedBounds.getNorth(),
          east: paddedBounds.getEast(),
        },
        controller.signal,
      )
        .then((result) => {
          lastFetchRef.current = { paddedBounds, zoomBucket };
          setPois(result);
          setStatus('ready');
        })
        .catch((err: unknown) => {
          if (isAbortError(err)) return;
          setStatus('error');
        });
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, [enabled, bounds, zoom]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  return { pois, status };
}
