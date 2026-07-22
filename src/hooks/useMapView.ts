import { useCallback, useState } from 'react';

const STORAGE_KEY = 'travel-memory:map-view';

export interface MapView {
  center: [number, number];
  zoom: number;
}

const DEFAULT_VIEW: MapView = { center: [51, 10], zoom: 6 };

function loadInitial(): MapView {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as MapView;
  } catch {
    // ignore malformed storage, fall back to default view
  }
  return DEFAULT_VIEW;
}

export function useMapView() {
  const [view, setView] = useState<MapView>(loadInitial);

  const saveView = useCallback((next: MapView) => {
    setView(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  return { view, saveView };
}
