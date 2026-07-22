import Dexie, { type EntityTable } from 'dexie';
import type { Place } from '../types/place';

class TravelMemoryDB extends Dexie {
  places!: EntityTable<Place, 'id'>;

  constructor() {
    super('travel-memory');
    this.version(1).stores({
      places: 'id, category, createdAt',
    });
  }
}

export const db = new TravelMemoryDB();
