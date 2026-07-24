import { useEffect, useState } from 'react';
import { Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import type { LatLngBounds } from 'leaflet';
import { useNearbyPois } from '../../hooks/useNearbyPois';
import { makePoiIcon } from '../../lib/leafletIcon';
import { POI_GROUP_COLORS } from '../../config/poiTags';
import type { Poi } from '../../data/overpass';

interface Props {
  enabled: boolean;
  onAddPoi: (poi: Poi) => void;
}

export function NearbyPoisLayer({ enabled, onAddPoi }: Props) {
  const map = useMap();
  const [bounds, setBounds] = useState<LatLngBounds | null>(null);
  const [zoom, setZoom] = useState(map.getZoom());

  useEffect(() => {
    setBounds(map.getBounds());
    setZoom(map.getZoom());
  }, [map]);

  useMapEvents({
    moveend() {
      setBounds(map.getBounds());
      setZoom(map.getZoom());
    },
  });

  const { pois, status } = useNearbyPois({ enabled, bounds, zoom });

  if (!enabled) return null;

  return (
    <>
      {pois.map((poi) => (
        <Marker
          key={poi.id}
          position={[poi.lat, poi.lng]}
          icon={makePoiIcon(POI_GROUP_COLORS[poi.group])}
        >
          <Popup>
            <div className="poi-popup">
              <strong>{poi.name || `${poi.osmType} (ohne Namen)`}</strong>
              <p className="poi-popup__type">{poi.osmType}</p>
              <button type="button" onClick={() => onAddPoi(poi)}>
                Zu meiner Liste hinzufügen
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
      {status === 'zoomed-out' && (
        <div className="poi-hint">Zoome hinein, um Orte in der Nähe zu entdecken</div>
      )}
      {status === 'error' && <div className="poi-hint">POI-Daten aktuell nicht verfügbar</div>}
    </>
  );
}
