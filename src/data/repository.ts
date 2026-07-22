import { LocalPlacesRepository } from './LocalPlacesRepository';
import type { PlacesRepository } from './PlacesRepository';

export const placesRepo: PlacesRepository = new LocalPlacesRepository();
