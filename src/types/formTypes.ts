// src/types/formTypes.ts
export interface Condition {
  fieldId: string;
  operator: string;
  value: string;
}

export interface Field {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options: string[];
  conditions: Condition[];
}

export interface FormState {
  fields: Field[];
  fieldValues: {
    [key: string]: string;
  };
}

export type Action =
  | { type: 'ADD_FIELD'; payload: Field }
  | { type: 'UPDATE_FIELD'; payload: Field }
  | { type: 'DELETE_FIELD'; payload: string }
  | { type: 'UPDATE_FIELD_VALUE'; payload: { fieldId: string; value: string } }
  | { type: 'RESET_FORM' }
  | { type: 'INTERNAL_UPDATE'; payload: FormState }; 
