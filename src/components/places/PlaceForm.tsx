import { useState, type FormEvent } from 'react';
import { CATEGORIES, getCategory } from '../../config/categories';
import { DynamicFields } from './DynamicFields';
import { coerceAttributes, validatePlaceForm, type FormValues } from '../../lib/validation';
import { CURRENT_SCHEMA_VERSION, type Place } from '../../types/place';
import type { CategoryKey } from '../../types/category';

const LAST_CATEGORY_KEY = 'travel-memory:last-category';

interface Props {
  location: { lat: number; lng: number };
  existing?: Place;
  onSave: (place: Place) => void;
  onCancel: () => void;
}

export function PlaceForm({ location, existing, onSave, onCancel }: Props) {
  const [categoryKey, setCategoryKey] = useState<CategoryKey>(
    existing?.category ?? localStorage.getItem(LAST_CATEGORY_KEY) ?? CATEGORIES[0].key,
  );
  const [values, setValues] = useState<FormValues>({
    name: existing?.name ?? '',
    referenceUrl: existing?.referenceUrl ?? '',
    notes: existing?.notes ?? '',
    attributes: existing?.attributes ?? {},
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const category = getCategory(categoryKey) ?? CATEGORIES[0];

  function handleAttributeChange(key: string, value: unknown) {
    setValues((prev) => ({ ...prev, attributes: { ...prev.attributes, [key]: value } }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = validatePlaceForm(category, values);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }

    localStorage.setItem(LAST_CATEGORY_KEY, categoryKey);

    const now = new Date().toISOString();
    const place: Place = {
      id: existing?.id ?? crypto.randomUUID(),
      category: categoryKey,
      name: values.name.trim(),
      lat: location.lat,
      lng: location.lng,
      referenceUrl: values.referenceUrl.trim() || undefined,
      notes: values.notes.trim() || undefined,
      attributes: coerceAttributes(category, values.attributes),
      photoIds: existing?.photoIds,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      schemaVersion: CURRENT_SCHEMA_VERSION,
    };
    onSave(place);
  }

  return (
    <form className="place-form" onSubmit={handleSubmit}>
      <h2>{existing ? 'Ort bearbeiten' : 'Neuer Ort'}</h2>

      <div className="form-field">
        <label htmlFor="category">Kategorie</label>
        <select
          id="category"
          value={categoryKey}
          onChange={(e) => setCategoryKey(e.target.value)}
          disabled={Boolean(existing)}
        >
          {CATEGORIES.map((c) => (
            <option key={c.key} value={c.key}>
              {c.icon} {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="name">Name*</label>
        <input
          id="name"
          type="text"
          value={values.name}
          onChange={(e) => setValues((prev) => ({ ...prev, name: e.target.value }))}
        />
        {errors.name && <span className="form-error">{errors.name}</span>}
      </div>

      <DynamicFields
        fields={category.fields}
        values={values.attributes}
        errors={errors}
        onChange={handleAttributeChange}
      />

      <div className="form-field">
        <label htmlFor="referenceUrl">Referenz-Link</label>
        <input
          id="referenceUrl"
          type="url"
          placeholder="z.B. Park4Night, Komoot, Homepage …"
          value={values.referenceUrl}
          onChange={(e) => setValues((prev) => ({ ...prev, referenceUrl: e.target.value }))}
        />
        {errors.referenceUrl && <span className="form-error">{errors.referenceUrl}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="notes">Notizen</label>
        <textarea
          id="notes"
          value={values.notes}
          onChange={(e) => setValues((prev) => ({ ...prev, notes: e.target.value }))}
        />
      </div>

      <div className="form-actions">
        <button type="submit">Speichern</button>
        <button type="button" onClick={onCancel}>
          Abbrechen
        </button>
      </div>
    </form>
  );
}
