# Travel-Memory

Eine Web-App, um gute Orte für Roadtrips auf einer Karte zu sammeln – Stellplätze, Cafés, Wanderungen und später weitere Kategorien.

## Prinzipien

- Reine Web-App, kein Login, keine Accounts – ein lokales Tool.
- **Alle Daten bleiben ausschließlich im Browser** (IndexedDB) auf dem jeweiligen Gerät. Es gibt keinen Server, keine Cloud-Synchronisation. Löschst du die Browserdaten, sind die Orte weg – nutze regelmäßig **Exportieren**, um ein JSON-Backup zu erstellen.
- Kein Google-Maps-API-Key nötig – die Karte nutzt OpenStreetMap-Tiles.
- Der eigentliche Mehrwert der App ist die persönliche Kuration (welche Orte gesammelt werden + eigene Notizen), nicht das Nachbilden von Objektdaten. Deshalb gibt es pro Ort ein Feld für einen Referenz-Link auf bestehende Quellen (Homepage, Park4Night, Komoot, …).

## Nutzung

```bash
npm install
npm run dev
```

Anschließend im Browser öffnen (Adresse wird im Terminal angezeigt). Auf die Karte klicken, um einen neuen Ort anzulegen; auf einen Marker klicken, um Details zu sehen, zu bearbeiten oder zu löschen. Über die Filter-Chips lassen sich Kategorien ein-/ausblenden.

Für einen produktionsnahen Build:

```bash
npm run build
npm run preview
```

Das Ergebnis in `dist/` ist eine rein statische Seite und kann z. B. auf Vercel, Netlify oder GitHub Pages gehostet werden – es wird kein Backend benötigt.

## Architektur

- **React + TypeScript + Vite**, **Leaflet/react-leaflet** für die Karte (OSM-Standard-Tiles, keine API-Keys), **Dexie** (IndexedDB) als lokaler Speicher.
- Kategorien und ihre Felder sind zentral in [`src/config/categories.ts`](src/config/categories.ts) definiert. Neue Kategorien oder Felder lassen sich dort ergänzen, ohne die Datenstruktur umzubauen.
- Der Datenzugriff läuft über das Interface [`src/data/PlacesRepository.ts`](src/data/PlacesRepository.ts), aktuell implementiert durch `LocalPlacesRepository` (IndexedDB). Eine spätere Erweiterung Richtung Accounts/Sharing kann eine weitere Implementierung hinter derselben Schnittstelle bereitstellen, ohne UI-Code anzufassen.
- Export/Import als JSON (`src/lib/exportImport.ts`) dient heute als Backup und wäre später ein natürlicher Migrationspfad in ein Account-System.

## Kartendaten

Kartenmaterial: © [OpenStreetMap](https://www.openstreetmap.org/copyright)-Mitwirkende. Die Nutzung der Standard-Tiles (`tile.openstreetmap.org`) ist für geringes, persönliches Nutzungsvolumen vorgesehen. Bei intensiverer/öffentlicher Nutzung sollte auf einen dedizierten Tile-Anbieter (z. B. Stadia Maps, MapTiler, Thunderforest) umgestellt werden – dafür genügt eine Änderung der Tile-URL in [`src/components/map/MapView.tsx`](src/components/map/MapView.tsx).
