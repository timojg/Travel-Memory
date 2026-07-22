import { CATEGORIES } from '../../config/categories';
import type { CategoryKey } from '../../types/category';

interface Props {
  isActive: (key: CategoryKey) => boolean;
  onToggle: (key: CategoryKey) => void;
}

export function CategoryFilterBar({ isActive, onToggle }: Props) {
  return (
    <div className="category-filter-bar">
      {CATEGORIES.map((c) => (
        <button
          key={c.key}
          type="button"
          className={`filter-chip${isActive(c.key) ? ' filter-chip--active' : ''}`}
          style={{ borderColor: c.color }}
          onClick={() => onToggle(c.key)}
        >
          {c.icon} {c.label}
        </button>
      ))}
    </div>
  );
}
