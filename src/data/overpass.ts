import { POI_TAGS, classifyTags, type PoiGroup } from '../config/poiTags';
import type { CategoryKey } from '../types/category';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const RESULT_CAP = 200;
const SERVER_TIMEOUT_S = 20;

export interface Poi {
  id: string;
  lat: number;
  lng: number;
  name: string;
  group: PoiGroup;
  suggestedCategory: CategoryKey;
  osmType: string;
}

export interface Bbox {
  south: number;
  west: number;
  north: number;
  east: number;
}

interface OverpassElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

interface OverpassResponse {
  elements: OverpassElement[];
}

export function buildOverpassQuery(bbox: Bbox): string {
  const bboxStr = `${bbox.south},${bbox.west},${bbox.north},${bbox.east}`;
  const clauses = POI_TAGS.flatMap((tag) => {
    const nodeClause = `node["${tag.osmKey}"="${tag.osmValue}"](${bboxStr});`;
    if (!tag.hasWayVariant) return [nodeClause];
    return [nodeClause, `way["${tag.osmKey}"="${tag.osmValue}"](${bboxStr});`];
  });

  return `[out:json][timeout:${SERVER_TIMEOUT_S}];\n(\n  ${clauses.join('\n  ')}\n);\nout center tags ${RESULT_CAP};`;
}

export async function fetchOverpass(bbox: Bbox, signal: AbortSignal): Promise<Poi[]> {
  const query = buildOverpassQuery(bbox);
  const response = await fetch(OVERPASS_URL, {
    method: 'POST',
    body: `data=${encodeURIComponent(query)}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Overpass request failed: ${response.status}`);
  }

  const data: OverpassResponse = await response.json();
  return parseElements(data.elements);
}

export function parseElements(elements: OverpassElement[]): Poi[] {
  const pois: Poi[] = [];
  const seen = new Set<string>();

  for (const el of elements) {
    const tagDef = classifyTags(el.tags);
    if (!tagDef) continue;

    const lat = el.lat ?? el.center?.lat;
    const lng = el.lon ?? el.center?.lon;
    if (lat === undefined || lng === undefined) continue;

    const id = `${el.type}/${el.id}`;
    if (seen.has(id)) continue;
    seen.add(id);

    pois.push({
      id,
      lat,
      lng,
      name: el.tags?.name ?? '',
      group: tagDef.group,
      suggestedCategory: tagDef.suggestedCategory,
      osmType: tagDef.osmType,
    });
  }

  return pois;
}
