import { useMapEvents } from 'react-leaflet';
import type { MapView } from '../../hooks/useMapView';

interface Props {
  onChange: (view: MapView) => void;
}

export function MapViewSync({ onChange }: Props) {
  const map = useMapEvents({
    moveend() {
      const center = map.getCenter();
      onChange({ center: [center.lat, center.lng], zoom: map.getZoom() });
    },
  });
  return null;
}
