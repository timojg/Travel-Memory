export type CategoryKey = string;

export type FieldType = 'text' | 'textarea' | 'number' | 'boolean' | 'url' | 'enum';

export interface EnumOption {
  value: string;
  label: string;
}

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: EnumOption[];
  unit?: string;
  placeholder?: string;
}

export interface CategoryDef {
  key: CategoryKey;
  label: string;
  color: string;
  icon: string;
  fields: FieldDef[];
}
