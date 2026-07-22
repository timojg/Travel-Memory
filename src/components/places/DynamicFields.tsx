import type { FieldDef } from '../../types/category';

interface Props {
  fields: FieldDef[];
  values: Record<string, unknown>;
  errors: Record<string, string>;
  onChange: (key: string, value: unknown) => void;
}

export function DynamicFields({ fields, values, errors, onChange }: Props) {
  if (fields.length === 0) return null;

  return (
    <>
      {fields.map((field) => {
        const inputId = `field-${field.key}`;
        return (
          <div className="form-field" key={field.key}>
            <label htmlFor={inputId}>
              {field.label}
              {field.unit ? ` (${field.unit})` : ''}
            </label>

            {field.type === 'boolean' ? (
              <input
                id={inputId}
                type="checkbox"
                checked={Boolean(values[field.key])}
                onChange={(e) => onChange(field.key, e.target.checked)}
              />
            ) : field.type === 'textarea' ? (
              <textarea
                id={inputId}
                value={(values[field.key] as string) ?? ''}
                onChange={(e) => onChange(field.key, e.target.value)}
              />
            ) : field.type === 'enum' ? (
              <select
                id={inputId}
                value={(values[field.key] as string) ?? ''}
                onChange={(e) => onChange(field.key, e.target.value)}
              >
                <option value="">–</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={inputId}
                type={field.type === 'number' ? 'number' : field.type === 'url' ? 'url' : 'text'}
                value={(values[field.key] as string | number) ?? ''}
                placeholder={field.placeholder}
                onChange={(e) =>
                  onChange(
                    field.key,
                    field.type === 'number' ? e.target.valueAsNumber : e.target.value,
                  )
                }
              />
            )}
            {errors[field.key] && <span className="form-error">{errors[field.key]}</span>}
          </div>
        );
      })}
    </>
  );
}
