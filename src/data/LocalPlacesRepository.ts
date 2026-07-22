import { db } from './db';
import type { Place } from '../types/place';
import type { CategoryKey } from '../types/category';
import type { PlacesRepository } from './PlacesRepository';

export class LocalPlacesRepository implements PlacesRepository {
  async getAll(): Promise<Place[]> {
    return db.places.toArray();
  }

  async getById(id: string): Promise<Place | undefined> {
    return db.places.get(id);
  }

  async add(place: Place): Promise<void> {
    await db.places.add(place);
  }

  async update(place: Place): Promise<void> {
    await db.places.put(place);
  }

  async delete(id: string): Promise<void> {
    await db.places.delete(id);
  }

  async getByCategory(category: CategoryKey): Promise<Place[]> {
    return db.places.where('category').equals(category).toArray();
  }

  async bulkImport(places: Place[]): Promise<void> {
    await db.places.bulkPut(places);
  }
}
