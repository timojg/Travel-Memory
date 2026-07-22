import type { ExportEnvelope, Place } from '../types/place';
import { CURRENT_SCHEMA_VERSION } from '../types/place';

export function buildEnvelope(places: Place[]): ExportEnvelope {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    places,
  };
}

export function downloadEnvelope(envelope: ExportEnvelope): void {
  const blob = new Blob([JSON.stringify(envelope, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const date = envelope.exportedAt.slice(0, 10);
  a.href = url;
  a.download = `travel-memory-export-${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function parseEnvelope(raw: string): ExportEnvelope {
  const data = JSON.parse(raw);
  if (!data || !Array.isArray(data.places)) {
    throw new Error('Ungültiges Export-Format: "places"-Array fehlt.');
  }
  return data as ExportEnvelope;
}
