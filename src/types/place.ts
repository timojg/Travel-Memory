import type { CategoryKey } from './category';

export const CURRENT_SCHEMA_VERSION = 1;

export interface Place {
  id: string;
  category: CategoryKey;
  name: string;
  lat: number;
  lng: number;
  referenceUrl?: string;
  notes?: string;
  attributes: Record<string, unknown>;
  photoIds?: string[];
  createdAt: string;
  updatedAt: string;
  schemaVersion: number;
}

export interface ExportEnvelope {
  schemaVersion: number;
  exportedAt: string;
  places: Place[];
}
