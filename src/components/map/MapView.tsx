import { LayersControl, MapContainer, Marker, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getCategory } from '../../config/categories';
import { makeDivIcon } from '../../lib/leafletIcon';
import type { Place } from '../../types/place';
import type { MapView as MapViewState } from '../../hooks/useMapView';
import type { Poi } from '../../data/overpass';
import { MapLongPressHandler } from './MapLongPressHandler';
import { MapViewSync } from './MapViewSync';
import { NearbyPoisLayer } from './NearbyPoisLayer';

const DRAFT_ICON = makeDivIcon('#9e9e9e', '📍');

interface Props {
  places: Place[];
  initialView: MapViewState;
  onViewChange: (view: MapViewState) => void;
  draftLocation: { lat: number; lng: number } | null;
  onLongPress: (lat: number, lng: number) => void;
  onSelectPlace: (id: string) => void;
  discoverEnabled: boolean;
  onAddPoi: (poi: Poi) => void;
}

export function MapView({
  places,
  initialView,
  onViewChange,
  draftLocation,
  onLongPress,
  onSelectPlace,
  discoverEnabled,
  onAddPoi,
}: Props) {
  return (
    <MapContainer
      center={initialView.center}
      zoom={initialView.zoom}
      className="map-container"
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Standard">
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Outdoor (Stellplätze, Wanderwege, Sehenswürdigkeiten)">
          <TileLayer
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            subdomains="abc"
            maxZoom={17}
            attribution='Kartendaten: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>-Mitwirkende, SRTM | Kartendarstellung: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
          />
        </LayersControl.BaseLayer>
      </LayersControl>
      <MapLongPressHandler onLongPress={onLongPress} />
      <MapViewSync onChange={onViewChange} />
      <NearbyPoisLayer enabled={discoverEnabled} onAddPoi={onAddPoi} />
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
