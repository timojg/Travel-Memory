import type { CategoryKey } from '../types/category';

export type PoiGroup = 'camp' | 'cafe' | 'view';

export interface PoiTagDef {
  osmKey: string;
  osmValue: string;
  group: PoiGroup;
  suggestedCategory: CategoryKey;
  osmType: string;
  /** Whether this tag is typically mapped as an area (way), not just a node. */
  hasWayVariant?: boolean;
}

// The single place to extend "Discover nearby POIs": add an OSM tag here to
// have it queried from Overpass and rendered as a POI marker. Deliberately
// small — restaurants/hotels/etc. would explode marker density in cities
// without a clean mapping to an existing category.
export const POI_TAGS: PoiTagDef[] = [
  {
    osmKey: 'tourism',
    osmValue: 'camp_site',
    group: 'camp',
    suggestedCategory: 'stellplatz',
    osmType: 'Campingplatz',
    hasWayVariant: true,
  },
  {
    osmKey: 'tourism',
    osmValue: 'caravan_site',
    group: 'camp',
    suggestedCategory: 'stellplatz',
    osmType: 'Wohnmobil-/Wohnwagenstellplatz',
    hasWayVariant: true,
  },
  {
    osmKey: 'amenity',
    osmValue: 'cafe',
    group: 'cafe',
    suggestedCategory: 'cafe',
    osmType: 'Café',
  },
  {
    osmKey: 'tourism',
    osmValue: 'viewpoint',
    group: 'view',
    suggestedCategory: 'wanderung',
    osmType: 'Aussichtspunkt',
  },
  {
    osmKey: 'tourism',
    osmValue: 'attraction',
    group: 'view',
    suggestedCategory: 'wanderung',
    osmType: 'Sehenswürdigkeit',
    hasWayVariant: true,
  },
];

export const POI_GROUP_COLORS: Record<PoiGroup, string> = {
  camp: '#2e7d32',
  cafe: '#6d4c41',
  view: '#1565c0',
};

export function classifyTags(
  tags: Record<string, string> | undefined,
): PoiTagDef | null {
  if (!tags) return null;
  for (const def of POI_TAGS) {
    if (tags[def.osmKey] === def.osmValue) return def;
  }
  return null;
}
