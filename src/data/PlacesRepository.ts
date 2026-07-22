import type { Place } from '../types/place';
import type { CategoryKey } from '../types/category';

// Interface boundary between UI and storage. Today there is exactly one
// implementation (IndexedDB via Dexie). A later account/sharing backend can
// implement this same interface without any UI/hook code changing.
export interface PlacesRepository {
  getAll(): Promise<Place[]>;
  getById(id: string): Promise<Place | undefined>;
  add(place: Place): Promise<void>;
  update(place: Place): Promise<void>;
  delete(id: string): Promise<void>;
  getByCategory(category: CategoryKey): Promise<Place[]>;
  bulkImport(places: Place[]): Promise<void>;
}
