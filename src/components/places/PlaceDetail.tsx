import { getCategory } from '../../config/categories';
import type { Place } from '../../types/place';

interface Props {
  place: Place;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export function PlaceDetail({ place, onEdit, onDelete, onClose }: Props) {
  const category = getCategory(place.category);

  function handleDelete() {
    if (confirm(`"${place.name}" wirklich löschen?`)) {
      onDelete();
    }
  }

  return (
    <div className="place-detail">
      <button className="place-detail__close" onClick={onClose} aria-label="Schließen">
        ×
      </button>
      <span className="category-badge" style={{ background: category?.color }}>
        {category?.icon} {category?.label}
      </span>
      <h2>{place.name}</h2>

      {category?.fields.map((field) => {
        const value = place.attributes[field.key];
        if (value === undefined || value === '') return null;
        const display =
          field.type === 'boolean'
            ? value
              ? 'Ja'
              : 'Nein'
            : `${value}${field.unit ? ` ${field.unit}` : ''}`;
        return (
          <p key={field.key}>
            <strong>{field.label}:</strong> {display}
          </p>
        );
      })}

      {place.referenceUrl && (
        <p>
          <a href={place.referenceUrl} target="_blank" rel="noopener noreferrer">
            Externer Link öffnen ↗
          </a>
        </p>
      )}

      {place.notes && <p className="place-detail__notes">{place.notes}</p>}

      <div className="form-actions">
        <button onClick={onEdit}>Bearbeiten</button>
        <button onClick={handleDelete} className="danger">
          Löschen
        </button>
      </div>
    </div>
  );
}
