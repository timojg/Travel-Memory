import { useCallback, useState } from 'react';
import { CATEGORIES } from '../config/categories';
import type { CategoryKey } from '../types/category';

const STORAGE_KEY = 'travel-memory:active-categories';

function loadInitial(): Set<CategoryKey> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch {
    // ignore malformed storage, fall back to "all categories active"
  }
  return new Set(CATEGORIES.map((c) => c.key));
}

function persist(active: Set<CategoryKey>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...active]));
}

export function useCategoryFilter() {
  const [active, setActive] = useState<Set<CategoryKey>>(loadInitial);

  const toggle = useCallback((key: CategoryKey) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      persist(next);
      return next;
    });
  }, []);

  const setAll = useCallback((on: boolean) => {
    const next = on ? new Set(CATEGORIES.map((c) => c.key)) : new Set<CategoryKey>();
    persist(next);
    setActive(next);
  }, []);

  const isActive = useCallback((key: CategoryKey) => active.has(key), [active]);

  return { active, toggle, setAll, isActive };
}
