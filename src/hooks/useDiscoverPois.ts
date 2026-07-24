import { useCallback, useState } from 'react';

const STORAGE_KEY = 'travel-memory:discover-pois';

function loadInitial(): boolean {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw === null ? true : raw === 'true';
}

export function useDiscoverPois() {
  const [enabled, setEnabled] = useState<boolean>(loadInitial);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  return { enabled, toggle };
}
