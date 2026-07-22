import type { CategoryDef, FieldDef } from '../types/category';

export interface FormValues {
  name: string;
  referenceUrl: string;
  notes: string;
  attributes: Record<string, unknown>;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

function coerceField(field: FieldDef, rawValue: unknown): unknown {
  if (field.type === 'number') {
    if (rawValue === '' || rawValue === null || rawValue === undefined) return undefined;
    const n = Number(rawValue);
    return Number.isNaN(n) ? undefined : n;
  }
  if (field.type === 'boolean') {
    return Boolean(rawValue);
  }
  return rawValue;
}

export function coerceAttributes(
  category: CategoryDef,
  raw: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const field of category.fields) {
    const value = coerceField(field, raw[field.key]);
    if (value !== undefined && value !== '') {
      result[field.key] = value;
    }
  }
  return result;
}

export function validatePlaceForm(
  category: CategoryDef,
  values: FormValues,
): ValidationResult {
  const errors: Record<string, string> = {};

  if (!values.name.trim()) {
    errors.name = 'Name ist erforderlich.';
  }

  if (values.referenceUrl.trim()) {
    try {
      new URL(values.referenceUrl.trim());
    } catch {
      errors.referenceUrl = 'Bitte eine gültige URL angeben.';
    }
  }

  for (const field of category.fields) {
    if (field.required) {
      const value = values.attributes[field.key];
      if (value === undefined || value === '' || value === null) {
        errors[field.key] = `${field.label} ist erforderlich.`;
      }
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
