// src/hooks/useFormState.ts
import { useReducer, useEffect } from 'react';
import type { Field, FormState, Action } from '../types/formTypes';

// تهيئة الحالة من localStorage
const initFormState = (): FormState => {
  try {
    const savedForm = localStorage.getItem('formBuilderState');
    if (savedForm) {
      const parsed = JSON.parse(savedForm);
      return {
        fields: parsed.fields || [],
        fieldValues: parsed.fieldValues || {},
      };
    }
  } catch (error) {
    console.error('Failed to load form from localStorage:', error);
  }

  return {
    fields: [],
    fieldValues: {},
  };
};

// ✅ اضافة الأنواع لـ state و action
function formReducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case 'ADD_FIELD':
      { const newField = action.payload;
      return {
        ...state,
        fields: [...state.fields, newField],
        fieldValues: {
          ...state.fieldValues,
          [newField.id]: '',
        },
      }; }

    case 'UPDATE_FIELD':
      return {
        ...state,
        fields: state.fields.map((field: Field) =>
          field.id === action.payload.id ? action.payload : field
        ),
      };

    case 'DELETE_FIELD':
      { const updatedFields = state.fields.filter(
        (field: Field) => field.id !== action.payload
      );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [action.payload]: removedValue, ...remainingFieldValues } =
        state.fieldValues;

      const cleanedFields = updatedFields.map((field: Field) => ({
        ...field,
        conditions:
          field.conditions?.filter((cond) => cond.fieldId !== action.payload) ||
          [],
      }));

      return {
        ...state,
        fields: cleanedFields,
        fieldValues: remainingFieldValues,
      }; }

    case 'UPDATE_FIELD_VALUE':
      return {
        ...state,
        fieldValues: {
          ...state.fieldValues,
          [action.payload.fieldId]: action.payload.value,
        },
      };

    case 'RESET_FORM':
      localStorage.removeItem('formBuilderState');
      return {
        fields: [],
        fieldValues: {},
      };

    default:
      return state;
  }
}

// ✅ استخدم tuple typing
export default function useFormState(): [FormState, React.Dispatch<Action>] {
  const [state, dispatch] = useReducer(formReducer, undefined, initFormState);

  useEffect(() => {
    try {
      localStorage.setItem('formBuilderState', JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save form to localStorage:', error);
    }
  }, [state]);

  return [state, dispatch];
}
