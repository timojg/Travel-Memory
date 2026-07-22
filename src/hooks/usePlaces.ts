import { useCallback, useEffect, useState } from 'react';
import { placesRepo } from '../data/repository';
import type { Place } from '../types/place';

export function usePlaces() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const all = await placesRepo.getAll();
    setPlaces(all);
  }, []);

  useEffect(() => {
    reload().finally(() => setLoading(false));
  }, [reload]);

  const addPlace = useCallback(
    async (place: Place) => {
      await placesRepo.add(place);
      await reload();
    },
    [reload],
  );

  const updatePlace = useCallback(
    async (place: Place) => {
      await placesRepo.update(place);
      await reload();
    },
    [reload],
  );

  const deletePlace = useCallback(
    async (id: string) => {
      await placesRepo.delete(id);
      await reload();
    },
    [reload],
  );

  const importPlaces = useCallback(
    async (imported: Place[]) => {
      await placesRepo.bulkImport(imported);
      await reload();
    },
    [reload],
  );

  return { places, loading, addPlace, updatePlace, deletePlace, importPlaces };
}
