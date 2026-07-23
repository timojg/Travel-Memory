import { useState } from 'react';
import { MapView } from './components/map/MapView';
import { PlaceForm } from './components/places/PlaceForm';
import { PlaceDetail } from './components/places/PlaceDetail';
import { CategoryFilterBar } from './components/filter/CategoryFilterBar';
import { ExportImportBar } from './components/io/ExportImportBar';
import { usePlaces } from './hooks/usePlaces';
import { useCategoryFilter } from './hooks/useCategoryFilter';
import { useMapView } from './hooks/useMapView';
import type { Place } from './types/place';

type PanelState =
  | { kind: 'idle' }
  | { kind: 'creating'; location: { lat: number; lng: number } }
  | { kind: 'editing'; place: Place }
  | { kind: 'viewing'; place: Place };

export default function App() {
  const { places, loading, addPlace, updatePlace, deletePlace, importPlaces } = usePlaces();
  const { isActive, toggle } = useCategoryFilter();
  const { view, saveView } = useMapView();
  const [panel, setPanel] = useState<PanelState>({ kind: 'idle' });

  const visiblePlaces = places.filter((p) => isActive(p.category));

  function handleLongPress(lat: number, lng: number) {
    setPanel({ kind: 'creating', location: { lat, lng } });
  }

  function handleSelectPlace(id: string) {
    const place = places.find((p) => p.id === id);
    if (place) setPanel({ kind: 'viewing', place });
  }

  async function handleSave(place: Place) {
    if (panel.kind === 'editing') {
      await updatePlace(place);
    } else {
      await addPlace(place);
    }
    setPanel({ kind: 'viewing', place });
  }

  async function handleDelete(id: string) {
    await deletePlace(id);
    setPanel({ kind: 'idle' });
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Travel-Memory</h1>
        <ExportImportBar places={places} onImport={importPlaces} />
      </header>

      <CategoryFilterBar isActive={isActive} onToggle={toggle} />

      <div className="app-body">
        <MapView
          places={visiblePlaces}
          initialView={view}
          onViewChange={saveView}
          draftLocation={panel.kind === 'creating' ? panel.location : null}
          onLongPress={handleLongPress}
          onSelectPlace={handleSelectPlace}
        />

        {panel.kind === 'creating' && (
          <aside className="side-panel">
            <PlaceForm
              location={panel.location}
              onSave={handleSave}
              onCancel={() => setPanel({ kind: 'idle' })}
            />
          </aside>
        )}

        {panel.kind === 'editing' && (
          <aside className="side-panel">
            <PlaceForm
              location={{ lat: panel.place.lat, lng: panel.place.lng }}
              existing={panel.place}
              onSave={handleSave}
              onCancel={() => setPanel({ kind: 'viewing', place: panel.place })}
            />
          </aside>
        )}

        {panel.kind === 'viewing' && (
          <aside className="side-panel">
            <PlaceDetail
              place={panel.place}
              onEdit={() => setPanel({ kind: 'editing', place: panel.place })}
              onDelete={() => handleDelete(panel.place.id)}
              onClose={() => setPanel({ kind: 'idle' })}
            />
          </aside>
        )}
      </div>

      {loading && <p className="loading-hint">Lade Orte …</p>}
    </div>
  );
}
