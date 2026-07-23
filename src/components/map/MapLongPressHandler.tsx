import { useRef } from 'react';
import { useMapEvents } from 'react-leaflet';
import type { LeafletMouseEvent } from 'leaflet';

// A tap alone must keep working for panning/zooming on touch devices, so
// creating a place requires a deliberate long press (mirrors the
// "drop a pin" gesture used by most mobile map apps) rather than any click.
const LONG_PRESS_MS = 500;
const MOVE_TOLERANCE_PX = 10;

interface Props {
  onLongPress: (lat: number, lng: number) => void;
}

export function MapLongPressHandler({ onLongPress }: Props) {
  const timerRef = useRef<number | null>(null);
  const startRef = useRef<LeafletMouseEvent | null>(null);

  function cancelPress() {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    startRef.current = null;
  }

  useMapEvents({
    mousedown(e) {
      startRef.current = e;
      timerRef.current = window.setTimeout(() => {
        onLongPress(e.latlng.lat, e.latlng.lng);
        cancelPress();
      }, LONG_PRESS_MS);
    },
    mousemove(e) {
      const start = startRef.current;
      if (!start) return;
      const dx = e.containerPoint.x - start.containerPoint.x;
      const dy = e.containerPoint.y - start.containerPoint.y;
      if (Math.hypot(dx, dy) > MOVE_TOLERANCE_PX) {
        cancelPress();
      }
    },
    mouseup: cancelPress,
    movestart: cancelPress,
  });

  return null;
}
