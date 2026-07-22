import type { CategoryDef, CategoryKey } from '../types/category';

// The single place to extend the app: add a category or a field here,
// no data migration required.
export const CATEGORIES: CategoryDef[] = [
  {
    key: 'stellplatz',
    label: 'Stellplatz',
    color: '#2e7d32',
    icon: '🚐',
    fields: [
      { key: 'address', label: 'Adresse', type: 'text' },
      { key: 'toilet', label: 'Toilette', type: 'boolean' },
      { key: 'shower', label: 'Dusche', type: 'boolean' },
      { key: 'price', label: 'Preis', type: 'number', unit: '€' },
    ],
  },
  {
    key: 'cafe',
    label: 'Café',
    color: '#6d4c41',
    icon: '☕',
    fields: [{ key: 'address', label: 'Adresse', type: 'text' }],
  },
  {
    key: 'wanderung',
    label: 'Wanderung',
    color: '#1565c0',
    icon: '🥾',
    fields: [
      { key: 'startPoint', label: 'Startpunkt', type: 'text' },
      { key: 'distanceKm', label: 'Distanz', type: 'number', unit: 'km' },
      { key: 'durationH', label: 'Dauer', type: 'number', unit: 'h' },
    ],
  },
];

export function getCategory(key: CategoryKey): CategoryDef | undefined {
  return CATEGORIES.find((c) => c.key === key);
}
