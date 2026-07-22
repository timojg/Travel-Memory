import L from 'leaflet';

const cache = new Map<string, L.DivIcon>();

// Leaflet's default marker icons resolve to broken asset paths under Vite,
// so every marker uses a divIcon instead — this also gives us free
// per-category colors/emoji without shipping custom PNGs.
export function makeDivIcon(color: string, icon: string): L.DivIcon {
  const key = `${color}|${icon}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const divIcon = L.divIcon({
    className: 'place-marker',
    html: `<span style="background:${color}" class="place-marker__badge">${icon}</span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });

  cache.set(key, divIcon);
  return divIcon;
}
