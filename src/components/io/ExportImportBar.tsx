import { useRef, type ChangeEvent } from 'react';
import { buildEnvelope, downloadEnvelope, parseEnvelope } from '../../lib/exportImport';
import type { Place } from '../../types/place';

interface Props {
  places: Place[];
  onImport: (places: Place[]) => void;
}

export function ExportImportBar({ places, onImport }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    downloadEnvelope(buildEnvelope(places));
  }

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const text = await file.text();
      const envelope = parseEnvelope(text);
      onImport(envelope.places);
    } catch (err) {
      alert(`Import fehlgeschlagen: ${(err as Error).message}`);
    }
  }

  return (
    <div className="export-import-bar">
      <button type="button" onClick={handleExport}>
        Exportieren
      </button>
      <button type="button" onClick={() => fileInputRef.current?.click()}>
        Importieren
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}
