import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getCategory } from '../../config/categories';
import { makeDivIcon } from '../../lib/leafletIcon';
import type { Place } from '../../types/place';
import type { MapView as MapViewState } from '../../hooks/useMapView';
import { MapClickHandler } from './MapClickHandler';
import { MapViewSync } from './MapViewSync';

const DRAFT_ICON = makeDivIcon('#9e9e9e', '📍');

interface Props {
  places: Place[];
  initialView: MapViewState;
  onViewChange: (view: MapViewState) => void;
  draftLocation: { lat: number; lng: number } | null;
  onMapClick: (lat: number, lng: number) => void;
  onSelectPlace: (id: string) => void;
}

export function MapView({
  places,
  initialView,
  onViewChange,
  draftLocation,
  onMapClick,
  onSelectPlace,
}: Props) {
  return (
    <MapContainer
      center={initialView.center}
      zoom={initialView.zoom}
      className="map-container"
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapClickHandler onClick={onMapClick} />
      <MapViewSync onChange={onViewChange} />
      {places.map((place) => {
        const category = getCategory(place.category);
        if (!category) return null;
        return (
          <Marker
            key={place.id}
            position={[place.lat, place.lng]}
            icon={makeDivIcon(category.color, category.icon)}
            eventHandlers={{ click: () => onSelectPlace(place.id) }}
          />
        );
      })}
      {draftLocation && (
        <Marker position={[draftLocation.lat, draftLocation.lng]} icon={DRAFT_ICON} />
      )}
    </MapContainer>
  );
}
